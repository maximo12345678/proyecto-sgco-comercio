import { Injectable } from '@angular/core';
import { Usuario } from 'src/models/Usuario';
import { CommerceData } from 'src/models/comunes/LocalStorageData';
import { LoginService } from '../../comercio/services/login.service';
import { ParametroPostLogin } from 'src/models/login/Login';

@Injectable({
  providedIn: 'root',
})
export class VariablesGlobalesService {
  private initialized: boolean = false;
  private readonly TEMP_RUT_COMERCIO = '76923783-6'

  constructor(private loginService: LoginService) {}

  async init(): Promise<void> {
    if (!this.initialized) {
      let {status, usuario} = this.getUsuarioStorage();
      if (status && usuario.rol_id && !this.loginService.tokenExpired(usuario.id_token)) {
        console.log('found valid user data in localstorage!', usuario);
        this.initialized = true;
        return;
      }
      await this.loginAndSaveData();
      this.initialized = true;
    }
  }



  async loginAndSaveData(): Promise<boolean> {
    console.log('login and save data...');
    let commerceInfo = this.getCommerceInfo();
    // let paramsLogin: ParametroPostLogin = {
    //   email: commerceInfo.email,
    //   rut_comercio: commerceInfo.commerce_rut,
    //   nombre: commerceInfo.first_name + ' ' + commerceInfo.last_name,
    //   nombre_fantasia: commerceInfo.fantasy_name,
    //   rut_usuario: commerceInfo.rut,
    // };
    let paramsLogin: ParametroPostLogin = {
      email: 'jvasquez@bst.cl',
      nombre: 'José',
      rut_usuario: '1-9',
      nombre_fantasia: 'nombre_fantasia',
      rut_comercio: '76923783-6',
    };
    let response = await this.loginService.login(paramsLogin);
    console.log('respuesta login', response);
    if (response.status !== 'OK') {
      console.error('error al iniciar sesion! ', response);
      return false;
    }
    let userData = {
      ...response.auth,
      email: commerceInfo.email,
    //   rut_comercio: commerceInfo.commerce_rut,
      rut_comercio: this.TEMP_RUT_COMERCIO,
    };
    console.log('variables globales init', userData);
    this.setUsuarioStorage(userData);
    return true;
  }

  private usuario: Usuario = {
    nombre_fantasia: '',
    email: '',
    id_token: '',
    usuario_id: 0,
    rol_id: 0,
    comercio_id: 0,
    rut_comercio: '',
  };
  getCommerceInfo() {
    const commerceInfoStr = sessionStorage.getItem('commerce_info') ?? '{}';
    const commerceInfo: CommerceData = JSON.parse(commerceInfoStr);
    console.log('comerceInfo parseado', commerceInfo);
    return commerceInfo;
  }

  // Método para establecer el ID Token y el ID Usuario después de un inicio de sesión exitoso
  setUsuarioStorage(usuarioParametro: Usuario) {
    let respuesta: { status: boolean; usuario: Usuario } = {
      status: false,
      usuario: {
        nombre_fantasia: '',
        email: '',
        id_token: '',
        usuario_id: 0,
        rol_id: 0,
        comercio_id: 0,
        rut_comercio: '',
      },
    };

    this.usuario = {
      nombre_fantasia: usuarioParametro.nombre_fantasia,
      email: usuarioParametro.email,
      id_token: usuarioParametro.id_token,
      usuario_id: usuarioParametro.usuario_id,
      rol_id: usuarioParametro.rol_id,
      comercio_id: usuarioParametro.comercio_id,
      rut_comercio: usuarioParametro.rut_comercio,
    };

    try {
      localStorage.setItem('usuario', JSON.stringify(this.usuario));
      respuesta.status = true;
      respuesta.usuario = this.usuario;
    } catch (error) {
      console.error('Error al cargar datos en storage:', error);
    }

    return respuesta;
  }

  // Método para obtener el ID Token
  getUsuarioStorage() {
    let respuesta: { status: boolean; usuario: Usuario } = {
      status: false,
      usuario: {
        nombre_fantasia: '',
        email: '',
        id_token: '',
        usuario_id: 0,
        rol_id: 0,
        comercio_id: 0,
        rut_comercio: '',
      },
    };

    try {
      const usuarioEnLocalStorage = localStorage.getItem('usuario');

      if (usuarioEnLocalStorage) {
        // Si hay un usuario en el localStorage
        respuesta.status = true;
        let lsUser: Usuario = JSON.parse(
          usuarioEnLocalStorage,
          function (k, v) {
            return typeof v === 'object' || isNaN(v) ? v : parseInt(v, 10);
          }
        );
        respuesta.usuario = lsUser;
      }
    } catch (error) {
      console.error('Error al traer datos en storage: ', error);
    }

    return respuesta;
  }

  deleteUsuarioStorage() {
    let respuesta: { status: boolean; usuario: Usuario } = {
      status: false,
      usuario: {
        nombre_fantasia: '',
        email: '',
        id_token: '',
        usuario_id: 0,
        rol_id: 0,
        comercio_id: 0,
        rut_comercio: '',
      },
    };

    try {
      const usuarioEnLocalStorage = localStorage.getItem('usuario');

      if (usuarioEnLocalStorage) {
        // Si hay un usuario en el localStorage

        const eliminarUsuario = localStorage.removeItem('usuario');

        respuesta.status = true;
        respuesta.usuario = {
          nombre_fantasia: '',
          email: '',
          id_token: '',
          usuario_id: 0,
          rol_id: 0,
          comercio_id: 0,
          rut_comercio: '',
        };
      }
    } catch (error) {
      console.error('Error al eliminar datos en storage: ', error);
    }

    return respuesta;
  }
}
