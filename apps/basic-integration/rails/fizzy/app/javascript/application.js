// Configure your import map in config/importmap.rb. Read more: https://github.com/rails/importmap-rails
import "@hotwired/turbo-rails"
import "@hotwired/hotwire-native-bridge"
import "initializers"
import "controllers"

import "lexxy"
import "@rails/actiontext"

const posthog = window.posthog

if (posthog) {
  document.addEventListener("turbo:load", () => {
    const distinctId = document.querySelector('meta[name="current-user-id"]')?.content

    if (distinctId) {
      posthog.identify(distinctId, {
        email: document.querySelector('meta[name="current-user-email"]')?.content,
        name: document.querySelector('meta[name="current-user-name"]')?.content,
        account_id: document.querySelector('meta[name="current-account-id"]')?.content
      })
    }
  })
}
