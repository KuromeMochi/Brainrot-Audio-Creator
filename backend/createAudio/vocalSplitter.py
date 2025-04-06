import spleeter
from spleeter.separator import Separator
import librosa
import librosa.display
import numpy as np
from pydub import AudioSegment
from pydub.playback import play
import soundfile as sf
import os
import sys

def split_audio(input_path, output_dir="createAudio/separated_audio"):
    """
    Splits an audio file into vocals and accompaniment using Spleeter.
    
    Parameters:
        input_path (str): Path to the input audio file.
        output_dir (str): Directory where output will be saved.
    """
    print("Initializing Spleeter...")
    separator = Separator('spleeter:2stems')  # vocals + accompaniment

    # input_path = r"C:\_Work\_Computer Science\University\Bath Hack\Brainrot-Audio-Creator\backend\createAudio\happy_birthday.mp3"  # uncomment when using a new audio
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

def remix_with_effect(vocal_path, effect_path, instrumental_path=None, output_path="createAudio/output_audio/remixed_output.wav"):
    # Load vocal audio and detect pitch librosa
    y_vocal, sr = librosa.load(vocal_path, sr=None)
    f0, voiced_flag, _ = librosa.pyin(y_vocal, fmin=80, fmax=1000)
    times = librosa.times_like(f0, sr=sr)

    # Load sound effect
    effect_audio, _ = librosa.load(effect_path, sr=sr)
    if len(effect_audio) < sr * 0.5:
        effect_audio = np.tile(effect_audio, 3)

    # output buffer
    output_length = len(y_vocal)
    output_audio = np.zeros(output_length)

    # Parameters
    semitone_threshold = 0.9  # pitch variation allowed in a note
    min_note_duration = 0.05  # seconds
    base_pitch = 200.0        # reference pitch for shifting
    crossfade = 0.5          # seconds

    # Group stable notes together
    notes = []
    current_note = None

    for i in range(len(f0)):
        if f0[i] is None or not voiced_flag[i]:
            if current_note:
                current_note["end"] = times[i]
                if current_note["end"] - current_note["start"] >= min_note_duration:
                    notes.append(current_note)
                current_note = None
            continue

        if current_note is None:
            current_note = {"start": times[i], "f0": f0[i]}
        else:
            pitch_diff = 12 * np.log2(f0[i] / current_note["f0"])
            if abs(pitch_diff) > semitone_threshold:
                current_note["end"] = times[i]
                if current_note["end"] - current_note["start"] >= min_note_duration:
                    notes.append(current_note)
                current_note = {"start": times[i], "f0": f0[i]}

    if current_note:
        current_note["end"] = times[-1]
        if current_note["end"] - current_note["start"] >= min_note_duration:
            notes.append(current_note)

    # Apply effect for each note
    for note in notes:
        start_sample = int(note["start"] * sr)
        end_sample = int(note["end"] * sr)
        segment_length = end_sample - start_sample

        if start_sample >= output_length or segment_length <= 0:
            continue

        # Pitch shift the effect
        semitone_diff = 12 * np.log2(note["f0"] / base_pitch)
        semitone_diff = np.clip(semitone_diff, -12, 12)
        shifted = librosa.effects.pitch_shift(effect_audio.copy(), sr=sr, n_steps=semitone_diff, bins_per_octave=24)

        # Match duration with looping or fading
        if len(shifted) > segment_length:
            shifted = shifted[:segment_length]
            fade_len = int(crossfade * sr)
            if fade_len < len(shifted):
                shifted[-fade_len:] *= np.linspace(1, 0, fade_len)
        else:
            needed = segment_length - len(shifted)
            looped = np.tile(shifted, 1 + needed // len(shifted))[:needed]
            fade_len = min(int(crossfade * sr), len(shifted), len(looped))

            if fade_len > 0:
                fade_in = looped[:fade_len] * np.linspace(0, 1, fade_len)
                fade_out = shifted[-fade_len:] * np.linspace(1, 0, fade_len)
                blended = fade_in + fade_out
                shifted = np.concatenate([shifted[:-fade_len], blended, looped[fade_len:]])
            else:
                shifted = np.concatenate([shifted, looped])

        # Smooth envelope
        envelope = np.ones_like(shifted)
        fade_env_len = min(int(0.1 * sr), len(shifted) // 3)
        envelope[:fade_env_len] = np.linspace(0, 1, fade_env_len)
        envelope[-fade_env_len:] = np.linspace(1, 0, fade_env_len)
        shifted *= envelope

        # Mix into output
        mix_end = min(start_sample + len(shifted), output_length)
        gain = 2.5  # 1.5 to 2.5 
        shifted *= gain
        output_audio[start_sample:mix_end] += shifted[:mix_end - start_sample]

    if instrumental_path:
        instrumental, _ = librosa.load(instrumental_path, sr=sr)
        min_len = min(len(output_audio), len(instrumental))
        output_audio = output_audio[:min_len] + instrumental[:min_len]

    # Normalise audio to avoid huge peaks in freq
    #output_audio = output_audio / np.max(np.abs(output_audio))

    sf.write(output_path, output_audio, sr)
    print(f"Remix created at: {output_path}")

if __name__ == "__main__":
    file1 = sys.argv[1]
    file2 = sys.argv[2]
    print(file1)
    print(file2)
    date = sys.argv[3]
    # parsed_filename = f"{file1}.mp3"
    # parsed_filename = "createAudio/separated_audio/happy_birthday.mp3"
    # filename_no_ext = os.path.splitext(parsed_filename)[0]
    # input_audio = "createAudio/" + parsed_filename 
    # input_audio = "createAudio/happy_birthday.mp3"  # uncomment when using a new audio
    # split_audio(input_audio) # uncomment when using a new audio
    remix_with_effect("createAudio\separated_audio/" + file1 + "/vocals.wav", f"sound_clips/{file2}.mp3", "createAudio\separated_audio/" + file1 + "/accompaniment.wav", output_path=f"createAudio/output_audio/output.wav")
