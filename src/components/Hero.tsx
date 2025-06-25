
import { Button } from "@/components/ui/button";
import { MessageSquare, Send, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Hero = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <section className="py-20 bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 text-center max-w-4xl">
        <div className="mb-8">
          <div className="bg-gradient-to-br from-purple-500 to-blue-600 p-4 rounded-3xl w-fit mx-auto mb-8 shadow-xl">
            <MessageSquare className="h-12 w-12 text-white" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent leading-tight">
            Get Honest Feedback,
            <br />
            <span className="text-4xl md:text-5xl">Anonymously</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Create your personal link and receive genuine, anonymous feedback from friends, colleagues, and anyone you trust. 
            No accounts needed to send feedback.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          {user ? (
            <Button
              onClick={() => navigate('/request')}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <Send className="h-5 w-5 mr-2" />
              Create Your Feedback Link
            </Button>
          ) : (
            <Button
              onClick={() => navigate('/auth')}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <Send className="h-5 w-5 mr-2" />
              Get Started - It's Free
            </Button>
          )}
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="bg-purple-100 p-3 rounded-xl w-fit mx-auto mb-4">
              <MessageSquare className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Completely Anonymous</h3>
            <p className="text-gray-600">
              Senders remain completely anonymous. No login required to give feedback.
            </p>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="bg-blue-100 p-3 rounded-xl w-fit mx-auto mb-4">
              <Send className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Easy to Share</h3>
            <p className="text-gray-600">
              Get a personalized link that you can share anywhere to collect feedback.
            </p>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="bg-pink-100 p-3 rounded-xl w-fit mx-auto mb-4">
              <Heart className="h-6 w-6 text-pink-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Honest & Safe</h3>
            <p className="text-gray-600">
              Create a safe space for honest feedback without fear of judgment.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
