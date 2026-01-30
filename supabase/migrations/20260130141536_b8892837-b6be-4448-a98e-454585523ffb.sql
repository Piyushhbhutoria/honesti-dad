-- Drop the overly permissive policy that exposes user names
DROP POLICY IF EXISTS "Anyone can view active feedback requests by slug" ON public.feedback_requests;

-- Create a more restrictive policy that only allows SELECT when querying by a specific slug
-- This prevents bulk harvesting of user names while still allowing the public feedback flow to work
CREATE POLICY "Public can view feedback request by specific slug"
ON public.feedback_requests
FOR SELECT
TO anon, authenticated
USING (
  is_active = true 
  AND unique_slug = current_setting('request.query.slug', true)
);

-- Alternative approach: Create a security definer function that safely retrieves feedback request by slug
-- This is more reliable than relying on current_setting
CREATE OR REPLACE FUNCTION public.get_feedback_request_by_slug(p_slug text)
RETURNS TABLE (
  id uuid,
  unique_slug text,
  name text,
  is_active boolean,
  created_at timestamptz
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id, unique_slug, name, is_active, created_at
  FROM public.feedback_requests
  WHERE unique_slug = p_slug AND is_active = true
  LIMIT 1;
$$;

-- Grant execute permission to anonymous and authenticated users
GRANT EXECUTE ON FUNCTION public.get_feedback_request_by_slug(text) TO anon, authenticated;

-- Update the RLS policy to be more restrictive - only owner can see their own requests
-- Public access should go through the function instead
DROP POLICY IF EXISTS "Public can view feedback request by specific slug" ON public.feedback_requests;

-- Only allow authenticated users to view their own feedback requests
-- Anonymous/public access uses the get_feedback_request_by_slug function
CREATE POLICY "Public can only view by exact slug match"
ON public.feedback_requests
FOR SELECT
TO anon
USING (false);  -- Anon users must use the RPC function

-- Authenticated users can view their own OR query by exact slug
CREATE POLICY "Authenticated users view own or by slug"
ON public.feedback_requests
FOR SELECT
TO authenticated
USING (
  auth.uid() = user_id  -- Owner can see their own
);