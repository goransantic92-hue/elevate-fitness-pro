import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { ProgramContentGate } from "@/components/ProgramContentGate";
import { ScrollToTop } from "@/components/ScrollToTop";
import { InstallAppPrompt } from "@/components/InstallAppPrompt";
import { RoutePageFallback } from "@/components/RoutePageFallback";
import PublicLayout from "@/components/PublicLayout";
import DashboardLayout from "@/layouts/DashboardLayout";
import AdminLayout from "@/layouts/AdminLayout";

const HomePage = lazy(() => import("@/pages/HomePage"));
const ProgramPage = lazy(() => import("@/pages/ProgramPage"));
const TrainingPage = lazy(() => import("@/pages/TrainingPage"));
const NutritionPage = lazy(() => import("@/pages/NutritionPage"));
const ResultsPage = lazy(() => import("@/pages/ResultsPage"));
const FAQPage = lazy(() => import("@/pages/FAQPage"));
const PricingPage = lazy(() => import("@/pages/PricingPage"));
const CoachingApplyPage = lazy(() => import("@/pages/CoachingApplyPage"));
const NotFound = lazy(() => import("@/pages/NotFound"));
const LoginPage = lazy(() => import("@/pages/auth/LoginPage"));
const SignupPage = lazy(() => import("@/pages/auth/SignupPage"));
const AuthCallbackPage = lazy(() => import("@/pages/auth/AuthCallbackPage"));
const DashboardHome = lazy(() => import("@/pages/dashboard/DashboardHome"));
const DashboardTrainingPage = lazy(() => import("@/pages/dashboard/DashboardTrainingPage"));
const DashboardWorkoutDetailPage = lazy(() => import("@/pages/dashboard/DashboardWorkoutDetailPage"));
const DashboardEmergencyWorkoutPage = lazy(() => import("@/pages/dashboard/DashboardEmergencyWorkoutPage"));
const DashboardNutritionPage = lazy(() => import("@/pages/dashboard/DashboardNutritionPage"));
const DashboardRoadmapPage = lazy(() => import("@/pages/dashboard/DashboardRoadmapPage"));
const DashboardProgressPage = lazy(() => import("@/pages/dashboard/DashboardProgressPage"));
const DashboardNotificationsPage = lazy(() => import("@/pages/dashboard/DashboardNotificationsPage"));
const DashboardProfilePage = lazy(() => import("@/pages/dashboard/DashboardProfilePage"));
const AdminOverview = lazy(() => import("@/pages/admin/AdminOverview"));
const AdminMembersPage = lazy(() => import("@/pages/admin/AdminMembersPage"));
const AdminContentPage = lazy(() => import("@/pages/admin/AdminContentPage"));
const AdminRemindersPage = lazy(() => import("@/pages/admin/AdminRemindersPage"));
const AdminWorkoutsPage = lazy(() => import("@/pages/admin/AdminWorkoutsPage"));

const queryClient = new QueryClient();

function Lazy({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<RoutePageFallback />}>{children}</Suspense>;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route element={<PublicLayout />}>
            <Route
              path="/"
              element={
                <Lazy>
                  <HomePage />
                </Lazy>
              }
            />
            <Route
              path="/program"
              element={
                <Lazy>
                  <ProgramPage />
                </Lazy>
              }
            />
            <Route
              path="/training"
              element={
                <Lazy>
                  <ProgramContentGate>
                    <TrainingPage />
                  </ProgramContentGate>
                </Lazy>
              }
            />
            <Route
              path="/nutrition"
              element={
                <Lazy>
                  <ProgramContentGate>
                    <NutritionPage />
                  </ProgramContentGate>
                </Lazy>
              }
            />
            <Route
              path="/results"
              element={
                <Lazy>
                  <ResultsPage />
                </Lazy>
              }
            />
            <Route
              path="/faq"
              element={
                <Lazy>
                  <FAQPage />
                </Lazy>
              }
            />
            <Route
              path="/pricing"
              element={
                <Lazy>
                  <PricingPage />
                </Lazy>
              }
            />
            <Route
              path="/coaching-apply"
              element={
                <Lazy>
                  <CoachingApplyPage />
                </Lazy>
              }
            />
          </Route>

          <Route
            path="/login"
            element={
              <Lazy>
                <LoginPage />
              </Lazy>
            }
          />
          <Route
            path="/signup"
            element={
              <Lazy>
                <SignupPage />
              </Lazy>
            }
          />
          <Route
            path="/auth/callback"
            element={
              <Lazy>
                <AuthCallbackPage />
              </Lazy>
            }
          />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route
              index
              element={
                <Lazy>
                  <DashboardHome />
                </Lazy>
              }
            />
            <Route
              path="training"
              element={
                <Lazy>
                  <DashboardTrainingPage />
                </Lazy>
              }
            />
            <Route
              path="training/emergency/:id"
              element={
                <Lazy>
                  <DashboardEmergencyWorkoutPage />
                </Lazy>
              }
            />
            <Route
              path="training/:variant/:code"
              element={
                <Lazy>
                  <DashboardWorkoutDetailPage />
                </Lazy>
              }
            />
            <Route
              path="nutrition"
              element={
                <Lazy>
                  <DashboardNutritionPage />
                </Lazy>
              }
            />
            <Route
              path="roadmap"
              element={
                <Lazy>
                  <DashboardRoadmapPage />
                </Lazy>
              }
            />
            <Route
              path="progress"
              element={
                <Lazy>
                  <DashboardProgressPage />
                </Lazy>
              }
            />
            <Route
              path="reminders"
              element={
                <Lazy>
                  <DashboardNotificationsPage />
                </Lazy>
              }
            />
            <Route
              path="profile"
              element={
                <Lazy>
                  <DashboardProfilePage />
                </Lazy>
              }
            />
          </Route>

          <Route
            path="/admin"
            element={
              <ProtectedRoute requireAdmin>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route
              index
              element={
                <Lazy>
                  <AdminOverview />
                </Lazy>
              }
            />
            <Route
              path="members"
              element={
                <Lazy>
                  <AdminMembersPage />
                </Lazy>
              }
            />
            <Route
              path="content"
              element={
                <Lazy>
                  <AdminContentPage />
                </Lazy>
              }
            />
            <Route
              path="reminders"
              element={
                <Lazy>
                  <AdminRemindersPage />
                </Lazy>
              }
            />
            <Route
              path="workouts"
              element={
                <Lazy>
                  <AdminWorkoutsPage />
                </Lazy>
              }
            />
          </Route>

          <Route
            path="*"
            element={
              <Lazy>
                <NotFound />
              </Lazy>
            }
          />
        </Routes>
        <InstallAppPrompt />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
