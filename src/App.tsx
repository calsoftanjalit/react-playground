import { useEffect } from "react";
import { ErrorBoundary } from "react-error-boundary";
import "./App.scss";
import { GlobalErrorFallback } from "@/components/miscellaneous";
import { AppRoutes } from "@/routes/AppRoutes";
import { useAuthStore } from "@/hooks/useAuthStore";

function App() {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <ErrorBoundary
      FallbackComponent={GlobalErrorFallback}
      onReset={() => {
        globalThis.location.href = "/";
      }}
    >
      <AppRoutes />
    </ErrorBoundary>
  );
}

export default App;
