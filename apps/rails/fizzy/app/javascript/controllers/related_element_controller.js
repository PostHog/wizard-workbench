import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = [ "related" ]
  static classes = [ "highlight" ]

  connect() {
    this.#highlight(null)
  }

  highlight(event) {
    this.#highlight(event.currentTarget.dataset.relatedElementGroupValue)
  }

  unhighlight() {
    this.#highlight(null)
  }

  #highlight(groupValue) {
    this.relatedTargets.forEach(element =>
      element.classList.toggle(this.highlightClass, element.dataset.relatedElementGroupValue === groupValue)
    )
  }
}
