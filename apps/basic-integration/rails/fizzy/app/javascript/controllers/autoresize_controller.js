import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["textarea", "wrapper"]

  connect() {
    this.resize()
  }

  resize() {
    this.wrapperTarget.setAttribute("data-autoresize-clone-value", this.textareaTarget.value)
  }
}
