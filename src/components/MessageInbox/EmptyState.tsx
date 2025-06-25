
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";

interface EmptyStateProps {
  onCreateLink: () => void;
}

const EmptyState = ({ onCreateLink }: EmptyStateProps) => {
  return (
    <div className="text-center py-12">
      <div className="ios-glass-card p-6 rounded-2xl max-w-md mx-auto">
        <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-[#111111] mb-2">No messages yet</h3>
        <p className="text-gray-500 mb-4">Share your link to start receiving anonymous feedback!</p>
        <Button
          onClick={onCreateLink}
          className="bg-[#5E5CE6] hover:bg-[#4C4AE5] text-white border-0"
        >
          Create Your Link
        </Button>
      </div>
    </div>
  );
};

export default EmptyState;
