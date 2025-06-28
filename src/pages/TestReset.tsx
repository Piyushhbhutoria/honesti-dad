import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { toast } from "sonner";

const TestReset = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const testResetFlow = async () => {
    if (!email) {
      toast.error("Please enter an email address");
      return;
    }

    setIsLoading(true);
    try {
      // Test different redirect URLs
      const redirectUrls = [
        `${window.location.origin}/reset-password`,
        `http://localhost:8081/reset-password`,
        `http://localhost:8080/reset-password`,
      ];

      console.log('Testing reset with URLs:', redirectUrls);

      for (const redirectUrl of redirectUrls) {
        console.log(`Testing with redirect URL: ${redirectUrl}`);

        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: redirectUrl,
        });

        if (!error) {
          toast.success(`Reset email sent with redirect: ${redirectUrl}`);
          console.log(`Success with: ${redirectUrl}`);
          break;
        } else {
          console.error(`Failed with ${redirectUrl}:`, error);
        }
      }
    } catch (error) {
      console.error('Test error:', error);
      toast.error("Test failed");
    } finally {
      setIsLoading(false);
    }
  };

  const checkSession = async () => {
    const { data: { session }, error } = await supabase.auth.getSession();
    console.log('Current session:', session, error);
    toast.info(`Session: ${session ? 'Active' : 'None'}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-950 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-glass border-0">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Test Reset Password</CardTitle>
          <p className="text-foreground/70">
            Test the reset password flow with different configurations
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter test email"
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Button
              onClick={testResetFlow}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? "Testing..." : "Test Reset Flow"}
            </Button>

            <Button
              onClick={checkSession}
              variant="outline"
              className="w-full"
            >
              Check Current Session
            </Button>
          </div>

          <div className="text-xs text-foreground/60 space-y-1">
            <p><strong>Current URL:</strong> {window.location.origin}</p>
            <p><strong>Port:</strong> {window.location.port}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TestReset; 
