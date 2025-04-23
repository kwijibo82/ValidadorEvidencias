import { Component, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
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
    MatCheckboxModule,
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

  @ViewChild('fechaDesdeInput', { static: false }) fechaDesdeInput!: ElementRef<HTMLInputElement>;
  @ViewChild('fechaHastaInput', { static: false }) fechaHastaInput!: ElementRef<HTMLInputElement>;

  selectedFile: File | null = null;
  loading = false;
  result: any = null;
  nombre: string = '';
  PrimerAppellido: string = '';
  SegundoApellido: string | any = null;
  cliente: string = '';
  fechaDesde: Date | null = null;
  fechaHasta: Date | null = null;
  usarFechaSistema: boolean = false;

  constructor(private evidenciaService: EvidenciaService) {}

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  onUpload() {
    if (!this.selectedFile || !this.nombre || !this.cliente || !this.fechaDesde || !this.fechaHasta) return;

    const formData = new FormData();
    formData.append('file', this.selectedFile);
    formData.append('autor_esperado', this.nombre);
    formData.append('cliente_proyecto', this.cliente);
    formData.append('fecha_min', this.fechaDesde.toISOString().split('T')[0]);
    formData.append('fecha_max', this.fechaHasta.toISOString().split('T')[0]);
    formData.append('primer_apellido', this.PrimerAppellido);
    formData.append('segundo_apellido', this.SegundoApellido || '');

    this.loading = true;
    this.result = null;

    // TODO: Borrar console.log en producción
    console.log('Datos a enviar:', {
      autor: this.nombre,
      cliente: this.cliente,
      fecha_min: this.fechaDesde.toISOString().split('T')[0],
      fecha_max: this.fechaHasta.toISOString().split('T')[0],
      primer_apellido: this.PrimerAppellido,
      segundo_apellido: this.SegundoApellido || '',
    });

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

  onUsarFechaSistemaChange() {
    if (this.usarFechaSistema) {
      const currentDate = new Date();
      this.fechaDesde = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      this.fechaHasta = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
      this.fechaDesdeInput.nativeElement.disabled = true;
      this.fechaHastaInput.nativeElement.disabled = true;
    } else {
      this.fechaDesdeInput.nativeElement.disabled = false;
      this.fechaHastaInput.nativeElement.disabled = false;
    }
  }
}
