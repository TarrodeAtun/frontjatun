import { autenticacion } from '../servicios/autenticacion';

export function authHeader() {
    // Retorna la cabecera con el json web token
    const currentUser = autenticacion.currentUserValue; 
    if (currentUser && currentUser.data.token) {
        return { Authorization: `${currentUser.data.token}` };  //si el usuario esta logueado retorna el token generado para utilizar en la cabecera
    } else {
        return {};
    }
}