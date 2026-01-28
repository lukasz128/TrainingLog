export const RIPPLE_COLOR = new InjectionToken<string>('Ripple color token');

import {
  computed,
  Directive,
  ElementRef,
  HostListener,
  inject,
  InjectionToken,
  input,
  Renderer2,
} from '@angular/core';

@Directive({
  selector: '[uiRipple]',
})
export class RippleDirective {
  private readonly _el = inject(ElementRef<HTMLElement>);
  private readonly _renderer = inject(Renderer2);
  private readonly _rippleColorByToken = inject(RIPPLE_COLOR, {
    optional: true,
  });

  readonly color = input('rgba(255, 255, 255, 0.35)');
  readonly duration = input(600);

  protected readonly computedColor = computed(() => {
    const inputColor = this.color();

    return this._rippleColorByToken ?? inputColor;
  });

  constructor() {
    this.prepareHost();
  }

  private prepareHost(): void {
    const style = getComputedStyle(this._el.nativeElement);

    if (style.position === 'static' || style.position === '') {
      this._renderer.setStyle(this._el.nativeElement, 'position', 'relative');
    }

    this._renderer.setStyle(this._el.nativeElement, 'overflow', 'hidden');
  }

  @HostListener('pointerdown', ['$event'])
  onPointerDown(event: MouseEvent): void {
    this.createRipple(event.clientX, event.clientY);
  }

  @HostListener('keydown.enter')
  @HostListener('keydown.space')
  onKeydown(): void {
    if (this.isInputFocused()) return;

    const rect = this._el.nativeElement.getBoundingClientRect();
    this.createRipple(rect.left + rect.width / 2, rect.top + rect.height / 2);
  }

  private isInputFocused(): boolean {
    const active = document.activeElement;
    if (!active) return false;

    return (
      active.tagName === 'INPUT' ||
      active.tagName === 'TEXTAREA' ||
      active.tagName === 'SELECT' ||
      !!(active as HTMLElement)?.isContentEditable
    );
  }

  private createRipple(clientX: number, clientY: number): void {
    const host = this._el.nativeElement;
    const rect = host.getBoundingClientRect();

    const ripple = this._renderer.createElement('span');

    const size = Math.max(rect.width, rect.height) * 2;
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    this._renderer.setStyle(ripple, 'position', 'absolute');
    this._renderer.setStyle(ripple, 'width', `${size}px`);
    this._renderer.setStyle(ripple, 'height', `${size}px`);
    this._renderer.setStyle(ripple, 'left', `${x}px`);
    this._renderer.setStyle(ripple, 'top', `${y}px`);
    this._renderer.setStyle(ripple, 'background', this.computedColor());
    this._renderer.setStyle(ripple, 'border-radius', '50%');
    this._renderer.setStyle(ripple, 'pointer-events', 'none');
    this._renderer.setStyle(
      ripple,
      'transform',
      'translate(-50%, -50%) scale(0)',
    );
    this._renderer.setStyle(ripple, 'opacity', '1');
    this._renderer.setStyle(
      ripple,
      'transition',
      `transform ${this.duration()}ms ease-out, opacity ${this.duration()}ms ease-out`,
    );

    this._renderer.appendChild(host, ripple);

    requestAnimationFrame(() => {
      this._renderer.setStyle(
        ripple,
        'transform',
        'translate(-50%, -50%) scale(1)',
      );
      this._renderer.setStyle(ripple, 'opacity', '0');
    });

    setTimeout(() => {
      this._renderer.removeChild(host, ripple);
    }, this.duration());
  }
}
