import { BraintrustExporter } from "@braintrust/otel";
import { registerOTel } from "@vercel/otel";

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const braintrustProjectName = process.env.BRAINTRUST_PROJECT_NAME ?? "hogkilla";

    if (process.env.BRAINTRUST_API_KEY) {
      registerOTel({
        serviceName: "hogkilla",
        traceExporter: new BraintrustExporter({
          parent: `project_name:${braintrustProjectName}`,
          filterAISpans: true,
        }),
      });
    }
  }
}
