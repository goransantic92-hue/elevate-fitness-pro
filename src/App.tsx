import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import PublicLayout from "@/components/PublicLayout";
import DashboardLayout from "@/layouts/DashboardLayout";
import AdminLayout from "@/layouts/AdminLayout";
import HomePage from "@/pages/HomePage";
import ProgramPage from "@/pages/ProgramPage";
import TrainingPage from "@/pages/TrainingPage";
import NutritionPage from "@/pages/NutritionPage";
import ResultsPage from "@/pages/ResultsPage";
import FAQPage from "@/pages/FAQPage";
import PricingPage from "@/pages/PricingPage";
import NotFound from "@/pages/NotFound";
import LoginPage from "@/pages/auth/LoginPage";
import SignupPage from "@/pages/auth/SignupPage";
import DashboardHome from "@/pages/dashboard/DashboardHome";
import DashboardTrainingPage from "@/pages/dashboard/DashboardTrainingPage";
import DashboardWorkoutDetailPage from "@/pages/dashboard/DashboardWorkoutDetailPage";
import DashboardNutritionPage from "@/pages/dashboard/DashboardNutritionPage";
import DashboardRoadmapPage from "@/pages/dashboard/DashboardRoadmapPage";
import DashboardProgressPage from "@/pages/dashboard/DashboardProgressPage";
import DashboardNotificationsPage from "@/pages/dashboard/DashboardNotificationsPage";
import DashboardProfilePage from "@/pages/dashboard/DashboardProfilePage";
import AdminOverview from "@/pages/admin/AdminOverview";
import AdminMembersPage from "@/pages/admin/AdminMembersPage";
import AdminContentPage from "@/pages/admin/AdminContentPage";
import AdminRemindersPage from "@/pages/admin/AdminRemindersPage";
import AdminWorkoutsPage from "@/pages/admin/AdminWorkoutsPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/program" element={<ProgramPage />} />
            <Route path="/training" element={<TrainingPage />} />
            <Route path="/nutrition" element={<NutritionPage />} />
            <Route path="/results" element={<ResultsPage />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/pricing" element={<PricingPage />} />
          </Route>

          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardHome />} />
            <Route path="training" element={<DashboardTrainingPage />} />
            <Route path="training/:variant/:code" element={<DashboardWorkoutDetailPage />} />
            <Route path="nutrition" element={<DashboardNutritionPage />} />
            <Route path="roadmap" element={<DashboardRoadmapPage />} />
            <Route path="progress" element={<DashboardProgressPage />} />
            <Route path="reminders" element={<DashboardNotificationsPage />} />
            <Route path="profile" element={<DashboardProfilePage />} />
          </Route>

          <Route
            path="/admin"
            element={
              <ProtectedRoute requireAdmin>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminOverview />} />
            <Route path="members" element={<AdminMembersPage />} />
            <Route path="content" element={<AdminContentPage />} />
            <Route path="reminders" element={<AdminRemindersPage />} />
            <Route path="workouts" element={<AdminWorkoutsPage />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
