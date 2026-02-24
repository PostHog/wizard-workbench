import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  #hiddenField

  static targets = [ "label", "item", "hiddenFieldTemplate" ]
  static values = {
    selectPropertyName: { type: String, default: "aria-checked" },
    defaultValue: String,
    defaultLabel: String
  }
  static classes = ["withDefault"]

  connect() {
    this.#selectedItem = this.#selectedItem
  }

  change(event) {
    const item = event.target.closest("[role='checkbox']")
    if (item) {
      this.#selectedItem = item
    }
  }

  get #selectedLabel() {
    const selectedValue = this.#selectedItemValue()

    if (this.hasDefaultLabelValue && (selectedValue === this.defaultValueValue || !selectedValue)) {
      return this.defaultLabelValue
    }

    return this.#selectedItem?.dataset?.comboboxLabel || ""
  }

  get #selectedItem() {
    return this.itemTargets.find(item => item.getAttribute(this.selectPropertyNameValue) === "true")
  }

  #selectedItemValue() {
    return this.#selectedItem?.dataset?.comboboxValue || ""
  }

  set #selectedItem(item) {
    if (!item) return

    this.#clearSelection()
    item.setAttribute(this.selectPropertyNameValue, "true")
    this.labelTarget.textContent = this.#selectedLabel
    this.hiddenField.value = item.dataset.comboboxValue
    this.hiddenField.disabled = !item.dataset.comboboxValue
    this.#updateWithDefaultClass()
  }

  #clearSelection() {
    this.itemTargets.forEach(target => {
      target.setAttribute(this.selectPropertyNameValue, "false")
    })
  }

  get hiddenField() {
    if (!this.#hiddenField) {
      this.#hiddenField = this.#buildHiddenField()
    }
    return this.#hiddenField
  }

  #buildHiddenField() {
    const [field] = this.hiddenFieldTemplateTarget.content.cloneNode(true).children
    this.element.appendChild(field)
    return field
  }

  #updateWithDefaultClass() {
    if (this.hasWithDefaultClass && this.hasDefaultValueValue) {
      const selectedValue = this.#selectedItemValue()
      const shouldHaveClass = selectedValue === this.defaultValueValue

      if (shouldHaveClass) {
        this.element.classList.add(this.withDefaultClass)
      } else {
        this.element.classList.remove(this.withDefaultClass)
      }
    }
  }
}
