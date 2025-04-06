import React, { useState, useRef } from "react";

const AudioRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/wav",
        });
        const audioUrl = URL.createObjectURL(audioBlob);
        console.log("Audio URL:", audioUrl);
        // Handle the audio URL (e.g., save it, play it, etc.)
      };
      setIsRecording(false);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
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
        Or if you think you can do better, record your own audio!
      </p>
      <button
        onClick={isRecording ? stopRecording : startRecording}
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          backgroundColor: isRecording ? "#ff4d4d" : "#38b2ac",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        {isRecording ? "Stop Recording" : "Start Recording"}
      </button>
    </div>
  );
};

export default AudioRecorder;
