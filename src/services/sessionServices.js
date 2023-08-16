import { encriptarJwt } from '../utils/criptografia.js';



export async function construirJwt(datosUsuario, options) {
    const jwtoken = encriptarJwt(datosUsuario, options);
    return jwtoken;
}


