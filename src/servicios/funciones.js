
import Axios from '../helpers/axiosconf';
import { authHeader } from '../helpers/auth-header';
import { handleResponse } from '../helpers/manejador';

export var funciones = {
    formatearRut,
    quitarFormato,
    getRutFormateado,
    verificaRut,
    getDV,
    validarEmail,
    nombreDia,
    nombreMes,
    paginacion,
    obtenerRutaServidor,
    obtenerRutaMedios,
    obtenerRutaUsuarios,
    obtenerClientes,
    obtenerSectores,
    obtenerRutaPlanes,
    obtenerServicios,
    obtenerTiposTurno,
    obtenerTodosTrabajadores,
    obtenerTrabajadores,
    obtenerJefesCuadrilla,
    obtenerConductores,
    obtenerPatentesVehiculos,
    obtenerOrdenesRetiroAsignado,
    obtenerCentrosCostos

};

async function formatearRut(rutCrudo, dv) {
    var sRut = new String(rutCrudo);
    var sRutFormateado = '';
    sRut = quitarFormato(sRut);
    if (dv) {
        var sDV = sRut.charAt(sRut.length - 1);
        sRut = sRut.substring(0, sRut.length - 1);
    }
    while (sRut.length > 3) {
        sRutFormateado = "." + sRut.substr(sRut.length - 3) + sRutFormateado;
        sRut = sRut.substring(0, sRut.length - 3);
    }
    sRutFormateado = sRut + sRutFormateado;
    if (sRutFormateado != "" && dv) {
        sRutFormateado += "-" + sDV;
    }
    else if (dv) {
        sRutFormateado += sDV;
    }

    return sRutFormateado;
}
function quitarFormato(rutCrudo) {
    var strRut = new String(rutCrudo);
    while (strRut.indexOf(".") != -1) {
        strRut = strRut.replace(".", "");
    }
    while (strRut.indexOf("-") != -1) {
        strRut = strRut.replace("-", "");
    }
    return strRut;
}



function verificaRut(rutCompleto) {
    console.log(rutCompleto);
    var tmp = rutCompleto.split('-');
    var digv = tmp[1];
    var rut = quitarFormato(tmp[0]);
    console.log(tmp);
    console.log(rut);
    console.log(digv);
    console.log(getDV(rut));
    if (digv == 'K') digv = 'k';
    return (getDV(rut) == digv);
}

function getDV(rut) {
    var M = 0,
        S = 1;
    for (; rut; rut = Math.floor(rut / 10))
        S = (S + rut % 10 * (9 - M++ % 6)) % 11;
    return S ? S - 1 : 'k';
}



function getDigito(rut) {
    var dvr = '0';
    var suma = 0;
    var mul = 2;
    for (var i = rut.length - 1; i >= 0; i--) {
        suma = suma + rut.charAt(i) * mul;
        if (mul === 7) {
            mul = 2;
        }
        else {
            mul++;
        }
    }
    var res = suma % 11;
    if (res === 1) {
        return 'k';
    }
    else if (res === 0) {
        return '0';
    }
    else {
        return 11 - res;
    }
}

async function getRutFormateado(rutCrudo, dv) {
    var rut = await formatearRut(rutCrudo);
    rut = rut + "-" + dv
    return rut;
}

function validarEmail(valor) {
    if (/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i.test(valor)) {
        console.log("mail valido");
        return true;
    } else {
        console.log("mail invalido");
        return false
    }
}

function nombreDia(fecha) {
    var arrayOfWeekdays = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sabado"]
    var weekdayNumber = fecha.getDay();
    var weekdayName = arrayOfWeekdays[weekdayNumber]
    return weekdayName;
}

function nombreMes(fecha) {
    var arrayOfWeekdays = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sabado"]
    var weekdayNumber = fecha.getDay();
    var weekdayName = arrayOfWeekdays[weekdayNumber]
    return weekdayName;
}


function paginacion(paginas, paginaActual, trig) {
    let paginacion = [];

    if (paginas === 1) {

    } else {
        for (var i = 1; i <= paginas; i++) {
            if (parseInt(paginaActual) === i) {
                paginacion.push(<li data-pag={i} className="activo"><span>{i}</span></li>)
            } else {
                paginacion.push(<li onClick={trig} data-pag={i}><span>{i}</span></li>)
            }

        }
    }
    return paginacion;

}

