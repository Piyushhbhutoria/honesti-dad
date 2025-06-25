
-- First, create the profiles table to store user information
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles table
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Create a function to handle new user profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'name', NEW.email),
    NEW.email
  );
  RETURN NEW;
END;
$$;

-- Create trigger to automatically create profile when user signs up
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Migrate existing data from the old users table to profiles
-- This preserves the existing user IDs and relationships
INSERT INTO public.profiles (id, name, email, created_at)
SELECT 
  u.id,
  u.name,
  u.email,
  u.created_at
FROM public.users u;

-- Update the foreign key constraint for feedback_requests
ALTER TABLE public.feedback_requests 
DROP CONSTRAINT IF EXISTS feedback_requests_user_id_fkey;

ALTER TABLE public.feedback_requests 
ADD CONSTRAINT feedback_requests_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- Update RLS policies for feedback_requests
-- For now, make them permissive until proper auth is implemented
DROP POLICY IF EXISTS "Anyone can view feedback requests" ON public.feedback_requests;
DROP POLICY IF EXISTS "Users can create feedback requests" ON public.feedback_requests;
DROP POLICY IF EXISTS "Users can update their own feedback requests" ON public.feedback_requests;

CREATE POLICY "Anyone can view active feedback requests" ON public.feedback_requests
  FOR SELECT USING (is_active = true);

CREATE POLICY "Anyone can create feedback requests" ON public.feedback_requests
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update feedback requests" ON public.feedback_requests
  FOR UPDATE USING (true);

-- Update RLS policies for anonymous_messages
-- Keep them permissive for now until proper auth is implemented
DROP POLICY IF EXISTS "Users can view messages for their feedback requests" ON public.anonymous_messages;

CREATE POLICY "Anyone can view messages for feedback requests" ON public.anonymous_messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.feedback_requests fr 
      WHERE fr.id = feedback_request_id 
      AND fr.is_active = true
    )
  );

-- Drop the old users table since we're using profiles now
DROP TABLE public.users CASCADE;
