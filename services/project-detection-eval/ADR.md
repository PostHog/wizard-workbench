# Project detection evaluation architecture

This ADR defines ownership and evidence boundaries for the credential-free evaluator core.

## Status

Proposed.

## Decisions

1. The evaluator is a sibling service at `services/project-detection-eval`; `framework-detect` remains an interactive debugger.
2. Cases live in a central catalog. Synthetic fixtures are owned by the evaluator; existing Workbench apps and submodules are referenced without modification.
3. Valid target IDs are queried from the evaluated Wizard source. Integration IDs come from `FRAMEWORK_REGISTRY`; source-map IDs come from `AUTOMATABLE_VARIANTS`.
4. Registry cross-check is credential-free and does not claim agentic coverage.
5. Scripted runners test evaluator behavior only. Their output is labeled `simulated` and never reported as live evidence.
6. Fixture expectations remain in Workbench. Generic Wizard code must stay fixture-neutral.
7. Reports contain field-level results and reproducible source fingerprints while excluding secret-named file contents and local absolute paths.

## Rejected alternatives

- Expanding `framework-detect`: conflates debugging with evaluation and changes its lightweight contract.
- Treating a fake runner as production coverage: tests the comparator at the wrong boundary.
- Enforcing exact project arrays universally: workspace-root inclusion is case-specific.
- Placing expectation files in every app: cannot work for externally owned submodules and duplicates existing applications.

## Deferred decisions

Production-path diagnostics, model execution, credential handling, analytics isolation, promotion thresholds, and CI orchestration are follow-up review units. The core report labels those claims blocked rather than replacing them with simulated output.
