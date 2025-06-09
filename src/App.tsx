
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Login } from "@/components/auth/Login";
import { Register } from "@/components/auth/Register";
import AdminRoute from "./pages/AdminRoute";
import BankRoute from "./pages/BankRoute";
import NotFound from "./pages/NotFound";
import NezaRoute from "./pages/NezaRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/neza" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin" element={
              <ProtectedRoute>
                <AdminRoute />
              </ProtectedRoute>
            } />
            <Route path="/banco" element={
              <ProtectedRoute>
                <BankRoute />
              </ProtectedRoute>
            } />
            <Route path="/neza" element={<NezaRoute />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
