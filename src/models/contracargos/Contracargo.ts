export interface Contracargo {
    caso: string
    comercio: string
    diasDesdeNotificacion: number
    diasParaCierre: number
    estado: string
    estadoId: number
    marca: string
    marcaId: string
    montoCbk: number
    montoTrx: number
    motivoDesc: string
    motivoId: string
    recepcion: string
    subcomercio: string
}

export interface ContracargoComercio {
    caso: number;
    marcaId: number;
    nombreMarca: string;
    motivoId: string;
    motivoDesc: string;
    etapaId: number;
    etapaDesc: string;
    estado: string;
    estadoId: number;
    recepcion: string;
    diasParaCierre: number;
    montoTrx: string;
    montoCbk: string;
    idMarca: string;
    nombreComercio: string;
  }
  