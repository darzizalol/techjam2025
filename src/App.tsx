import React from 'react'
import CaptionGenerator from './components/CaptionGenerator'
import './App.css'

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>🎬 Caption & Hashtag Alchemist</h1>
        <p>Transform your TikTok videos with AI-powered captions and strategic hashtags</p>
      </header>
      <main>
        <CaptionGenerator />
      </main>
    </div>
  )
}

export default App
