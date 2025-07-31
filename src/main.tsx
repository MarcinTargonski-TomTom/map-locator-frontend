import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import Layout from "./layout.tsx";
import { ToastsProvider } from "tombac";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <ToastsProvider zIndex={1000}>
        <Layout />
      </ToastsProvider>
    </BrowserRouter>
  </StrictMode>
);
