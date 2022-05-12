import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, Observable, throwError } from "rxjs";

@Injectable()
export class ServerErrorInterceptor implements HttpInterceptor {

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = '';
        if (error.error instanceof HttpErrorResponse) {
          errorMessage = `Server Error (${error.status}): ${error.error.message}`;
        }
        else {
          errorMessage = `Client Error (${error.status}): ${error.error.message}`;
        }
        return throwError(() => new Error(errorMessage));
      })
    )
  }
}
