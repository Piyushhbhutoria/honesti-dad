import SharingModal from "@/components/SharingModal";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { copyImageToClipboard, generateFeedbackImage } from "@/lib/imageGenerator";
import { Heart, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface SocialShareButtonsProps {
  message: string;
  onShare?: () => void;
}

const SocialShareButtons = ({ message, onShare }: SocialShareButtonsProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const { theme } = useAuth();

  const handleGenerateAndCopyImage = async () => {
    if (isGenerating) return;

    setIsGenerating(true);

    try {
      // Determine if using dark theme
      const isDarkTheme = theme === 'dark';

      // Generate the feedback image
      const imageBlob = await generateFeedbackImage(message, isDarkTheme);

      if (!imageBlob) {
        throw new Error('Failed to generate image');
      }

      // Copy image to clipboard
      const copySuccess = await copyImageToClipboard(imageBlob);

      if (!copySuccess) {
        throw new Error('Failed to copy image to clipboard');
      }

      // Show success and open modal
      toast.success("Feedback image copied to clipboard!");
      setShowModal(true);
      onShare?.();

    } catch (error) {
      console.error('Error generating/copying image:', error);

      // Fallback: show helpful message about manual sharing
      toast.error("Unable to copy image automatically. Try using your device's screenshot feature instead!");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
      <Button
        variant="glass"
        size="sm"
        onClick={handleGenerateAndCopyImage}
        disabled={isGenerating}
        className="transition-all duration-300 transform hover:scale-105 hover:bg-primary/10 hover:text-primary"
      >
        {isGenerating ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Heart className="h-4 w-4" />
        )}
        {isGenerating ? 'Creating...' : 'Thanks'}
      </Button>

      <SharingModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </>
  );
};

export default SocialShareButtons; 
