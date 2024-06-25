import { CommonResponseFields, RequiredParams } from "../comunes/ApiCommons";
import { HistorialContracargo } from "./HistorialContracargo";

export interface GetHistorialContracargo extends RequiredParams {
    contracargo_id: string;
}


export interface RespuestaGetHistorialContracargo extends CommonResponseFields {
    historial: HistorialContracargo[];
}