# Supabase Setup Instructions

To support image uploads and the new image URL field, please run the following SQL script in your Supabase Dashboard SQL Editor.

```sql
-- 1. Add image_url column to prompts table if it doesn't exist
ALTER TABLE prompts ADD COLUMN IF NOT EXISTS image_url TEXT;

-- 2. Create the 'images' storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('images', 'images', true)
ON CONFLICT (id) DO NOTHING;

-- 3. Enable RLS on the bucket (optional but recommended, usually enabled by default)
-- UPDATE storage.buckets SET file_size_limit = 5242880 WHERE id = 'images'; -- 5MB limit example

-- 4. Set up Storage Policies

-- Allow public read access to images
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'images' );

-- Allow authenticated users to upload images
CREATE POLICY "Authenticated users can upload images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'images' AND auth.role() = 'authenticated' );

-- Allow users to update/delete their own images (Optional, strictly speaking only upload is minimal requirement)
CREATE POLICY "Users can delete own images"
ON storage.objects FOR DELETE
TO authenticated
USING ( bucket_id = 'images' AND auth.uid() = owner );
```

## How to run:

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard).
2. Select your project.
3. Go to the **SQL Editor** section (icon on the left).
4. Paste the SQL code above.
5. Click **Run**.
