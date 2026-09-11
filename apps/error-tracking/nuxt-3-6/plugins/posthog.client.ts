import posthog from "posthog-js";

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();

  posthog.init(config.public.posthogKey, {
    api_host: config.public.posthogHost,
    capture_pageview: "history_change",
  });

  return {
    provide: {
      posthog,
    },
  };
});
