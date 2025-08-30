-- To be run in supabase


-- Create the generation_logs table
CREATE TABLE IF NOT EXISTS generation_logs (
  id SERIAL PRIMARY KEY,
  video_name TEXT NOT NULL,
  tone TEXT NOT NULL,
  context TEXT,
  caption TEXT NOT NULL,
  hashtags TEXT[] NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_generation_logs_created_at ON generation_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_generation_logs_tone ON generation_logs(tone);

-- Enable Row Level Security (RLS)
ALTER TABLE generation_logs ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows all operations (for demo purposes)
-- In production, you might want to restrict this based on user authentication
CREATE POLICY "Allow all operations" ON generation_logs
  FOR ALL USING (true);

-- Optional: Create a view for analytics
CREATE OR REPLACE VIEW generation_analytics AS
SELECT 
  DATE(created_at) as date,
  tone,
  COUNT(*) as total_generations,
  AVG(LENGTH(caption)) as avg_caption_length,
  COUNT(DISTINCT video_name) as unique_videos
FROM generation_logs
GROUP BY DATE(created_at), tone
ORDER BY date DESC, total_generations DESC;

-- Optional: Create a function to get popular hashtags
CREATE OR REPLACE FUNCTION get_popular_hashtags(limit_count INTEGER DEFAULT 20)
RETURNS TABLE(hashtag TEXT, usage_count BIGINT) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    unnest(hashtags) as hashtag,
    COUNT(*) as usage_count
  FROM generation_logs
  GROUP BY unnest(hashtags)
  ORDER BY usage_count DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon;
GRANT ALL ON generation_logs TO anon;
GRANT ALL ON generation_logs_id_seq TO anon;
GRANT SELECT ON generation_analytics TO anon;
GRANT EXECUTE ON FUNCTION get_popular_hashtags TO anon;

