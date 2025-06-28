import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Heart, MessageSquare, Send } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Don't render Hero section if user is authenticated
  if (user) {
    return null;
  }

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-1/4 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-128 h-128 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="container mx-auto px-4 text-center max-w-4xl relative z-10">
        <div className="mb-8">
          <div className="glass-card bg-gradient-to-br from-indigo-500 to-indigo-600 p-4 w-fit mx-auto mb-8 shadow-glass">
            <MessageSquare className="h-12 w-12 text-white" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-indigo-600 to-indigo-500 bg-clip-text text-transparent leading-tight">
            Get Honest Feedback,
            <br />
            <span className="text-4xl md:text-5xl">Anonymously</span>
          </h1>
          <p className="text-xl text-foreground/70 mb-8 max-w-2xl mx-auto leading-relaxed">
            Create your personal link and receive genuine, anonymous feedback from friends, colleagues, and anyone you trust.
            No accounts needed to send feedback.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Button
            onClick={() => navigate('/auth')}
            className="glass-button bg-indigo-500 hover:bg-indigo-600 text-white px-8 py-4 text-lg font-semibold border-0 transition-all duration-300 transform hover:scale-105"
          >
            <Send className="h-5 w-5 mr-2" />
            Get Started
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <div className="glass-card p-6 hover:shadow-glass-hover transition-all duration-300 transform hover:scale-105">
            <div className="glass-card bg-indigo-500/10 p-3 w-fit mx-auto mb-4">
              <MessageSquare className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">Completely Anonymous</h3>
            <p className="text-foreground/70">
              Senders remain completely anonymous. No login required to give feedback.
            </p>
          </div>

          <div className="glass-card p-6 hover:shadow-glass-hover transition-all duration-300 transform hover:scale-105">
            <div className="glass-card bg-blue-500/10 p-3 w-fit mx-auto mb-4">
              <Send className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">Easy to Share</h3>
            <p className="text-foreground/70">
              Get a personalized link that you can share anywhere to collect feedback.
            </p>
          </div>

          <div className="glass-card p-6 hover:shadow-glass-hover transition-all duration-300 transform hover:scale-105">
            <div className="glass-card bg-pink-500/10 p-3 w-fit mx-auto mb-4">
              <Heart className="h-6 w-6 text-pink-600 dark:text-pink-400" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">Honest & Safe</h3>
            <p className="text-foreground/70">
              Create a safe space for honest feedback without fear of judgment.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
