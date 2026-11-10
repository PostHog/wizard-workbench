import i18next from "i18next";
import I18nextBrowserLanguageDetector from "i18next-browser-languagedetector";
import Fetch from "i18next-fetch-backend";
import { StrictMode, startTransition } from "react";
import { hydrateRoot } from "react-dom/client";
import { I18nextProvider, initReactI18next } from "react-i18next";
import { HydratedRouter } from "react-router/dom";

import posthog, { isPostHogEnabled } from "./lib/posthog.client";
import { createClient } from "./lib/supabase/client";

function configurePostHogIdentity() {
  if (!isPostHogEnabled) return;

  const supabase = createClient();
  let authStateVersion = 0;
  let identifiedUserId: string | undefined;
  let resetOnLogoutSubmit = false;

  const identify = (user: { id: string; email?: string }) => {
    if (identifiedUserId && identifiedUserId !== user.id) {
      posthog.reset();
    }

    posthog.identify(user.id, user.email ? { email: user.email } : undefined);
    identifiedUserId = user.id;
    resetOnLogoutSubmit = false;
  };

  const initialAuthStateVersion = authStateVersion;
  void supabase.auth
    .getUser()
    .then(({ data: { user } }) => {
      if (user && authStateVersion === initialAuthStateVersion) identify(user);
    })
    .catch(() => undefined);

  supabase.auth.onAuthStateChange((event, session) => {
    if (event === "SIGNED_OUT") {
      authStateVersion += 1;
      if (!resetOnLogoutSubmit) posthog.reset();
      identifiedUserId = undefined;
      resetOnLogoutSubmit = false;
    } else if (
      session?.user &&
      (event === "INITIAL_SESSION" ||
        event === "SIGNED_IN" ||
        event === "USER_UPDATED")
    ) {
      authStateVersion += 1;
      identify(session.user);
    }
  });

  document.addEventListener("submit", (event) => {
    const form = event.target;
    if (
      form instanceof HTMLFormElement &&
      new URL(form.action).pathname === "/logout"
    ) {
      authStateVersion += 1;
      posthog.reset();
      identifiedUserId = undefined;
      resetOnLogoutSubmit = true;
    }
  });
}

async function hydrate() {
  configurePostHogIdentity();
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
