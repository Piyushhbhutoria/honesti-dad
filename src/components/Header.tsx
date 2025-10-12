
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
      <header className="bg-white/95 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="container mx-auto px-2 sm:px-4 py-3 sm:py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="bg-gradient-to-br from-purple-500 to-blue-600 p-2 rounded-lg">
              <MessageSquare className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              HonestBox
            </h1>
          </div>
          <div className="animate-pulse bg-gray-200 h-8 w-24 sm:h-10 sm:w-32 rounded"></div>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-white/95 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="container mx-auto px-2 sm:px-4 py-3 sm:py-4 flex items-center justify-between">
        <div 
          className="flex items-center space-x-2 cursor-pointer"
          onClick={() => navigate('/')}
        >
          <div className="bg-gradient-to-br from-purple-500 to-blue-600 p-2 rounded-lg">
            <MessageSquare className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            HonestBox
          </h1>
        </div>
        
        <div className="flex items-center space-x-1 sm:space-x-4">
          {user ? (
            // Authenticated user view
            <>
              <Button 
                onClick={handleRequestFeedback}
                variant="outline" 
                size="sm"
                className="border-purple-200 text-purple-600 hover:bg-purple-50 text-xs sm:text-sm px-2 sm:px-4"
              >
                <Send className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">{existingRequest ? "View Feedback" : "Request Feedback"}</span>
                <span className="sm:hidden">{existingRequest ? "View" : "Request"}</span>
              </Button>
              
              <div className="hidden md:flex items-center space-x-2 text-sm text-gray-600">
                <User className="h-4 w-4" />
                <span className="max-w-32 truncate">{profile?.name || user.email}</span>
              </div>
              
              <Button
                onClick={handleSignOut}
                variant="ghost"
                size="sm"
                className="text-gray-600 hover:text-gray-800 px-2 sm:px-3"
              >
                <LogOut className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Sign Out</span>
              </Button>
            </>
          ) : (
            // Non-authenticated user view
            <Button
              onClick={() => navigate('/auth')}
              size="sm"
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white text-xs sm:text-sm px-3 sm:px-4"
            >
              <LogIn className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              Sign In
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
