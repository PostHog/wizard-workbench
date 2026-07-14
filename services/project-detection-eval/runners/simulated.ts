import type { DetectionRun } from "../types.js";

export type SimulatedResponse = Omit<DetectionRun, "mode">;

/** Scripted runner for evaluator tests. It is never production detector evidence. */
export class SimulatedRunner {
  readonly mode = "simulated" as const;
  constructor(private readonly responses: Map<string, SimulatedResponse>) {}
  run(caseId: string): DetectionRun {
    const response = this.responses.get(caseId);
    if (!response)
      return {
        mode: this.mode,
        status: "infrastructure-error",
        toolCalls: [],
        durationMs: 0,
        error: `missing simulated response: ${caseId}`,
      };
    return { mode: this.mode, ...structuredClone(response) };
  }
}
