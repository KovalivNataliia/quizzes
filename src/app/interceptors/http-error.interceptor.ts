import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, tap } from "rxjs";

@Injectable()
export class ServerErrorInterceptor implements HttpInterceptor {

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      tap({
        error: (error) => {
          if (error.status < 500) {
            error.message = `Client Error: ${error.error.message || error.message}`;
          }
          else {
            error.message = `Server returned status code: ${error.status}
Response message: ${error.error.message || error.message}`;
          }
        }
      })
    )
  }
}
