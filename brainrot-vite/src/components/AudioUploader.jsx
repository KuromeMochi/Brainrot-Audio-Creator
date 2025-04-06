import React, { useState } from "react";

const AudioUploader = ({ onAudioSelected, onEffectSelected }) => {
  const [selectedAudio, setSelectedAudio] = useState(null);
  const [audioPlayer, setAudioPlayer] = useState(null); // State to manage the audio player
  const [selectedEffect, setSelectedEffect] = useState(null); // State to manage the selected sound effect
  const [effectPlayer, setEffectPlayer] = useState(null); // State to manage the sound effect player
  const audioFiles = [
    { name: "Peppa Pig", url: "/songs/peppapig.mp3", file: "peppapig" },
    { name: "Audio 2", url: "/audio2.mp3", file: "peppapig" },
    { name: "Audio 3", url: "/audio3.mp3", file: "peppapig" },
  ];
  const soundEffects = [
    { name: "Fart", url: "/sound_effects/perfect-fart.mp3", file: "perfect-fart" },
    { name: "Laughter", url: "/laughter.mp3" , file: "perfect-fart" },
    { name: "Buzzer", url: "/buzzer.mp3", file: "perfect-fart"  },
  ];

  const handleSelectAudio = (audio) => {
    setSelectedAudio(audio);
    onAudioSelected(audio); // Pass the selected audio to the parent component
    if (audioPlayer) {
      audioPlayer.pause(); // Stop any currently playing audio
    }
    setAudioPlayer(new Audio(audio.url)); // Create a new audio player
  };

  const handleSelectEffect = (effect) => {
    setSelectedEffect(effect);
    onEffectSelected(effect); // Pass the selected effect to the parent component
    if (effectPlayer) {
      effectPlayer.pause(); // Stop any currently playing audio
    }
    setEffectPlayer(new Audio(effect.url)); // Create a new audio player
  };

  const handlePlaySoundEffect = () => {
    if (selectedEffect && effectPlayer) {
      effectPlayer.currentTime = 0; // Start from the beginning
      effectPlayer.play();
      console.log("Playing:", selectedEffect.name);

      // Stop playback after 5 seconds
      setTimeout(() => {
        effectPlayer.pause();
        effectPlayer.currentTime = 0; // Reset playback to the beginning
        console.log("Sound effect sample ended");
      }, 3000);
    } else {
      console.log("No sound effect selected");
    }
  };

  const handlePlayAudio = () => {
    if (selectedAudio && audioPlayer) {
      audioPlayer.currentTime = 0; // Start from the beginning
      audioPlayer.play();
      console.log("Playing:", selectedAudio.name);

      // Stop playback after 5 seconds
      setTimeout(() => {
        audioPlayer.pause();
        audioPlayer.currentTime = 0; // Reset playback to the beginning
        console.log("Audio sample ended");
      }, 3000);
    } else {
      console.log("No audio selected");
    }
  };

  return (
    <div
      style={{
        maxWidth: "700px",
        margin: "0 auto",
        textAlign: "center",
        padding: "30px",
        border: "1px solid #ddd",
        borderRadius: "12px",
        backgroundColor: "#fefefe",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      }}
    >
      <h2 style={{ fontSize: "24px", color: "#2d3748", marginBottom: "20px" }}>
        Select a Song
      </h2>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "15px",
          marginBottom: "30px",
        }}
      >
        {audioFiles.map((audio) => (
          <div
            key={audio.name}
            onClick={() => handleSelectAudio(audio)}
            style={{
              border:
                selectedAudio?.name === audio.name
                  ? "2px solid #38b2ac"
                  : "1px solid #ddd",
              borderRadius: "10px",
              padding: "15px",
              cursor: "pointer",
              width: "160px",
              textAlign: "center",
              backgroundColor:
                selectedAudio?.name === audio.name ? "#e6fffa" : "#fff",
              transition: "background-color 0.3s, border-color 0.3s",
            }}
          >
            <p
              style={{ fontWeight: "bold", margin: "10px 0", color: "#2d3748" }}
            >
              {audio.name}
            </p>
          </div>
        ))}
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "15px",
          marginBottom: "30px",
        }}
      >
        <button
          onClick={handlePlayAudio}
          disabled={!selectedAudio} // Disable if no audio is selected
          style={{
            padding: "12px 25px",
            backgroundColor: selectedAudio ? "#38b2ac" : "#a0aec0",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: selectedAudio ? "pointer" : "not-allowed",
            fontSize: "16px",
            transition: "background-color 0.3s",
          }}
          onMouseOver={(e) =>
            selectedAudio && (e.target.style.backgroundColor = "#319795")
          }
          onMouseOut={(e) =>
            selectedAudio && (e.target.style.backgroundColor = "#38b2ac")
          }
        >
          Preview
        </button>
      </div>
      <h2 style={{ fontSize: "24px", color: "#2d3748", marginBottom: "20px" }}>
        Select a Sound Effect
      </h2>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "15px",
          marginBottom: "30px",
        }}
      >
        {soundEffects.map((effect) => (
          <div
            key={effect.name}
            onClick={() => handleSelectEffect(effect)}
            style={{
              border:
                selectedEffect?.name === effect.name
                  ? "2px solid #38b2ac"
                  : "1px solid #ddd",
              borderRadius: "10px",
              padding: "15px",
              cursor: "pointer",
              width: "160px",
              textAlign: "center",
              backgroundColor:
                selectedEffect?.name === effect.name ? "#e6fffa" : "#fff",
              transition: "background-color 0.3s, border-color 0.3s",
            }}
          >
            <p
              style={{ fontWeight: "bold", margin: "10px 0", color: "#2d3748" }}
            >
              {effect.name}
            </p>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "center", gap: "15px" }}>
        <button
          onClick={handlePlaySoundEffect}
          disabled={!selectedEffect} // Disable if no sound effect is selected
          style={{
            padding: "12px 25px",
            backgroundColor: selectedEffect ? "#38b2ac" : "#a0aec0",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: selectedEffect ? "pointer" : "not-allowed",
            fontSize: "16px",
            transition: "background-color 0.3s",
          }}
          onMouseOver={(e) =>
            selectedEffect && (e.target.style.backgroundColor = "#319795")
          }
          onMouseOut={(e) =>
            selectedEffect && (e.target.style.backgroundColor = "#38b2ac")
          }
        >
          Preview
        </button>
      </div>
    </div>
  );
};

export default AudioUploader;
