import { PostHogProvider } from "@posthog/react";
import i18next from "i18next";
import I18nextBrowserLanguageDetector from "i18next-browser-languagedetector";
import Fetch from "i18next-fetch-backend";
import posthog from "posthog-js";
import { StrictMode, startTransition } from "react";
import { hydrateRoot } from "react-dom/client";
import { I18nextProvider, initReactI18next } from "react-i18next";
import { HydratedRouter } from "react-router/dom";

posthog.init(window.ENV.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN as string, {
  __add_tracing_headers: [window.location.host, "localhost"],
  api_host: window.ENV.VITE_PUBLIC_POSTHOG_HOST,
  defaults: "2026-01-30",
});

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
        <I18nextProvider i18n={i18next}>
          <StrictMode>
            <HydratedRouter />
          </StrictMode>
        </I18nextProvider>
      </PostHogProvider>,
    );
  });
}

hydrate();
