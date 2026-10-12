import i18next from "i18next";
import I18nextBrowserLanguageDetector from "i18next-browser-languagedetector";
import Fetch from "i18next-fetch-backend";
import posthog from "posthog-js";
import { StrictMode, startTransition } from "react";
import { hydrateRoot } from "react-dom/client";
import { I18nextProvider, initReactI18next } from "react-i18next";
import { HydratedRouter } from "react-router/dom";

const posthogToken = window.ENV.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN;
const posthogHost = window.ENV.VITE_PUBLIC_POSTHOG_HOST;

if (!posthogToken || !posthogHost) {
  if (import.meta.env.DEV) {
    const missingVariable = posthogToken
      ? "VITE_PUBLIC_POSTHOG_HOST"
      : "VITE_PUBLIC_POSTHOG_PROJECT_TOKEN";
    throw new Error(
      `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`,
    );
  }
} else {
  posthog.init(posthogToken, {
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

  const posthogUser = document.querySelector<HTMLElement>(
    "[data-posthog-user-id]",
  );
  const distinctId = posthogUser?.dataset.posthogUserId;
  const email = posthogUser?.dataset.posthogUserEmail;

  if (distinctId) {
    posthog.identify(distinctId, email ? { email } : {});
  }

  document.addEventListener("submit", (event) => {
    if (
      event.target instanceof HTMLFormElement &&
      event.target.dataset.posthogResetOnSubmit !== undefined
    ) {
      posthog.reset();
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
