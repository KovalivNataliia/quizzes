import { Directive, HostListener, HostBinding, Input } from '@angular/core';

@Directive({
  selector: '[hoverEffect]'
})
export class HoverEffectDirective {

  @Input() createdByUser!: boolean;

  private _hoverBoxShadow = '1px 1px 15px 1px rgb(0 0 0 / 20%)';
  private _hoverBackgroundColor = '#edf3fd';
  private _userHoverBackgroundColor = '#fde7ef';

  @HostBinding("style.boxShadow") boxShadow!: string;

  @HostBinding("style.backgroundColor") backgroundColor!: string;

  @HostBinding('style.cursor') cursor = 'pointer';

  @HostListener("mouseenter") onMouseEnter() {
    this.boxShadow = this._hoverBoxShadow;
    this.backgroundColor = this.createdByUser ?
      this._userHoverBackgroundColor : this._hoverBackgroundColor;
  }

  @HostListener("mouseleave") onMouseLeave() {
    this.boxShadow = '';
    this.backgroundColor = '';
  }
}