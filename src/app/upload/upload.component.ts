import { Component, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, Validators, ReactiveFormsModule  } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { EvidenciaService } from '../evidencia.service';
import { ModalValidateComponent } from '../upload/modal-validate/modal-validate.component';

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
    MatNativeDateModule,
    MatDialogModule,
    ReactiveFormsModule
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

  uploadForm = new FormGroup({
    nombre: new FormControl(null, Validators.required),
    primerAppellido: new FormControl(null, Validators.required),
    segundoApellido: new FormControl(''),
    cliente: new FormControl(null, Validators.required),
    fechaDesde: new FormControl(new Date(), Validators.required),
    fechaHasta: new FormControl(new Date(), Validators.required),
    file: new FormControl(null, Validators.required)
  });

  constructor(
    private evidenciaService: EvidenciaService,
    private dialog: MatDialog
  ) {}

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  onUpload() {
    //if (!this.selectedFile || !this.nombre || !this.cliente || !this.fechaDesde || !this.fechaHasta) return;

    // const formData = new FormData();
    // formData.append('file', this.selectedFile);
    // formData.append('autor_esperado', this.nombre);
    // formData.append('cliente_proyecto', this.cliente);
    // formData.append('fecha_min', this.fechaDesde.toISOString().split('T')[0]);
    // formData.append('fecha_max', this.fechaHasta.toISOString().split('T')[0]);
    // formData.append('primer_apellido', this.PrimerAppellido);
    // formData.append('segundo_apellido', this.SegundoApellido || '');

    this.loading = true;
    this.result = null;

    // TODO: Borrar console.log en producción
    // console.log('Datos a enviar:', {
    //   autor: this.nombre,
    //   cliente: this.cliente,
    //   fecha_min: this.fechaDesde.toISOString().split('T')[0],
    //   fecha_max: this.fechaHasta.toISOString().split('T')[0],
    //   primer_apellido: this.PrimerAppellido,
    //   segundo_apellido: this.SegundoApellido || '',
    // });

    const formulario = { ...this.uploadForm.value };
    this.evidenciaService.enviarEvidencia(formulario).subscribe({
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

  onUsarFechaSistemaChange(event: MatCheckboxChange) {

    if (event.checked) {
      const currentDate = new Date();
      const fechaDesde = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const fechaHasta = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
      this.uploadForm.controls.fechaDesde.setValue(fechaDesde);
      this.uploadForm.controls.fechaHasta.setValue(fechaHasta);
      this.uploadForm.get('fechaDesde')?.disable();
      this.uploadForm.get('fechaHasta')?.disable();
      // this.fechaDesdeInput.nativeElement.disabled = true;
      // this.fechaHastaInput.nativeElement.disabled = true;
    } else {
      this.uploadForm.get('fechaDesde')?.enable();
      this.uploadForm.get('fechaHasta')?.enable();
    }
  }

  openModalValidations(): void {
    const autor = "fonde"
    const proyecto = "valora"
    const fecha = "12/06/2025"
    const htmlValidation =
      `<p><strong>Autor:</strong> ${autor}</p>
      <p><strong>Cliente:</strong> ${proyecto}</p>
      <p><strong>Fecha:</strong> ${fecha}</p>`;

    const dialogRef = this.dialog.open(ModalValidateComponent, {
      width: '400px',
      height:'250px',
      data: {
        message: htmlValidation
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Modal cerrado. Resultado:', result);
    });
  }
}
