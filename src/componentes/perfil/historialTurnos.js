//importaciones de bibliotecas
import React, { Component } from "react";
import { autenticacion } from '../../servicios/autenticacion';
import { Link } from 'react-router-dom';
import Axios from '../../helpers/axiosconf';
import { authHeader } from '../../helpers/auth-header';
import { handleResponse } from '../../helpers/manejador';
import { funciones } from '../../servicios/funciones';
import moment from 'moment';

import '../../styles/listarTrabajadores.css';


// importaciones de iconos 
import { ReactComponent as Bcelesterev } from "../../assets/iconos/bcelesterev.svg";
import { ReactComponent as Basurero } from "../../assets/iconos/basurero.svg";
import { ReactComponent as Ojo } from "../../assets/iconos/ojo.svg";
import { ReactComponent as Descarga } from "../../assets/iconos/descarga.svg";
import { ReactComponent as Flechaam } from "../../assets/iconos/flechaam.svg";
import { ReactComponent as Plus } from "../../assets/iconos/X.svg";


//importamos manejadores de modal
import Modal from '../includes/modal';
import { toogleModalCore } from '../includes/funciones';

const openInNewTab = (url) => {
    let direccion = "http://localhost:4000/media";
    direccion = direccion + url;
    const newWindow = window.open(direccion, '_blank', 'noopener,noreferrer')
    if (newWindow) newWindow.opener = null
}


export default class ListarTrabajadores extends Component {



    constructor(props) {
        super(props);

        this.state = {
            currentUser: autenticacion.currentUserValue,
            datosUsuario: "",
            registros: [],
            pagina: 1,
            paginas: '',

        };
    }

    toogleModal = toogleModalCore; //copiamos la funcion modal a una funcion local
    paginacion = funciones.paginacion;
    manejadorModals = (e, res) => { //creamos una funcion que reciba parametros para pasarlo al toogle modal (esta funcion la pasaremos al cuerpo del modal como propiedad para ejecutarse por autoreferencia)
        this.toogleModal(e, res);
    }
    numPaginasTurnos = async () => {
        var componente = this;
        var rut = autenticacion.currentUserValue.data.usuariobd.rut;
        const res = Axios.post('/api/users/worker/turnos/paginas', { rut: rut }, { headers: authHeader() }) //se envia peticion axios con el token sesion guardado en local storage como cabecera
            .then(function (res) {   //si la peticion es satisfactoria entonces
                componente.setState({ paginas: res.data.paginas });
            })
            .catch(function (err) { //en el caso de que se ocurra un error, axios lo atrapa y procesa
                handleResponse(err.response);  //invocamos al manejador para ver el tipo de error y ejecutar la accion pertinente
                return;
            });
    }
    listadoTurnos = async () => {
        var componente = this;
        var rut = autenticacion.currentUserValue.data.usuariobd.rut;
        const res = Axios.post('/api/users/worker/turnos/general', { rut: rut, pagina: this.state.pagina }, { headers: authHeader() }) //se envia peticion axios con el token sesion guardado en local storage como cabecera
            .then(function (res) {   //si la peticion es satisfactoria entonces
                console.log(res.data.data);
                componente.setState({ registros: res.data.data });  //almacenamos el listado de usuarios en el estado usuarios (array)
            })
            .catch(function (err) { //en el caso de que se ocurra un error, axios lo atrapa y procesa
                handleResponse(err.response);  //invocamos al manejador para ver el tipo de error y ejecutar la accion pertinente
                return;
            });
    }
    paginar = async (e) => {
        console.log(e.currentTarget.dataset.pag);
        await this.setState({ pagina: e.currentTarget.dataset.pag })
        this.listadoTurnos();
    }

    // ultimoTurno = async () => {
    //     var componente = this;
    //     var rut = autenticacion.currentUserValue.data.usuariobd.rut;
    //     const res = Axios.post('/api/users/worker/turnos/ultimo', { rut: rut }, { headers: authHeader() }) //se envia peticion axios con el token sesion guardado en local storage como cabecera
    //         .then(function (res) {   //si la peticion es satisfactoria entonces
    //             console.log(res.data.data);
    //             componente.setState({ horas: res.data.data });  //almacenamos el listado de usuarios en el estado usuarios (array)
    //         })
    //         .catch(function (err) { //en el caso de que se ocurra un error, axios lo atrapa y procesa
    //             handleResponse(err.response);  //invocamos al manejador para ver el tipo de error y ejecutar la accion pertinente
    //             return;
    //         });
    // }


    async componentDidMount() {
        await this.numPaginasTurnos();
        this.listadoTurnos();
        // this.ultimoTurno();
    }

    render() {

        let registros;
        if (this.state.registros.length > 0) {
            registros = this.state.registros.map(registro => {
                var url = '';
                registro.imagen.forEach(archivo => {
                    if (archivo.input === "fotoGrupal") {
                        url = archivo.url;
                    }
                });
                const resultado = registro.trabajadores.find(trabajador => trabajador.rut === autenticacion.currentUserValue.data.usuariobd.rut);
                var estado = resultado.estado;
                return (<tr>
                    <td className="columna">
                        <span>{moment(registro.fecha).utc().format("DD/MM/YYYY")}</span>
                        <span>{registro.inicio} - {registro.termino}</span>

                    </td>
                    <td className="columna">
                        <span>{registro.datosServicio.nombre}</span>
                        <span>{registro.datosSectores.nombre}</span>
                    </td>
                    <td className="columna">
                        <span>
                            {estado === 1 && "Asiste"}
                            {estado === 2 && "Atrasado"}
                            {estado === 3 && "Falta"}
                            {estado === 4 && "Reemplazo"}
                        </span>

                    </td>
                    <td className="acciones">
                        <span onClick={() => openInNewTab(url)}><Ojo /></span>
                    </td>
                </tr>)
            })
        } else {
            <tr><td colSpan="3">No hay turnos registrados para esta fecha</td></tr>
        }
        let paginacion = funciones.paginacion(this.state.paginas, this.state.pagina, this.paginar);

        return (
            <div className="principal" id="component-listar-trabajadores">
                <div>
                    <h2 className="celeste"><Link to="/perfil/turnos"> <Bcelesterev /> </Link> Mis turnos <strong>/ Historial de Turnos</strong></h2>
                </div>
                <div className="filtros">
                    <div className="sup">
                        <button>Filtros</button>
                    </div>
                    <div>
                        <form>
                            <div className="form-group justify-center">
                                <input type="date" className="input-generico" placeholder="Nombre o Rut" />
                                <button className="boton-generico btazul" type="button">Filtrar</button>
                                <button className="boton-generico btblanco" type="button">Limpiar</button>
                            </div>
                        </form>
                    </div>
                </div>
                <div className="listado">
                    <table>
                        <thead>
                            <th>Fecha / Jornada</th>
                            <th>Servicio / Sector</th>
                            <th>Tipo Asistencia</th>
                            <th>Foto Turno</th>
                        </thead>
                        <tbody>

                        </tbody>
                    </table>
                </div>
                <div className="listado">
                    <table>
                        <thead>
                            <th>Fecha / Jornada</th>
                            <th>Servicio / Sector</th>
                            <th>Tipo Asistencia</th>
                            <th>Foto Turno</th>
                        </thead>
                        <tbody>
                            {registros}
                        </tbody>
                    </table>
                    <div>
                        <ul className="paginador">
                            {paginacion}
                        </ul>
                    </div>
                </div>
            </div>

        )
    }
}

