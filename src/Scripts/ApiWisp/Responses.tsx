export const ErrorConnection = {
    code: 1,
    cause: 'Ocurrió un error de conexion.',
    showLoading: false
};
export const ErrorCode = {
    code: 2,
    cause: 'Ocurrió un error inesperado.',
    showLoading: false
};
export const ErrorSession = {
    code: 3,
    cause: 'Ocurrió un error al intentar iniciar sesión.',
    showLoading: false,
    relogin: false
};
export const ErrorVerifyLogin = {
    code: 4,
    cause: 'Inicie sesión por favor.',
    showLoading: true,
    relogin: true
};
export const ErrorStorage = {
    code: 5,
    cause: 'Error al acceder a los datos guardados.',
    showLoading: false
};