import { GoogleGenerativeAI } from '@google/generative-ai'

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || '')

export interface GenerationResponse {
  caption: string
  hashtags: string[]
}

// Function to list available models (for debugging)
export const listAvailableModels = async (): Promise<string[]> => {
  try {
    if (!import.meta.env.VITE_GEMINI_API_KEY) {
      throw new Error('Gemini API key not configured')
    }
    
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${import.meta.env.VITE_GEMINI_API_KEY}`)
    const data = await response.json()
    
    if (data.models) {
      return data.models.map((model: any) => model.name)
    }
    return []
  } catch (error) {
    console.error('Error listing models:', error)
    return []
  }
}

export const generateCaptionAndHashtags = async (
  tone: string,
  context: string
): Promise<GenerationResponse> => {
  try {
    if (!import.meta.env.VITE_GEMINI_API_KEY) {
      throw new Error('Gemini API key not configured')
    }

    // Try different model names if one fails
    let model
    let modelName = ''
    try {
      model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
      modelName = 'gemini-1.5-flash'
      console.log('Using model: gemini-1.5-flash')
    } catch (error) {
      try {
        model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' })
        modelName = 'gemini-1.5-pro'
        console.log('Using model: gemini-1.5-pro')
      } catch (error2) {
        try {
          model = genAI.getGenerativeModel({ model: 'gemini-pro' })
          modelName = 'gemini-pro'
          console.log('Using model: gemini-pro')
        } catch (error3) {
          // Try the most basic approach
          try {
            model = genAI.getGenerativeModel({ model: 'gemini-1.0-pro' })
            modelName = 'gemini-1.0-pro'
            console.log('Using model: gemini-1.0-pro')
          } catch (error4) {
            throw new Error('No compatible Gemini model found. Please check your API key and model availability.')
          }
        }
      }
    }

    // Create a comprehensive prompt for TikTok content
    const prompt = `
You are a TikTok content expert. Generate a viral caption and strategic hashtags for a TikTok video.

Video Context: ${context || 'No additional context provided'}
Desired Tone: ${tone}

Requirements:
1. CAPTION: Create a ${tone} caption that's engaging, under 150 characters, and follows TikTok trends
2. HASHTAGS: Provide 8-12 hashtags including:
   - 2-3 trending/popular hashtags
   - 2-3 niche/community hashtags
   - 2-3 content-specific hashtags
   - 1-2 brand/creator hashtags (if applicable)

Format your response exactly as:
CAPTION: [your caption here]
HASHTAGS: [hashtag1] [hashtag2] [hashtag3] [hashtag4] [hashtag5] [hashtag6] [hashtag7] [hashtag8] [hashtag9] [hashtag10]

Make it engaging, authentic, and optimized for TikTok's algorithm.
`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    // Parse the response
    const captionMatch = text.match(/CAPTION:\s*(.+?)(?=\n|$)/i)
    const hashtagsMatch = text.match(/HASHTAGS:\s*(.+?)(?=\n|$)/i)

    if (!captionMatch || !hashtagsMatch) {
      throw new Error('Failed to parse AI response')
    }

    const caption = captionMatch[1].trim()
    const hashtagsText = hashtagsMatch[1].trim()
    const hashtags = hashtagsText.match(/\[([^\]]+)\]/g)?.map(h => h.replace(/[\[\]]/g, '')) || []

    return {
      caption,
      hashtags: hashtags.slice(0, 12) // Ensure max 12 hashtags
    }

  } catch (error) {
    console.error('Error generating content:', error)
    
    // Provide more specific error messages
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        throw new Error('Invalid API key. Please check your Gemini API key configuration.')
      } else if (error.message.includes('model')) {
        throw new Error('Model not available. Please try again or check API status.')
      } else if (error.message.includes('quota')) {
        throw new Error('API quota exceeded. Please try again later.')
      }
    }
    
    throw new Error('Failed to generate caption and hashtags. Please try again.')
  }
}
