
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { AdminProvider } from "@/context/AdminContext";
import Index from "./pages/Index";
import Developers from "./pages/Developers";
import DeveloperProfile from "./pages/Developers/DeveloperProfile";
import Hackathons from "./pages/Hackathons";
import HackathonDetail from "./pages/Hackathons/HackathonDetail";
import UserProfile from "./pages/Profile/UserProfile";
import EditProfile from "./pages/Profile/EditProfile";
import Login from "./pages/Auth/Login";
import AuthCallback from "./pages/Auth/Callback";
import CreateHackathon from "./pages/Admin/CreateHackathon";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import PendingHackathons from "./pages/Admin/PendingHackathons";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <AdminProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/developers" element={<Developers />} />
              <Route path="/developers/:id" element={<DeveloperProfile />} />
              <Route path="/hackathons" element={<Hackathons />} />
              <Route path="/hackathons/:id" element={<HackathonDetail />} />
              <Route path="/profile/:id" element={<UserProfile />} />
              <Route path="/profile/edit" element={<EditProfile />} />
              <Route path="/auth/login" element={<Login />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
              <Route path="/admin/hackathons/create" element={<CreateHackathon />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/pending-hackathons" element={<PendingHackathons />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AdminProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
