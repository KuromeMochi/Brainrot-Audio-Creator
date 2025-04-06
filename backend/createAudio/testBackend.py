# testAudioScript.py

import sys
import os
import shutil  # for copying files

def main():
    """
    This script just copies vocals.wav from
    createAudio/separated_audio/peppapig/vocals.wav
    into an output directory, then exits.
    """

    # If you want to pass args from Node, you could do something like:
    #   file1 = sys.argv[1]  # Not used in this example
    # But we’ll just do a simple copy for now.

    # Path to the source file
    file1 = sys.argv[1]
    file2 = sys.argv[2]
    date = sys.argv[3]
    src_file = f"createAudio/separated_audio/peppapig/vocals.wav"


    if not os.path.isfile(src_file):
        print(f"Error: The file {src_file} does not exist.")
        sys.exit(1)

    # Path to the destination directory
    output_dir = "createAudio/output_audio"  # Change this to your desired output directory
    os.makedirs(output_dir, exist_ok=True)

    # We'll name the copied file "copied_vocals.wav" in the output folder
    dest_file = os.path.join(output_dir, f"{date}.wav")

    # Copy the file
    shutil.copyfile(src_file, dest_file)

    print(f"Copied {src_file} to {dest_file} successfully.")

if __name__ == "__main__":
    main()
