import { useState } from 'react'
import AudioUploader from '../brainrot-vite/src/components/AudioUploader'
import AudioRecorder from '../brainrot-vite/src/components/AudioRecorder'
import AudioPlayer from '../brainrot-vite/src/components/AudioPlayer'
import ConvertedAudioDownloader from '../brainrot-vite/src/components/ConvertedAudioDownloader'
import { Sparkles, Music, DownloadCloud, Mic } from 'lucide-react'

function App() {
  const [originalAudio, setOriginalAudio] = useState(null)
  const [convertedAudio, setConvertedAudio] = useState(null)

  const handleFileUpload = (file) => {
    setOriginalAudio(file)
    // Implement file upload to backend here
  }

  const handleAudioRecorded = (audioBlob) => {
    setOriginalAudio(audioBlob)
    // Implement audio upload to backend here
  }

  const fetchConvertedAudio = () => {
    // Fetch converted audio from backend
    setConvertedAudio(/* received audio from backend */)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-amber-50 text-gray-900 flex flex-col items-center justify-center px-4 py-12 font-sans">
      <div className="w-full max-w-3xl text-center">
        <h1 className="text-5xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-amber-500 text-center mx-auto">
          Brainrot Audio Converter
        </h1>
        <p className="text-lg text-gray-700 mb-10 leading-relaxed max-w-2xl mx-auto text-center">
          Transform your recordings into uniquely amusing audio experiences.
        </p>

        <div className="space-y-8 mb-12">
          <AudioUploader onUpload={handleFileUpload} />
          <AudioRecorder onRecord={handleAudioRecorded} />
        </div>

        {originalAudio && (
          <div className="mb-12">
            <h2 className="text-xl font-medium text-gray-800 flex items-center justify-center gap-2 mb-4">
              <Music className="text-teal-500 animate-pulse" /> Original Audio
            </h2>
            <AudioPlayer audio={originalAudio} />
          </div>
        )}

        <button
          className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-500 to-amber-500 text-white font-semibold py-3 px-8 rounded-full transition-transform hover:opacity-90 active:scale-95 shadow-lg hover:shadow-xl"
          onClick={fetchConvertedAudio}
        >
          <Sparkles className="animate-spin-slow" /> Convert Audio
        </button>

        {convertedAudio && (
          <div className="mt-12">
            <h2 className="text-xl font-medium text-gray-800 flex items-center justify-center gap-2 mb-4">
              <Mic className="text-teal-500 animate-bounce" /> Converted Audio
            </h2>
            <AudioPlayer audio={convertedAudio} />
            <ConvertedAudioDownloader audio={convertedAudio}>
              <button className="mt-6 inline-flex items-center gap-2 border border-gray-300 bg-white text-gray-800 font-medium py-2 px-5 rounded-full shadow-md transition-transform hover:opacity-90 active:scale-95 hover:shadow-lg">
                <DownloadCloud /> Download Audio
              </button>
            </ConvertedAudioDownloader>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
