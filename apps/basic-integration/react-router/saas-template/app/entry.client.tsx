import i18next from "i18next";
import I18nextBrowserLanguageDetector from "i18next-browser-languagedetector";
import Fetch from "i18next-fetch-backend";
import posthog from "posthog-js";
import { StrictMode, startTransition } from "react";
import { hydrateRoot } from "react-dom/client";
import { I18nextProvider, initReactI18next } from "react-i18next";
import { HydratedRouter } from "react-router/dom";

import { createClient } from "./lib/supabase/client";

const posthogProjectToken = import.meta.env.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN;
const posthogHost = import.meta.env.VITE_PUBLIC_POSTHOG_HOST;

if (posthogProjectToken && posthogHost) {
  posthog.init(posthogProjectToken, {
    api_host: posthogHost,
    capture_exceptions: {
      capture_console_errors: false,
      capture_unhandled_errors: true,
      capture_unhandled_rejections: true,
    },
    defaults: "2026-01-30",
  });
} else if (import.meta.env.DEV) {
  const missingVariable = posthogProjectToken
    ? "VITE_PUBLIC_POSTHOG_HOST"
    : "VITE_PUBLIC_POSTHOG_PROJECT_TOKEN";
  throw new Error(
    `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`,
  );
}

if (posthogProjectToken && posthogHost) {
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session?.user) {
    posthog.identify(session.user.id, {
      ...(session.user.email ? { email: session.user.email } : {}),
    });
  }

  supabase.auth.onAuthStateChange((event, nextSession) => {
    if (event === "SIGNED_OUT") {
      posthog.reset();
      return;
    }

    if (event === "SIGNED_IN" && nextSession?.user) {
      posthog.identify(nextSession.user.id, {
        ...(nextSession.user.email ? { email: nextSession.user.email } : {}),
      });
    }
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

  startTransition(() => {
    hydrateRoot(
      document,
      <I18nextProvider i18n={i18next}>
        <StrictMode>
          <HydratedRouter />
        </StrictMode>
      </I18nextProvider>,
    );
  });
}

hydrate();
