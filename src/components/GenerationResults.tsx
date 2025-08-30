import React, { useState } from 'react'
import { GenerationResult, VideoData } from './CaptionGenerator'
import './GenerationResults.css'

interface GenerationResultsProps {
  results: GenerationResult[]
  isGenerating: boolean
  videoData: VideoData | null
}

const GenerationResults: React.FC<GenerationResultsProps> = ({ 
  results, 
  isGenerating, 
  videoData 
}) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  const copyToClipboard = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedIndex(index)
      setTimeout(() => setCopiedIndex(null), 2000)
    } catch (err) {
      console.error('Failed to copy to clipboard:', err)
    }
  }

  const copyCaptionAndHashtags = async (result: GenerationResult, index: number) => {
    const fullText = `${result.caption}\n\n${result.hashtags.join(' ')}`
    await copyToClipboard(fullText, index)
  }

  if (!videoData) {
    return (
      <div className="results-placeholder">
        <div className="placeholder-content">
          <div className="placeholder-icon">🎬</div>
          <h3>Upload a video to get started</h3>
          <p>Your AI-generated captions and hashtags will appear here</p>
        </div>
      </div>
    )
  }

  return (
    <div className="generation-results">
      <h3>✨ Generated Results</h3>
      
      {isGenerating && (
        <div className="generating-indicator">
          <div className="loading-spinner"></div>
          <p>AI is crafting your perfect caption and hashtags...</p>
        </div>
      )}

      {results.length === 0 && !isGenerating && (
        <div className="no-results">
          <p>Click "Generate" to create your first caption and hashtags!</p>
        </div>
      )}

      <div className="results-list">
        {results.map((result, index) => (
          <div key={index} className="result-card">
            <div className="result-header">
              <span className="result-timestamp">
                {result.timestamp.toLocaleTimeString()}
              </span>
              <div className="result-actions">
                <button
                  className={`copy-btn ${copiedIndex === index ? 'copied' : ''}`}
                  onClick={() => copyCaptionAndHashtags(result, index)}
                  title="Copy caption + hashtags"
                >
                  {copiedIndex === index ? '✅ Copied!' : '📋 Copy All'}
                </button>
              </div>
            </div>

            <div className="result-content">
              <div className="caption-section">
                <h4>📝 Caption</h4>
                <p className="caption-text">{result.caption}</p>
                <button
                  className="copy-section-btn"
                  onClick={() => copyToClipboard(result.caption, index)}
                >
                  📋 Copy Caption
                </button>
              </div>

              <div className="hashtags-section">
                <h4>🏷️ Hashtags</h4>
                <div className="hashtags-grid">
                  {result.hashtags.map((hashtag, hashtagIndex) => (
                    <span key={hashtagIndex} className="hashtag">
                      {hashtag}
                    </span>
                  ))}
                </div>
                <button
                  className="copy-section-btn"
                  onClick={() => copyToClipboard(result.hashtags.join(' '), index)}
                >
                  📋 Copy Hashtags
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default GenerationResults

