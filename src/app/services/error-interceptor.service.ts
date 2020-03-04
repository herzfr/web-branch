import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ErrorInterceptorService implements HttpInterceptor {

  // constructor(private notifier: NotifierService) { }
  constructor() { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      tap(response => {
        // if (response instanceof HttpResponse) {
        // }
      }, error => {
        if (error instanceof HttpErrorResponse) {
          if (error.error === null) {
            // this.showNotification('error', error.message);
          } else {
            // this.showNotification('error', error.message);
          }
        }
      }));
  }

  public showNotification(type: string, message: string): void {
    // this.notifier.notify(type, message);
  }

}
