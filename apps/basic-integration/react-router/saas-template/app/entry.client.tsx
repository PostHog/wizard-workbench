import { PostHogErrorBoundary, PostHogProvider } from "@posthog/react";
import i18next from "i18next";
import I18nextBrowserLanguageDetector from "i18next-browser-languagedetector";
import Fetch from "i18next-fetch-backend";
import posthog from "posthog-js";
import { StrictMode, startTransition } from "react";
import { hydrateRoot } from "react-dom/client";
import { I18nextProvider, initReactI18next } from "react-i18next";
import { HydratedRouter } from "react-router/dom";

const posthogToken = window.ENV?.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN;
const posthogHost = window.ENV?.VITE_PUBLIC_POSTHOG_HOST;

if (posthogToken && posthogHost) {
  posthog.init(posthogToken, {
    api_host: posthogHost,
    capture_exceptions: {
      capture_console_errors: false,
    },
    defaults: "2026-01-30",
  });
} else if (import.meta.env.DEV) {
  throw new Error(
    "VITE_PUBLIC_POSTHOG_PROJECT_TOKEN or VITE_PUBLIC_POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once the PostHog variables are configured",
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
      <PostHogProvider client={posthog}>
        <PostHogErrorBoundary>
          <I18nextProvider i18n={i18next}>
            <StrictMode>
              <HydratedRouter />
            </StrictMode>
          </I18nextProvider>
        </PostHogErrorBoundary>
      </PostHogProvider>,
    );
  });
}

hydrate();
