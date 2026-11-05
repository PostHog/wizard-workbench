import i18next from "i18next";
import I18nextBrowserLanguageDetector from "i18next-browser-languagedetector";
import Fetch from "i18next-fetch-backend";
import { PostHogErrorBoundary, PostHogProvider } from "@posthog/react";
import { StrictMode, startTransition } from "react";
import { hydrateRoot } from "react-dom/client";
import { I18nextProvider, initReactI18next } from "react-i18next";
import { HydratedRouter } from "react-router/dom";

import { isPostHogEnabled, posthog } from "./lib/posthog.client";
import { posthogLogger } from "./lib/posthog-logger.client";

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

  posthogLogger.appHydrationStarted();

  startTransition(() => {
    hydrateRoot(
      document,
      <I18nextProvider i18n={i18next}>
        <StrictMode>
          {isPostHogEnabled ? (
            <PostHogProvider client={posthog}>
              <PostHogErrorBoundary
                fallback={<p>Something went wrong. Please try again later.</p>}
              >
                <HydratedRouter />
              </PostHogErrorBoundary>
            </PostHogProvider>
          ) : (
            <HydratedRouter />
          )}
        </StrictMode>
      </I18nextProvider>,
    );
  });
}

hydrate();
