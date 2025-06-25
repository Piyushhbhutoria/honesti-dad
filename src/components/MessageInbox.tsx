
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Share2, Copy, Clock, Heart } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const MessageInbox = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const [userLink, setUserLink] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // For demo purposes, try to find any user data in localStorage
    // In a real app, this would be based on authenticated user
    const allKeys = Object.keys(localStorage);
    const userKeys = allKeys.filter(key => key.startsWith('user_'));
    
    if (userKeys.length > 0) {
      const latestUserKey = userKeys[userKeys.length - 1];
      const userData = localStorage.getItem(latestUserKey);
      if (userData) {
        const user = JSON.parse(userData);
        setMessages(user.messages || []);
        const userId = latestUserKey.replace('user_', '');
        setUserLink(`${window.location.origin}/feedback/${userId}`);
      }
    }
  }, []);

  const handleCopyLink = () => {
    if (userLink) {
      navigator.clipboard.writeText(userLink);
      toast.success("Link copied to clipboard!");
    } else {
      navigate('/request');
    }
  };

  const handleShare = () => {
    if (userLink) {
      if (navigator.share) {
        navigator.share({
          title: "Send me an anonymous message",
          url: userLink
        });
      } else {
        handleCopyLink();
      }
    } else {
      navigate('/request');
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffHours < 1) return "Just now";
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
  };

  return (
    <section className="py-20 bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <div className="bg-gradient-to-br from-purple-500 to-blue-600 p-3 rounded-2xl w-fit mx-auto mb-6">
            <MessageSquare className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Your Message Inbox
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            {messages.length > 0 
              ? "Here are the anonymous messages you've received" 
              : "No messages yet - share your link to start receiving feedback!"}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={handleShare}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Share2 className="h-4 w-4 mr-2" />
              {userLink ? "Share Your Link" : "Create Feedback Link"}
            </Button>
            <Button
              onClick={handleCopyLink}
              variant="outline"
              className="border-purple-200 text-purple-600 hover:bg-purple-50 px-6 py-3 rounded-xl font-semibold transition-all duration-300"
            >
              <Copy className="h-4 w-4 mr-2" />
              {userLink ? "Copy Link" : "Get Started"}
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          {messages.map((message, index) => (
            <Card 
              key={message.id} 
              className={`shadow-lg border-0 bg-white/80 backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:scale-[1.02] animate-fade-in`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <MessageSquare className="h-5 w-5 text-purple-500" />
                    <CardTitle className="text-lg text-gray-700">Anonymous Message</CardTitle>
                    {!message.isRead && (
                      <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-200">
                        New
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="h-4 w-4 mr-1" />
                    {formatTimestamp(message.timestamp)}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed mb-4">
                  {message.content}
                </p>
                <div className="flex items-center justify-between">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                  >
                    <Heart className="h-4 w-4 mr-1" />
                    Thank sender
                  </Button>
                  <div className="text-xs text-gray-400">
                    Message #{message.id}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {messages.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-gray-100 p-6 rounded-2xl max-w-md mx-auto">
              <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No messages yet</h3>
              <p className="text-gray-500 mb-4">Share your link to start receiving anonymous feedback!</p>
              <Button
                onClick={() => navigate('/request')}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
              >
                Create Your Link
              </Button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default MessageInbox;
