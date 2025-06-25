
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Clock, Heart } from "lucide-react";
import { toast } from "sonner";

interface Message {
  id: string;
  content: string;
  is_read: boolean;
  created_at: string;
}

interface MessageCardProps {
  message: Message;
  index: number;
  thankedMessages: Set<string>;
  onThankSender: (messageId: string) => void;
}

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

const MessageCard = ({ message, index, thankedMessages, onThankSender }: MessageCardProps) => {
  const handleThankSender = () => {
    if (thankedMessages.has(message.id)) {
      toast.info("You've already thanked the sender for this message!");
      return;
    }
    onThankSender(message.id);
  };

  return (
    <Card 
      className={`shadow-lg border-0 bg-white/80 backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:scale-[1.02] animate-fade-in`}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MessageSquare className="h-5 w-5 text-purple-500" />
            <CardTitle className="text-lg text-gray-700">Anonymous Message</CardTitle>
            {!message.is_read && (
              <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-200">
                New
              </Badge>
            )}
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <Clock className="h-4 w-4 mr-1" />
            {formatTimestamp(message.created_at)}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-700 leading-relaxed mb-4">
          {message.content}
        </p>
        <div className="flex items-center justify-between">
          <Button
            onClick={handleThankSender}
            variant="ghost"
            size="sm"
            className={`transition-all duration-300 ${
              thankedMessages.has(message.id)
                ? "text-pink-600 bg-pink-50 hover:bg-pink-100"
                : "text-purple-600 hover:text-purple-700 hover:bg-purple-50"
            }`}
          >
            <Heart className={`h-4 w-4 mr-1 ${thankedMessages.has(message.id) ? "fill-current" : ""}`} />
            {thankedMessages.has(message.id) ? "Thanked!" : "Thank sender"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MessageCard;
