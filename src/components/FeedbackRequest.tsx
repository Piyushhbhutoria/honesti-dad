import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import HonestBoxIcon from "@/components/ui/HonestBoxIcon";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { trackError, trackFeedbackRequestCreated, trackFeedbackRequestShared, trackPageView } from "@/lib/analytics";
import { checkRateLimit, formatResetTime, RATE_LIMITS } from "@/lib/rateLimiter";
import { getFeedbackURL } from "@/lib/urlUtils";
import { sanitizeText, validateName } from "@/lib/validation";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle, Copy, Link, Moon, Share2, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const FeedbackRequest = () => {
  const [userName, setUserName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { user, theme, toggleTheme } = useAuth();

  // Track page view when component mounts
  useEffect(() => {
    trackPageView('/request', 'Request Feedback');
  }, []);

  // Check for existing feedback request
  const { data: existingRequest, isLoading: checkingExisting } = useQuery({
    queryKey: ['existing-feedback-request', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;

      const { data, error } = await supabase
        .from('feedback_requests')
        .select('id, unique_slug, name')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) {
        console.error('Error fetching existing request:', error);
        return null;
      }

      return data && data.length > 0 ? data[0] : null;
    },
    enabled: !!user?.id,
  });

  useEffect(() => {
    // Set default name from user metadata or email
    if (user) {
      const defaultName = user.user_metadata?.name || user.email?.split('@')[0] || '';
      setUserName(defaultName);
    }
  }, [user]);

  const generateFeedbackLink = async () => {
    // Check rate limiting first
    const { isLimited, resetTime } = checkRateLimit(RATE_LIMITS.CREATE_FEEDBACK_REQUEST, user?.id);
    if (isLimited) {
      const timeRemaining = formatResetTime(resetTime);
      toast.error(`Too many feedback requests created. Please wait ${timeRemaining} before creating another.`);
      return;
    }

    // Validate the name
    const validation = validateName(userName);
    if (!validation.isValid) {
      toast.error(validation.errors[0] || "Please enter a valid name");
      return;
    }

    if (!user) {
      toast.error("You must be logged in to create a feedback request");
      return;
    }

    setIsLoading(true);

    try {
      // Sanitize the name
      const sanitizedName = sanitizeText(validation.data);

      // Generate unique slug
      const slug = sanitizedName.toLowerCase().replace(/\s+/g, '') + Date.now();

      // Create feedback request using authenticated user ID
      const { data: requestData, error: requestError } = await supabase
        .from('feedback_requests')
        .insert({
          user_id: user.id,
          unique_slug: slug,
          name: sanitizedName
        })
        .select()
        .single();

      if (requestError) throw requestError;

      toast.success("Your feedback link has been generated! 🎉");
      // Refresh the page to show the existing request
      window.location.reload();

      // Track feedback request created event
      trackFeedbackRequestCreated();
    } catch (error) {
      console.error('Error creating feedback request:', error);
      toast.error("Failed to generate link. Please try again.");

      // Track error event
      trackError('Failed to create feedback request', 'FeedbackRequest.generateFeedbackLink');
    } finally {
      setIsLoading(false);
    }
  };

  const getFeedbackUrl = () => {
    if (!existingRequest?.unique_slug) return "";
    try {
      return getFeedbackURL(existingRequest.unique_slug);
    } catch (error) {
      console.error('Error generating feedback URL:', error);
      return "";
    }
  };

  const handleCopyLink = () => {
    // Check rate limiting for copy/share actions
    const { isLimited, resetTime } = checkRateLimit(RATE_LIMITS.COPY_SHARE);
    if (isLimited) {
      const timeRemaining = formatResetTime(resetTime);
      toast.error(`Too many copy actions. Please wait ${timeRemaining}.`);
      return;
    }

    const url = getFeedbackUrl();
    navigator.clipboard.writeText(url);

    // Track copy action
    trackFeedbackRequestShared('copy_link');

    toast.success("Link copied to clipboard!");

    // Track feedback request shared event (this will be handled by individual tracking calls)
  };

  const handleShare = () => {
    // Check rate limiting for copy/share actions
    const { isLimited, resetTime } = checkRateLimit(RATE_LIMITS.COPY_SHARE);
    if (isLimited) {
      const timeRemaining = formatResetTime(resetTime);
      toast.error(`Too many share actions. Please wait ${timeRemaining}.`);
      return;
    }

    const url = getFeedbackUrl();
    if (navigator.share) {
      // Track native share action
      trackFeedbackRequestShared('social');

      navigator.share({
        title: `Send me anonymous feedback`,
        text: `Share your honest thoughts with me anonymously`,
        url: url
      });
    } else {
      handleCopyLink();
    }
  };

  if (checkingExisting) {
    return (
      <section className="py-20 bg-gradient-to-br from-teal-50 via-teal-50/50 to-teal-100 dark:from-slate-900 dark:via-slate-800 dark:to-emerald-950 min-h-screen">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-foreground/70">Loading...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-br from-teal-50 via-teal-50/50 to-teal-100 dark:from-slate-900 dark:via-slate-800 dark:to-emerald-950 min-h-screen relative overflow-hidden">
      {/* Theme Toggle Button */}
      <div className="fixed top-6 right-6 z-50">
        <Button
          onClick={toggleTheme}
          variant="ghost"
          size="sm"
          className="glass-card bg-glass-light border-glass-border p-3 shadow-glass hover:shadow-glass-hover transition-all duration-300"
        >
          {theme === 'light' ? (
            <Moon className="h-5 w-5" />
          ) : (
            <Sun className="h-5 w-5" />
          )}
        </Button>
      </div>

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-128 h-128 bg-primary/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="container mx-auto px-4 max-w-2xl relative z-10">
        <div className="text-center mb-12">
          <div className="glass-card bg-gradient-to-br from-primary to-primary/90 p-3 w-fit mx-auto mb-6 shadow-glass">
            <HonestBoxIcon className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/90 bg-clip-text text-transparent">
            {existingRequest ? "Your Feedback Link" : "Request Anonymous Feedback"}
          </h1>
          <p className="text-lg text-foreground/70">
            {existingRequest
              ? "Your personalized link is ready to share with friends and colleagues"
              : "Create your personalized link to receive honest, anonymous feedback from friends and colleagues"
            }
          </p>
        </div>

        {existingRequest ? (
          // Show existing link
          <div className="space-y-6">
            <Card className="shadow-glass border-0 hover:shadow-glass-hover transition-all duration-300">
              <CardHeader className="pb-4">
                <CardTitle className="text-center text-foreground flex items-center justify-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  Your Feedback Link is Active
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="glass-card bg-primary/5 p-4 border-primary/10">
                    <p className="text-sm text-foreground/60 mb-2">Share this link:</p>
                    <p className="text-primary font-mono text-sm break-all">
                      {getFeedbackUrl()}
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button
                      onClick={handleShare}
                      variant="gradient-primary"
                      className="flex-1 py-3 font-semibold border-0 transition-all duration-300 transform hover:scale-105"
                    >
                      <Share2 className="h-4 w-4 mr-2" />
                      Share Link
                    </Button>
                    <Button
                      onClick={handleCopyLink}
                      variant="glass-primary"
                      className="flex-1 py-3 font-semibold transition-all duration-300 transform hover:scale-105"
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Link
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-glass border-0 hover:shadow-glass-hover transition-all duration-300">
              <CardContent className="pt-6">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-foreground mb-2">How it works</h3>
                  <p className="text-foreground/70 mb-4">
                    Share your link with anyone you'd like feedback from.
                    All responses will be completely anonymous and appear in your inbox.
                  </p>
                  <Button
                    onClick={() => navigate('/')}
                    variant="glass"
                    className="text-primary hover:bg-primary/20"
                  >
                    View My Inbox
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          // Show form to create new link
          <Card className="shadow-glass border-0 hover:shadow-glass-hover transition-all duration-300">
            <CardHeader className="pb-4">
              <CardTitle className="text-center text-foreground flex items-center justify-center gap-2">
                <Link className="h-5 w-5" />
                Generate Your Feedback Link
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <label htmlFor="userName" className="block text-sm font-medium text-foreground mb-2">
                    Your Name
                  </label>
                  <Input
                    id="userName"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="Enter your name..."
                    className="text-lg py-3 glass-input"
                    disabled={isLoading}
                  />
                </div>

                <Button
                  onClick={generateFeedbackLink}
                  disabled={!userName.trim() || isLoading}
                  variant="gradient-primary"
                  className="w-full py-3 text-lg font-semibold border-0 transition-all duration-300 transform hover:scale-105"
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Generating...
                    </div>
                  ) : (
                    <>
                      <Link className="h-5 w-5 mr-2" />
                      Generate Feedback Link
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </section>
  );
};

export default FeedbackRequest;
