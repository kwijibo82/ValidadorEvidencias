import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { EvidenciaService } from '../evidencia.service';


@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss'],
})
export class UploadComponent {
  selectedFile: File | null = null;
  loading = false;
  result: any = null;
  nombre = '';
  cliente = '';
  fechaDesde: Date | null = null;
  fechaHasta: Date | null = null;

  constructor(private evidenciaService: EvidenciaService) {}

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  onUpload() {
    if (!this.selectedFile || !this.nombre || !this.cliente || !this.fechaDesde || !this.fechaHasta) return;

    const formData = new FormData();
    formData.append('file', this.selectedFile);
    formData.append('autor', this.nombre);
    formData.append('cliente', this.cliente);
    formData.append('fecha_desde', this.fechaDesde.toISOString());
    formData.append('fecha_hasta', this.fechaHasta.toISOString());

    this.loading = true;
    this.result = null;

    this.evidenciaService.enviarEvidencia(formData).subscribe({
      next: (res) => {
        this.result = res;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        alert('Hubo un error al enviar los datos.');
      },
    });
  }
}
