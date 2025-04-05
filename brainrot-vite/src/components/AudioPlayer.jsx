import React, { useState, useRef } from 'react'

const AudioPlayer = ({ audioSrc }) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef(null)

  const togglePlayPause = () => {
    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }

  return (
    <div className="audio-player">
      <audio ref={audioRef} src={audioSrc} />
      <button onClick={togglePlayPause}>{isPlaying ? 'Pause' : 'Play'}</button>
    </div>
  )
}

export default AudioPlayer
