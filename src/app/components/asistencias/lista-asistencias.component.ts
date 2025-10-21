import { Component, OnInit } from '@angular/core';
import { AsistenciaService } from '../../services/asistencia.service';

@Component({
  selector: 'app-lista-asistencias',
  template: `
  <div class="container">
    <h4>Asistencias</h4>

    <div class="d-flex mb-3">
      <input type="date" class="form-control w-auto" [(ngModel)]="fecha">
      <button class="btn btn-secondary ms-2" (click)="buscar()">Buscar</button>
      <button class="btn btn-success ms-2" (click)="exportar()">Exportar</button>
      <label class="btn btn-outline-primary ms-2">
        Importar <input type="file" hidden (change)="onFile($event)">
      </label>
    </div>

    <table class="table table-striped align-middle">
      <thead>
        <tr>
          <th>ID</th>
          <th>DNI</th>
          <th>Nombre</th>
          <th>Observación</th>
          <th>Respuesta Observación</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let a of asistencias">
          <td>{{ a.id }}</td>
          <td>{{ a.dni }}</td>
          <td>{{ a.apellidosNombres }}</td>
          <td>{{ a.observacion }}</td>
          <td>
            <select 
              class="form-select form-select-sm" 
              [(ngModel)]="a.respuestaObservacion"
              [disabled]="a.enviado">
              <option value="">Seleccione...</option>
              <option value="Indicó generar marcación">Indicó generar marcación</option>
              <option value="Olvidó marcar">Olvidó marcar</option>
              <option value="Trabajador no reportado en planilla">Trabajador no reportado en planilla</option>
              <option value="Ausente">Ausente</option>
            </select>
          </td>
          <td>
            <!-- Botones dinámicos -->
            <button *ngIf="!a.enviado" 
                    class="btn btn-sm btn-primary"
                    (click)="guardarRespuesta(a)">
              Guardar
            </button>

            <button *ngIf="a.enviado" 
                    class="btn btn-sm btn-warning"
                    (click)="editar(a)">
              Editar
            </button>

            <button *ngIf="a.enviado"
                    class="btn btn-sm btn-success"
                    disabled>
              Enviado ✔
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  `
})
export class ListaAsistenciasComponent implements OnInit {
  fecha = new Date().toISOString().slice(0, 10);
  asistencias: any[] = [];
  selectedFile?: File;

  constructor(private svc: AsistenciaService) {}

  ngOnInit() {
    this.buscar();
  }

  buscar() {
    this.svc.listar(this.fecha).subscribe(r => {
      this.asistencias = r.map((a: any) => ({
        ...a,
        respuestaObservacion: a.respuestaObservacion || '',
        enviado: !!a.respuestaObservacion // si ya tiene respuesta, se marca como enviado
      }));
    });
  }

  onFile(e: Event) {
    const fi = (e.target as HTMLInputElement).files;
    if (!fi || fi.length === 0) return;
    const f = fi[0];
    this.svc.importar(f, this.fecha).subscribe({
      next: () => {
        alert('Archivo subido correctamente');
        this.buscar();
      },
      error: () => alert('Error importando')
    });
  }

  exportar() {
    this.svc.exportar(this.fecha).subscribe(
      resp => {
        const contentDisposition = resp.headers.get('content-disposition') || '';
        const matches = /filename="?([^"]+)"?/.exec(contentDisposition);
        const filename = matches ? matches[1] : `reporte_${this.fecha}.xlsx`;
        const blob = new Blob([resp.body as Blob], {
          type: resp.body?.type || 'application/octet-stream'
        });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = filename;
        link.click();
        window.URL.revokeObjectURL(link.href);
      },
      () => alert('Error al exportar')
    );
  }

  guardarRespuesta(a: any) {
    if (!a.respuestaObservacion) {
      alert('Seleccione una respuesta antes de guardar');
      return;
    }

    this.svc.updateRespuestaObservacion(a.id, a.respuestaObservacion).subscribe({
      next: () => {
        a.enviado = true;
        alert('Respuesta guardada correctamente');
      },
      error: () => alert('Error al guardar la respuesta')
    });
  }

  editar(a: any) {
    a.enviado = false;
  }
}

