
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Share2, Copy, Clock, Heart } from "lucide-react";
import { toast } from "sonner";

const MessageInbox = () => {
  const [messages] = useState([
    {
      id: 1,
      content: "You're doing an amazing job leading the team. Your positive attitude really makes a difference!",
      timestamp: "2 hours ago",
      isRead: false
    },
    {
      id: 2,
      content: "I think you could improve on giving more specific feedback during code reviews. Sometimes it's hard to understand what exactly needs to be changed.",
      timestamp: "1 day ago",
      isRead: true
    },
    {
      id: 3,
      content: "Your presentation skills have improved so much over the past year. Keep it up!",
      timestamp: "3 days ago",
      isRead: true
    },
    {
      id: 4,
      content: "You have great ideas, but sometimes you interrupt others during meetings. Just something to be aware of.",
      timestamp: "1 week ago",
      isRead: true
    }
  ]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText("https://honestbox.app/u/johndoe");
    toast.success("Link copied to clipboard!");
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "Send me an anonymous message",
        url: "https://honestbox.app/u/johndoe"
      });
    } else {
      handleCopyLink();
    }
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
            Here are the anonymous messages you've received
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={handleShare}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share Your Link
            </Button>
            <Button
              onClick={handleCopyLink}
              variant="outline"
              className="border-purple-200 text-purple-600 hover:bg-purple-50 px-6 py-3 rounded-xl font-semibold transition-all duration-300"
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy Link
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
                    {message.timestamp}
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
              <p className="text-gray-500">Share your link to start receiving anonymous feedback!</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default MessageInbox;
