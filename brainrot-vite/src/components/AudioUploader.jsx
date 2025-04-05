import React, { useState } from "react";

const AudioUploader = () => {
  const [audioFile, setAudioFile] = useState(null);
  const [error, setError] = useState("");
  const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("audio/")) {
      if (file.size > MAX_FILE_SIZE) {
        setAudioFile(null);
        setError("File size exceeds the 50MB limit.");
      } else {
        setAudioFile(file);
        setError("");
      }
    } else {
      setAudioFile(null);
      setError("Please select a valid audio file.");
    }
  };

  const handleUpload = () => {
    if (audioFile) {
      console.log("Uploading:", audioFile.name);
      // Add upload logic here
    } else {
      console.log("No file selected");
    }
  };

  return (
    <div
      style={{
        maxWidth: "400px",
        margin: "0 auto",
        textAlign: "center",
        padding: "20px",
        border: "1px solid #ccc",
        borderRadius: "8px",
        backgroundColor: "#f9f9f9",
      }}
    >
      <input
        type="file"
        accept="audio/*"
        onChange={handleFileChange}
        style={{
          display: "block",
          margin: "0 auto 10px auto",
          padding: "5px",
          fontSize: "14px",
        }}
      />
      {error && (
        <p
          style={{
            color: "red",
            fontWeight: "bold",
            marginBottom: "10px",
          }}
        >
          {error}
        </p>
      )}
      {audioFile && (
        <p
          style={{
            margin: "10px 0",
            fontSize: "14px",
            color: "#333",
          }}
        >
          Selected file: {audioFile.name} (
          {(audioFile.size / 1024 / 1024).toFixed(2)} MB)
        </p>
      )}
      <button
        onClick={handleUpload}
        disabled={!audioFile}
        style={{
          padding: "10px 20px",
          backgroundColor: audioFile ? "#007BFF" : "#ccc",
          color: "#fff",
          border: "none",
          borderRadius: "4px",
          cursor: audioFile ? "pointer" : "not-allowed",
          fontSize: "14px",
        }}
      >
        Upload Audio
      </button>
    </div>
  );
};

export default AudioUploader;
