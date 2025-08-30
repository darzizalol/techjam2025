import React from 'react'
import './ContextInput.css'

interface ContextInputProps {
  context: string
  onContextChange: (context: string) => void
}

const ContextInput: React.FC<ContextInputProps> = ({ context, onContextChange }) => {
  return (
    <div className="context-input">
      <h3>💭 Additional Context (Optional)</h3>
      <textarea
        value={context}
        onChange={(e) => onContextChange(e.target.value)}
        placeholder="Describe what's happening in your video, your target audience, or any specific message you want to convey..."
        rows={4}
        className="context-textarea"
      />
      <p className="context-hint">
        💡 Adding context helps AI generate more relevant and engaging captions
      </p>
    </div>
  )
}

export default ContextInput

