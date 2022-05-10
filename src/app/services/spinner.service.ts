import { Injectable } from "@angular/core";
import { Subject } from "rxjs";


@Injectable({
  providedIn: 'root'
})
export class SpinnerService {

  public showSpinner = new Subject<boolean>();
  
  public show() {
    this.showSpinner.next(true);
  }

  public hide() {
    this.showSpinner.next(false);
  }

}