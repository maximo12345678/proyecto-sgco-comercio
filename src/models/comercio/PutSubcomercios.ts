import { CommonResponseFields, RequiredParams } from "../comunes/ApiCommons";

export interface ParametroPutSubcomercios extends RequiredParams{
  subcomercio_ids: number[];
  montos_minimos: number[];
}

export interface RespuestaPutSubcomercios extends CommonResponseFields {
}