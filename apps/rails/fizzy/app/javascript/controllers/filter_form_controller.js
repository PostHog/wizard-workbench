import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  clearCategory({ params: { name } }) {
    name.split(",").forEach(name => {
      this.element.querySelectorAll(`input[name="${name}"]`).forEach(input => {
        input.checked = false
      })
    })
  }
}
