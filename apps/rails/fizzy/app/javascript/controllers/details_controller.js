import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = [ "details" ]

  close() {
    this.detailsTarget.removeAttribute("open")
  }

  closeOnClickOutside({ target }) {
    if (!this.element.contains(target)) this.close()
  }
}
