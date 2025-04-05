import IPython.display as ipd
import soundfile as sf
import os
import numpy as np
import librosa
import random

# -------------------------------
# Configuration and File Loading
# -------------------------------
# Use different files for the input song and the fart sample.
input_audio = "input_audio/Never.wav"       # Your input song file
fart_sample_audio = "fart_sample.wav"  # Your clean fart sample file

# Display the input audio (for notebooks)
ipd.display(ipd.Audio(input_audio))

# Load the input audio
audio_data, sr = librosa.load(input_audio, sr=None)
print(f"Loaded input audio: {input_audio} with sample rate: {sr}")

# Load the fart sample ensuring the same sample rate as input
fart_data, sr_fart = librosa.load(fart_sample_audio, sr=sr)
print(f"Loaded fart sample: {fart_sample_audio} with sample rate: {sr_fart}")

# -------------------------------
# Helper Functions
# -------------------------------

def shift_fart(fart_data, sr, target_pitch, base_pitch):
    """
    Pitch-shift the fart sample so that its fundamental frequency 
    matches the target_pitch.
    """
    # Calculate semitone difference: n_steps = 12 * log2(target/base)
    n_steps = 12 * np.log2(target_pitch / base_pitch)
    shifted = librosa.effects.pitch_shift(fart_data, sr=sr, n_steps=n_steps)
    return shifted

def calculate_segment_pitch(pitches, times, start_time, end_time, default_pitch):
    """
    Calculate the average pitch for the segment defined by start_time and end_time.
    If no valid pitch is detected in the segment, return default_pitch.
    """
    # Get indices corresponding to the current segment
    idx = np.where((times >= start_time) & (times < end_time))[0]
    if len(idx) == 0:
        return default_pitch
    seg_pitches = pitches[idx]
    # Remove NaN values (unvoiced frames)
    seg_pitches = seg_pitches[~np.isnan(seg_pitches)]
    if len(seg_pitches) == 0:
        return default_pitch
    return np.nanmean(seg_pitches)

# -------------------------------
# Pitch Analysis on Input Audio
# -------------------------------
# Use librosa.pyin to extract pitch (fundamental frequency) over time.
# fmin and fmax define the expected pitch range.
pitches, voiced_flags, voiced_probs = librosa.pyin(
    audio_data, 
    fmin=librosa.note_to_hz('C2'), 
    fmax=librosa.note_to_hz('C7')
)
# Compute the times corresponding to each pitch estimate
times = librosa.times_like(pitches, sr=sr)
print("Pitch tracking completed on input audio.")

# -------------------------------
# Determine Base Pitch of the Fart Sample
# -------------------------------
# Analyze the fart sample to find its natural (base) pitch.
fart_pitches, fart_voiced_flags, fart_voiced_probs = librosa.pyin(
    fart_data, 
    fmin=librosa.note_to_hz('C2'), 
    fmax=librosa.note_to_hz('C7')
)
if np.all(np.isnan(fart_pitches)):
    # If no pitch is detected, set a default base pitch (in Hz)
    base_pitch = 150  
    print("No pitch detected in fart sample. Using default base pitch:", base_pitch)
else:
    base_pitch = np.nanmean(fart_pitches)
    print("Computed base pitch of fart sample:", base_pitch)

# -------------------------------
# Segment the Input Audio
# -------------------------------
# For this example, we divide the input audio into fixed-length segments.
segment_length = 1.0  # in seconds
total_duration = librosa.get_duration(y=audio_data, sr=sr)
print(f"Input audio duration: {total_duration:.2f} seconds.")

# Create a list of segments as (start_time, end_time) tuples.
segments = []
start_time = 0.0
while start_time < total_duration:
    end_time = min(start_time + segment_length, total_duration)
    segments.append((start_time, end_time))
    start_time = end_time

print(f"Number of segments: {len(segments)}")

# -------------------------------
# Process Each Segment
# -------------------------------
final_audio = np.array([], dtype=np.float32)

for seg in segments:
    seg_start, seg_end = seg
    # Calculate the target (average) pitch for this segment.
    target_pitch = calculate_segment_pitch(pitches, times, seg_start, seg_end, default_pitch=base_pitch)
    
    # Shift the fart sample to match the target pitch.
    shifted_fart = shift_fart(fart_data, sr, target_pitch, base_pitch)
    
    # Calculate the desired number of samples for the segment.
    target_samples = int((seg_end - seg_start) * sr)
    if target_samples == 0:
        continue
    
    # Time-stretch the shifted fart sample to fit the segment duration.
    # The rate factor is the ratio of current length to target length.
    rate = len(shifted_fart) / target_samples
    adjusted_fart = librosa.effects.time_stretch(shifted_fart, rate = rate)
    
    # Ensure the adjusted segment is exactly target_samples long
    if len(adjusted_fart) > target_samples:
        adjusted_fart = adjusted_fart[:target_samples]
    elif len(adjusted_fart) < target_samples:
        adjusted_fart = np.pad(adjusted_fart, (0, target_samples - len(adjusted_fart)), mode='constant')
    
    # Append the processed segment to the final output.
    final_audio = np.concatenate([final_audio, adjusted_fart])

print("Audio processing complete.")

# -------------------------------
# Save and Playback the Output
# -------------------------------
output_file = "output_fart_song.wav"
sf.write(output_file, final_audio, sr)
print(f"Output saved to {output_file}")

# To play back in a notebook:
ipd.display(ipd.Audio(output_file))
