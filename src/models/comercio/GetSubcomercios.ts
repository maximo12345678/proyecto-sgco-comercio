import { CommonResponseFields, RequiredParams, Sortable } from "../comunes/ApiCommons";
import { Comercio } from "./Comercio";

export interface Subcomercio {
  id: number;
  comercioId: number;
  nombreFantasiaLocal: string;
  montoMinimo: number;
  codigoLocal: string;
}


export interface ParametroGetSubcomercios extends RequiredParams, Sortable {
  comercio_id: number;
  page: number;
  size: number;
  busqueda_avanzada: string;
}

export interface RespuestaGetSubcomercios extends CommonResponseFields{
  comercio: Comercio;
  subcomercios: Subcomercio[];
  totalElements: number;
}
