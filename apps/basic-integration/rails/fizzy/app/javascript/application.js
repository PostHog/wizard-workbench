// Configure your import map in config/importmap.rb. Read more: https://github.com/rails/importmap-rails
import "@hotwired/turbo-rails"
import "@hotwired/hotwire-native-bridge"
import "initializers"
import "controllers"
import { initializePostHog } from "posthog"

import "lexxy"

initializePostHog()
import "@rails/actiontext"
