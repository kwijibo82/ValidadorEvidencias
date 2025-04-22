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
    formData.append('autor', this.nombre);
    formData.append('cliente', this.cliente);
    formData.append('fecha_desde', this.fechaDesde.toISOString());
    formData.append('fecha_hasta', this.fechaHasta.toISOString());
    formData.append('primer_apellido', this.PrimerAppellido);
    formData.append('segundo_apellido', this.SegundoApellido || null);

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

  onUsarFechaSistemaChange() {
    if (this.usarFechaSistema) {
      const currentDate = new Date();
      this.fechaDesde = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      this.fechaHasta = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
      this.fechaDesdeInput.nativeElement.disabled = true;
      this.fechaHastaInput.nativeElement.disabled = true;

    }
    else {
      this.fechaDesdeInput.nativeElement.disabled = false;
      this.fechaHastaInput.nativeElement.disabled = false;
    }
  }
}


// const primerDiaDelMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
 
// const fechaActual = new Date();
// const ultimoDiaDelMes = new Date(fechaActual.getFullYear(), fechaActual.getMonth() + 1, 0).getDate();
// console.log(ultimoDiaDelMes); // Output: 30 (para Abril)
 