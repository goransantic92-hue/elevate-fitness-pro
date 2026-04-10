import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import PublicLayout from "@/components/PublicLayout";
import HomePage from "@/pages/HomePage";
import ProgramPage from "@/pages/ProgramPage";
import TrainingPage from "@/pages/TrainingPage";
import NutritionPage from "@/pages/NutritionPage";
import ResultsPage from "@/pages/ResultsPage";
import FAQPage from "@/pages/FAQPage";
import PricingPage from "@/pages/PricingPage";
import NotFound from "./pages/NotFound.tsx";

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
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
