
import { Button } from "@/components/ui/button";
import { MessageSquare, Shield, Heart } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
      <div className="absolute top-40 right-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
      <div className="absolute -bottom-32 left-20 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-500"></div>
      
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <div className="mb-8 flex justify-center">
          <div className="bg-gradient-to-br from-purple-500 to-blue-600 p-4 rounded-2xl shadow-lg animate-scale-in">
            <MessageSquare className="h-16 w-16 text-white" />
          </div>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent animate-fade-in">
          Get Honest Feedback
        </h1>
        
        <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-2xl mx-auto animate-fade-in delay-300">
          Receive anonymous messages from friends, colleagues, and anyone who wants to share honest thoughts with you.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-fade-in delay-500">
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            Create Your Box
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className="border-2 border-purple-200 text-purple-600 hover:bg-purple-50 px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 hover:scale-105"
          >
            Send Anonymous Message
          </Button>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-3xl mx-auto animate-fade-in delay-700">
          <div className="text-center group">
            <div className="bg-white p-6 rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
              <Shield className="h-12 w-12 text-purple-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">100% Anonymous</h3>
              <p className="text-gray-600">Your identity is completely protected. Send and receive messages without revealing who you are.</p>
            </div>
          </div>
          
          <div className="text-center group">
            <div className="bg-white p-6 rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
              <Heart className="h-12 w-12 text-blue-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Honest Feedback</h3>
              <p className="text-gray-600">Get genuine opinions and constructive feedback that people might hesitate to share otherwise.</p>
            </div>
          </div>
          
          <div className="text-center group">
            <div className="bg-white p-6 rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
              <MessageSquare className="h-12 w-12 text-indigo-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Easy Sharing</h3>
              <p className="text-gray-600">Share your unique link with friends and colleagues to start receiving anonymous messages.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
