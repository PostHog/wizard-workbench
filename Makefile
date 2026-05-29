SHELL := /bin/bash

APPS := next next-no-posthog react-vite rust node-raw node-rollup node-rollup-typescript-plugin node-webpack nuxt-4-3 nuxt-3-6

.PHONY: $(APPS) source-maps
$(APPS):
	source .env && cd apps/error-tracking-upload-source-maps/$@ && node $$WIZARD_PATH/dist/bin.js upload-sourcemaps --local-mcp

source-maps:
	@choice=$$(./scripts/select-app.sh "Select a technology to test source map upload:" $(APPS)) && \
		$(MAKE) $$choice
