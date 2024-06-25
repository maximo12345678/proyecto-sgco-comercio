import { Injectable } from '@angular/core';
import {
  ApiGetSubcomerciosBO,
  ApiKeyBO,
  ApiUpdateSubcomercios,
} from 'src/environments/ApisUrls';
import { getDefaultComercio } from 'src/models/comercio/Comercio';
import {
  ParametroGetSubcomercios,
  RespuestaGetSubcomercios,
} from 'src/models/comercio/GetSubcomercios';
import {
  ParametroPutSubcomercios,
  RespuestaPutSubcomercios,
} from 'src/models/comercio/PutSubcomercios';
import { ResponseStatus } from 'src/models/comunes/ApiCommons';
import { ApiRequestWrapperService } from '../../comunes/services/api-auth.service';

@Injectable({
  providedIn: 'root',
})
export class SubcomerciosService extends ApiRequestWrapperService {
  async getSubcomercios(
    params: ParametroGetSubcomercios
  ): Promise<RespuestaGetSubcomercios> {
    const url = ApiGetSubcomerciosBO.apiUrl;
    const apiKey = ApiKeyBO.key;

    const urlParams = new URLSearchParams(Object(params)).toString();

    let respuestaApi: RespuestaGetSubcomercios = {
      comercio: getDefaultComercio(),
      message: '',
      status: ResponseStatus.unknown,
      subcomercios: [],
      totalElements: 0,
    };

    try {

      const { data, apiError } = await this.fetchGet(url, apiKey, urlParams);
      if (apiError) {
        return { ...respuestaApi, ...apiError };
      }
      respuestaApi = {
        comercio: data.body['Comercios'],
        subcomercios: data.body['Subcomercios'].content,
        message: '',
        status: data.statusCode,
        totalElements: data.body['Subcomercios'].totalElements,
      };

      console.log('Respuesta API parseada: ', respuestaApi);
    } catch (error) {
      console.error('Error:', error);
    }
    return respuestaApi;
  }

  async updateSubcomercios(
    params: ParametroPutSubcomercios
  ): Promise<RespuestaPutSubcomercios> {
    const url = ApiUpdateSubcomercios.apiUrl;
    const apiKey = ApiKeyBO.key;

    let respuestaApi: RespuestaPutSubcomercios = {
      message: '',
      status: ResponseStatus.unknown,
    };

    try {
      const { data, apiError } = await this.fetchPost(url, apiKey, params);
      if (apiError) {
        return { ...respuestaApi, ...apiError };
      }
      respuestaApi = {
        status: data.statusCode,
        message: data.body.message,
      };
      console.log('Respuesta API parseada: ', respuestaApi);
    } catch (error) {
      console.error('Error:', error);
    }
    return respuestaApi;
  }
}