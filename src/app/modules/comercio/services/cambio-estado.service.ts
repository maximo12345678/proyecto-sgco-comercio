import { Injectable } from '@angular/core';
import {
    ApiContracargoAceptar,
    ApiContracargoRechazar,
    ApiKey
} from 'src/environments/ApisUrls';
import {
    CambioEstadoComercio,
    RespuestaCambioEstadoComercio
} from 'src/models/CambioEstado';
import { ResponseStatus } from 'src/models/comunes/ApiCommons';
import { ApiRequestWrapperService } from '../../comunes/services/api-auth.service';

@Injectable({
  providedIn: 'root',
})
export class CambioEstadoService extends ApiRequestWrapperService{

  async aceptarContracargo(
    params: CambioEstadoComercio
  ): Promise<RespuestaCambioEstadoComercio> {
    const url = ApiContracargoAceptar.apiUrl;
    const apiKey = ApiKey.key;

    let respuestaApi: RespuestaCambioEstadoComercio = {
      message: '',
      status: ResponseStatus.unknown,
    };

    try {
      console.log('aceptando contracargo...');
      const { data, apiError } = await this.fetchPost(url, apiKey, params);
      if (apiError) {
        return { ...respuestaApi, ...apiError };
      }
      respuestaApi = { ...data.body, statusCode: data.statusCode };
      console.log('Respuesta API: ', respuestaApi);
    } catch (error) {
      respuestaApi.message = String(error);
      console.error('Error:', error);
    }
    return respuestaApi;
  }

  async rechazarContracargo(
    params: CambioEstadoComercio
  ): Promise<RespuestaCambioEstadoComercio> {
    const url = ApiContracargoRechazar.apiUrl;
    const apiKey = ApiKey.key;

    let respuestaApi: RespuestaCambioEstadoComercio = {
      message: '',
      status: ResponseStatus.unknown,
    };

    try {
      console.log('Cambiando el estado del contracargo...');
      const { data, apiError } = await this.fetchPost(url, apiKey, params);
      if (apiError) {
        return { ...respuestaApi, ...apiError };
      }
      respuestaApi = { message: data.body.message, status: data.statusCode };
      console.log('Respuesta API: ', respuestaApi);
    } catch (error) {
      respuestaApi.message = String(error);
      console.error('Error:', error);
    }
    return respuestaApi;
  }
}
