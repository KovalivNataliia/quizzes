import { Directive, HostListener, HostBinding, Input } from '@angular/core';
import { StyleService } from '@services/style.service';
import { StyleVariables } from '@shared/style-variables';

@Directive({
  selector: '[hoverEffect]'
})
export class HoverEffectDirective {

  @Input() createdByUser!: boolean;

  private _hoverBoxShadow = this.styleService.getStyle('box-shadow');
  private _hoverBackgroundColor = this.styleService.getStyle('color');
  private _userHoverBackgroundColor = this.styleService.getStyle('background-color');

  constructor(private styleService: StyleService) { }

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