import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static classes = [ "deleteable", "reveal", "perform" ]
  static targets = [ "button", "content" ]
  static values = { reacterId: String }

  connect() {
    if (this.#currentUserIsReacter) {
      this.#setAccessibleAttributes()
    }
  }

  reveal() {
    if (this.#currentUserIsReacter) {
      this.element.classList.toggle(this.revealClass)
      this.contentTarget.ariaExpanded = this.element.classList.contains(this.revealClass)
      this.buttonTarget.focus()
    }
  }

  perform() {
    this.element.classList.add(this.performClass)
  }

  #setAccessibleAttributes() {
    this.contentTarget.role = "button"
    this.contentTarget.tabIndex = 0
    this.contentTarget.ariaExpanded = false
    this.element.classList.add(this.deleteableClass)
  }

  get #currentUserIsReacter() {
    return Current.user.id === this.reacterIdValue
  }
}
