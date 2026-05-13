"use client";

import { useEventLog, useTrack } from "@/hooks/use-analytics";
import { useFeatureFlags } from "@/hooks/use-flags";
import { useChat } from "@ai-sdk/react";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
} from "@ras-sh/ui";
import { DefaultChatTransport } from "ai";
import { useState } from "react";

// --- Vendor Panels ---

function LaunchDarklyPanel() {
  const flags = useFeatureFlags();
  const showBanner = flags["show-welcome-banner"] as boolean | undefined;
  const buttonColor = flags["cta-button-color"] as string | undefined;
  const targetIndividualUsersExample1774462935314 = flags[
    "targetIndividualUsersExample1774462935314"
  ] as boolean | undefined;

  return (
    <Card className="border-zinc-200 dark:border-zinc-800">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          LaunchDarkly
          <Badge className="text-xs" variant="secondary">
            Feature Flags
          </Badge>
        </CardTitle>
        <CardDescription className="mt-1">
          Feature flags evaluated from LaunchDarkly in real time
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center justify-between rounded-md border border-zinc-200 bg-zinc-100 px-3 py-2 dark:border-zinc-800 dark:bg-zinc-900/50">
            <span className="font-mono text-sm text-zinc-700 dark:text-zinc-300">
              show-welcome-banner
            </span>
            <Badge variant={showBanner ? "default" : "outline"}>
              {showBanner === undefined ? "not connected" : showBanner ? "ON" : "OFF"}
            </Badge>
          </div>
          <div className="flex items-center justify-between rounded-md border border-zinc-200 bg-zinc-100 px-3 py-2 dark:border-zinc-800 dark:bg-zinc-900/50">
            <span className="font-mono text-sm text-zinc-700 dark:text-zinc-300">
              cta-button-color
            </span>
            <Badge variant="outline">
              {buttonColor === undefined ? "not connected" : buttonColor}
            </Badge>
          </div>
          <div className="flex items-center justify-between rounded-md border border-zinc-200 bg-zinc-100 px-3 py-2 dark:border-zinc-800 dark:bg-zinc-900/50">
            <span className="font-mono text-sm text-zinc-700 dark:text-zinc-300">
              targetIndividualUsersExample1774462935314
            </span>
            <Badge variant={targetIndividualUsersExample1774462935314 ? "default" : "outline"}>
              {targetIndividualUsersExample1774462935314 === undefined
                ? "not connected"
                : targetIndividualUsersExample1774462935314
                  ? "ON"
                  : "OFF"}
            </Badge>
          </div>
        </div>
        <div className="mt-4 rounded-md border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/50">
          {targetIndividualUsersExample1774462935314 ? (
            <div className="space-y-1">
              <p className="font-medium text-sm text-zinc-900 dark:text-zinc-100">
                Targeted feature is enabled
              </p>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                This user is included in the rollout, so they see the LaunchDarkly-gated experience.
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              <p className="font-medium text-sm text-zinc-900 dark:text-zinc-100">
                Fallback experience
              </p>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                This user is outside the targeting rule, so the default behavior is shown.
              </p>
            </div>
          )}
        </div>
        <p className="mt-3 font-mono text-xs text-zinc-500 dark:text-zinc-500">
          SDK: launchdarkly-react-client-sdk &middot; ~40KB gzipped
        </p>
      </CardContent>
    </Card>
  );
}

