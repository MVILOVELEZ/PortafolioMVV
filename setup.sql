-- Create the projects table
CREATE TABLE IF NOT EXISTS projects (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT NOT NULL,
    image_url TEXT NOT NULL,
    user_id UUID REFERENCES auth.users(id)
);

-- Enable Row Level Security
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view projects
CREATE POLICY "Public projects are viewable by everyone" 
ON projects FOR SELECT 
USING (true);

-- Policy: Only authenticated users can manage their own projects
CREATE POLICY "Users can manage their own projects" 
ON projects FOR ALL 
USING (auth.role() = 'authenticated');
