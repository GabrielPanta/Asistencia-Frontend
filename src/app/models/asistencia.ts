export interface Asistencia {
  id?: number;
  codigo?: string;
  apellidosNombres?: string;
  dni?: string;
  regimen?: string;
  fechaIngreso?: string; // ISO date
  horaIngreso?: string;
  totalHoras?: number;
  zona?: string;
  ruta?: string;
  cuadrilla?: string;
  labor?: string;
  observacion?: string;
  respuestaObservacion?: string;
  fecha?: string; // si usas campo fecha para búsqueda
}
