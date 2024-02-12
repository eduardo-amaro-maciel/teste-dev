import { Toaster } from "./components/ui/toaster";
import { AppRoutes } from "./routes/AppRoutes";

export function App() {
  return (
    <div>
      <Toaster />
      <AppRoutes />
    </div>
  );
}
