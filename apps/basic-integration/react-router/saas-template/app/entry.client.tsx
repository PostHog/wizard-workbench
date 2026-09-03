import { PostHogErrorBoundary, PostHogProvider } from "@posthog/react";
import i18next from "i18next";
import I18nextBrowserLanguageDetector from "i18next-browser-languagedetector";
import Fetch from "i18next-fetch-backend";
import posthog from "posthog-js";
import { StrictMode, startTransition } from "react";
import { hydrateRoot } from "react-dom/client";
import { I18nextProvider, initReactI18next } from "react-i18next";
import { HydratedRouter } from "react-router/dom";

const posthogToken = import.meta.env.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN;
const posthogHost = import.meta.env.VITE_PUBLIC_POSTHOG_HOST;

if (posthogToken && posthogHost) {
  posthog.init(posthogToken, {
    api_host: posthogHost,
    defaults: "2026-01-30",
  });
} else if (import.meta.env.DEV) {
  const missingVariable = posthogToken
    ? "VITE_PUBLIC_POSTHOG_HOST"
    : "VITE_PUBLIC_POSTHOG_PROJECT_TOKEN";
  throw new Error(
    `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`,
  );
}

async function hydrate() {
  await i18next
    .use(initReactI18next)
    .use(Fetch)
    .use(I18nextBrowserLanguageDetector)
    .init({
      backend: { loadPath: "/api/locales/{{lng}}/{{ns}}" },
      detection: { caches: [], order: ["htmlTag"] },
      fallbackLng: "en",
      interpolation: { escapeValue: false },
    });

  startTransition(() => {
    hydrateRoot(
      document,
      <I18nextProvider i18n={i18next}>
        <StrictMode>
          <PostHogProvider client={posthog}>
            <PostHogErrorBoundary>
              <HydratedRouter />
            </PostHogErrorBoundary>
          </PostHogProvider>
        </StrictMode>
      </I18nextProvider>,
    );
  });
}

hydrate();
