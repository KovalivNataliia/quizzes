import { Injectable } from "@angular/core";


@Injectable({
  providedIn: 'root'
})
export class StyleService {

  private _appElement!: HTMLCollectionOf<Element>;
  private _appStyles!: CSSStyleDeclaration;

  public getStyle(styleName: string): string {
    this._appElement = document.getElementsByClassName('style-variables');
    this._appStyles = window.getComputedStyle(this._appElement[0]);
    return this._appStyles.getPropertyValue(styleName);
  }

}