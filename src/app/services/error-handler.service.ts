import { HttpErrorResponse } from "@angular/common/http";
import { ErrorHandler, Injectable, NgZone } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";

@Injectable()
export class ErrorHandlerService implements ErrorHandler {

  constructor(private snackBar: MatSnackBar, private zone: NgZone) { }

  handleError(error: Error | HttpErrorResponse): void {
    this.zone.run(() => {
      this.snackBar.open(error.message, 'Close', { duration: 5000, panelClass: ['snackbar'] });
    });
  }
}