import { PostHogErrorBoundary, PostHogProvider } from "@posthog/react";
import i18next from "i18next";
import I18nextBrowserLanguageDetector from "i18next-browser-languagedetector";
import Fetch from "i18next-fetch-backend";
import posthog from "posthog-js";
import { StrictMode, startTransition } from "react";
import { hydrateRoot } from "react-dom/client";
import { I18nextProvider, initReactI18next } from "react-i18next";
import { HydratedRouter } from "react-router/dom";

import { createClient } from "./lib/supabase/client";

const posthogProjectToken = window.ENV.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN;
const posthogHost = window.ENV.VITE_PUBLIC_POSTHOG_HOST;
let posthogInitialized = false;

function identifyAuthenticatedUser() {
  const supabase = createClient();

  void supabase.auth.getUser().then(({ data: { user } }) => {
    if (!user) return;

    const name =
      typeof user.user_metadata.full_name === "string"
        ? user.user_metadata.full_name
        : undefined;

    posthog.identify(user.id, {
      ...(user.email ? { email: user.email } : {}),
      ...(name ? { name } : {}),
    });
  });
}

if (!posthogProjectToken) {
  if (window.ENV.MODE === "development") {
    throw new Error(
      "VITE_PUBLIC_POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once VITE_PUBLIC_POSTHOG_PROJECT_TOKEN is configured",
    );
  }
} else if (!posthogHost) {
  if (window.ENV.MODE === "development") {
    throw new Error(
      "VITE_PUBLIC_POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once VITE_PUBLIC_POSTHOG_HOST is configured",
    );
  }
} else {
  posthog.init(posthogProjectToken, {
    api_host: posthogHost,
    defaults: "2026-01-30",
  });
  posthogInitialized = true;
}

if (posthogInitialized) {
  identifyAuthenticatedUser();
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
