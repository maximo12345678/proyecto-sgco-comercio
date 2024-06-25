import { Injectable } from '@angular/core';
import { ApiKeyAuth, ApiPostLogin } from 'src/environments/ApisUrls';
import {
  ParametroPostLogin,
  RespuestaPostLogin,
  getDefaultAuthData,
} from 'src/models/login/Login';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  async login(
    params: ParametroPostLogin
  ): Promise<RespuestaPostLogin> {
    const url = ApiPostLogin.apiUrl;
    const apiKey = ApiKeyAuth.key;

    let respuestaApi: RespuestaPostLogin = {
      message: '',
      status: '',
      auth: getDefaultAuthData(),
    };

    console.log("logeando...", params);

    try {
      const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(params),
        headers: {
          'x-api-key': apiKey,
        },
      });
      const data = await response.json();
      const statusCode = response.status;

      if (statusCode !== 200 || !data.body) {
        respuestaApi.message = data.message ?? 'Error desconocido.';
        return respuestaApi;
      }

      respuestaApi.status = data.statusCode;
      respuestaApi.message = data.body.message ?? data.body.message_code;
      respuestaApi.auth = data.body.auth;
      console.log('Respuesta API subida JSON: ', respuestaApi);
    } catch (error) {
      console.error('Error:', error);
    }

    return respuestaApi;
  }

  tokenExpired(idToken: string){
      const decoded = jwtDecode(idToken);
      if (!decoded || !decoded.exp){
        return true;
      }
      const expiration: number = decoded.exp;
      const currentTime: number = Math.floor(Date.now() / 1000); // Current time in seconds
      const hasExpired: boolean = expiration < currentTime;
      console.log('Token has expired:', hasExpired);
      return hasExpired;
  }

  constructor() {}
}
