import type { APIRoute } from "astro";
import { getPostHogServer } from "../../../lib/posthog-server";

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { helpful, page, distinctId } = body;

    if (typeof helpful !== "boolean" || !page) {
      return new Response(
        JSON.stringify({ error: "helpful (boolean) and page (string) are required" }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    const posthog = getPostHogServer();
    const sessionId = request.headers.get("X-PostHog-Session-Id");
    const resolvedDistinctId = distinctId || `anon-${Date.now()}`;

    posthog.capture({
      distinctId: resolvedDistinctId,
      event: "doc_feedback_submitted",
      properties: {
        $session_id: sessionId || undefined,
        helpful,
        page,
        source: "api",
      },
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Doc feedback error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
