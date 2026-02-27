import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static values = {
    reloadInterval: { type: Number, default: 10 * 60 } // 10 minutes
  }

  connect() {
    this.freshSince = Date.now()
  }

  reload() {
    const now = Date.now()
    const reloadIntervalMs = this.reloadIntervalValue * 1000

    if ((now - this.freshSince) >= reloadIntervalMs) {
      this.freshSince = now
      this.element.reload()
    }
  }
}
