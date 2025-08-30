import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Report from "./pages/Report";
import Dashboard from "./pages/Dashboard";
import Leaderboard from "./pages/Leaderboard";
import Community from "./pages/Community";
import Education from "./pages/Education";
import Profile from "./pages/Profile";
import Alerts from "./pages/Alerts";
import NotFound from "./pages/NotFound";
import TestConnection from "./pages/TestConnection";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

import { AuthProvider } from "./contexts/AuthContext";
import ErrorBoundary from "./components/ErrorBoundary";

const queryClient = new QueryClient();

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Layout>
              <Routes>
                <Route path="/" element={<Report />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/leaderboard" element={<Leaderboard />} />
                <Route path="/community" element={<Community />} />
                <Route path="/education" element={<Education />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/alerts" element={<Alerts />} />
                <Route path="/test" element={<TestConnection />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
        
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Layout>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
