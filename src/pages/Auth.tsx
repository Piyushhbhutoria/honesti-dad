import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import HonestBoxIcon from "@/components/ui/HonestBoxIcon";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ThemeToggle from "@/components/ui/theme-toggle";
import { supabase } from "@/integrations/supabase/client";
import { trackError, trackPageView, trackUserLogin, trackUserSignUp } from "@/lib/analytics";
import { getAuthRedirectURL, getResetPasswordURL } from "@/lib/urlUtils";
import { Lock, Mail, Shield, User } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Track page view
    trackPageView('/auth', 'Authentication');

    // Check if user is already logged in
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate('/');
      }
    };
    checkUser();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        // Track login error
        trackError('Login failed', 'Auth.handleLogin');

        if (error.message.includes('Invalid login credentials')) {
          toast.error("Invalid email or password. Please check your credentials and try again.");
        } else {
          toast.error(error.message);
        }
        return;
      }

      // Track successful login
      trackUserLogin('email');

      toast.success("Welcome back!");
      navigate('/');
    } catch (error) {
      // Track unexpected error
      trackError('Unexpected login error', 'Auth.handleLogin');
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: getAuthRedirectURL('/'),
          data: {
            name: name,
            app_name: 'HonestBox',
            welcome_message: 'Welcome to anonymous feedback!'
          }
        }
      });

      if (error) {
        // Track signup error
        trackError('Signup failed', 'Auth.handleSignup');

        if (error.message.includes('User already registered')) {
          toast.error("An account with this email already exists. Please try logging in instead.");
        } else {
          toast.error(error.message);
        }
        return;
      }

      // Track successful signup
      trackUserSignUp('email');

      toast.success("Account created successfully! Please check your email to verify your account.");
      setIsLogin(true);
    } catch (error) {
      // Track unexpected error
      trackError('Unexpected signup error', 'Auth.handleSignup');
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    setIsLoading(true);
    try {
      const redirectUrl = getResetPasswordURL();
      console.log('Sending reset email with redirect URL:', redirectUrl);

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl,
      });

      if (error) {
        console.error('Reset password error:', error);
        toast.error(error.message);
        return;
      }

      console.log('Reset email sent successfully');
      toast.success("Password reset email sent! Check your inbox.");
      setShowForgotPassword(false);
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: getAuthRedirectURL('/'),
        }
      });

      if (error) {
        // Track Google sign-in error
        trackError('Google sign-in failed', 'Auth.handleGoogleSignIn');
        toast.error(error.message);
        return;
      }

      // Track Google sign-in attempt (success will be tracked on redirect)
      trackUserLogin('google');

      // The user will be redirected to Google for authentication
      // and then back to the redirectTo URL after successful authentication
    } catch (error) {
      // Track unexpected error
      trackError('Unexpected Google sign-in error', 'Auth.handleGoogleSignIn');
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

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
          <div className="glass-card bg-gradient-to-br from-primary to-primary/90 p-3 w-fit mx-auto mb-4 shadow-glass">
            <HonestBoxIcon className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-2xl bg-gradient-to-r from-primary to-primary/90 bg-clip-text text-transparent">
            {isLogin ? "Welcome Back" : "Create Account"}
          </CardTitle>
          <p className="text-foreground/70">
            {isLogin ? "Sign in to your HonestBox account" : "Join HonestBox to get anonymous feedback"}
          </p>
        </CardHeader>
        <CardContent>
          {/* Google OAuth Button */}
          <div className="space-y-4 mb-6">
            <Button
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full glass-button bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 transition-all duration-300 transform hover:scale-105 py-3 font-semibold"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-700 dark:border-gray-200 mr-2"></div>
                  Connecting...
                </div>
              ) : (
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Continue with Google
                </div>
              )}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-300 dark:border-gray-600" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white dark:bg-slate-900 px-2 text-gray-500 dark:text-gray-400">
                  Or continue with email
                </span>
              </div>
            </div>
          </div>

          <form onSubmit={isLogin ? handleLogin : handleSignup} className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-2 text-foreground">
                  <User className="h-4 w-4" />
                  Full Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  required={!isLogin}
                  disabled={isLoading}
                  className="glass-input"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2 text-foreground">
                <Mail className="h-4 w-4" />
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                disabled={isLoading}
                className="glass-input"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="flex items-center gap-2 text-foreground">
                <Lock className="h-4 w-4" />
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                disabled={isLoading}
                minLength={6}
                className="glass-input"
              />
            </div>

            <Button
              type="submit"
              variant="gradient-primary"
              className="w-full py-3 font-semibold border-0 transition-all duration-300 transform hover:scale-105"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  {isLogin ? "Signing in..." : "Creating account..."}
                </div>
              ) : (
                isLogin ? "Sign In" : "Create Account"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-foreground/70">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setEmail("");
                  setPassword("");
                  setName("");
                }}
                className="text-primary hover:text-primary/80 font-semibold hover:underline transition-colors"
                disabled={isLoading}
              >
                {isLogin ? "Sign up" : "Sign in"}
              </button>
            </p>
          </div>

          {isLogin && (
            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => setShowForgotPassword(true)}
                className="text-sm text-primary hover:text-primary/80 hover:underline transition-colors"
                disabled={isLoading}
              >
                Forgot your password?
              </button>
            </div>
          )}
        </CardContent>
      </Card>

      {showForgotPassword && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-300">
          {/* Animated background elements for the modal */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 left-1/3 w-32 h-32 bg-primary/10 rounded-full blur-2xl animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/3 w-48 h-48 bg-primary/5 rounded-full blur-2xl animate-pulse delay-700"></div>
          </div>

          <Card className="w-full max-w-md shadow-glass border-0 relative z-10 hover:shadow-glass-hover transition-all duration-300 animate-in slide-in-from-bottom-4 zoom-in-95">
            <CardHeader className="text-center pb-4">
              <div className="glass-card bg-gradient-to-br from-primary to-primary/90 p-3 w-fit mx-auto mb-4 shadow-glass animate-pulse">
                <Lock className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-xl bg-gradient-to-r from-primary to-primary/90 bg-clip-text text-transparent">
                Reset Password
              </CardTitle>
              <p className="text-foreground/70 text-sm">
                Enter your email address and we'll send you a secure link to reset your password.
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleForgotPassword} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="reset-email" className="flex items-center gap-2 text-foreground font-medium">
                    <Mail className="h-4 w-4 text-primary" />
                    Email Address
                  </Label>
                  <Input
                    id="reset-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    required
                    disabled={isLoading}
                    className="glass-input"
                  />
                </div>

                <div className="glass-card bg-primary/5 border-primary/10 p-4 rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="glass-card bg-primary/10 p-1.5 rounded-md">
                      <Shield className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground mb-1">Secure Password Reset</p>
                      <p className="text-xs text-foreground/70">
                        We'll send you a secure link to reset your password. The link will expire in 24 hours for your security.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button
                    type="submit"
                    disabled={isLoading}
                    variant="gradient-primary"
                    className="flex-1 font-semibold border-0 transition-all duration-300 transform hover:scale-105 focus-ring"
                  >
                    {isLoading ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Sending...
                      </div>
                    ) : (
                      <>
                        <Mail className="h-4 w-4 mr-2" />
                        Send Reset Link
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="glass"
                    onClick={() => setShowForgotPassword(false)}
                    disabled={isLoading}
                    className="px-6 text-foreground/70 hover:text-foreground transition-all duration-300 hover:scale-105"
                  >
                    Cancel
                  </Button>
                </div>
              </form>

              <div className="mt-6 text-center">
                <p className="text-xs text-foreground/60">
                  Remember your password?{" "}
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(false)}
                    className="text-primary hover:text-primary/80 hover:underline transition-colors font-medium"
                    disabled={isLoading}
                  >
                    Back to Sign In
                  </button>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Auth;
