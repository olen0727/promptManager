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

-- 5. (Optional) Add user_email and user_name columns for easier database browsing
ALTER TABLE prompts ADD COLUMN IF NOT EXISTS user_email TEXT;
ALTER TABLE prompts ADD COLUMN IF NOT EXISTS user_name TEXT;

-- 6. Automate Demo Prompt for New Users
-- Function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  new_tag_id_cute UUID;
  new_tag_id_animal UUID;
  new_prompt_id UUID;
BEGIN
  -- 1. Create Default Tags
  INSERT INTO public.tags (name, color, user_id)
  VALUES ('可愛', '#FFB6C1', new.id)
  RETURNING id INTO new_tag_id_cute;

  INSERT INTO public.tags (name, color, user_id)
  VALUES ('動物', '#ADD8E6', new.id)
  RETURNING id INTO new_tag_id_animal;

  -- 2. Create Demo Prompt
  INSERT INTO public.prompts (
    title, 
    description, 
    content, 
    user_id, 
    is_public,
    user_email,
    user_name
  )
  VALUES (
    '示範Prompt',
    '這是個示範的Prompt, 您可以在變數後增加冒號及選項',
    '畫面以超高解析度 8K 呈現，結合 HDR 效果與 {{style:樂高積木風格,Unreal Engine 5 寫實光追,Pixar 卡通渲染,黏土動畫值感,手辦級實體渲染}} ，細節極為精緻細膩。畫面中央是一碗盛在瓷碗中的湯圓，碗裡的湯圓被塑造成多種 可愛動物 的臉部，包括加菲貓、美洲豹、狐狸、豬鼻子白兔、犀牛、兔耳白鴨、戴皇冠的獅子王、哥吉拉、絨鼠、戴皇冠的女王蜂、鹿角棕髮少年、史努比、肥胖橘貓以及白兔子，造型豐富且充滿童趣。
背景為木質桌面散景，營造出溫暖柔和的氛圍。畫面上方以童趣字體書寫了標題「{{pic_title}}」，為整幅作品增添了可愛又應景的節慶氛圍。',
    new.id,
    false,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email, '@', 1))
  )
  RETURNING id INTO new_prompt_id;

  -- 3. Link Tags to Prompt
  INSERT INTO public.prompt_tags (prompt_id, tag_id)
  VALUES 
  (new_prompt_id, new_tag_id_cute),
  (new_prompt_id, new_tag_id_animal);

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call the function on new user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created

-- 7. (Recommended) Enable Cascade Delete for User Data
-- This ensures that when a user is deleted from Auth, their Prompts and Tags are also removed.
-- NOTE: If your constraint names are different, you may need to check them in Table Editor first.

-- Attempt to fix prompts table
ALTER TABLE public.prompts
DROP CONSTRAINT IF EXISTS prompts_user_id_fkey,
ADD CONSTRAINT prompts_user_id_fkey
FOREIGN KEY (user_id)
REFERENCES auth.users(id)
ON DELETE CASCADE;

-- Attempt to fix tags table
ALTER TABLE public.tags
DROP CONSTRAINT IF EXISTS tags_user_id_fkey,
ADD CONSTRAINT tags_user_id_fkey
FOREIGN KEY (user_id)
REFERENCES auth.users(id)
ON DELETE CASCADE;



```

## How to run:

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard).
2. Select your project.
3. Go to the **SQL Editor** section (icon on the left).
4. Paste the SQL code above.

## Google OAuth Setup

1.  Go to the [Google Cloud Console](https://console.cloud.google.com/).
2.  Create a new project or select an existing one.
3.  Go to **APIs & Services** > **Credentials**.
4.  Click **Create Credentials** > **OAuth client ID**.
5.  Select **Web application** as the application type.
6.  Add the following URI to **Authorized redirect URIs**:
    `https://<your-project-ref>.supabase.co/auth/v1/callback`
    *(Replace `<your-project-ref>` with your Supabase Project ID)*
7.  Copy the **Client ID** and **Client Secret**.
8.  Go to your [Supabase Dashboard](https://supabase.com/dashboard).
9.  Go to **Authentication** > **Providers** > **Google**.
10. Toggle **Enable Google** to ON.
11. Paste your Client ID and Client Secret.
12. Click **Save**.

