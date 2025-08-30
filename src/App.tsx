import ProtectedRoute from "@/components/ProtectedRoute";
import PWAInstallPrompt from "@/components/PWAInstallPrompt";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { initializeAnalytics, trackPageView } from "@/lib/analytics";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { lazy, Suspense, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

// Lazy load components to reduce initial bundle size
const FeedbackRequest = lazy(() => import("./components/FeedbackRequest"));
const SendFeedback = lazy(() => import("./components/SendFeedback"));
const Auth = lazy(() => import("./pages/Auth"));
const DebugReset = lazy(() => import("./pages/DebugReset"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const TestReset = lazy(() => import("./pages/TestReset"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Import Index immediately as it's the main page
import Index from "./pages/Index";

const queryClient = new QueryClient();

function App() {
  useEffect(() => {
    // Initialize Google Analytics
    initializeAnalytics();

    // Track initial page view
    trackPageView(window.location.pathname, document.title);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <PWAInstallPrompt />
          <BrowserRouter>
            <div className="transition-colors duration-300 ease-in-out">
              <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>}>
                <Routes>
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/reset-password" element={<ResetPassword />} />
                  {import.meta.env.DEV && (
                    <>
                      <Route path="/debug-reset" element={<DebugReset />} />
                      <Route path="/test-reset" element={<TestReset />} />
                    </>
                  )}
                  <Route path="/feedback/:slug" element={<SendFeedback />} />
                  <Route path="/" element={<Index />} />
                  <Route path="/request" element={
                    <ProtectedRoute>
                      <FeedbackRequest />
                    </ProtectedRoute>
                  } />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </div>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
