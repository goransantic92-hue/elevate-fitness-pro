import "./i18n";
import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import { registerSW } from "virtual:pwa-register";
import { RootErrorBoundary } from "@/components/RootErrorBoundary";
import { AuthProvider } from "@/context/AuthContext";
import { setupBootRecovery } from "@/lib/bootRecovery";
import App from "./App.tsx";
import "./index.css";

setupBootRecovery();

registerSW({
  immediate: true,
  onRegisteredSW(_url, registration) {
    if (registration) {
      void registration.update();
    }
  },
});

createRoot(document.getElementById("root")!).render(
  <RootErrorBoundary>
    <HelmetProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </HelmetProvider>
  </RootErrorBoundary>
);
