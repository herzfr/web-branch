import { ComponentCanDeactivate } from '../can-deactivate/component-can-deactivate';
import { NgForm } from "@angular/forms";

export abstract class FormCanDeactivate extends ComponentCanDeactivate {

  abstract get form(): NgForm;

  canDeactivate(): boolean {
    console.log("submitted :", this.form.submitted);
    console.log("dirty :", this.form.dirty);

    return this.form.submitted || !this.form.dirty
  }
}