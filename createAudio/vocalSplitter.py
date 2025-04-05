# vocal_splitter.py
import spleeter
from spleeter.separator import Separator
import librosa
import librosa.display
import numpy as np
from pydub import AudioSegment
from pydub.playback import play
import soundfile as sf
import os

def split_audio(input_path, output_dir="separated_audio"):
    """
    Splits an audio file into vocals and accompaniment using Spleeter.
    
    Parameters:
        input_path (str): Path to the input audio file.
        output_dir (str): Directory where output will be saved.
    """
    print("Initializing Spleeter...")
    separator = Separator('spleeter:2stems')  # vocals + accompaniment

    print(f"Processing file: {input_path}")
    separator.separate_to_file(input_path, output_dir)

    print(f"Done! Check the output in: {os.path.join(output_dir, os.path.splitext(os.path.basename(input_path))[0])}")

def detect_voiced_pitch(vocal_path):
    y, sr = librosa.load(vocal_path, sr=None)
    f0, voiced_flag, _ = librosa.pyin(
        y,
        fmin=librosa.note_to_hz('C2'),
        fmax=librosa.note_to_hz('C6')
    )
    times = librosa.times_like(f0, sr=sr)
    return f0, voiced_flag, times, sr

def remix_with_effect(vocal_path, effect_path, instrumental_path=None, output_path="remixed_output.wav"):
    # Load vocals and detect pitch
    y_vocal, sr = librosa.load(vocal_path, sr=None)
    f0, voiced_flag, _ = librosa.pyin(y_vocal, fmin=80, fmax=1000)  # Wider range for natural voice
    times = librosa.times_like(f0, sr=sr)
    
    # Load effect (ensure it's long enough)
    effect_audio, _ = librosa.load(effect_path, sr=sr)
    if len(effect_audio) < sr * 0.5:  # If effect is shorter than 0.5s
        effect_audio = np.tile(effect_audio, 3)  # Repeat to make longer
    
    # Initialize output
    output_length = int(times[-1] * sr) if len(times) > 0 else len(y_vocal)
    output_audio = np.zeros(output_length)
    
    # Parameters for natural sound
    base_pitch = 120.0  # Lower base pitch for more natural "bruh"
    min_duration = 0.15  # Minimum duration per segment (seconds)
    crossfade = 0.05     # Crossfade duration (seconds)

    prev_end = 0
    for i in range(len(f0)):
        if f0[i] is None or not voiced_flag[i]:
            continue
            
        # Determine segment timing
        duration = max(min_duration, times[i+1]-times[i] if i<len(f0)-1 else min_duration)
        start_time = max(times[i] - 0.02, 0)  # Slight anticipation
        end_time = start_time + duration
        
        start_sample = int(start_time * sr)
        end_sample = int(end_time * sr)
        
        # Only process if we have space
        if start_sample >= len(output_audio):
            continue
            
        # Calculate pitch shift (less aggressive)
        semitone_diff = 12 * np.log2(f0[i]/base_pitch)
        semitone_diff = np.clip(semitone_diff, -12, 12)  # Limit to 1 octave up/down
        
        # Apply pitch shift to a COPY of the original effect
        shifted = librosa.effects.pitch_shift(
            effect_audio.copy(), 
            sr=sr, 
            n_steps=semitone_diff,
            bins_per_octave=24  # Smoother pitching
        )
        
        # Trim to desired duration with fade
        segment_length = end_sample - start_sample
        if len(shifted) > segment_length:
            # Crossfade cut
            fade_out = shifted[segment_length-int(crossfade*sr):segment_length] * np.linspace(1, 0, int(crossfade*sr))
            shifted = shifted[:segment_length]
            shifted[-int(crossfade*sr):] = fade_out
        else:
            # Crossfade loop
            needed = segment_length - len(shifted)
            looped = np.tile(shifted, 1 + needed//len(shifted))[:needed]
            fade_in = looped[:int(crossfade*sr)] * np.linspace(0, 1, int(crossfade*sr))
            shifted = np.concatenate([
                shifted,
                fade_in + shifted[-int(crossfade*sr):]*(1-np.linspace(0, 1, int(crossfade*sr))),
                looped[int(crossfade*sr):]
            ])
        
        # Apply volume envelope
        envelope = np.ones_like(shifted)
        fade_len = min(int(0.1*sr), len(shifted)//3)
        envelope[:fade_len] = np.linspace(0, 1, fade_len)
        envelope[-fade_len:] = np.linspace(1, 0, fade_len)
        shifted = shifted * envelope
        
        # Mix into output
        output_audio[start_sample:start_sample+len(shifted)] += shifted

    # Normalize and mix with instrumental
    output_audio = librosa.util.normalize(output_audio)
    
    if instrumental_path:
        instrumental, _ = librosa.load(instrumental_path, sr=sr)
        min_len = min(len(output_audio), len(instrumental))
        output_audio = output_audio[:min_len] + instrumental[:min_len]
        output_audio = librosa.util.normalize(output_audio)
    
    sf.write(output_path, output_audio, sr)
    print(f"Remix created at {output_path}")


# Example usage:
if __name__ == "__main__":
    input_audio = "magnetic.ogg"  # Replace with your file path
    #split_audio(input_audio)
    #create_remix("separated_audio/magnetic/vocals.wav", "bruh.mp3")
    remix_with_effect("separated_audio/magnetic/vocals.wav", "rizz.mp3", "separated_audio/magnetic/accompaniment.wav")
