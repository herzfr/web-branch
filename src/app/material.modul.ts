import { NgModule } from '@angular/core';
import { MatSliderModule } from '@angular/material/slider';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule, MatDatepickerModule, MatNativeDateModule, MatInputModule, MatSelectModule, MatNavList, MatSortModule, MatIconModule, MatCardModule, MatSnackBarModule, MatMenuModule, MatRippleModule, MatProgressSpinnerModule } from '@angular/material';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatToolbarModule } from '@angular/material/toolbar';

@NgModule({
    imports: [
        MatTableModule,
        MatButtonModule,
        MatPaginatorModule,
        MatSlideToggleModule,
        MatTooltipModule,
        MatSidenavModule,
        MatFormFieldModule,
        MatCheckboxModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatInputModule,
        MatSelectModule,
        MatSortModule,
        MatIconModule,
        MatCardModule,
        MatSnackBarModule,
        MatMenuModule,
        MatRippleModule,
        MatProgressSpinnerModule,
        MatSliderModule,
        MatToolbarModule

    ],
    exports: [
        MatTableModule,
        MatButtonModule,
        MatPaginatorModule,
        MatSlideToggleModule,
        MatTooltipModule,
        MatSidenavModule,
        MatFormFieldModule,
        MatCheckboxModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatInputModule,
        MatSelectModule,
        MatSortModule,
        MatIconModule,
        MatCardModule,
        MatSnackBarModule,
        MatMenuModule,
        MatRippleModule,
        MatProgressSpinnerModule,
        MatToolbarModule
    ],
    providers: []
})

export class MaterialModule { }