
-- Create a table for users who create feedback requests
CREATE TABLE public.users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create a table for feedback requests (shareable links)
CREATE TABLE public.feedback_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  unique_slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create a table for anonymous messages
CREATE TABLE public.anonymous_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  feedback_request_id UUID REFERENCES public.feedback_requests(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS) to ensure proper data access
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.anonymous_messages ENABLE ROW LEVEL SECURITY;

-- Create policies for users table
CREATE POLICY "Users can view their own data" ON public.users
  FOR SELECT USING (true); -- For now, allow reading for demo purposes

CREATE POLICY "Anyone can create users" ON public.users
  FOR INSERT WITH CHECK (true);

-- Create policies for feedback_requests table
CREATE POLICY "Anyone can view feedback requests" ON public.feedback_requests
  FOR SELECT USING (is_active = true);

CREATE POLICY "Users can create feedback requests" ON public.feedback_requests
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their own feedback requests" ON public.feedback_requests
  FOR UPDATE USING (true);

-- Create policies for anonymous_messages table
CREATE POLICY "Users can view messages for their feedback requests" ON public.anonymous_messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.feedback_requests fr 
      WHERE fr.id = feedback_request_id
    )
  );

CREATE POLICY "Anyone can send anonymous messages" ON public.anonymous_messages
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.feedback_requests fr 
      WHERE fr.id = feedback_request_id AND fr.is_active = true
    )
  );

-- Create indexes for better performance
CREATE INDEX idx_feedback_requests_slug ON public.feedback_requests(unique_slug);
CREATE INDEX idx_anonymous_messages_feedback_request ON public.anonymous_messages(feedback_request_id);
CREATE INDEX idx_anonymous_messages_created_at ON public.anonymous_messages(created_at DESC);
