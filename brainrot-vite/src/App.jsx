import { useState } from "react";
import AudioUploader from "./components/AudioUploader";
import AudioPlayer from "./components/AudioPlayer";
import { Sparkles, Music, DownloadCloud, Mic } from "lucide-react";

function App() {
  const [originalAudio, setOriginalAudio] = useState(null);
  const [convertedAudio, setConvertedAudio] = useState(null);
  const [selectedAudio, setSelectedAudio] = useState(null);
  const [selectedEffect, setSelectedEffect] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileUpload = (file) => {
    setOriginalAudio(file);
    // Implement file upload to backend here
  };

  const handleAudioSelected = (audio) => {
    setSelectedAudio(audio);
  };

  const handleEffectSelected = (effect) => {
    setSelectedEffect(effect);
  };

  // const fetchConvertedAudio = () => {
  //   setIsLoading(true);
  //   // Simulate API call with timeout
  //   setTimeout(() => {
  //     // Replace this with actual API call
  //     setConvertedAudio(selectedAudio.url); // Using URL for demo, replace with actual converted audio
  //     setIsLoading(false);
  //   }, 3000);
  // };

  const handleConvertAudio = async () => {
    if (!selectedAudio || !selectedEffect) {
      console.warn("Both an audio track and an effect must be selected.");
      return;
    }
    setIsLoading(true);
    try {
      // Make the POST request to your Node.js backend
      const response = await fetch("http://localhost:5000/process-audio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          audio1: selectedAudio.file, // e.g. "/songs/peppapig.mp3"
          audio2: selectedEffect.file, // e.g. "/sound_effects/perfect-fart.mp3"
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to process audio");
      }

      const data = await response.json();
      console.log("Backend response:", data);
      console.log("Converted audio URL:", data.fileUrl);
      // data.fileUrl should be something like "/output-audio/converted.wav"
      // Prepend the server base if needed, or just store it and let the <audio> tag do the rest
      setConvertedAudio("http://localhost:5000/output-audio/output.wav");
    } catch (error) {
      console.error("Error processing audio:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(to bottom right, #e6fffa, #fff8e1)",
        color: "#1a202c",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "sans-serif",
        overflow: "hidden",
      }}
    >
      <div style={{ width: "100%", maxWidth: "48rem", textAlign: "center" }}>
        <h1
          style={{
            fontSize: "4rem",
            fontWeight: "800",
            background: "linear-gradient(to right, #38b2ac, #f6ad55)",
            WebkitBackgroundClip: "text",
            color: "transparent",
            textAlign: "center",
            margin: "0 auto",
          }}
        >
          Brainrot Audio Converter
        </h1>
        <p
          style={{
            fontSize: "1.125rem",
            color: "#4a5568",
            marginBottom: "2.5rem",
            lineHeight: "1.75",
            maxWidth: "40rem",
            margin: "0 auto",
            textAlign: "center",
          }}
        >
          Transform your recordings into uniquely amusing audio experiences.
        </p>

        <div style={{ marginBottom: "3rem" }}>
          <AudioUploader
            onUpload={handleFileUpload}
            onAudioSelected={handleAudioSelected}
            onEffectSelected={handleEffectSelected}
          />
        </div>

        {originalAudio && (
          <div style={{ marginBottom: "3rem" }}>
            <h2
              style={{
                fontSize: "1.25rem",
                fontWeight: "500",
                color: "#2d3748",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                marginBottom: "1rem",
              }}
            >
              <Music
                style={{ color: "#38b2ac", animation: "pulse 2s infinite" }}
              />{" "}
              Original Audio
            </h2>
            <AudioPlayer audio={originalAudio} />
          </div>
        )}

        <div style={{ position: "relative", margin: "2rem 0" }}>
          <button
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              background:
                selectedAudio && selectedEffect
                  ? "linear-gradient(to right, #38b2ac, #f6ad55)"
                  : "#e2e8f0",
              color: selectedAudio && selectedEffect ? "#fff" : "#a0aec0",
              fontWeight: "600",
              padding: "0.75rem 2rem",
              borderRadius: "9999px",
              transition: "transform 0.2s, opacity 0.2s",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              cursor:
                selectedAudio && selectedEffect ? "pointer" : "not-allowed",
              position: "relative",
              overflow: "hidden",
            }}
            onClick={
              selectedAudio && selectedEffect ? handleConvertAudio : null
            }
            disabled={!selectedAudio || !selectedEffect || isLoading}
          >
            {isLoading ? (
              <>
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: "100%",
                    background:
                      "linear-gradient(to right, transparent, rgba(255,255,255,0.5), transparent)",
                    animation: "shimmer 1.5s infinite",
                  }}
                />
                <span style={{ position: "relative", zIndex: 1 }}>
                  Processing...
                </span>
              </>
            ) : (
              <>
                <Sparkles style={{ animation: "spin 2s linear infinite" }} />
                Convert Audio
              </>
            )}
          </button>
        </div>

        {convertedAudio && (
          <div style={{ marginTop: "3rem" }}>
            <h2
              style={{
                fontSize: "1.25rem",
                fontWeight: "500",
                color: "#2d3748",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                marginBottom: "1rem",
              }}
            >
              <Mic
                style={{ color: "#38b2ac", animation: "bounce 2s infinite" }}
              />{" "}
              Converted Audio
            </h2>
            <AudioPlayer audioSrc={convertedAudio} />
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        @keyframes pulse {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.2);
          }
          100% {
            transform: scale(1);
          }
        }
        @keyframes bounce {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }
      `}</style>
    </div>
  );
}

export default App;
