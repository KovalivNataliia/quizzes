import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
  
    const url = req.url.split('/')[2];
    if (url === 'opentdb.com') {
      return next.handle(req);
    }

    const user = JSON.parse(sessionStorage.getItem('user')!);
    if (user) {
      const token = user.token;
      const cloned = req.clone({
        headers: req.headers.set('Authorization', token)
      });
      return next.handle(cloned);
    } else {
      return next.handle(req);
    }
  }
  
}