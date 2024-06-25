import { Injectable } from '@angular/core';
import {
  ApiGetHistorialContracargoBO,
  ApiKeyBO,
} from 'src/environments/ApisUrls';
import { ResponseStatus } from 'src/models/comunes/ApiCommons';
import {
  GetHistorialContracargo,
  RespuestaGetHistorialContracargo,
} from 'src/models/contracargos/GetHistorialContracargo';
import { ApiRequestWrapperService } from '../../comunes/services/api-auth.service';


@Injectable({
  providedIn: 'root',
})
export class HistorialContracargoService extends ApiRequestWrapperService {
  async getHistorial(
    params: GetHistorialContracargo
  ): Promise<RespuestaGetHistorialContracargo> {
    const url = ApiGetHistorialContracargoBO.apiUrl;
    const apiKey = ApiKeyBO.key;

    let respuestaApi: RespuestaGetHistorialContracargo = {
      historial: [],
      message: '',
      status: ResponseStatus.unknown,
    };

    const filteredParams = Object.fromEntries(
      Object.entries(params).filter(
        ([_, value]) => value !== null && value !== undefined
      )
    );
    const urlParams = new URLSearchParams(filteredParams).toString();
    try {
      const { data, apiError } = await this.fetchGet(url, apiKey, urlParams);
      if (apiError) {
        return { ...respuestaApi, ...apiError };
      }
      respuestaApi = {
        historial: data.body.historialContracargos,
        message: data.body.message || data.body.mensaje,
        status: data.statusCode,
      };
      console.log('Respuesta API parseada: ', respuestaApi);
    } catch (error) {
      console.error('Error:', error);
      respuestaApi.message = String(error);
    }
    return respuestaApi;
  }
}
