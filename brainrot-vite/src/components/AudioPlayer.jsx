import React, { useState, useRef, useEffect } from "react";

const AudioPlayer = ({ audioSrc }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);
  console.log("Audio source:", audioSrc);

  const togglePlayPause = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  // Stop playback and reset when audioSrc changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
  }, [audioSrc]);

  if (!audioSrc) {
    return <p>No audio selected.</p>;
  }

  return (
    <div className="audio-player" style={{ textAlign: "center" }}>
      <audio ref={audioRef} src={audioSrc} />
      <button
        onClick={togglePlayPause}
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          backgroundColor: isPlaying ? "#e53e3e" : "#38b2ac",
          color: "#fff",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          marginTop: "10px",
        }}
      >
        {isPlaying ? "Pause" : "Play"}
      </button>
    </div>
  );
};

export default AudioPlayer;
