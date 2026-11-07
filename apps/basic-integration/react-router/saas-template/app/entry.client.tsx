import i18next from "i18next";
import I18nextBrowserLanguageDetector from "i18next-browser-languagedetector";
import Fetch from "i18next-fetch-backend";
import { StrictMode, startTransition } from "react";
import { hydrateRoot } from "react-dom/client";
import { PostHogErrorBoundary, PostHogProvider } from "@posthog/react";
import { I18nextProvider, initReactI18next } from "react-i18next";
import { HydratedRouter } from "react-router/dom";
import posthog from "posthog-js";

declare global {
  interface Window {
    posthogIdentify?: (
      distinctId: string,
      personProperties: Record<string, string>,
    ) => void;
    posthogReset?: () => void;
  }
}

let identifiedDistinctId: string | undefined;

const posthogKey = import.meta.env.VITE_POSTHOG_KEY;
const posthogHost = import.meta.env.VITE_POSTHOG_HOST;

if (!posthogKey || !posthogHost) {
  if (import.meta.env.DEV) {
    throw new Error(
      `VITE_POSTHOG_${posthogKey ? "HOST" : "KEY"} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once VITE_POSTHOG_${posthogKey ? "HOST" : "KEY"} is configured`,
    );
  }
} else {
  posthog.init(posthogKey, {
    api_host: posthogHost,
    capture_exceptions: {
      capture_console_errors: false,
      capture_unhandled_errors: true,
      capture_unhandled_rejections: true,
    },
  });

  window.posthogIdentify = (distinctId, personProperties) => {
    if (identifiedDistinctId !== distinctId) {
      posthog.identify(distinctId, personProperties);
      identifiedDistinctId = distinctId;
    }
  };
  window.posthogReset = () => {
    posthog.reset();
    identifiedDistinctId = undefined;
  };
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
