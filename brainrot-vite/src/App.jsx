import { useState } from "react";
import AudioUploader from "./components/AudioUploader";
import AudioRecorder from "./components/AudioRecorder";
import AudioPlayer from "./components/AudioPlayer";
import ConvertedAudioDownloader from "./components/ConvertedAudioDownloader";
import { Sparkles, Music, DownloadCloud, Mic } from "lucide-react";

function App() {
  const [originalAudio, setOriginalAudio] = useState(null);
  const [convertedAudio, setConvertedAudio] = useState(null);

  const handleFileUpload = (file) => {
    setOriginalAudio(file);
    // Implement file upload to backend here
  };

  const handleAudioRecorded = (audioBlob) => {
    setOriginalAudio(audioBlob);
    // Implement audio upload to backend here
  };

  const fetchConvertedAudio = () => {
    // Fetch converted audio from backend
    setConvertedAudio(/* received audio from backend */);
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
        padding: "3rem 1rem",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ width: "100%", maxWidth: "48rem", textAlign: "center" }}>
        <h1
          style={{
            fontSize: "3rem",
            fontWeight: "800",
            marginBottom: "1rem",
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
          <AudioUploader onUpload={handleFileUpload} />
          <AudioRecorder onRecord={handleAudioRecorded} />
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

        <button
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            background: "linear-gradient(to right, #38b2ac, #f6ad55)",
            color: "#fff",
            fontWeight: "600",
            padding: "0.75rem 2rem",
            borderRadius: "9999px",
            transition: "transform 0.2s, opacity 0.2s",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            cursor: "pointer",
          }}
          onClick={fetchConvertedAudio}
        >
          <Sparkles style={{ animation: "spin 2s linear infinite" }} /> Convert
          Audio
        </button>

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
            <AudioPlayer audio={convertedAudio} />
            <ConvertedAudioDownloader audio={convertedAudio}>
              <button
                style={{
                  marginTop: "1.5rem",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  border: "1px solid #e2e8f0",
                  background: "#fff",
                  color: "#2d3748",
                  fontWeight: "500",
                  padding: "0.5rem 1.25rem",
                  borderRadius: "9999px",
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                  transition: "transform 0.2s, opacity 0.2s",
                  cursor: "pointer",
                }}
              >
                <DownloadCloud /> Download Audio
              </button>
            </ConvertedAudioDownloader>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
