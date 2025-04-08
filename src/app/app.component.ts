import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { UploadComponent } from './upload/upload.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
        UploadComponent
  ],
  template: `
    <mat-toolbar color="primary">Validación de Evidencias</mat-toolbar>
    <div class="main-container">
      <app-upload></app-upload>
    </div>
  `,
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {}
