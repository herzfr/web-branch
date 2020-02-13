import { NgModule } from '@angular/core';
import { BsDropdownModule } from 'ngx-bootstrap';

@NgModule({
    imports: [
        BsDropdownModule.forRoot()
    ],
    exports: [
        BsDropdownModule,
    ],
    providers: []
})

export class NgxBootstrapModule { }