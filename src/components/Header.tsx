
import { MessageSquare, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="bg-white/95 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div 
          className="flex items-center space-x-2 cursor-pointer"
          onClick={() => navigate('/')}
        >
          <div className="bg-gradient-to-br from-purple-500 to-blue-600 p-2 rounded-lg">
            <MessageSquare className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            HonestBox
          </h1>
        </div>
        <Button 
          onClick={() => navigate('/request')}
          variant="outline" 
          className="border-purple-200 text-purple-600 hover:bg-purple-50"
        >
          <Send className="h-4 w-4 mr-2" />
          Request Feedback
        </Button>
      </div>
    </header>
  );
};

export default Header;
