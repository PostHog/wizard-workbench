import { Directive, ElementRef, OnInit, inject, input } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appNumberInput]',
  host: {
    '(input)': 'onInputChange($event)',
  },
})
export class NumberInputDirective implements OnInit {
  private readonly el = inject(ElementRef);
  readonly ngControl = inject(NgControl, { optional: true, self: true });

  type = input<'number' | 'phone' | 'zipcode'>('number');
  customRegex = input<string | undefined>(undefined);
  maxLength = input(14);

  private regex = new RegExp(/^\d+$/);
  private computedMaxLength = 14;

  ngOnInit() {
    this.computedMaxLength = this.maxLength();
    switch (this.type()) {
      case 'number':
        this.regex = new RegExp(/^\d+$/);
        break;
      case 'phone':
        this.regex = new RegExp(this.customRegex() || /^(\+49)?[ ]?(\([0-9]{3}\)[ ]?)?[0-9]{3,14}$/);
        this.computedMaxLength = 16; // +49 (123) 4567890
        break;
      case 'zipcode':
        this.regex = new RegExp(/^[0-9]{5}(?:-[0-9]{4})?$/);
        this.computedMaxLength = 5;
        break;
    }
  }

  onInputChange(event: Event) {
    const initialValue = this.el.nativeElement.value;
    this.el.nativeElement.value = initialValue.replace(/[^0-9 +()]/g, '').slice(0, this.computedMaxLength);

    if (this.ngControl?.control) {
      if (!this.regex.test(this.el.nativeElement.value)) {
        this.ngControl.control.setErrors({ invalid: true });
      } else {
        this.ngControl.control.setErrors(null);
      }
    }
  }
}
