import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Share2, Copy, MessageSquare, Link } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const FeedbackRequest = () => {
  const [userName, setUserName] = useState("");
  const [uniqueSlug, setUniqueSlug] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

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

      setUniqueSlug(slug);
      toast.success("Your feedback link has been generated! 🎉");
    } catch (error) {
      console.error('Error creating feedback request:', error);
      toast.error("Failed to generate link. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const getFeedbackUrl = () => {
    if (!uniqueSlug) return "";
    return `${window.location.origin}/feedback/${uniqueSlug}`;
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

  return (
    <section className="py-20 bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 min-h-screen">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="text-center mb-12">
          <div className="bg-gradient-to-br from-purple-500 to-blue-600 p-3 rounded-2xl w-fit mx-auto mb-6">
            <MessageSquare className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Request Anonymous Feedback
          </h1>
          <p className="text-lg text-gray-600">
            Create your personalized link to receive honest, anonymous feedback from friends and colleagues
          </p>
        </div>

        {!uniqueSlug ? (
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-center text-gray-700 flex items-center justify-center gap-2">
                <Link className="h-5 w-5" />
                Generate Your Feedback Link
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <label htmlFor="userName" className="block text-sm font-medium text-gray-700 mb-2">
                    Your Name
                  </label>
                  <Input
                    id="userName"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="Enter your name..."
                    className="text-lg py-3"
                    disabled={isLoading}
                  />
                </div>
                
                <Button
                  onClick={generateFeedbackLink}
                  disabled={!userName.trim() || isLoading}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-3 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
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
        ) : (
          <div className="space-y-6">
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-center text-gray-700">
                  Your Feedback Link is Ready! 🎉
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg border">
                    <p className="text-sm text-gray-600 mb-2">Share this link:</p>
                    <p className="text-blue-600 font-mono text-sm break-all">
                      {getFeedbackUrl()}
                    </p>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button
                      onClick={handleShare}
                      className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <Share2 className="h-4 w-4 mr-2" />
                      Share Link
                    </Button>
                    <Button
                      onClick={handleCopyLink}
                      variant="outline"
                      className="flex-1 border-purple-200 text-purple-600 hover:bg-purple-50 py-3 rounded-xl font-semibold transition-all duration-300"
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Link
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="pt-6">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">What's Next?</h3>
                  <p className="text-gray-600 mb-4">
                    Share your link with friends, colleagues, or anyone you'd like feedback from. 
                    All responses will be completely anonymous.
                  </p>
                  <Button
                    onClick={() => navigate('/')}
                    variant="ghost"
                    className="text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                  >
                    View My Inbox
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeedbackRequest;
