export const ApiGetContracargos = {
  production: false,
  apiUrl:
    '${API_GATEWAY}/contracargos/getcontracargos',
};

export const ApiCambioEstado = {
  production: false,
  apiUrl:
    '${API_GATEWAY}/cambioestado',
};

export const ApiGetContracargosComercio = {
  production: false,
  apiUrl:
    '${API_GATEWAY_COMERCIO}/comercio/get',
};

export const ApiContracargoAceptar = {
  production: false,
  apiUrl:
    '${API_GATEWAY_COMERCIO}/comercio/contracargo/aceptar',
};

export const ApiContracargoRechazar = {
  production: false,
  apiUrl:
    '${API_GATEWAY_COMERCIO}/comercio/contracargo/rechazar',
};

export const ApiPostEvicencia = {
  production: false,
  apiUrl:
    '${API_GATEWAY_COMERCIO}/comercio/evidencias/create',
};

export const ApiGetHistorialContracargo = {
  production: false,
  apiUrl: '${API_GATEWAY_COMERCIO}/',
};

export const ApiGetHistorialContracargoBO = {
  production: false,
  apiUrl:
    '${API_GATEWAY}/contracargos/historial/comercio',
};

export const ApiGetIndicadoresBO = {
  production: false,
  apiUrl:
    '${API_GATEWAY}/getindicators/comercio',
};

export const ApiGetSubcomerciosBO = {
  production: false,
  apiUrl:
    '${API_GATEWAY}/comercios/getSubcomercios',
};


export const ApiUpdateSubcomercios = {
  production: false,
  apiUrl:
    '${API_GATEWAY}/comercios/updateSubcomercios',
};


export const ApiPostLogin = {
  production: false,
  apiUrl:
    '${API_GATEWAY_AUTH}/login/comercio',
};

export const ApiKey = {
  key: '${API_KEY_COMERCIO}',
};

export const ApiKeyBO = {
  key: '${API_KEY}',
};

export const ApiKeyAuth = {
  key: '${API_KEY_AUTH}',
};