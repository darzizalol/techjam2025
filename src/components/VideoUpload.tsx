import React, { useRef, useState } from 'react'
import './VideoUpload.css'

interface VideoUploadProps {
  onVideoUpload: (file: File) => void
}

const VideoUpload: React.FC<VideoUploadProps> = ({ onVideoUpload }) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [dragActive, setDragActive] = useState(false)
  const [preview, setPreview] = useState<string>('')

  const handleFileSelect = (file: File) => {
    if (file.type.startsWith('video/')) {
      const previewUrl = URL.createObjectURL(file)
      setPreview(previewUrl)
      onVideoUpload(file)
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0])
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0])
    }
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="video-upload">
      <h3>📹 Upload Your TikTok Video</h3>
      
      {!preview ? (
        <div
          className={`upload-area ${dragActive ? 'drag-active' : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={handleClick}
        >
          <div className="upload-content">
            <div className="upload-icon">🎬</div>
            <p>Drop your video here or click to browse</p>
            <p className="upload-hint">Supports MP4, MOV, AVI formats</p>
          </div>
        </div>
      ) : (
        <div className="video-preview">
          <video 
            src={preview} 
            controls 
            className="preview-video"
            onLoadedMetadata={(e) => {
              const video = e.target as HTMLVideoElement
              if (video.duration > 60) {
                alert('Video should be under 60 seconds for TikTok')
              }
            }}
          />
          <button 
            className="change-video-btn"
            onClick={() => {
              setPreview('')
              onVideoUpload(new File([], ''))
            }}
          >
            Change Video
          </button>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="video/*"
        onChange={handleFileInput}
        style={{ display: 'none' }}
      />
    </div>
  )
}

export default VideoUpload

