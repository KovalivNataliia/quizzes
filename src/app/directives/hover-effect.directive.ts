import { Directive, HostListener, HostBinding, Input } from '@angular/core';
import { StyleVariables } from '@shared/style-variables';

@Directive({
  selector: '[hoverEffect]'
})
export class HoverEffectDirective {

  @Input() createdByUser!: boolean;

  private _hoverBoxShadow = StyleVariables['hover-box-shadow'];
  private _hoverBackgroundColor = StyleVariables['hover-background-color'];
  private _userHoverBackgroundColor = StyleVariables['user-hover-background-color'];

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