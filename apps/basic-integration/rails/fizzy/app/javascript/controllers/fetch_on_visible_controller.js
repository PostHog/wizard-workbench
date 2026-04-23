import { Controller } from "@hotwired/stimulus"
import { get } from "@rails/request.js"

export default class extends Controller {
  static values = { url: String }

  connect() {
    this.#observe()
  }

  #observe() {
    const observer = new IntersectionObserver((entries) => {
      const visible = !!entries.find(entry => entry.isIntersecting)
      if (visible) {
        this.#fetch()
      }
    })

    observer.observe(this.element)
  }

  #fetch() {
    get(this.urlValue, { responseKind: "turbo-stream" })
  }
}
