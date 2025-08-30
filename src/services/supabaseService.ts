import { createClient, SupabaseClient } from '@supabase/supabase-js'

// Initialize Supabase client only when environment variables are available
let supabase: SupabaseClient | null = null

const initializeSupabase = () => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
  
  if (supabaseUrl && supabaseKey) {
    try {
      supabase = createClient(supabaseUrl, supabaseKey)
      return true
    } catch (error) {
      console.error('Failed to initialize Supabase client:', error)
      return false
    }
  }
  return false
}

export interface GenerationLog {
  videoName: string
  tone: string
  context: string
  caption: string
  hashtags: string[]
  timestamp: Date
}

export const saveToSupabase = async (data: GenerationLog): Promise<void> => {
  try {
    if (!supabase && !initializeSupabase()) {
      console.warn('Supabase not configured, skipping log save')
      return
    }

    if (!supabase) {
      console.warn('Supabase client not available, skipping log save')
      return
    }

    const { error } = await supabase
      .from('generation_logs')
      .insert({
        video_name: data.videoName,
        tone: data.tone,
        context: data.context,
        caption: data.caption,
        hashtags: data.hashtags,
        created_at: data.timestamp.toISOString()
      })

    if (error) {
      console.error('Error saving to Supabase:', error)
      // Don't throw error as this is just logging
    }
  } catch (error) {
    console.error('Error saving to Supabase:', error)
    // Don't throw error as this is just logging
  }
}

export const getGenerationHistory = async (): Promise<GenerationLog[]> => {
  try {
    if (!supabase && !initializeSupabase()) {
      return []
    }

    if (!supabase) {
      return []
    }

    const { data, error } = await supabase
      .from('generation_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50)

    if (error) {
      console.error('Error fetching history:', error)
      return []
    }

    return data?.map(row => ({
      videoName: row.video_name,
      tone: row.tone,
      context: row.context,
      caption: row.caption,
      hashtags: row.hashtags,
      timestamp: new Date(row.created_at)
    })) || []

  } catch (error) {
    console.error('Error fetching history:', error)
    return []
  }
}
