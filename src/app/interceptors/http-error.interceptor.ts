import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { SpinnerService } from "@services/spinner.service";
import { catchError, Observable, throwError } from "rxjs";

@Injectable()
export class ServerErrorInterceptor implements HttpInterceptor {

  constructor(private spinnerService: SpinnerService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = '';
        if (error.error instanceof HttpErrorResponse) {
          errorMessage = `Server Error (${error.status}): ${error.message}`;
        }
        else {
          errorMessage = `Client Error (${error.status}): ${error.message}`;
        }
        this.spinnerService.hide()
        return throwError(() => new Error(errorMessage));
      })
    )
  }
}