function AmplitudePanel() {
  const events = useEventLog();
  const trackEvent = useTrack();
  const recentEvents = events.slice(-5).reverse();

  return (
    <Card className="border-zinc-200 dark:border-zinc-800">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-base">
              Amplitude
              <Badge className="text-xs" variant="secondary">
                Product Analytics
              </Badge>
            </CardTitle>
            <CardDescription className="mt-1">
              Every interaction on this page is tracked as an event
            </CardDescription>
          </div>
          {events.length > 0 && <Badge variant="secondary">{events.length} events</Badge>}
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex flex-wrap gap-2">
          <Button
            onClick={() => trackEvent("demo_cta_clicked", { variant: "primary" })}
            size="sm"
            variant="outline"
          >
            Track CTA Click
          </Button>
          <Button
            onClick={() => trackEvent("pricing_viewed", { plan: "pro" })}
            size="sm"
            variant="outline"
          >
            Track Pricing View
          </Button>
          <Button
            onClick={() => trackEvent("signup_started", { source: "amplitude-panel" })}
            size="sm"
            variant="outline"
          >
            Track Signup Start
          </Button>
        </div>
        <div className="space-y-2">
          {recentEvents.length === 0 ? (
            <p className="py-4 text-center text-sm text-zinc-500 dark:text-zinc-500">
              Click one of the tracking buttons to see events appear here
            </p>
          ) : (
            recentEvents.map((event, i) => (
              <div
                className="flex items-center justify-between rounded-md border border-zinc-200 bg-zinc-100 px-3 py-2 dark:border-zinc-800 dark:bg-zinc-900/50"
                key={`${event.timestamp}-${i}`}
              >
                <span className="font-mono text-sm text-zinc-700 dark:text-zinc-300">
                  {event.name}
                </span>
                <span className="font-mono text-xs text-zinc-500 dark:text-zinc-500">
                  {new Date(event.timestamp).toLocaleTimeString()}
                </span>
              </div>
            ))
          )}
        </div>
        <p className="mt-3 font-mono text-xs text-zinc-500 dark:text-zinc-500">
          SDK: @amplitude/unified &middot; autocapture + session replay
        </p>
      </CardContent>
    </Card>
  );
}

function BraintrustPanel() {
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/ai",
    }),
  });
  const trackEvent = useTrack();
  const [input, setInput] = useState("");
  const isLoading = status === "submitted" || status === "streaming";

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || isLoading) {
      return;
    }

    trackEvent("ai_message_sent", { message: input });
    await sendMessage({ text: input });
    setInput("");
  };

  return (
    <Card className="border-zinc-200 dark:border-zinc-800">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-base">
              Braintrust
              <Badge className="text-xs" variant="secondary">
                LLM Analytics
              </Badge>
            </CardTitle>
            <CardDescription className="mt-1">
              Every LLM call is traced, logged, and scored
            </CardDescription>
          </div>
          {messages.length > 0 && (
            <Badge variant="secondary">{Math.floor(messages.length / 2)} calls</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="max-h-48 space-y-2 overflow-y-auto">
            {messages.length === 0 ? (
              <p className="py-4 text-center text-sm text-zinc-500 dark:text-zinc-500">
                Ask the AI something to see Braintrust tracing
              </p>
            ) : (
              messages.map((m) => (
                <div
                  className={`rounded-md px-3 py-2 text-sm ${
                    m.role === "user"
                      ? "border border-zinc-200 bg-zinc-100 text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-300"
                      : "border border-cyan-500/30 bg-cyan-500/10 text-cyan-700 dark:border-cyan-500/20 dark:bg-cyan-500/5 dark:text-cyan-300"
                  }`}
                  key={m.id}
                >
                  <span className="font-mono text-xs text-zinc-500 dark:text-zinc-500">
                    {m.role === "user" ? "you" : "ai"}:{" "}
                  </span>
                  {m.parts.map((part, i) => {
                    switch (part.type) {
                      case "text":
                        return <span key={`${m.id}-${i}`}>{part.text}</span>;
                      default:
                        return null;
                    }
                  })}
                </div>
              ))
            )}
          </div>
          <form className="flex gap-2" onSubmit={onSubmit}>
            <Input
              className="flex-1"
              disabled={isLoading}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask the AI something..."
              value={input}
            />
            <Button disabled={isLoading} size="sm" type="submit">
              Send
            </Button>
          </form>
          <p className="font-mono text-xs text-zinc-500 dark:text-zinc-500">
            SDK: braintrust + ai + @ai-sdk/openai &middot; ~150KB gzipped
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

// --- Main Content ---

export function Content() {
  return (
    <div className="mx-auto max-w-3xl space-y-8 px-8 py-12 md:py-20">
      <main className="space-y-8">
        <section>
          <h1 className="mb-4 font-bold text-4xl tracking-tight">posthog-migrate</h1>
          <p className="text-lg leading-relaxed text-zinc-700 dark:text-zinc-300">
            A real app wired up with{" "}
            <span className="font-semibold text-blue-400">LaunchDarkly</span>,{" "}
            <span className="font-semibold text-purple-400">Amplitude</span>, and{" "}
            <span className="font-semibold text-cyan-400">Braintrust</span>.
          </p>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            This template is for demonstrating the starting point before a migration to PostHog
          </p>
        </section>

        <section className="space-y-4">
          <AmplitudePanel />
          <LaunchDarklyPanel />
          <BraintrustPanel />
        </section>
      </main>
    </div>
  );
}
