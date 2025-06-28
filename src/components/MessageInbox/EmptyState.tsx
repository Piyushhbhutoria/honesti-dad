import { Button } from "@/components/ui/button";
import { MessageSquare, Sparkles } from "lucide-react";

interface EmptyStateProps {
  onCreateLink: () => void;
}

const EmptyState = ({ onCreateLink }: EmptyStateProps) => {
  return (
    <div className="text-center py-12 relative">
      {/* Subtle animated background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl animate-pulse"></div>
      </div>

      <div className="glass-card p-8 max-w-md mx-auto relative z-10 hover:shadow-glass-hover transition-all duration-300">
        <div className="glass-card bg-indigo-500/10 p-4 w-fit mx-auto mb-6">
          <MessageSquare className="h-12 w-12 text-indigo-500 mx-auto" />
        </div>

        <div className="flex items-center justify-center gap-2 mb-2">
          <h3 className="text-lg font-semibold text-foreground">No messages yet</h3>
          <Sparkles className="h-4 w-4 text-indigo-500 animate-pulse" />
        </div>

        <p className="text-foreground/70 mb-6 leading-relaxed">
          Share your link to start receiving anonymous feedback from friends, colleagues, and anyone you trust!
        </p>

        <Button
          onClick={onCreateLink}
          className="glass-button bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-3 font-semibold border-0 transition-all duration-300 transform hover:scale-105"
        >
          <MessageSquare className="h-4 w-4 mr-2" />
          Create Your Link
        </Button>
      </div>
    </div>
  );
};

export default EmptyState;
