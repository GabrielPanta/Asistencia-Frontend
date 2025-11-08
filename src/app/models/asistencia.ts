export interface Asistencia {
  id?: number;
  empresaTrabajador?:string
  codigo?: string;
  apellidosNombres?: string;
  dni?: string;
  regimen?: string;
  fechaIngreso?: string;
  horaIngreso?: string;
  totalHoras?: string;
  zona?: string;
  ruta?: string;
  cuadrilla?: string;
  labor?: string;
  observacion?: string;
  respuestaObservacion?: string;
  fecha?: string; // si usas campo fecha para búsqueda
}
