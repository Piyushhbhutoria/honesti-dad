import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ThemeToggle from "@/components/ui/theme-toggle";
import { supabase } from "@/integrations/supabase/client";
import { validatePassword } from "@/lib/validation";
import { Check, Eye, EyeOff, Lock, Shield, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [hasStartedTyping, setHasStartedTyping] = useState(false);
  const [passwordValidation, setPasswordValidation] = useState<{ isValid: boolean, errors: string[] }>({ isValid: false, errors: [] });
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Real-time password matching validation
  useEffect(() => {
    if (hasStartedTyping && confirmPassword.length > 0) {
      setPasswordsMatch(password === confirmPassword);
    }
  }, [password, confirmPassword, hasStartedTyping]);

  // Real-time password strength validation
  useEffect(() => {
    if (password.length > 0) {
      const validation = validatePassword(password);
      setPasswordValidation(validation);
    } else {
      setPasswordValidation({ isValid: false, errors: [] });
    }
  }, [password]);

  useEffect(() => {
    // Handle Supabase auth callback
    const handleAuthCallback = async () => {
      try {
        // Listen for auth state changes (this handles the Supabase redirect)
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            console.log('Auth state change:', event, session?.user?.email);

            if (event === 'PASSWORD_RECOVERY') {
              console.log('Password recovery event detected');
              toast.success("Reset link verified! Please set your new password.");
              return;
            }

            if (event === 'SIGNED_IN' && session) {
              console.log('User signed in via reset link');
              toast.success("Reset link verified! Please set your new password.");
              return;
            }
          }
        );

        // Also check current session immediately
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
          console.error('Session error:', sessionError);
          toast.error("Error retrieving session. Please try the reset link again.");
          navigate('/auth');
          return;
        }

        if (session && session.user) {
          console.log('User already authenticated via reset link:', session.user.email);
          toast.success("Reset link verified! Please set your new password.");
          return;
        }

        // If no session, check URL parameters for manual token handling
        const accessToken = searchParams.get('access_token');
        const refreshToken = searchParams.get('refresh_token');
        const type = searchParams.get('type');
        const error = searchParams.get('error');
        const errorDescription = searchParams.get('error_description');

        console.log('URL params:', {
          accessToken: accessToken ? 'present' : 'missing',
          refreshToken: refreshToken ? 'present' : 'missing',
          type,
          error,
          errorDescription
        });

        // Check for errors first
        if (error) {
          console.error('URL contains error:', error, errorDescription);
          toast.error(`Reset link error: ${errorDescription || error}`);
          navigate('/auth');
          return;
        }

        // If we have tokens in URL, try to set session manually
        if (accessToken) {
          console.log('Setting session from URL tokens...');
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken || '',
          });

          if (error) {
            console.error('Session error:', error);
            toast.error("Invalid or expired reset link. Please request a new one.");
            navigate('/auth');
            return;
          }

          console.log('Session set successfully:', data);
          toast.success("Reset link verified! Please set your new password.");
          return;
        }

        // Clean up subscription
        return () => {
          subscription.unsubscribe();
        };

      } catch (error) {
        console.error('Error handling auth callback:', error);
        toast.error("Error processing reset link. Please try again.");
        navigate('/auth');
      }
    };

    handleAuthCallback();
  }, [searchParams, navigate]);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords don't match. Please try again.");
      return;
    }

    if (!passwordValidation.isValid) {
      toast.error(passwordValidation.errors[0] || "Password does not meet security requirements.");
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      toast.success("Password updated successfully! You are now logged in.");
      navigate('/');
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmPasswordChange = (value: string) => {
    setConfirmPassword(value);
    if (!hasStartedTyping && value.length > 0) {
      setHasStartedTyping(true);
    }
  };

  const getPasswordStrength = (password: string) => {
    if (password.length === 0) return { strength: 0, label: '', color: '' };
    if (password.length < 6) return { strength: 1, label: 'Too short', color: 'text-error' };
    if (password.length < 8) return { strength: 2, label: 'Weak', color: 'text-warning' };
    if (password.length < 10) return { strength: 3, label: 'Good', color: 'text-warning' };
    return { strength: 4, label: 'Strong', color: 'text-success' };
  };

  const passwordStrength = getPasswordStrength(password);

  return (
    <div className="min-h-screen page-gradient flex items-center justify-center p-4 relative overflow-hidden">
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
            <Lock className="h-8 w-8 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl bg-gradient-to-r from-primary to-primary/90 bg-clip-text text-transparent">
            Set New Password
          </CardTitle>
          <p className="text-foreground/70">
            Enter your new password for your HonestBox account
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password" className="flex items-center gap-2 text-foreground">
                <Lock className="h-4 w-4" />
                New Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your new password"
                  required
                  disabled={isLoading}
                  minLength={6}
                  className="pr-10 glass-input"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-foreground/60 hover:text-foreground transition-colors"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              {/* Password strength indicator */}
              {password.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-muted rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.strength === 1 ? 'bg-error w-1/4' :
                          passwordStrength.strength === 2 ? 'bg-warning w-2/4' :
                            passwordStrength.strength === 3 ? 'bg-warning w-3/4' :
                              passwordStrength.strength === 4 ? 'bg-success w-full' : 'w-0'
                          }`}
                      />
                    </div>
                    <span className={`text-xs font-medium ${passwordStrength.color}`}>
                      {passwordStrength.label}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="flex items-center gap-2 text-foreground">
                <Lock className="h-4 w-4" />
                Confirm New Password
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => handleConfirmPasswordChange(e.target.value)}
                  placeholder="Confirm your new password"
                  required
                  disabled={isLoading}
                  minLength={6}
                  className={`pr-16 glass-input transition-all duration-300 ${hasStartedTyping && confirmPassword.length > 0
                    ? passwordsMatch
                      ? 'border-success focus:border-success'
                      : 'border-error focus:border-error'
                    : ''
                    }`}
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
                  {hasStartedTyping && confirmPassword.length > 0 && (
                    <div className={`transition-all duration-300 ${passwordsMatch ? 'text-success' : 'text-error'}`}>
                      {passwordsMatch ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="text-foreground/60 hover:text-foreground transition-colors ml-1"
                    disabled={isLoading}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Password match feedback */}
              {hasStartedTyping && confirmPassword.length > 0 && (
                <div className={`text-sm transition-all duration-300 ${passwordsMatch ? 'text-success' : 'text-error'}`}>
                  {passwordsMatch ? (
                    <div className="flex items-center gap-1">
                      <Check className="h-3 w-3" />
                      Passwords match
                    </div>
                  ) : (
                    <div className="flex items-center gap-1">
                      <X className="h-3 w-3" />
                      Passwords don't match
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="glass-card bg-primary/5 border-primary/10 p-4">
              <div className="flex items-start gap-2 mb-2">
                <Shield className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-sm font-medium text-foreground">Password Requirements:</span>
              </div>
              <ul className="text-sm space-y-1 ml-6">
                <li className={`transition-colors flex items-center gap-2 ${password.length >= 8 ? 'text-success' : 'text-foreground/70'}`}>
                  {password.length >= 8 ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                  At least 8 characters long
                </li>
                <li className={`transition-colors flex items-center gap-2 ${/[A-Z]/.test(password) ? 'text-success' : 'text-foreground/70'}`}>
                  {/[A-Z]/.test(password) ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                  At least one uppercase letter
                </li>
                <li className={`transition-colors flex items-center gap-2 ${/[a-z]/.test(password) ? 'text-success' : 'text-foreground/70'}`}>
                  {/[a-z]/.test(password) ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                  At least one lowercase letter
                </li>
                <li className={`transition-colors flex items-center gap-2 ${/\d/.test(password) ? 'text-success' : 'text-foreground/70'}`}>
                  {/\d/.test(password) ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                  At least one number
                </li>
                <li className={`transition-colors flex items-center gap-2 ${/^[a-zA-Z0-9]+$/.test(password) && password.length > 0 ? 'text-success' : 'text-foreground/70'}`}>
                  {/^[a-zA-Z0-9]+$/.test(password) && password.length > 0 ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                  Only letters and numbers allowed
                </li>
              </ul>
              {passwordValidation.errors.length > 0 && (
                <div className="mt-3 p-2 bg-error/10 border border-error/20 rounded-md">
                  <p className="text-sm text-error">
                    {passwordValidation.errors[0]}
                  </p>
                </div>
              )}
            </div>

            <Button
              type="submit"
              variant="gradient-primary"
              className="w-full py-3 font-semibold border-0 transition-all duration-300 transform hover:scale-105"
              disabled={isLoading || (hasStartedTyping && !passwordsMatch) || !passwordValidation.isValid}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-foreground mr-2"></div>
                  Updating Password...
                </div>
              ) : (
                <>
                  <Lock className="h-4 w-4 mr-2" />
                  Update Password
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => navigate('/auth')}
              className="text-sm text-primary hover:text-primary/80 hover:underline transition-colors"
              disabled={isLoading}
            >
              Back to Sign In
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPassword; 
