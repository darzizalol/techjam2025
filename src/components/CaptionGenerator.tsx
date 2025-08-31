import React, { useState } from 'react'
import VideoUpload from './VideoUpload'
import ToneSelector from './ToneSelector'
import ContextInput from './ContextInput'
import GenerationResults from './GenerationResults'
import { generateCaptionAndHashtags } from '../services/geminiService'
import { saveToSupabase } from '../services/supabaseService'
import './CaptionGenerator.css'

export interface GenerationResult {
  caption: string
  hashtags: string[]
  timestamp: Date
}

export interface VideoData {
  file: File
  preview: string
}

const CaptionGenerator: React.FC = () => {
  const [videoData, setVideoData] = useState<VideoData | null>(null)
  const [tone, setTone] = useState<string>('funny')
  const [context, setContext] = useState<string>('')
  const [isGenerating, setIsGenerating] = useState<boolean>(false)
  const [results, setResults] = useState<GenerationResult[]>([])
  const [error, setError] = useState<string>('')

  const handleGenerate = async () => {
    if (!videoData) {
      setError('Please upload a video first')
      return
    }

    setIsGenerating(true)
    setError('')

    try {
      // Generate caption and hashtags using Gemini
      const result = await generateCaptionAndHashtags(tone, context)
      
      const newResult: GenerationResult = {
        caption: result.caption,
        hashtags: result.hashtags,
        timestamp: new Date()
      }

      setResults(prev => [newResult, ...prev])
      
      // Save to Supabase for logging
      await saveToSupabase({
        videoName: videoData.file.name,
        tone,
        context,
        caption: result.caption,
        hashtags: result.hashtags,
        timestamp: newResult.timestamp
      })

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate content')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleVideoUpload = (file: File) => {
    const preview = URL.createObjectURL(file)
    setVideoData({ file, preview })
    setError('')
  }

  const canGenerate = videoData && !isGenerating

  return (
    <div className="caption-generator">
      <div className="generator-container">
        <div className="input-section">
          <VideoUpload onVideoUpload={handleVideoUpload} />
          <ToneSelector tone={tone} onToneChange={setTone} />
          <ContextInput context={context} onContextChange={setContext} />
          
          <button 
            className={`generate-btn ${!canGenerate ? 'disabled' : ''}`}
            onClick={handleGenerate}
            disabled={!canGenerate}
          >
            {isGenerating ? '✨ Generating...' : '🚀 Generate Caption & Hashtags'}
          </button>

          {error && <div className="error-message">{error}</div>}
        </div>

        <div className="results-section">
          <GenerationResults 
            results={results} 
            isGenerating={isGenerating}
            videoData={videoData}
          />
        </div>
      </div>
    </div>
  )
}

export default CaptionGenerator


