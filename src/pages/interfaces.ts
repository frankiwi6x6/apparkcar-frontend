export interface Estacionamiento {
    id: number,
    id_dueno: number,
    titulo: string,
    descripcion: string,
    tipo: string,
    direccion: string,
    latitud: number,
    longitud: number,
    precio: number,
    capacidad: number,
    estado: boolean
  }