
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";

interface EmptyStateProps {
  onCreateLink: () => void;
}

const EmptyState = ({ onCreateLink }: EmptyStateProps) => {
  return (
    <div className="text-center py-12">
      <div className="bg-gray-100 p-6 rounded-2xl max-w-md mx-auto">
        <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-600 mb-2">No messages yet</h3>
        <p className="text-gray-500 mb-4">Share your link to start receiving anonymous feedback!</p>
        <Button
          onClick={onCreateLink}
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
        >
          Create Your Link
        </Button>
      </div>
    </div>
  );
};

export default EmptyState;
