"use client";

import { usePostHog } from "posthog-js/react";

export default function Home() {
  const posthog = usePostHog();

  return (
    <main style={{ padding: "2rem", fontFamily: "system-ui" }}>
      <h1>Next.js + PostHog test fixture</h1>
      <p>This page exists to give the bundler something to ship.</p>
      <button onClick={() => posthog?.capture("button_clicked")}>
        Capture event
      </button>
    </main>
  );
}
