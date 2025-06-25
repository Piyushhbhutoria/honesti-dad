
-- Drop ALL existing policies first (some may not exist, so we use IF EXISTS)
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own data" ON public.profiles;
DROP POLICY IF EXISTS "Anyone can create users" ON public.profiles;

DROP POLICY IF EXISTS "Users can view their own feedback requests" ON public.feedback_requests;
DROP POLICY IF EXISTS "Users can create their own feedback requests" ON public.feedback_requests;
DROP POLICY IF EXISTS "Users can update their own feedback requests" ON public.feedback_requests;
DROP POLICY IF EXISTS "Users can delete their own feedback requests" ON public.feedback_requests;
DROP POLICY IF EXISTS "Anyone can view active feedback requests" ON public.feedback_requests;
DROP POLICY IF EXISTS "Anyone can create feedback requests" ON public.feedback_requests;
DROP POLICY IF EXISTS "Anyone can update feedback requests" ON public.feedback_requests;
DROP POLICY IF EXISTS "Public can view active feedback requests by slug" ON public.feedback_requests;

DROP POLICY IF EXISTS "Users can view messages for their own feedback requests" ON public.anonymous_messages;
DROP POLICY IF EXISTS "Users can update messages for their own feedback requests" ON public.anonymous_messages;
DROP POLICY IF EXISTS "Users can delete messages for their own feedback requests" ON public.anonymous_messages;
DROP POLICY IF EXISTS "Anyone can view messages for feedback requests" ON public.anonymous_messages;
DROP POLICY IF EXISTS "Anyone can send anonymous messages" ON public.anonymous_messages;
DROP POLICY IF EXISTS "Public can send anonymous messages to active requests" ON public.anonymous_messages;

-- Now create the secure policies
-- Profiles table policies
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Feedback requests policies
CREATE POLICY "Users can view their own feedback requests" ON public.feedback_requests
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own feedback requests" ON public.feedback_requests
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own feedback requests" ON public.feedback_requests
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own feedback requests" ON public.feedback_requests
  FOR DELETE USING (auth.uid() = user_id);

-- Public can view active feedback requests by slug (needed for SendFeedback component)
CREATE POLICY "Public can view active feedback requests by slug" ON public.feedback_requests
  FOR SELECT USING (is_active = true);

-- Anonymous messages policies
CREATE POLICY "Users can view messages for their own feedback requests" ON public.anonymous_messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.feedback_requests fr 
      WHERE fr.id = feedback_request_id 
      AND fr.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update messages for their own feedback requests" ON public.anonymous_messages
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.feedback_requests fr 
      WHERE fr.id = feedback_request_id 
      AND fr.user_id = auth.uid()
    )
  );

CREATE POLICY "Public can send anonymous messages to active requests" ON public.anonymous_messages
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.feedback_requests fr 
      WHERE fr.id = feedback_request_id 
      AND fr.is_active = true
    )
  );

-- Add validation constraints using correct column names
DO $$ 
BEGIN
  -- Check and add content length constraint
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints tc
    JOIN information_schema.check_constraints cc ON tc.constraint_name = cc.constraint_name
    WHERE tc.constraint_name = 'check_content_length' 
    AND tc.table_name = 'anonymous_messages'
    AND tc.table_schema = 'public'
  ) THEN
    ALTER TABLE public.anonymous_messages 
    ADD CONSTRAINT check_content_length CHECK (char_length(content) > 0 AND char_length(content) <= 2000);
  END IF;

  -- Check and add name length constraint
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints tc
    JOIN information_schema.check_constraints cc ON tc.constraint_name = cc.constraint_name
    WHERE tc.constraint_name = 'check_name_length' 
    AND tc.table_name = 'feedback_requests'
    AND tc.table_schema = 'public'
  ) THEN
    ALTER TABLE public.feedback_requests 
    ADD CONSTRAINT check_name_length CHECK (char_length(name) > 0 AND char_length(name) <= 100);
  END IF;

  -- Check and add slug format constraint
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints tc
    JOIN information_schema.check_constraints cc ON tc.constraint_name = cc.constraint_name
    WHERE tc.constraint_name = 'check_slug_format' 
    AND tc.table_name = 'feedback_requests'
    AND tc.table_schema = 'public'
  ) THEN
    ALTER TABLE public.feedback_requests 
    ADD CONSTRAINT check_slug_format CHECK (unique_slug ~ '^[a-z0-9]+$' AND char_length(unique_slug) >= 5);
  END IF;

  -- Check and add profile name length constraint
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints tc
    JOIN information_schema.check_constraints cc ON tc.constraint_name = cc.constraint_name
    WHERE tc.constraint_name = 'check_profile_name_length' 
    AND tc.table_name = 'profiles'
    AND tc.table_schema = 'public'
  ) THEN
    ALTER TABLE public.profiles 
    ADD CONSTRAINT check_profile_name_length CHECK (char_length(name) > 0 AND char_length(name) <= 100);
  END IF;
END $$;
