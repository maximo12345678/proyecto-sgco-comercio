import { CommonResponseFields, RequiredParams } from "./comunes/ApiCommons";

export interface CambioEstado { // Para todos los cambios de estado se enviara este objeto como parametro a la api.
    id: number; // este es el ID del caso al cual se le modificara el estado.
    estado_inicial: number;
    estado_final: number;
    usuario_id: number;
    rol_id: number;
}

export interface CambioEstadoComercio extends RequiredParams{
    id: number; 
}

export interface RespuestaCambioEstadoComercio extends CommonResponseFields{
}
