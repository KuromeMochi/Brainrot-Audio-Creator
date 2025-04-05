import pandas as pd
import numpy as np
import librosa
import os
import matplotlib.pylab as plt
import seaborn as sns
from itertools import cycle
# from glob import glob
import librosa.display 
import IPython.display as ipd

sns.set_theme(style="white", palette=None)
color_pal = plt.rcParams['axes.prop_cycle'].by_key()['color']
color_cycle = cycle(plt.rcParams['axes.prop_cycle'].by_key()['color'])

audio_path = "input_audio/Never.wav"  # Your input song file
fart_sample_audio = "bruh.wav"  # Your clean fart sample file

ipd.display(ipd.Audio(audio_path))
ipd.display(ipd.Audio(fart_sample_audio))

audio_data, sr = librosa.load(audio_path, sr=None)
print(f"Loaded input audio: {audio_path} with sample rate: {sr}")
fart_data, sr_fart = librosa.load(fart_sample_audio, sr=sr)
print(f"Loaded fart sample: {fart_sample_audio} with sample rate: {sr_fart}")


pd.Series(fart_data).plot(title="Fart Sample", lw = 1, figsize=(12, 4), color=next(color_cycle))
# plt.xlabel("Sample Index")
plt.show()

fart_trimmed, _ = librosa.effects.trim(fart_data, top_db=20)
pd.Series(fart_trimmed).plot(title="Fart Trimmed Sample", lw = 1, figsize=(12, 4), color=next(color_cycle))
# plt.xlabel("Sample Index")
plt.show()

D= librosa.stft(fart_trimmed)
S_db = librosa.amplitude_to_db(np.abs(D), ref=np.max)