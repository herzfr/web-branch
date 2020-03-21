import { Injectable } from '@angular/core';
import { CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { ComponentCanDeactivate } from './component-can-deactivate';


@Injectable()
export class CanDeactivateGuard implements CanDeactivate<ComponentCanDeactivate> {
  canDeactivate(component: ComponentCanDeactivate): boolean {

    if (!component.canDeactivate()) {
      if (confirm("You have unsaved changes! If you leave, your changes will be lost.")) {
        console.log("true di tekan ");

        return true;
      } else {
        console.log("false ditekan ");
        
        return false;
      }
    }
    return true;
  }
}
