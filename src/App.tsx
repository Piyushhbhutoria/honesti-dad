
import ProtectedRoute from "@/components/ProtectedRoute";
import PWAInstallPrompt from "@/components/PWAInstallPrompt";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import FeedbackRequest from "./components/FeedbackRequest";
import SendFeedback from "./components/SendFeedback";
import Auth from "./pages/Auth";
import DebugReset from "./pages/DebugReset";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ResetPassword from "./pages/ResetPassword";
import TestReset from "./pages/TestReset";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <PWAInstallPrompt />
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/debug-reset" element={<DebugReset />} />
            <Route path="/test-reset" element={<TestReset />} />
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
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
