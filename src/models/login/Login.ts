export interface AuthData{
    access_token: string;
    refresh_token: string;
    id_token: string;
    usuario_id: number;
    comercio_id: number;
    rol_id: number;
    nombre_fantasia: string;
}
export interface ParametroPostLogin{
    email: string;
    nombre: string;
    rut_usuario: string;
    rut_comercio: string;
    nombre_fantasia: string;
}


export interface RespuestaPostLogin{
      message: string,
      status: string,
      auth: AuthData
}

export function getDefaultAuthData(): AuthData {
    let data:AuthData  =  {
        access_token: "",
        refresh_token: "",
        id_token: "",
        usuario_id: 0,
        comercio_id: 0,
        rol_id: 0,
        nombre_fantasia: ""
    }
    return data
    
}