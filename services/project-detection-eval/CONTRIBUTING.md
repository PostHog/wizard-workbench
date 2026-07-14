# Turn a detection bug into a regression case

This guide adds one durable project-detection case without changing generic detector infrastructure.

1. Minimize the reported repository to the manifests and workspace markers that reproduce the behavior. Keep it under 100 KB and omit credentials, lockfiles that are not signals, generated dependencies, and source code that is irrelevant to detection.
2. Choose a lowercase hyphenated case ID. Add provenance explaining the failure pattern; link a public issue or PR when one exists.
3. Put self-authored minimal files under `fixtures/<case-id>/`. Reference an existing Workbench app instead when it already represents the topology. Do not add expectation files to submodules.
4. Add `cases/<case-id>.json` with `schemaVersion: 1`, fixture ownership, tiers, tags, and one or more consumer expectations.
5. Mark every project `required`, `optional`, or `forbidden`. Use `optional` for orchestration-only roots until the desired consumer semantics are settled.
6. Use the evaluated Wizard's production target vocabulary. Integration uses IDs such as `javascript_node`; source maps uses IDs such as `node` and `vite`. Catalog validation rejects cross-profile IDs.
7. Run the case and confirm the intended field-level failure:

   ```bash
   WIZARD_PATH=/absolute/path/to/wizard pnpm project-detection-eval --case <case-id> --output-dir /tmp/project-detection-case
   ```

8. Make the scoped detector or context change in its owning repository. Fixture expectations stay in Workbench; generic Wizard code stays fixture-neutral.
9. Run `pnpm test:project-detection-eval`, `pnpm typecheck:project-detection-eval`, the complete credential-free corpus, and five consecutive deterministic repetitions.
10. If the claim needs a real model, stop at the core evaluator boundary. A scripted runner may test evaluator behavior but cannot close a live acceptance criterion; production-path execution belongs in a separately reviewed follow-up.

Do not record or publish model traffic without an approved production-path recording seam. Do not dispatch workflows or publish repository changes as part of local case authoring.
