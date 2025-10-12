-- Migration to add UPDATE policy for anonymous_messages
-- This allows users to mark messages as read for their own feedback requests

-- Add UPDATE policy for anonymous_messages
CREATE POLICY "Users can update messages for their own feedback requests" ON public.anonymous_messages
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.feedback_requests fr 
      WHERE fr.id = feedback_request_id 
      AND fr.user_id = auth.uid()
    )
  );

-- Optional: Add some helpful comments
COMMENT ON POLICY "Users can update messages for their own feedback requests" ON public.anonymous_messages IS 
'Allows users to update messages (e.g., mark as read) for feedback requests they own'; 
