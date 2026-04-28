import { post } from "@rails/request.js"
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static values = { url: String }

  connect() {
    this.#sendBeacon()
    this.onVisibilityChange = this.#sendBeacon.bind(this);
    document.addEventListener("visibilitychange", this.onVisibilityChange)
  }

  disconnect() {
    this.#sendBeacon()
    document.removeEventListener("visibilitychange", this.onVisibilityChange)
  }

  #sendBeacon() {
    if (!document.hidden) {
      post(this.urlValue, { responseKind: "turbo-stream" })
    }
  }
}
