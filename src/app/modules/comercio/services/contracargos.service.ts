import { Injectable } from '@angular/core';
import { ApiGetContracargosComercio, ApiKey } from 'src/environments/ApisUrls';
import {
  GetContracargoComercio,
  RespuestaContracargosComercio,
  getDefaultRespuestaContracargos,
} from 'src/models/contracargos/GetContracargo';
import { ApiRequestWrapperService } from '../../comunes/services/api-auth.service';
import { ResponseStatus } from 'src/models/comunes/ApiCommons';

@Injectable({
  providedIn: 'root',
})
export class ContracargosService extends ApiRequestWrapperService {
  async getContracargos(
    params: GetContracargoComercio
  ): Promise<RespuestaContracargosComercio> {
    const url = ApiGetContracargosComercio.apiUrl;
    const apiKey = ApiKey.key;

    // return sampleResponse;
    const filteredParams = Object.fromEntries(
      Object.entries(params).filter(
        ([_, value]) => value !== null && value !== undefined
      )
    );
    const urlParams = new URLSearchParams(filteredParams).toString();

    let respuestaApi = getDefaultRespuestaContracargos();

    try {
      const { data, apiError } = await this.fetchGet(url, apiKey, urlParams);
      if (apiError) {
        return { ...respuestaApi, ...apiError };
      }
      respuestaApi = data.body;
      respuestaApi.status = data.statusCode;
    } catch (error) {
      console.error('Error:', error);
    }
    return respuestaApi;
  }
}
