import { BrowserRouter as Router } from "react-router-dom";
import { AppRoutes } from "./routes";
import { useTimezoneSync } from "./hooks/timezone/useTimezoneSync";

function App() {
  // Auto-sync timezones to Firestore for logged-in users
  useTimezoneSync();

  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;
