import { createRoot } from "react-dom/client";
import { App } from "./app";
import "./style.css";

type AppConfig = {
  mode?: "standalone" | "embed";
  title?: string;
  subtitle?: string;
  downloadFileName?: string;
  showPrivacyNote?: boolean;
};

const parseConfig = (rawConfig: string | null): AppConfig => {
  if (!rawConfig) {
    return {};
  }

  try {
    return JSON.parse(rawConfig) as AppConfig;
  } catch (error) {
    console.warn("PDFZUSMERGE: config could not be parsed.", error);
    return {};
  }
};

const hosts = document.querySelectorAll<HTMLElement>("[data-pdfzusmerge-app]");

hosts.forEach((host) => {
  const config = parseConfig(host.dataset.config ?? null);
  createRoot(host).render(<App config={config} />);
});
