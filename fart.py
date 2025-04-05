import numpy as np
import librosa
import soundfile as sf

# -------------------------------
# Helper Functions
# -------------------------------

def dominant_frequency_fft(signal, sr):
    """
    Compute the dominant frequency of a signal using FFT.
    Ignores the DC component (0 Hz).
    """
    N = len(signal)
    if N == 0:
        return 0
    fft_vals = np.fft.rfft(signal)
    fft_mag = np.abs(fft_vals)
    freqs = np.fft.rfftfreq(N, 1/sr)
    # Skip DC component and get the frequency with maximum amplitude
    if len(fft_mag) > 1:
        idx = np.argmax(fft_mag[1:]) + 1
    else:
        idx = 0
    return freqs[idx]

def shift_fart(fart_data, sr, target_pitch, base_pitch):
    """
    Pitch-shift the fart sample so that its dominant frequency matches the target_pitch.
    """
    # Calculate semitone difference: n_steps = 12 * log2(target/base)
    if target_pitch <= 0 or base_pitch <= 0:
        n_steps = 0
    else:
        n_steps = 12 * np.log2(target_pitch / base_pitch)
    shifted = librosa.effects.pitch_shift(fart_data, sr=sr, n_steps=n_steps)
    return shifted

# -------------------------------
# Load Audio Files
# -------------------------------
# Load the birthday song and fart sample ensuring the same sample rate.
birthday_file = "input_audio/HBD.wav"    # Replace with your birthday song file
fart_file = "bruh.wav"            # Replace with your fart sample file

audio_data, sr = librosa.load(birthday_file, sr=None)
print("Loaded birthday song with sample rate:", sr)

fart_data, sr_fart = librosa.load(fart_file, sr=sr)
print("Loaded fart sample with sample rate:", sr)
fart_data, _ = librosa.effects.trim(fart_data, top_db=20)
# -------------------------------
# Compute Base Pitch of Fart Sample using FFT
# -------------------------------
base_pitch = dominant_frequency_fft(fart_data, sr)
print("Base pitch of fart sample:", base_pitch)

# -------------------------------
# Analyze Pitch Contour of the Birthday Song
# -------------------------------
# Extract pitch estimates and their corresponding times.
pitches, voiced_flags, voiced_probs = librosa.pyin(
    audio_data,
    fmin=librosa.note_to_hz('C2'),
    fmax=librosa.note_to_hz('C7')
)
times = librosa.times_like(pitches, sr=sr)
print("Pitch tracking completed on birthday song.")

# -------------------------------
# Dynamic Segmentation Based on Pitch Changes
# -------------------------------
# Define a threshold (in Hz) to detect a significant change in pitch.
pitch_threshold = 20  # Adjust this threshold as needed

segments = []
start_time = times[0]
prev_pitch = pitches[0]

# Loop over the pitch contour to detect boundaries.
for i in range(1, len(pitches)):
    current_pitch = pitches[i]
    # If the current pitch is unvoiced, or the change exceeds the threshold, mark a segment boundary.
    if np.isnan(current_pitch) or np.isnan(prev_pitch) or abs(current_pitch - prev_pitch) > pitch_threshold:
        end_time = times[i]
        segments.append((start_time, end_time))
        start_time = times[i]
        prev_pitch = current_pitch
    else:
        prev_pitch = current_pitch

# Append the final segment.
segments.append((start_time, times[-1]))
print("Number of dynamic segments:", len(segments))

# -------------------------------
# Process Each Segment and Build Final Audio
# -------------------------------
final_audio = np.array([], dtype=np.float32)

for seg in segments:
    seg_start, seg_end = seg
    start_sample = int(seg_start * sr)
    end_sample = int(seg_end * sr)
    segment_data = audio_data[start_sample:end_sample]
    
    if len(segment_data) == 0:
        continue

    # Use FFT to compute the dominant frequency for this segment.
    target_pitch = dominant_frequency_fft(segment_data, sr)
    
    # Pitch-shift the fart sample to match the segment's target pitch.
    shifted_fart = shift_fart(fart_data, sr, target_pitch, base_pitch)
    
    # Time-stretch/compress the shifted fart sample to match the segment duration.
    target_samples = len(segment_data)
    if target_samples == 0:
        continue
    rate = len(shifted_fart) / target_samples
    adjusted_fart = librosa.effects.time_stretch(shifted_fart, rate=rate)
    
    # Ensure the adjusted segment is exactly the correct length.
    if len(adjusted_fart) > target_samples:
        adjusted_fart = adjusted_fart[:target_samples]
    elif len(adjusted_fart) < target_samples:
        adjusted_fart = np.pad(adjusted_fart, (0, target_samples - len(adjusted_fart)), mode='constant')
    
    # Append this processed segment.
    final_audio = np.concatenate([final_audio, adjusted_fart])

# -------------------------------
# Save the Final Output
# -------------------------------
output_file = "output_dynamic_fart_version.wav"
sf.write(output_file, final_audio, sr)
print("Output saved to", output_file)
