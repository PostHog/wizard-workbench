import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static outlets = [ "auto-save" ]

  change(event) {
    this.autoSaveOutlet.change(event)
  }

  submit() {
    this.autoSaveOutlet.submit()
  }
}
