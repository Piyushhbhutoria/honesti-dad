import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle, Copy, Link, MessageSquare, Share2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const FeedbackRequest = () => {
  const [userName, setUserName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

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
    if (!userName.trim()) {
      toast.error("Please enter your name first");
      return;
    }

    if (!user) {
      toast.error("You must be logged in to create a feedback request");
      return;
    }

    setIsLoading(true);

    try {
      // Generate unique slug
      const slug = userName.toLowerCase().replace(/\s+/g, '') + Date.now();

      // Create feedback request using authenticated user ID
      const { data: requestData, error: requestError } = await supabase
        .from('feedback_requests')
        .insert({
          user_id: user.id,
          unique_slug: slug,
          name: userName.trim()
        })
        .select()
        .single();

      if (requestError) throw requestError;

      toast.success("Your feedback link has been generated! 🎉");
      // Refresh the page to show the existing request
      window.location.reload();
    } catch (error) {
      console.error('Error creating feedback request:', error);
      toast.error("Failed to generate link. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const getFeedbackUrl = () => {
    if (!existingRequest?.unique_slug) return "";
    return `${window.location.origin}/feedback/${existingRequest.unique_slug}`;
  };

  const handleCopyLink = () => {
    const url = getFeedbackUrl();
    navigator.clipboard.writeText(url);
    toast.success("Link copied to clipboard!");
  };

  const handleShare = () => {
    const url = getFeedbackUrl();
    if (navigator.share) {
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
      <section className="py-20 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-950 min-h-screen">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-foreground/70">Loading...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-950 min-h-screen relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-1/4 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-128 h-128 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="container mx-auto px-4 max-w-2xl relative z-10">
        <div className="text-center mb-12">
          <div className="glass-card bg-gradient-to-br from-indigo-500 to-indigo-600 p-3 w-fit mx-auto mb-6 shadow-glass">
            <MessageSquare className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-indigo-500 bg-clip-text text-transparent">
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
                  <div className="glass-card bg-indigo-500/5 p-4 border-indigo-500/10">
                    <p className="text-sm text-foreground/60 mb-2">Share this link:</p>
                    <p className="text-indigo-600 dark:text-indigo-400 font-mono text-sm break-all">
                      {getFeedbackUrl()}
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button
                      onClick={handleShare}
                      className="flex-1 glass-button bg-indigo-500 hover:bg-indigo-600 text-white py-3 font-semibold border-0 transition-all duration-300 transform hover:scale-105"
                    >
                      <Share2 className="h-4 w-4 mr-2" />
                      Share Link
                    </Button>
                    <Button
                      onClick={handleCopyLink}
                      variant="glass-indigo"
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
                    className="text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500/20"
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
                    className="text-lg py-3 glass-card bg-glass-light border-glass-border"
                    disabled={isLoading}
                  />
                </div>

                <Button
                  onClick={generateFeedbackLink}
                  disabled={!userName.trim() || isLoading}
                  className="w-full glass-button bg-indigo-500 hover:bg-indigo-600 text-white py-3 text-lg font-semibold border-0 transition-all duration-300 transform hover:scale-105"
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
