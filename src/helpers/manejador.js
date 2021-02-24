import { autenticacion } from '../servicios/autenticacion';

export function handleResponse(response) { //recibe un response el cual puede ser un error o una respuesta normal
    console.log(response);
    if (!response.data.ok) { //procesa el estado de la variable ok enviada en el json de respuesta
        if ([401, 403].indexOf(response.status) !== -1) { //si el estado de la peticion es 401 o 403, elimina la sesion de usuario y lo redirecciona al login
            // se desloguea si ocurre un error 401 o 403
            autenticacion.cerrarSesion();
            window.location.reload(true);
        }
        if ([400].indexOf(response.status) !== -1){
            autenticacion.cerrarSesion();
        }
        const error = response; //si ocurre otro error lo almacena 
        // return Promise.reject(error);  //rechaza la promesa con los datos del error
    } 
    return response;  // en el caso de que no haya error retorna al respuesta de la promesa.
}