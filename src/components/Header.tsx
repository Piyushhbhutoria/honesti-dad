import { MessageSquare, Send, LogOut, User, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const Header = () => {
  const navigate = useNavigate();
  const { user, signOut, loading } = useAuth();

  // Fetch user profile to get the name
  const { data: profile } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('name')
        .eq('id', user.id)
        .single();
      
      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }
      
      return data;
    },
    enabled: !!user?.id,
  });

  // Check if user has an active feedback request
  const { data: existingRequest } = useQuery({
    queryKey: ['existing-feedback-request', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from('feedback_requests')
        .select('id, unique_slug')
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

  const handleSignOut = async () => {
    try {
      console.log('Sign out button clicked');
      await signOut();
      
      // Navigate to home page after successful sign out
      navigate('/');
      toast.success("Signed out successfully");
    } catch (error) {
      console.error('Sign out error in header:', error);
      // Still navigate and show success since local state is cleared
      navigate('/');
      toast.success("Signed out successfully");
    }
  };

  const handleRequestFeedback = () => {
    if (existingRequest) {
      // User already has a feedback request, navigate to inbox
      navigate('/');
      toast.info("You already have an active feedback link! Check your inbox below.");
    } else {
      // User doesn't have a feedback request, navigate to create one
      navigate('/request');
    }
  };

  if (loading) {
    return (
      <header className="bg-white/95 backdrop-blur-sm border-b border-[#E0E0E0] sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="mint-gradient p-2 rounded-full pill-shadow">
              <MessageSquare className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-[#333333]">
              HonestBox
            </h1>
          </div>
          <div className="animate-pulse bg-[#E0E0E0] h-10 w-32 rounded-full"></div>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-white/95 backdrop-blur-sm border-b border-[#E0E0E0] sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div 
          className="flex items-center space-x-2 cursor-pointer spring-bounce hover:scale-105"
          onClick={() => navigate('/')}
        >
          <div className="mint-gradient p-2 rounded-full pill-shadow">
            <MessageSquare className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-[#333333]">
            HonestBox
          </h1>
        </div>
        
        <div className="flex items-center space-x-4">
          {user ? (
            // Authenticated user view
            <>
              <Button 
                onClick={handleRequestFeedback}
                variant="outline" 
                className="border-[#E0E0E0] text-[#333333] hover:bg-[#A1E4B6]/10 rounded-full spring-bounce hover:scale-105"
              >
                <Send className="h-4 w-4 mr-2" />
                {existingRequest ? "View Feedback" : "Request Feedback"}
              </Button>
              
              <div className="flex items-center space-x-2 text-sm text-[#666666]">
                <User className="h-4 w-4" />
                <span>{profile?.name || user.email}</span>
              </div>
              
              <Button
                onClick={handleSignOut}
                variant="ghost"
                size="sm"
                className="text-[#666666] hover:text-[#333333] hover:bg-[#F76C5E]/10 rounded-full spring-bounce hover:scale-105"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </>
          ) : (
            // Non-authenticated user view
            <Button
              onClick={() => navigate('/auth')}
              className="mint-gradient hover:opacity-90 text-white rounded-full spring-bounce hover:scale-105 pill-shadow"
            >
              <LogIn className="h-4 w-4 mr-2" />
              Sign In
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
