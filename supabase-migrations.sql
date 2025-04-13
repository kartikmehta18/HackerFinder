
-- This is a sample migration file that would be applied to your Supabase project

-- Add is_approved column to hackathons table
ALTER TABLE hackathons ADD COLUMN IF NOT EXISTS is_approved BOOLEAN DEFAULT FALSE;

-- Set existing hackathons to approved
UPDATE hackathons SET is_approved = TRUE WHERE is_approved IS NULL;

-- Add index for faster querying
CREATE INDEX IF NOT EXISTS idx_hackathons_approval ON hackathons(is_approved);

-- Add reference from hackathon_participants to hackathons
ALTER TABLE hackathon_participants 
    ADD CONSTRAINT hackathon_participants_hackathon_id_fkey 
    FOREIGN KEY (hackathon_id) 
    REFERENCES hackathons(id) 
    ON DELETE CASCADE;

-- Add reference from hackathons to profiles (for created_by)
ALTER TABLE hackathons 
    ADD CONSTRAINT hackathons_created_by_fkey 
    FOREIGN KEY (created_by) 
    REFERENCES profiles(id);

-- Add default admin user (this would be done through RLS)
-- In a real implementation, you would set up proper RLS policies and not hardcode admin emails
