import { BrowserRouter as Router } from "react-router-dom";
import { AppRoutes } from "./routes";
import { useTimezoneSync } from "./features/timezone/hooks/useTimezoneSync";
import { useAuthBootstrap } from "./features/auth/hooks/useAuthBootstrap";

function App() {
  // Bootstrap authentication state on app load
  useAuthBootstrap();

  // Auto-sync timezones to Firestore for logged-in users
  useTimezoneSync();

  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;
