import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ThemeToggle from "@/components/ui/theme-toggle";
import { useNavigate, useSearchParams } from "react-router-dom";

const DebugReset = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const allParams = Object.fromEntries(searchParams.entries());

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

      <Card className="w-full max-w-2xl shadow-glass border-0">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Debug Reset Password URL</CardTitle>
          <p className="text-foreground/70">
            This page shows all URL parameters received from the reset link
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Current URL:</h3>
            <code className="block p-2 bg-gray-100 dark:bg-gray-800 rounded text-sm break-all">
              {window.location.href}
            </code>
          </div>

          <div>
            <h3 className="font-semibold mb-2">URL Parameters:</h3>
            <div className="space-y-2">
              {Object.keys(allParams).length === 0 ? (
                <p className="text-red-500">No URL parameters found!</p>
              ) : (
                Object.entries(allParams).map(([key, value]) => (
                  <div key={key} className="flex gap-2">
                    <span className="font-mono font-semibold min-w-32">{key}:</span>
                    <span className="font-mono break-all">{value}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button onClick={() => navigate('/reset-password')}>
              Go to Reset Password
            </Button>
            <Button variant="outline" onClick={() => navigate('/auth')}>
              Go to Auth
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DebugReset; 
