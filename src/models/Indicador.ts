import { CommonResponseFields, RequiredParams } from "./comunes/ApiCommons";

export interface Indicador {
  id: number;
  nombre: string;
  cantidad: number;
  monto: string;
}

export interface ParametroGetIndicadores extends RequiredParams{
  comercio_id: number;
}

export interface RespuestaIndicadores extends CommonResponseFields {
  indicadores: Indicador[];
}