async function obtenerClientes() { //genera una peticion get por axios a la api de usuarios
    let registro;
    await Axios.get('/api/generales/clientes/', { headers: authHeader() }) //se envia peticion axios con el token sesion guardado en local storage como cabecera
        .then(function (res) {
            if (res.data.data.length > 0) {
                registro = res.data.data
            }
        })
        .catch(function (err) { //en el caso de que se ocurra un error, axios lo atrapa y procesa
            handleResponse(err.response);  //invocamos al manejador para ver el tipo de error y ejecutar la accion pertinente
            return;
        });
    return registro;
}
function obtenerSectores() { //genera una peticion get por axios a la api de usuarios
    let registro;
    Axios.get('/api/generales/sectores/', { headers: authHeader() }) //se envia peticion axios con el token sesion guardado en local storage como cabecera
        .then(function (res) {
            if (res.data.data.length > 0) {
                registro = res.data.data
            }
        })
        .catch(function (err) { //en el caso de que se ocurra un error, axios lo atrapa y procesa
            handleResponse(err.response);  //invocamos al manejador para ver el tipo de error y ejecutar la accion pertinente
            return;
        });
    return registro;
}
async function obtenerServicios() { //genera una peticion get por axios a la api de usuarios
    let registro;
    await Axios.get('/api/generales/servicios/', { headers: authHeader() }) //se envia peticion axios con el token sesion guardado en local storage como cabecera
        .then(function (res) {
            if (res.data.data.length > 0) {
                registro = res.data.data
            }

        })
        .catch(function (err) { //en el caso de que se ocurra un error, axios lo atrapa y procesa
            handleResponse(err.response);  //invocamos al manejador para ver el tipo de error y ejecutar la accion pertinente
            return;
        });
    return registro;
}
function obtenerTiposTurno() { //genera una peticion get por axios a la api de usuarios
    let registro;
    const res = Axios.get('/api/generales/tiposTurno', { headers: authHeader() }) //se envia peticion axios con el token sesion guardado en local storage como cabecera
        .then(function (res) {   //si la peticion es satisfactoria entonces
            if (res.data.data.length > 0) {
                registro = res.data.data
            }
        })
        .catch(function (err) { //en el caso de que se ocurra un error, axios lo atrapa y procesa
            handleResponse(err.response);  //invocamos al manejador para ver el tipo de error y ejecutar la accion pertinente
            return;
        });
    return registro;
}
async function obtenerTrabajadores() { //genera una peticion get por axios a la api de usuarios
    let registro;
    await Axios.get('/api/users/worker/obtenertrabajadores', { headers: authHeader() }) //se envia peticion axios con el token sesion guardado en local storage como cabecera
        .then(function (res) {
            if (res.data.data.length > 0) {
                registro = res.data.data
            }
        })
        .catch(function (err) { //en el caso de que se ocurra un error, axios lo atrapa y procesa
            handleResponse(err.response);  //invocamos al manejador para ver el tipo de error y ejecutar la accion pertinente
            return;
        });
    return registro;
}
async function obtenerTodosTrabajadores() { //genera una peticion get por axios a la api de usuarios
    let registro;
    await Axios.get('/api/users/', { headers: authHeader() }) //se envia peticion axios con el token sesion guardado en local storage como cabecera
        .then(function (res) {
            if (res.data.data.length > 0) {
                registro = res.data.data
            }
        })
        .catch(function (err) { //en el caso de que se ocurra un error, axios lo atrapa y procesa
            handleResponse(err.response);  //invocamos al manejador para ver el tipo de error y ejecutar la accion pertinente
            return;
        });
    return registro;
}
function obtenerJefesCuadrilla() { //genera una peticion get por axios a la api de usuarios
    let registro;
    const res = Axios.get('/api/users/worker/obtenerjefes', { headers: authHeader() }) //se envia peticion axios con el token sesion guardado en local storage como cabecera
        .then(function (res) {
            if (res.data.data.length > 0) {
                registro = res.data.data
            }
        })
        .catch(function (err) { //en el caso de que se ocurra un error, axios lo atrapa y procesa
            handleResponse(err.response);  //invocamos al manejador para ver el tipo de error y ejecutar la accion pertinente
            return;
        });
    return registro;
}
async function obtenerCentrosCostos() { //genera una peticion get por axios a la api de usuarios
    let registro;
    await Axios.get('/api/generales/centroscostos/', { headers: authHeader() }) //se envia peticion axios con el token sesion guardado en local storage como cabecera
        .then(function (res) {
            console.log(res.data);
            if (res.data.data.length > 0) {
                registro = res.data.data
            }
        })
        .catch(function (err) { //en el caso de que se ocurra un error, axios lo atrapa y procesa
            handleResponse(err.response);  //invocamos al manejador para ver el tipo de error y ejecutar la accion pertinente
            return;
        });
    return registro;
}
async function obtenerConductores() { //genera una peticion get por axios a la api de usuarios
    let registro;
    await Axios.get('/api/users/worker/conductores', { headers: authHeader() }) //se envia peticion axios con el token sesion guardado en local storage como cabecera
        .then(function (res) {
            if (res.data.data.length > 0) {
                registro = res.data.data
            }
        })
        .catch(function (err) { //en el caso de que se ocurra un error, axios lo atrapa y procesa
            handleResponse(err.response);  //invocamos al manejador para ver el tipo de error y ejecutar la accion pertinente
            return;
        });
    return registro;
}
async function obtenerPatentesVehiculos() { //genera una peticion get por axios a la api de usuarios
    let registro;
    await Axios.get('/api/generales/vehiculos/', { headers: authHeader() }) //se envia peticion axios con el token sesion guardado en local storage como cabecera
        .then(function (res) {
            if (res.data.data.length > 0) {
                registro = res.data.data
            }
        })
        .catch(function (err) { //en el caso de que se ocurra un error, axios lo atrapa y procesa
            handleResponse(err.response);  //invocamos al manejador para ver el tipo de error y ejecutar la accion pertinente
            return;
        });
    return registro;
}
async function obtenerOrdenesRetiroAsignado() { //genera una peticion get por axios a la api de usuarios
    let registro;
    await Axios.get('/api/gestion-residuos/retiros/asignados', { headers: authHeader() }) //se envia peticion axios con el token sesion guardado en local storage como cabecera
        .then(function (res) {
            if (res.data.data.length > 0) {
                registro = res.data.data
            }
        })
        .catch(function (err) { //en el caso de que se ocurra un error, axios lo atrapa y procesa
            handleResponse(err.response);  //invocamos al manejador para ver el tipo de error y ejecutar la accion pertinente
            return;
        });
    return registro;
}


//   await this.setState({ clientes: await funciones.obtenerClientes() }); se usa de esta manera

function obtenerRutaServidor() {
    return ("http://localhost:4000/");
}
function obtenerRutaMedios() {
    return ("http://localhost:4000/media");
}
function obtenerRutaUsuarios() {
    return ("http://localhost:4000/media/users/");
}
function obtenerRutaPlanes() {
    return ("http://localhost:4000/media/planes");
}
function obtenerRutaEmergencias() {
    return ("http://localhost:4000/media/emergencias");
}