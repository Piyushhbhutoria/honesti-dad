
import { Button } from "@/components/ui/button";
import { MessageSquare, Send, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Hero = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Don't render Hero section if user is authenticated
  if (user) {
    return null;
  }

  return (
    <section className="py-20 bg-[#FAFAFA]">
      <div className="container mx-auto px-4 text-center max-w-4xl">
        <div className="mb-8">
          <div className="mint-gradient p-4 rounded-full w-fit mx-auto mb-8 pill-shadow">
            <MessageSquare className="h-12 w-12 text-white" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-[#333333] leading-tight">
            Get Honest Feedback,
            <br />
            <span className="text-4xl md:text-5xl text-[#A1E4B6]">Anonymously</span>
          </h1>
          <p className="text-xl text-[#666666] mb-8 max-w-2xl mx-auto leading-relaxed">
            Create your personal link and receive genuine, anonymous feedback from friends, colleagues, and anyone you trust. 
            No accounts needed to send feedback.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Button
            onClick={() => navigate('/auth')}
            className="mint-gradient hover:opacity-90 text-white px-8 py-4 rounded-full text-lg font-semibold pill-shadow spring-bounce hover:scale-105"
          >
            <Send className="h-5 w-5 mr-2" />
            Get Started
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <div className="bg-white p-6 rounded-3xl pill-shadow spring-bounce hover:scale-105">
            <div className="bg-[#A1E4B6]/20 p-3 rounded-full w-fit mx-auto mb-4">
              <MessageSquare className="h-6 w-6 text-[#A1E4B6]" />
            </div>
            <h3 className="text-xl font-semibold text-[#333333] mb-2">Completely Anonymous</h3>
            <p className="text-[#666666]">
              Senders remain completely anonymous. No login required to give feedback.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-3xl pill-shadow spring-bounce hover:scale-105">
            <div className="bg-[#F76C5E]/20 p-3 rounded-full w-fit mx-auto mb-4">
              <Send className="h-6 w-6 text-[#F76C5E]" />
            </div>
            <h3 className="text-xl font-semibold text-[#333333] mb-2">Easy to Share</h3>
            <p className="text-[#666666]">
              Get a personalized link that you can share anywhere to collect feedback.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-3xl pill-shadow spring-bounce hover:scale-105">
            <div className="bg-[#A1E4B6]/20 p-3 rounded-full w-fit mx-auto mb-4">
              <Heart className="h-6 w-6 text-[#A1E4B6]" />
            </div>
            <h3 className="text-xl font-semibold text-[#333333] mb-2">Honest & Safe</h3>
            <p className="text-[#666666]">
              Create a safe space for honest feedback without fear of judgment.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
