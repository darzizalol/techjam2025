import React from 'react'
import './ToneSelector.css'

interface ToneSelectorProps {
  tone: string
  onToneChange: (tone: string) => void
}

const ToneSelector: React.FC<ToneSelectorProps> = ({ tone, onToneChange }) => {
  const tones = [
    { value: 'funny', label: '😄 Funny', description: 'Humor and wit' },
    { value: 'dramatic', label: '🎭 Dramatic', description: 'Emotional and intense' },
    { value: 'curious', label: '🤔 Curious', description: 'Questioning and engaging' },
    { value: 'inspirational', label: '✨ Inspirational', description: 'Motivational and uplifting' },
    { value: 'sarcastic', label: '😏 Sarcastic', description: 'Witty and ironic' },
    { value: 'casual', label: '😊 Casual', description: 'Relaxed and friendly' }
  ]

  return (
    <div className="tone-selector">
      <h3>🎨 Choose Your Tone</h3>
      <div className="tone-grid">
        {tones.map((toneOption) => (
          <div
            key={toneOption.value}
            className={`tone-option ${tone === toneOption.value ? 'selected' : ''}`}
            onClick={() => onToneChange(toneOption.value)}
          >
            <div className="tone-icon">{toneOption.label.split(' ')[0]}</div>
            <div className="tone-info">
              <div className="tone-label">{toneOption.label.split(' ').slice(1).join(' ')}</div>
              <div className="tone-description">{toneOption.description}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ToneSelector

