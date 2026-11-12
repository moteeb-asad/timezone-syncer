import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/index.css";
import { ComingSoon } from "./pages/ComingSoon";

// The live domain shows only the coming-soon page while the app is being redesigned.
// Vercel preview URLs and localhost still load the full app.
// Set VITE_COMING_SOON=true to preview the page locally.
const LIVE_HOSTS = ["timezonesyncer.com", "www.timezonesyncer.com"];

const showComingSoon =
  import.meta.env.VITE_COMING_SOON === "true" ||
  LIVE_HOSTS.includes(window.location.hostname);

const root = createRoot(document.getElementById("root")!);

if (showComingSoon) {
  // Every route lands on the coming-soon page at "/"
  if (window.location.pathname !== "/" || window.location.search) {
    window.history.replaceState(null, "", "/");
  }
  document.title = "Timezone Syncer - Coming soon";

  root.render(
    <StrictMode>
      <ComingSoon />
    </StrictMode>
  );
} else {
  // Loaded only outside the live domain, so Firebase never starts there
  import("./AppRoot").then(({ default: AppRoot }) => {
    root.render(
      <StrictMode>
        <AppRoot />
      </StrictMode>
    );
  });
}
