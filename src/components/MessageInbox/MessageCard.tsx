
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Heart, MessageSquare } from "lucide-react";
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
      className={`shadow-glass border-0 transition-all duration-300 hover:shadow-glass-hover hover:scale-[1.02] animate-fade-in`}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <MessageSquare className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg text-foreground">Anonymous Message</CardTitle>
            {!message.is_read && (
              <Badge className="glass-button bg-primary/20 text-primary border-primary/20">
                New
              </Badge>
            )}
          </div>
          <div className="flex items-center text-sm text-foreground/60">
            <Clock className="h-4 w-4 mr-1" />
            {formatTimestamp(message.created_at)}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-foreground/80 leading-relaxed mb-6 text-base">
          {message.content}
        </p>
        <div className="flex items-center justify-between pt-2">
          <Button
            onClick={handleThankSender}
            variant="glass"
            size="sm"
            className={`transition-all duration-300 ${thankedMessages.has(message.id)
              ? "text-pink-600 dark:text-pink-400 bg-pink-500/20 border-pink-500/20"
              : "text-primary hover:bg-primary/20"
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
