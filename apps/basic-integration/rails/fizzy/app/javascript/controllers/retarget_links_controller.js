import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  connect() {
    this.element.querySelectorAll("a").forEach(this.#retargetLink.bind(this))
  }

  #retargetLink(link) {
    link.target = this.#targetsSameDomain(link) ? "_top" : "_blank"
  }

  #targetsSameDomain(link) {
    return link.href.startsWith(window.location.origin)
  }
}
