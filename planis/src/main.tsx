import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { CalendarApp } from "./App";
import { AppProviders } from "./features/providers/AppProviders";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppProviders>
      <CalendarApp />
    </AppProviders>
  </StrictMode>,
);
