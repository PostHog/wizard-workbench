import { Directive, ElementRef, OnInit, Renderer2, inject, input } from '@angular/core';

/**
 * `LetterWordCountDirective` is a directive that counts the number of letters or words in a given HTML element.
 * It can also limit the maximum number of characters or words allowed in the element.
 * It can also reverse the count to show the remaining number of characters or words.
 * It can be used only with a textarea or input element.
 *
 * @directive
 * @selector appLetterWordCount
 *
 * @example
 * <span [targetElement]="textAreaInput" appLetterWordCount reverse="true"></span>
 *   <textarea
 *     #textAreaInput
 *     id="description"
 *     name="description"
 *     rows="6"
 *   ></textarea>
 */
@Directive({
  selector: '[appLetterWordCount]',
})
export class LetterWordCountDirective implements OnInit {
  private readonly el = inject(ElementRef);
  private readonly renderer = inject(Renderer2);

  /** Determines whether to count words or characters. If true, it counts words, otherwise it counts characters. */
  countWords = input(false);

  /** The target element to count the number of characters or words. */
  targetElement = input<HTMLElement | undefined>(undefined);

  /** The maximum number of characters or words allowed in the target element. */
  maxLimit = input(600);

  /** Determines whether to reverse the count. If true, it counts the remaining number of characters or words. */
  reverse = input(false);

  /** Determines whether to show the maximum limit of characters or words. */
  showMaxLimit = input(false);

  ngOnInit() {
    const target = this.targetElement();
    if (target) {
      this.renderer.listen(target, 'input', () => this.updateCount());
    }
    this.updateCount();
  }

  private updateCount(): void {
    const target = this.targetElement();
    if (!target) return;

    let text = '';
    if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) {
      text = target.value;
    } else {
      text = target.innerText;
    }

    const maxLimitValue = this.maxLimit();
    let count = this.countWords() ? text.split(/\s+/).filter((word) => word.length > 0).length : text.length;
    if (this.reverse()) {
      count = maxLimitValue - count;
      if (count < 0) {
        count = 0;
        if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) {
          target.value = text.substring(0, maxLimitValue);
        }
      }
    } else if (count > maxLimitValue) {
      this.renderer.setStyle(this.el.nativeElement, 'color', 'var(--red)');
    } else {
      this.renderer.removeStyle(this.el.nativeElement, 'color');
    }

    this.el.nativeElement.innerText = `${count}`;
    if (this.showMaxLimit()) {
      this.el.nativeElement.innerText += ` / ${maxLimitValue}`;
    }
  }
}
