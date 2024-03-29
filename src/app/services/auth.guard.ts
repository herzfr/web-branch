import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import * as securels from 'secure-ls';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  ls = new securels({ encodingType: 'aes' });

  constructor(private router: Router) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    try {
      let user = JSON.parse(this.ls.get('data'));
      
      if (user.enabled === 1) {
        return true
      }
    } catch (error) {
      this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
      return false;
    }
    return false;
  }

}
