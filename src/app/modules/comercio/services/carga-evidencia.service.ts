import { Injectable } from '@angular/core';
import { ApiKey, ApiPostEvicencia } from 'src/environments/ApisUrls';
import { ParametroPostEvidencia, RespuestaPostEvidencia } from 'src/models/Evidencia';
import { ResponseStatus } from 'src/models/comunes/ApiCommons';
import { ApiRequestWrapperService } from '../../comunes/services/api-auth.service';


@Injectable({ 
  providedIn: 'root'
})

export class CreateEvidenciaService extends ApiRequestWrapperService {

  async createEvidence(params: ParametroPostEvidencia ): Promise<RespuestaPostEvidencia> {

    const url = ApiPostEvicencia.apiUrl;
    const apiKey = ApiKey.key;

    let respuestaApi: RespuestaPostEvidencia = {
      message: "",
      status: ResponseStatus.unknown,
      file_key: "",
    };

    try {

      const { data, apiError } = await this.fetchPost(url, apiKey, params);
      if (apiError) {
        return { ...respuestaApi, ...apiError };
      }
      respuestaApi.status = data.statusCode;
      respuestaApi.message = data.body.message ?? data.body.message_code;
      respuestaApi.file_key = data.body.file_key;
      console.log('Respuesta API subida JSON: ', respuestaApi);
      
    } catch (error) {
      console.error('Error:', error);
    }

    return respuestaApi;
  }
}
