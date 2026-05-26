SHELL := /bin/bash

APPS := next next-no-posthog react-vite rust node-rollup

.PHONY: $(APPS)
$(APPS):
	source .env && cd apps/error-tracking-upload-source-maps/$@ && node $$WIZARD_PATH/dist/bin.js upload-sourcemaps --local-mcp
