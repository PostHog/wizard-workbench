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

const posthogClient = posthogToken
  ? posthogHost
    ? posthog.init(posthogToken, {
        api_host: posthogHost,
        capture_exceptions: {
          capture_console_errors: false,
          capture_unhandled_errors: true,
          capture_unhandled_rejections: true,
        },
        defaults: "2026-05-30",
        logs: {
          environment: import.meta.env.MODE,
          serviceName: "saas-template-web",
        },
      })
    : undefined
  : undefined;

if (!posthogToken && import.meta.env.DEV) {
  throw new Error(
    "VITE_PUBLIC_POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once VITE_PUBLIC_POSTHOG_PROJECT_TOKEN is configured",
  );
}

if (!posthogHost && import.meta.env.DEV) {
  throw new Error(
    "VITE_PUBLIC_POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once VITE_PUBLIC_POSTHOG_HOST is configured",
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
          <PostHogProvider client={posthogClient}>
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
