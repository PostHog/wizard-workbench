SHELL := /bin/bash

APPS := next next-no-posthog react-vite rust node-rollup node-rollup-typescript-plugin node-webpack

.PHONY: $(APPS) source-maps
$(APPS):
	source .env && cd apps/error-tracking-upload-source-maps/$@ && node $$WIZARD_PATH/dist/bin.js upload-sourcemaps --local-mcp

source-maps:
	@choice=$$(./scripts/select-app.sh "Select a technology to test source map upload:" $(APPS)) && \
		$(MAKE) $$choice
