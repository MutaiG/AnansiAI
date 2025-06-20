import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Import warning filter to suppress known third-party library warnings
import "./lib/reactWarningFilter";

createRoot(document.getElementById("root")!).render(<App />);
