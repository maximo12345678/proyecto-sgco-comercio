import { Injectable } from '@angular/core';
import { ApiGetIndicadoresBO, ApiKeyBO } from 'src/environments/ApisUrls';
import {
  Indicador,
  ParametroGetIndicadores,
  RespuestaIndicadores,
} from 'src/models/Indicador';
import { ResponseStatus } from 'src/models/comunes/ApiCommons';
import { ApiRequestWrapperService } from '../../comunes/services/api-auth.service';

@Injectable({
  providedIn: 'root',
})
export class IndicadoresService extends ApiRequestWrapperService {
  async getIndicadores(
    params: ParametroGetIndicadores
  ): Promise<RespuestaIndicadores> {
    const url = ApiGetIndicadoresBO.apiUrl;
    const apiKey = ApiKeyBO.key;

    const urlParams = new URLSearchParams(Object(params)).toString();
    let respuestaApi: RespuestaIndicadores = {
      indicadores: [],
      message: '',
      status: ResponseStatus.unknown,
    };

    try {
      const { data, apiError } = await this.fetchGet(url, apiKey, urlParams);
      if (apiError) {
        return { ...respuestaApi, ...apiError };
      }
      respuestaApi = {
        status: data.statusCode,
        message: '',
        indicadores: data.body.indicadores.detalles,
      };

      console.log(
        'Respuesta API parseada indicadores comercio: ',
        respuestaApi
      );
    } catch (error) {
      console.error('Error:', error);
    }
    return respuestaApi;
  }
}
