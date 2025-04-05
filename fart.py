import os
from spleeter.separator import Separator
from pydub import AudioSegment, silence

# -------------------------------
# 1. Separate the song into stems using Spleeter
# -------------------------------
input_audio = "input_audio/HBD.wav"  # Replace with your song file
output_dir = "output_audio"
separator = Separator('spleeter:2stems')  # Using 2 stems: vocals and accompaniment
separator.separate_to_file(input_audio, output_dir)

# Assume the output structure is:
# separated_output/<song_basename>/vocals.wav
song_basename = os.path.splitext(os.path.basename(input_audio))[0]
vocals_path = os.path.join(output_dir, song_basename, "vocals.wav")

# -------------------------------
# 2. Load the vocal track and detect segments (approximate words)
# -------------------------------
vocals = AudioSegment.from_file(vocals_path)
# Adjust these parameters based on your file:
min_silence_len = 200      # minimum silence in ms to consider a break (tweak as needed)
silence_thresh = vocals.dBFS - 16  # silence threshold relative to the vocal level
nonsilent_ranges = silence.detect_nonsilent(vocals, 
                                            min_silence_len=min_silence_len, 
                                            silence_thresh=silence_thresh, 
                                            seek_step=1)

# -------------------------------
# 3. Load and trim the replacement sound
# -------------------------------
replacement_sound = AudioSegment.from_file("bruh.wav")

def trim_silence(audio, silence_thresh=-40, chunk_size=10):
    """
    Trims silence from the beginning and end of an AudioSegment.
    """
    # Trim leading silence
    start_trim = 0
    while start_trim < len(audio) and audio[start_trim:start_trim+chunk_size].dBFS < silence_thresh:
        start_trim += chunk_size

    # Trim trailing silence
    end_trim = len(audio)
    while end_trim - chunk_size > 0 and audio[end_trim-chunk_size:end_trim].dBFS < silence_thresh:
        end_trim -= chunk_size

    return audio[start_trim:end_trim]

# Trim the replacement sound to remove low-volume (silent) parts
replacement_sound = trim_silence(replacement_sound, silence_thresh=-40, chunk_size=10)

# -------------------------------
# 4. Create a new audio track with replaced segments
# -------------------------------
# Create a silent track matching the length of the original vocal track.
output_audio = AudioSegment.silent(duration=len(vocals))

# For each detected vocal segment, replace it with the replacement sound adjusted to the same duration.
for start, end in nonsilent_ranges:
    segment_duration = end - start  # duration in milliseconds

    # If the replacement sound is longer than needed, trim it;
    # if it’s too short, loop it to cover the duration.
    if len(replacement_sound) > segment_duration:
        segment = replacement_sound[:segment_duration]
    else:
        # Loop the replacement sound to extend its duration
        repeats = segment_duration // len(replacement_sound) + 1
        segment = replacement_sound * repeats
        segment = segment[:segment_duration]

    # Overlay the adjusted replacement sound onto the output track at the correct position.
    output_audio = output_audio.overlay(segment, position=start)

# -------------------------------
# 5. Export the final output
# -------------------------------
output_audio.export("output_replaced.wav", format="wav")
print("Processing complete! Output saved as 'output_replaced.wav'")
