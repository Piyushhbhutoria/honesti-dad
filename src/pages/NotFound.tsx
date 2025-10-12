import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ThemeToggle from "@/components/ui/theme-toggle";
import { AlertTriangle, Home } from "lucide-react";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-teal-50/50 to-teal-100 dark:from-slate-900 dark:via-slate-800 dark:to-emerald-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Theme Toggle Button */}
      <div className="absolute top-4 right-4 z-20">
        <ThemeToggle />
      </div>

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-128 h-128 bg-primary/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <Card className="w-full max-w-md shadow-glass border-0 relative z-10 hover:shadow-glass-hover transition-all duration-300">
        <CardHeader className="text-center pb-4">
          <div className="glass-card bg-gradient-to-br from-red-500 to-red-600 p-3 w-fit mx-auto mb-4 shadow-glass">
            <AlertTriangle className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-6xl font-bold bg-gradient-to-r from-primary to-primary/90 bg-clip-text text-transparent mb-2">
            404
          </CardTitle>
          <CardTitle className="text-2xl bg-gradient-to-r from-primary to-primary/90 bg-clip-text text-transparent">
            Page Not Found
          </CardTitle>
          <p className="text-foreground/70">
            Oops! The page you're looking for doesn't exist or has been moved.
          </p>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-sm text-foreground/60">
            The URL you requested: <code className="glass-card bg-primary/5 px-2 py-1 rounded text-xs">{location.pathname}</code>
          </p>

          <Button
            onClick={() => navigate('/')}
            variant="gradient-primary"
            className="w-full py-3 font-semibold border-0 transition-all duration-300 transform hover:scale-105"
          >
            <Home className="h-4 w-4 mr-2" />
            Return to Home
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;
