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

import { ReactComponent as Check } from "../../assets/iconos/check.svg";
import { ReactComponent as Rech } from "../../assets/iconos/rechazado.svg";
import { ReactComponent as Pendiente } from "../../assets/iconos/pendiente.svg";


//importamos manejadores de modal
import Modal from '../includes/modal';
import { toogleModalCore } from '../includes/funciones';

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
        var { rut } = this.props.match.params;
        const res = Axios.post('/api/users/worker/turnos/paginas', { rut: rut }, { headers: authHeader() }) //se envia peticion axios con el token sesion guardado en local storage como cabecera
            .then(function (res) {   //si la peticion es satisfactoria entonces
                componente.setState({ paginas: res.data.paginas });
            })
            .catch(function (err) { //en el caso de que se ocurra un error, axios lo atrapa y procesa
                handleResponse(err.response);  //invocamos al manejador para ver el tipo de error y ejecutar la accion pertinente
                return;
            });
    }
    listadoSolicitudesReemplazo = async () => {
        var componente = this;
        var { rut } = this.props.match.params;
        const res = Axios.post('/api/users/worker/turnos/listado-solicitudes', { rut: rut, pagina: this.state.pagina }, { headers: authHeader() }) //se envia peticion axios con el token sesion guardado en local storage como cabecera
            .then(function (res) {   //si la peticion es satisfactoria entonces
                console.log(res.data.data);
                componente.setState({ registros: res.data.data });  //almacenamos el listado de usuarios en el estado usuarios (array)
            })
            .catch(function (err) { //en el caso de que se ocurra un error, axios lo atrapa y procesa
                handleResponse(err.response);  //invocamos al manejador para ver el tipo de error y ejecutar la accion pertinente
                return;
            });
    }
    responderSolicitud = async (e) => {
        console.log(e.currentTarget.dataset.rut);
        var componente = this;
        Axios.post('/api/users/worker/turnos/solicitudes/respuesta/', { rut: e.currentTarget.dataset.rut, turno: e.currentTarget.dataset.turno, estado: e.currentTarget.dataset.respuesta }, { headers: authHeader() }) //se envia peticion axios con el token sesion guardado en local storage como cabecera
            .then(function (res) {   //si la peticion es satisfactoria entonces
                console.log(res);
            })
            .catch(function (err) { //en el caso de que se ocurra un error, axios lo atrapa y procesa
                handleResponse(err.response);  //invocamos al manejador para ver el tipo de error y ejecutar la accion pertinente
                return;
            });
    }
    paginar = async (e) => {
        await this.setState({ pagina: e.currentTarget.dataset.pag })
        this.listadoSolicitudesReemplazo();
    }

    async componentDidMount() {
        await this.numPaginasTurnos();
        this.listadoSolicitudesReemplazo();
    }

    render() {
        var { rut } = this.props.match.params;
        let registros = [];
        let componente = this;
        if (this.state.registros.length > 0) {
            for (let registro of this.state.registros) {
                let estado;
                registro.reemplazos.map((elem, ind) => {
                    console.log(elem);
                    // elem.find(function () {
                        if (parseInt(elem.rut) === parseInt(rut)) {
                            if (elem.estado === 0) estado = <span className="solicitudesopciones"><button data-rut={registro.datosTrabajador[ind].rut} data-turno={registro._id} onClick={componente.responderSolicitud} data-respuesta="1" title="Aprobar"><Check /></button><button data-rut={registro.datosTrabajador[ind].rut} data-turno={registro._id} title="Rechazar" onClick={componente.responderSolicitud} data-respuesta="2"><Rech /></button></span>;
                            if (elem.estado === 1) estado = <Check />
                            if (elem.estado === 2) estado = <Rech />

                            registros.push(<tr>
                                <td>{moment(registro.fecha).utc().format("DD-MM-YYYY")}<br></br>{registro.inicio} - {registro.termino}</td>
                                <td>{registro.datosServicio[0].nombre}</td>
                                <td>
                                    {registro.datosReemplazo[ind].nombre}  {registro.datosReemplazo[ind].apellido} <br></br>  {registro.datosReemplazo[ind].rut}
                                </td>
                                <td>{estado}</td>
                            </tr>)
                        }
                    // })
                });
            }
        } else {
            <tr><td colSpan="3">No hay turnos registrados para esta fecha</td></tr>
        }
        // let paginacion = funciones.paginacion(this.state.paginas, this.state.pagina, this.paginar);

        return (
            <div className="principal" id="component-listar-trabajadores">
                <div>
                    <h2 className="celeste"><Link to="/perfil/turnos"> <Bcelesterev /> </Link> Mis turnos <strong>/ Solicitudes de reemplazo</strong></h2>
                </div>
                <div className="listado listado-simple">
                    <div className="encabezado">
                        <h3 className="amarillo inline-block">Solicitudes</h3>
                    </div>
                    <table>
                        <thead>
                            <th>Fecha / Jornada</th>
                            <th>Servicio / Sector</th>
                            <th>Reemplazo</th>
                            <th>Estado</th>
                        </thead>
                        <tbody>
                            {registros}
                        </tbody>
                    </table>
                    <div>
                        <ul className="paginador">
                            {/* {paginacion} */}
                        </ul>
                    </div>
                </div>
            </div>

        )
    }
}

