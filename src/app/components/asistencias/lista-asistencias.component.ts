import { Component, OnInit } from '@angular/core';
import { AsistenciaService } from '../../services/asistencia.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-lista-asistencias',
  templateUrl: './lista-asistencias.component.html',
  styleUrls: ['./lista-asistencias.component.scss']
})
export class ListaAsistenciasComponent implements OnInit {
  fecha = new Date().toISOString().slice(0, 10);
  asistencias: any[] = [];
  asistenciasFiltradas: any[] = [];
  observacionesUnicas: string[] = [];
  filtroObservacion = '';
  username: string | null = '';
  role: string | null = '';

  constructor(
    private svc: AsistenciaService,
    private auth: AuthService
  ) {}

  ngOnInit() {
    this.username = this.auth.getUsernameFromToken();
    this.role = this.auth.getRole();
    this.buscar();
  }

  logout() {
    this.auth.logout();
    window.location.href = '/login';
  }

  buscar() {
    this.svc.listar(this.fecha).subscribe(r => {
      this.asistencias = r.map((a: any) => ({
        ...a,
        respuestaObservacion: a.respuestaObservacion || '',
        enviado: !!a.respuestaObservacion
      }));
      this.asistenciasFiltradas = [...this.asistencias];
      this.obtenerObservacionesUnicas();
    });
  }

  obtenerObservacionesUnicas() {
    const obsSet = new Set(this.asistencias.map(a => a.observacion).filter(Boolean));
    this.observacionesUnicas = Array.from(obsSet);
  }

  filtrarObservacion() {
    if (!this.filtroObservacion) {
      this.asistenciasFiltradas = [...this.asistencias];
    } else {
      this.asistenciasFiltradas = this.asistencias.filter(a => a.observacion === this.filtroObservacion);
    }
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




