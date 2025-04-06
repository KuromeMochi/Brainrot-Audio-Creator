from scipy.fft import fft, fftfreq
import numpy as np
import soundfile as sf
import matplotlib.pyplot as plt

# Load audio with soundfile
y, sr = sf.read("FreedomDive.mp3")

# Mono check
if y.ndim > 1:
    y = y.mean(axis=1)  # convert to mono

# FFT
n = len(y)
Y = fft(y)
frequencies = fftfreq(n, d=1/sr)

# Plotting
plt.plot(frequencies[:n//2], np.abs(Y)[:n//2])
plt.xlabel('Frequency (Hz)')
plt.ylabel('Magnitude')
plt.title('Frequency Spectrum')
plt.grid()
plt.show()
