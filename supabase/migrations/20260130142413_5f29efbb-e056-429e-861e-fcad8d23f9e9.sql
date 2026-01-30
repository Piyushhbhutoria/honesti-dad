-- Add explicit DENY policy for anonymous users on profiles table
-- This ensures unauthenticated users cannot access any profile data including emails

CREATE POLICY "Anonymous users cannot access profiles"
ON public.profiles
FOR SELECT
TO anon
USING (false);