import { Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { ProgramContentGate } from "@/components/ProgramContentGate";
import { ScrollToTop } from "@/components/ScrollToTop";
import { InstallAppPrompt } from "@/components/InstallAppPrompt";
import { RoutePageFallback } from "@/components/RoutePageFallback";
import { lazyRoute } from "@/lib/lazyRoute";
import { I18nDirectionSync } from "@/components/I18nDirectionSync";
import PublicLayout from "@/components/PublicLayout";
import DashboardLayout from "@/layouts/DashboardLayout";
import AdminLayout from "@/layouts/AdminLayout";
import HomePage from "@/pages/HomePage";

const ProgramPage = lazyRoute(() => import("@/pages/ProgramPage"));
const TrainingPage = lazyRoute(() => import("@/pages/TrainingPage"));
const NutritionPage = lazyRoute(() => import("@/pages/NutritionPage"));
const FAQPage = lazyRoute(() => import("@/pages/FAQPage"));
const PricingPage = lazyRoute(() => import("@/pages/PricingPage"));
const CoachingApplyPage = lazyRoute(() => import("@/pages/CoachingApplyPage"));
const BlogIndexPage = lazyRoute(() => import("@/pages/BlogIndexPage"));
const BlogPostPage = lazyRoute(() => import("@/pages/BlogPostPage"));
const NotFound = lazyRoute(() => import("@/pages/NotFound"));
const LoginPage = lazyRoute(() => import("@/pages/auth/LoginPage"));
const SignupPage = lazyRoute(() => import("@/pages/auth/SignupPage"));
const AuthCallbackPage = lazyRoute(() => import("@/pages/auth/AuthCallbackPage"));
const DashboardHome = lazyRoute(() => import("@/pages/dashboard/DashboardHome"));
const DashboardTrainingPage = lazyRoute(() => import("@/pages/dashboard/DashboardTrainingPage"));
const DashboardWorkoutDetailPage = lazyRoute(() => import("@/pages/dashboard/DashboardWorkoutDetailPage"));
const DashboardEmergencyWorkoutPage = lazyRoute(() => import("@/pages/dashboard/DashboardEmergencyWorkoutPage"));
const DashboardNutritionPage = lazyRoute(() => import("@/pages/dashboard/DashboardNutritionPage"));
const DashboardRoadmapPage = lazyRoute(() => import("@/pages/dashboard/DashboardRoadmapPage"));
const DashboardProgressPage = lazyRoute(() => import("@/pages/dashboard/DashboardProgressPage"));
const DashboardNotificationsPage = lazyRoute(() => import("@/pages/dashboard/DashboardNotificationsPage"));
const DashboardProfilePage = lazyRoute(() => import("@/pages/dashboard/DashboardProfilePage"));
const AdminOverview = lazyRoute(() => import("@/pages/admin/AdminOverview"));
const AdminMembersPage = lazyRoute(() => import("@/pages/admin/AdminMembersPage"));
const AdminContentPage = lazyRoute(() => import("@/pages/admin/AdminContentPage"));
const AdminRemindersPage = lazyRoute(() => import("@/pages/admin/AdminRemindersPage"));
const AdminHandbookLeadsPage = lazyRoute(() => import("@/pages/admin/AdminHandbookLeadsPage"));
const AdminWorkoutsPage = lazyRoute(() => import("@/pages/admin/AdminWorkoutsPage"));

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
        <I18nDirectionSync />
        <ScrollToTop />
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
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
            <Route path="/results" element={<Navigate to="/program" replace />} />
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
            <Route
              path="/blog"
              element={
                <Lazy>
                  <BlogIndexPage />
                </Lazy>
              }
            />
            <Route
              path="/blog/:slug"
              element={
                <Lazy>
                  <BlogPostPage />
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
              path="leads"
              element={
                <Lazy>
                  <AdminHandbookLeadsPage />
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
