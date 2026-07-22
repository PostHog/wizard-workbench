import { PostHogErrorBoundary, PostHogProvider } from "@posthog/react";
import i18next from "i18next";
import I18nextBrowserLanguageDetector from "i18next-browser-languagedetector";
import Fetch from "i18next-fetch-backend";
import { StrictMode, startTransition } from "react";
import { hydrateRoot } from "react-dom/client";
import { I18nextProvider, initReactI18next } from "react-i18next";
import { HydratedRouter } from "react-router/dom";

import posthog from "./lib/posthog.client";
import { createClient } from "./lib/supabase/client";

async function identifyAuthenticatedUser() {
  const {
    data: { user },
  } = await createClient().auth.getUser();

  if (!user) return;

  posthog?.identify(user.id, {
    email: user.email,
  });
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

  void identifyAuthenticatedUser();

  startTransition(() => {
    hydrateRoot(
      document,
      <I18nextProvider i18n={i18next}>
        <StrictMode>
          {posthog ? (
            <PostHogProvider client={posthog}>
              <PostHogErrorBoundary>
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
