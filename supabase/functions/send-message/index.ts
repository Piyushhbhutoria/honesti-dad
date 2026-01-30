import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
}

// Rate limit configuration
const RATE_LIMIT = {
  maxAttempts: 5,
  windowSeconds: 60, // 1 minute
}

// Simple content validation
function validateContent(content: unknown): { isValid: boolean; error?: string; sanitized?: string } {
  if (typeof content !== 'string') {
    return { isValid: false, error: 'Content must be a string' }
  }
  
  const trimmed = content.trim()
  
  if (trimmed.length === 0) {
    return { isValid: false, error: 'Message cannot be empty' }
  }
  
  if (trimmed.length > 2000) {
    return { isValid: false, error: 'Message cannot exceed 2000 characters' }
  }
  
  // Basic sanitization - remove control characters except newlines
  const sanitized = trimmed.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
  
  return { isValid: true, sanitized }
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Get client IP for rate limiting
    const forwardedFor = req.headers.get('x-forwarded-for')
    const clientIp = forwardedFor ? forwardedFor.split(',')[0].trim() : 'unknown'
    
    // Parse request body
    const { feedback_request_id, content } = await req.json()

    // Validate required fields
    if (!feedback_request_id || typeof feedback_request_id !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Invalid feedback_request_id' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Validate content
    const validation = validateContent(content)
    if (!validation.isValid) {
      return new Response(
        JSON.stringify({ error: validation.error }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Create Supabase client with service role for rate limiting checks
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Check server-side rate limit using IP-based key
    const rateLimitKey = `send_message:${clientIp}`
    
    const { data: isAllowed, error: rateLimitError } = await supabase
      .rpc('check_rate_limit', {
        p_key: rateLimitKey,
        p_max_attempts: RATE_LIMIT.maxAttempts,
        p_window_seconds: RATE_LIMIT.windowSeconds,
      })

    if (rateLimitError) {
      console.error('Rate limit check error:', rateLimitError)
      return new Response(
        JSON.stringify({ error: 'Internal server error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (!isAllowed) {
      // Get reset time for better error message
      const { data: resetSeconds } = await supabase
        .rpc('get_rate_limit_reset_time', { p_key: rateLimitKey })
      
      console.log(`Rate limit exceeded for IP: ${clientIp}`)
      
      return new Response(
        JSON.stringify({ 
          error: 'Too many messages sent. Please wait before sending another.',
          reset_in_seconds: resetSeconds || RATE_LIMIT.windowSeconds
        }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Verify the feedback request exists and is active
    const { data: feedbackRequest, error: feedbackError } = await supabase
      .from('feedback_requests')
      .select('id, is_active')
      .eq('id', feedback_request_id)
      .single()

    if (feedbackError || !feedbackRequest) {
      return new Response(
        JSON.stringify({ error: 'Feedback request not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (!feedbackRequest.is_active) {
      return new Response(
        JSON.stringify({ error: 'This feedback request is no longer active' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Insert the anonymous message
    const { error: insertError } = await supabase
      .from('anonymous_messages')
      .insert({
        feedback_request_id,
        content: validation.sanitized,
      })

    if (insertError) {
      console.error('Message insert error:', insertError)
      return new Response(
        JSON.stringify({ error: 'Failed to send message' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log(`Message sent successfully for feedback request: ${feedback_request_id}`)

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Unexpected error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
