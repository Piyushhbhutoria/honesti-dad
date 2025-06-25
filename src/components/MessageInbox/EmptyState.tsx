
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";

interface EmptyStateProps {
  onCreateLink: () => void;
}

const EmptyState = ({ onCreateLink }: EmptyStateProps) => {
  return (
    <div className="text-center py-12">
      <div className="bg-white p-6 rounded-3xl max-w-md mx-auto pill-shadow">
        <div className="bg-[#A1E4B6]/20 p-4 rounded-full w-fit mx-auto mb-4">
          <MessageSquare className="h-12 w-12 text-[#A1E4B6]" />
        </div>
        <h3 className="text-lg font-semibold text-[#333333] mb-2">No messages yet</h3>
        <p className="text-[#666666] mb-4">Share your link to start receiving anonymous feedback!</p>
        <Button
          onClick={onCreateLink}
          className="mint-gradient hover:opacity-90 text-white rounded-full spring-bounce hover:scale-105"
        >
          Create Your Link
        </Button>
      </div>
    </div>
  );
};

export default EmptyState;
