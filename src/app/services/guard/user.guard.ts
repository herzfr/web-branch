import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import * as SecureLS from 'secure-ls';

@Injectable({
  providedIn: 'root'
})
export class UserGuard implements CanActivate {


  ls = new SecureLS({ encodingType: 'aes' });

  constructor(private router: Router) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    try {
      let user = JSON.parse(this.ls.get('data'));

      console.log("isi user : ", user);
      let rolesData = [];
      rolesData = user.roles;

      let isAdmin = rolesData.includes("admin");
      let isTeller = rolesData.includes("teller");
      let isHeadTeller = rolesData.includes("headteller");
      let isCs =rolesData.includes("cs");
      let isHeadCs = rolesData.includes("headcs");
    
  
      console.log("user teller : ", isTeller );
      console.log("user admin : ", isAdmin );
      console.log("user headteller : ", isHeadTeller );
      console.log("user cs : ", isCs );
      console.log("user headcs : ", isHeadCs );

      
      if (user.enabled === 1) {
        return true
      }
    } catch (error) {
      this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
      return false;
    }


    return true;
  }

}
