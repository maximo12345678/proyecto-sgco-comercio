import {
  CommonResponseFields,
  RequiredParams,
  ResponseStatus,
  Sortable,
} from '../comunes/ApiCommons';
import { Contracargo, ContracargoComercio } from './Contracargo';

export interface GetContracargo {
  marcas: number[];
  estados: number[];
  etapas: number[];
  fecha_desde: string;
  fecha_hasta: string;
  page: number;
}

export interface GetContracargoComercio extends RequiredParams, Sortable {
  marcas: number[];
  estados: number[];
  etapas: number[];
  fecha_desde: string;
  fecha_hasta: string;
    rut_comercio: string;
  page: number;
  page_size?: number;
  busqueda_avanzada: string;
  ultimos_dias?: number;
}

export interface RespuestaContracargos {
  contracargos: Contracargo[];
  curPage: number;
  message: string;
  pageSize: number;
  total: number;
}

export interface RespuestaContracargosComercio extends CommonResponseFields {
  contracargos: ContracargoComercio[];
  curPage: number;
  pageSize: number;
  totalPages: number;
  total: number;
}

const defaultRespuestaContracargos: RespuestaContracargosComercio = {
  contracargos: [],
  curPage: 0,
  message: '',
  pageSize: 0,
  total: 0,
  totalPages: 0,
  status: ResponseStatus.unknown,
};

export function getDefaultRespuestaContracargos(): RespuestaContracargosComercio {
  return defaultRespuestaContracargos;
}
