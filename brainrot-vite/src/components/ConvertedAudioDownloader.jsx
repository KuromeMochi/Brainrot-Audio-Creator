import React from "react";

function ConvertedAudioDownloader({ audioBlob, fileName }) {
  // Function to handle the download
  const handleDownload = () => {
    const url = URL.createObjectURL(audioBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName || "converted-audio.mp3";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <button
        onClick={handleDownload}
        style={{
          padding: "12px 24px",
          fontSize: "16px",
          fontWeight: "bold",
          backgroundColor: "#007BFF",
          color: "#FFFFFF",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          transition: "background-color 0.3s ease",
        }}
        onMouseOver={(e) => (e.target.style.backgroundColor = "#0056b3")}
        onMouseOut={(e) => (e.target.style.backgroundColor = "#007BFF")}
      >
        Download Audio
      </button>
    </div>
  );
}

export default ConvertedAudioDownloader;
