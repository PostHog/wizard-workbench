import type { User } from "@supabase/supabase-js";
import i18next from "i18next";
import I18nextBrowserLanguageDetector from "i18next-browser-languagedetector";
import Fetch from "i18next-fetch-backend";
import posthog from "posthog-js";
import { StrictMode, startTransition } from "react";
import { hydrateRoot } from "react-dom/client";
import { I18nextProvider, initReactI18next } from "react-i18next";
import { HydratedRouter } from "react-router/dom";

import { createClient } from "./lib/supabase/client";

const posthogKey = import.meta.env.VITE_PUBLIC_POSTHOG_KEY;
const posthogHost = import.meta.env.VITE_PUBLIC_POSTHOG_HOST;

if (!posthogKey || !posthogHost) {
  if (import.meta.env.DEV) {
    const missingVariable = posthogKey
      ? "VITE_PUBLIC_POSTHOG_HOST"
      : "VITE_PUBLIC_POSTHOG_KEY";
    throw new Error(
      `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`,
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
    defaults: "2026-01-30",
    logs: {
      environment: import.meta.env.MODE,
      serviceName: "saas-template-web",
    },
  });

  const supabase = createClient();
  let identifiedUserId: string | undefined;
  let logoutRequested = false;

  const identifyUser = (user: User) => {
    if (identifiedUserId === user.id) return;

    if (identifiedUserId) {
      posthog.reset();
    }

    const name = user.user_metadata.full_name ?? user.user_metadata.name;
    posthog.identify(user.id, {
      ...(user.email ? { email: user.email } : {}),
      ...(typeof name === "string" ? { name } : {}),
    });
    identifiedUserId = user.id;
  };

  supabase.auth.onAuthStateChange((event, session) => {
    if ((event === "INITIAL_SESSION" || event === "SIGNED_IN") && session) {
      logoutRequested = false;
      identifyUser(session.user);
    }

    if (event === "SIGNED_OUT" && !logoutRequested) {
      posthog.reset();
      identifiedUserId = undefined;
    }
  });

  window.addEventListener("submit", (event) => {
    const form = event.target;
    if (
      form instanceof HTMLFormElement &&
      new URL(form.action).pathname === "/logout"
    ) {
      logoutRequested = true;
      posthog.reset();
      identifiedUserId = undefined;
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
