import { BehaviorSubject } from 'rxjs';
// import { handleResponse } from '../helpers/manejador';

import Axios  from '../helpers/axiosconf';

if (localStorage.getItem('usuarioActual') == 'undefined' || localStorage.getItem('usuarioActual') == null) { //comprueba si la variable esta definida o si esta vacia
    localStorage.removeItem('usuarioActual'); //en ese caso eliminamos la variable
} else {
    // console.log(localStorage.getItem('usuarioActual'));
}

var currentUserSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('usuarioActual')));

export var autenticacion = {
    login,
    cerrarSesion,
    actualizar,
    currentUser: currentUserSubject.asObservable(),
    get currentUserValue() { 
        return currentUserSubject.value 
    }
};

async function login(rut, password) {
    var mensaje = "";
    await Axios.post('/api/login', { rut, password })
        .then(usuario => {
            console.log(usuario);
            localStorage.setItem('usuarioActual', JSON.stringify(usuario));
            currentUserSubject.next(usuario);
        })
        .catch(err =>{
            mensaje = err.response.data.err.message;
            return err;
        });
    return mensaje;
}
async function actualizar() {
    currentUserSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('usuarioActual')));
    this.currentUser = currentUserSubject.asObservable();
}


function cerrarSesion() {
    // Elimina los datos del usuario del local storage, al refrescar la pagina y no existir datos se redireccionara al login
    localStorage.removeItem('usuarioActual');
    currentUserSubject.next(null);
}