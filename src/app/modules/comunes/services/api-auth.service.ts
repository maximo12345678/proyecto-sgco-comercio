import { Injectable } from '@angular/core';
import { VariablesGlobalesService } from './variables-globales.service';
import { LoginService } from '../../comercio/services/login.service';
import { ApiAuthData, ResponseStatus } from 'src/models/comunes/ApiCommons';
import { Usuario } from 'src/models/Usuario';

@Injectable({
  providedIn: 'root',
})
export class ApiRequestWrapperService {
  constructor(
    private variablesGlobales: VariablesGlobalesService,
    private loginService: LoginService
  ) {}

  private refreshLock: Promise<ApiAuthData> | null = null;

  async getAuthParams(): Promise<ApiAuthData> {
    if (this.refreshLock) {
      await this.refreshLock;
    }

    let { status, usuario } = this.variablesGlobales.getUsuarioStorage();
    if (!status || !usuario) {
      return { usuario_id: 0, rol_id: 0, id_token: '' };
    }

    let { usuario_id, rol_id, id_token } = usuario;
    if (!this.loginService.tokenExpired(id_token)) {
      return { usuario_id: 122, rol_id: 4, id_token: usuario.id_token };
    //   return { usuario_id, rol_id, id_token };
    }
    
    this.refreshLock = this.refreshTokenAndResetLock(usuario);
    try {
      const updatedUsuario = await this.refreshLock;
      return { ...updatedUsuario };
    } finally {
      this.refreshLock = null;
    }
  }

  private async refreshTokenAndResetLock(
    usuario: Usuario
  ): Promise<ApiAuthData> {
    await this.variablesGlobales.loginAndSaveData();
    let { status, usuario:updatedUsuario } = this.variablesGlobales.getUsuarioStorage();
    return updatedUsuario;
  }

  handleUnauthorized() {
    try {
      let respuestaDeletetStorage =
        this.variablesGlobales.deleteUsuarioStorage();
      if (respuestaDeletetStorage.status) {
        location.reload();
      }
    } catch (error) {
      let msj = 'Por alguna razon no se puede cerrar sesion!';
      console.error(msj + ': ' + error);
    }
  }

  async fetchGet(baseUrl: string, apiKey: string, queryParams: string) {
    const { usuario_id, id_token, rol_id } = await this.getAuthParams();
    const authParams = { usuario_id, rol_id };
    const authParamsStr = new URLSearchParams(Object(authParams)).toString();
    let fullUrl = '';
    if (queryParams) {
      fullUrl = `${baseUrl}?${queryParams}&${authParamsStr}`;
    } else {
      fullUrl = `${baseUrl}?${authParamsStr}`;
    }
    
    const response = await fetch(fullUrl, {
      method: 'GET',
      headers: {
        'x-api-key': apiKey,
        Authorization: id_token,
      },
    });
    return this.processResponse(response);
  }

  async fetchPut(url: string, apiKey: string, params: Object) {
    const { usuario_id, id_token, rol_id } = await this.getAuthParams();
    params = { ...params, usuario_id, rol_id };
    const response = await fetch(url, {
      method: 'PUT',
      body: JSON.stringify(params),
      headers: {
        'x-api-key': apiKey,
        Authorization: id_token,
      },
    });
    return this.processResponse(response);
  }

  async fetchPost(url: string, apiKey: string, params: Object) {
    const { usuario_id, id_token, rol_id } = await this.getAuthParams();
    params = { ...params, usuario_id, rol_id };
    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(params),
      headers: {
        'x-api-key': apiKey,
        Authorization: id_token,
      },
    });
    return this.processResponse(response);
  }

  private async processResponse(response: Response) {
    let apiError = undefined;
    const data = await response.json();
    const statusCode = response.status;
    if (statusCode === 401) {
      this.handleUnauthorized();
      let message =
        data.message ?? data.errorMessage ?? 'Error de Autorizacion';
      apiError = { message, status: ResponseStatus.authorizationError };
    }
    if (statusCode !== 200 || !data.body) {
      let message =
        data.message ?? data.errorMessage ?? data.error ?? 'Error desconocido.';
      apiError = { message, status: ResponseStatus.unknownError };
    }
    return { data, apiError, statusCode };
  }
}
