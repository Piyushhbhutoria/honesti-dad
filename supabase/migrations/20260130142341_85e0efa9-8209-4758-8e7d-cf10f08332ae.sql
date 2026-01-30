-- Add restrictive policies for UPDATE and DELETE on anonymous_messages
-- Only the feedback request owner should be able to delete messages (e.g., to remove spam)
-- UPDATE is completely denied to preserve message integrity

-- Policy: Deny all UPDATE operations on anonymous messages to preserve integrity
-- Anonymous messages should never be modified after submission
CREATE POLICY "Anonymous messages cannot be updated"
ON public.anonymous_messages
FOR UPDATE
TO authenticated, anon
USING (false);

-- Policy: Only feedback request owners can delete messages sent to them
-- This allows users to remove unwanted/spam messages from their inbox
CREATE POLICY "Feedback request owners can delete their messages"
ON public.anonymous_messages
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.feedback_requests
    WHERE feedback_requests.id = anonymous_messages.feedback_request_id
    AND feedback_requests.user_id = auth.uid()
  )
);