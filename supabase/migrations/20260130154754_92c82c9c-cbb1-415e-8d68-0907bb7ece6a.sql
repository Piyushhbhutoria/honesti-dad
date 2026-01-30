-- Create rate_limits table for server-side rate limiting
CREATE TABLE IF NOT EXISTS public.rate_limits (
  key TEXT PRIMARY KEY,
  count INTEGER NOT NULL DEFAULT 1,
  reset_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '1 minute'),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS on rate_limits table
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;

-- Create a policy that denies all direct access (only accessible via security definer functions)
CREATE POLICY "No direct access to rate_limits"
ON public.rate_limits
FOR ALL
TO anon, authenticated
USING (false)
WITH CHECK (false);

-- Create index for efficient cleanup of expired entries
CREATE INDEX IF NOT EXISTS idx_rate_limits_reset_at ON public.rate_limits(reset_at);

-- Create function to check and enforce rate limits
-- Returns TRUE if action is allowed, FALSE if rate limited
CREATE OR REPLACE FUNCTION public.check_rate_limit(
  p_key TEXT,
  p_max_attempts INTEGER,
  p_window_seconds INTEGER
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_count INTEGER;
  v_reset_at TIMESTAMPTZ;
BEGIN
  -- Clean up expired entries (garbage collection)
  DELETE FROM public.rate_limits WHERE reset_at < NOW();
  
  -- Check if key exists and get current count
  SELECT count, reset_at INTO v_count, v_reset_at
  FROM public.rate_limits
  WHERE key = p_key;
  
  -- If no entry exists, create one and allow the action
  IF v_count IS NULL THEN
    INSERT INTO public.rate_limits (key, count, reset_at)
    VALUES (p_key, 1, NOW() + (p_window_seconds || ' seconds')::INTERVAL);
    RETURN TRUE;
  END IF;
  
  -- If within window but under limit, increment and allow
  IF v_count < p_max_attempts THEN
    UPDATE public.rate_limits 
    SET count = count + 1 
    WHERE key = p_key;
    RETURN TRUE;
  END IF;
  
  -- Rate limit exceeded
  RETURN FALSE;
END;
$$;

-- Create function to get remaining time until rate limit resets
CREATE OR REPLACE FUNCTION public.get_rate_limit_reset_time(p_key TEXT)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_reset_at TIMESTAMPTZ;
BEGIN
  SELECT reset_at INTO v_reset_at
  FROM public.rate_limits
  WHERE key = p_key AND reset_at > NOW();
  
  IF v_reset_at IS NULL THEN
    RETURN 0;
  END IF;
  
  RETURN EXTRACT(EPOCH FROM (v_reset_at - NOW()))::INTEGER;
END;
$$;

-- Grant execute permissions to both anon and authenticated roles
GRANT EXECUTE ON FUNCTION public.check_rate_limit(TEXT, INTEGER, INTEGER) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_rate_limit_reset_time(TEXT) TO anon, authenticated;