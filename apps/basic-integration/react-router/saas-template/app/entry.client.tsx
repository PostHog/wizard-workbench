import { PostHogErrorBoundary, PostHogProvider } from "@posthog/react";
import i18next from "i18next";
import I18nextBrowserLanguageDetector from "i18next-browser-languagedetector";
import Fetch from "i18next-fetch-backend";
import posthog from "posthog-js";
import { StrictMode, startTransition, useEffect } from "react";
import { hydrateRoot } from "react-dom/client";
import { I18nextProvider, initReactI18next } from "react-i18next";
import { HydratedRouter } from "react-router/dom";

import { createClient } from "./lib/supabase/client";

let identifiedUserId: string | undefined;

const posthogToken = import.meta.env.VITE_POSTHOG_PROJECT_TOKEN;
const posthogHost = import.meta.env.VITE_POSTHOG_HOST;

if (!posthogToken || !posthogHost) {
  if (import.meta.env.DEV) {
    const missingVariable = posthogToken
      ? "VITE_POSTHOG_HOST"
      : "VITE_POSTHOG_PROJECT_TOKEN";
    throw new Error(
      `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`,
    );
  }
} else {
  posthog.init(posthogToken, {
    api_host: posthogHost,
    defaults: "2026-08-30",
    logs: {
      environment: import.meta.env.MODE,
      serviceName: "saas-template-web",
    },
  });
}

const posthogLog = posthog.logger;

function PostHogSessionIdentity() {
  useEffect(() => {
    if (!posthogToken || !posthogHost) return;

    const supabase = createClient();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT") {
        posthogLog.info("authenticated browser session signed out");
        posthog.reset();
        identifiedUserId = undefined;
        return;
      }

      if (
        (event === "INITIAL_SESSION" || event === "SIGNED_IN") &&
        session?.user
      ) {
        if (identifiedUserId === session.user.id) {
          return;
        }

        if (identifiedUserId) {
          posthog.reset();
        }

        posthog.identify(session.user.id, {
          ...(session.user.email ? { email: session.user.email } : {}),
        });
        posthogLog.info("authenticated browser session identified", {
          authentication_event: event,
        });
        identifiedUserId = session.user.id;
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return null;
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
    if (posthogToken && posthogHost) {
      posthogLog.info("client hydration started");
    }

    hydrateRoot(
      document,
      <I18nextProvider i18n={i18next}>
        <StrictMode>
          <PostHogProvider client={posthog}>
            <PostHogSessionIdentity />
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
