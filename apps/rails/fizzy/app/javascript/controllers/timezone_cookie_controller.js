import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  connect() {
    this.#setTimezoneCookie()
  }

  #setTimezoneCookie() {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
    document.cookie = `timezone=${encodeURIComponent(timezone)}; path=/`
  }
}
