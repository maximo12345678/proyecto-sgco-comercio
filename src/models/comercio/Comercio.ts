export interface Comercio {
  id: number;
  nombre: string;
  montoMinimo: number;
  tieneSubcomercio: boolean;
  debitoInicial: boolean;
}


export function getDefaultComercio(): Comercio {
    return {
        debitoInicial: false,
        id: 0, 
        montoMinimo: 0,
        nombre: "",
        tieneSubcomercio: false
    }
}
