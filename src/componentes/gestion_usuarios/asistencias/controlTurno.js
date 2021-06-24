//importaciones de bibliotecas
import React, { Component } from "react";
import { autenticacion } from '../../../servicios/autenticacion';
import { Link } from 'react-router-dom';
import Axios from '../../../helpers/axiosconf';
import { authHeader } from '../../../helpers/auth-header';
import { handleResponse } from '../../../helpers/manejador';
import { historial } from '../../../helpers/historial';
import { funciones } from '../../../servicios/funciones';
import LectorQR from './lectorQR';
import moment from 'moment';
import '../../../styles/listarTrabajadores.css';
import { confirmAlert } from 'react-confirm-alert';
import { toast } from 'react-toastify';


// importaciones de iconos 
import { ReactComponent as Bamarillorev } from "../../../assets/iconos/bamarillorev.svg";
import { ReactComponent as Basurero } from "../../../assets/iconos/basurero.svg";
import { ReactComponent as Ojo } from "../../../assets/iconos/ojo.svg";
import { ReactComponent as Descarga } from "../../../assets/iconos/descarga.svg";
import { ReactComponent as Flechaam } from "../../../assets/iconos/flechaam.svg";
import { ReactComponent as Plus } from "../../../assets/iconos/plusNaranjo.svg";


//importamos manejadores de modal
import Modal from '../../includes/modal';
import { toogleModalCore } from '../../includes/funciones';

const toastoptions = {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
}

export default class ListarTrabajadores extends Component {



    constructor(props) {
        super(props);

        this.state = {
            trabajadores: [],
            turnos: '',
            showLectorQR: false,

        };
    }

    toogleModal = toogleModalCore; //copiamos la funcion modal a una funcion local

    manejadorModals = (e, res) => { //creamos una funcion que reciba parametros para pasarlo al toogle modal (esta funcion la pasaremos al cuerpo del modal como propiedad para ejecutarse por autoreferencia)
        this.toogleModal(e, res);
    }

    onChangeInput = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }
    formatearRutListado = (rutCrudo, dv) => {
        var sRut = new String(rutCrudo);
        var sRutFormateado = '';
        while (sRut.length > 3) {
            sRutFormateado = "." + sRut.substr(sRut.length - 3) + sRutFormateado;
            sRut = sRut.substring(0, sRut.length - 3);
        }
        sRutFormateado = sRut + sRutFormateado;
        sRutFormateado += "-" + dv;
        return sRutFormateado;
    }

    obtenerTurnos = async () => { //genera una peticion get por axios a la api de usuarios
        var componente = this;
        var { id } = this.props.match.params;
        const res = Axios.get('/api/users/worker/turnos/detalle/' + id, { headers: authHeader() }) //se envia peticion axios con el token sesion guardado en local storage como cabecera
            .then(function (res) {   //si la peticion es satisfactoria entonces
                console.log(res.data.data[0]);
                componente.setState({ turnos: res.data.data[0], trabajadores: res.data.data[0].trabajadores });  //almacenamos el listado de usuarios en el estado usuarios (array)
            })
            .catch(function (err) { //en el caso de que se ocurra un error, axios lo atrapa y procesa
                console.log(err);
                handleResponse(err.response);  //invocamos al manejador para ver el tipo de error y ejecutar la accion pertinente
                return;
            });
    }

    capturaQR = async (datos) => {
        let datosDesencriptados = JSON.parse(datos);
        console.log(datosDesencriptados);
        this.confirmaAsistencia(datosDesencriptados);
    }
    evaluar = async () => {
        var { id } = this.props.match.params;
        historial.push("/personas/asistencias/control-asistencia/turno/evaluar/" + id);
    }
    verEvaluacion = async () => {
        var { id } = this.props.match.params;
        historial.push("/personas/asistencias/control-asistencia/turno/detalle/" + id);
    }
    confirmaAsistencia = async (datos) => {
        console.log(datos);
        var componente = this;
        var { id } = this.props.match.params;
        const res = Axios.post('/api/users/worker/turnos/pasarLista/', { id: id, datos: datos }, {
            headers: authHeader()
        }).then(respuesta => {
            console.log(respuesta.data.data);
            if (respuesta.data.estado === "success") {
                componente.setState({ trabajadores: respuesta.data.data.trabajadores });
                toast.success(respuesta.data.mensaje, toastoptions);
            }
        }).catch(function (err) { //en el caso de que se ocurra un error, axios lo atrapa y procesa
            handleResponse(err.response);  //invocamos al manejador para ver el tipo de error y ejecutar la accion pertinente
            toast.error("Ha habido un error al enviar los datos", toastoptions);
        });
    }

    iniciarTurno = async () => { //genera una peticion get por axios a la api de usuarios
        var { id } = this.props.match.params;
        var componente = this;
        confirmAlert({
            customUI: ({ onClose }) => {
                return (
                    <div className='custom-confirm '>
                        <p>¿Está seguro de iniciar el turno?</p>
                        <button className="boton-generico btazulalt" onClick={onClose}>Cancelar</button>
                        <button className="boton-generico btazul"
                            onClick={async () => {
                                Axios.post('/api/users/worker/turnos/iniciar/', { id: id }, {
                                    headers: authHeader()
                                })
                                    .then(res => {
                                        console.log(res.data.data);
                                        if (res.data.estado === "success") {
                                            componente.setState({ turnos: { ...this.state.turnos, estado: res.data.data.estado } })
                                            console.log(this.state.turnos);
                                            toast.success(res.data.mensaje, toastoptions);
                                            onClose();
                                        }
                                    })
                                    .catch(function (err) { //en el caso de que se ocurra un error, axios lo atrapa y procesa
                                        console.log(err);
                                        handleResponse(err.response);  //invocamos al manejador para ver el tipo de error y ejecutar la accion pertinente
                                        onClose();
                                        toast.error("Ha habido un error al enviar los datos", toastoptions);
                                    });
                            }}
                        >
                            Aceptar
                    </button>
                    </div >
                );
            }
        });
    }
    subirAsistencia = async () => { //genera una peticion get por axios a la api de usuarios
        var { id } = this.props.match.params;
        var componente = this;
        confirmAlert({
            customUI: ({ onClose }) => {
                return (
                    <div className='custom-confirm '>
                        <p>¿Está seguro de subir la asistencia? Una vez realizado no se podrá modificar</p>
                        <button className="boton-generico btazulalt" onClick={onClose}>Cancelar</button>
                        <button className="boton-generico btazul"
                            onClick={async () => {
                                Axios.post('/api/users/worker/turnos/subirAsistencia/', { id: id }, {
                                    headers: authHeader()
                                })
                                    .then(res => {
                                        console.log(res);
                                        if (res.data.estado === "success") {
                                            componente.setState({ turnos: { ...this.state.turnos, estado: 1 } })
                                            toast.success(res.data.mensaje, toastoptions);
                                            onClose();
                                            window.location.reload();
                                        }
                                    })
                                    .catch(function (err) { //en el caso de que se ocurra un error, axios lo atrapa y procesa
                                        handleResponse(err.response);  //invocamos al manejador para ver el tipo de error y ejecutar la accion pertinente
                                        onClose();
                                        toast.error("Ha habido un error al enviar los datos", toastoptions);
                                    });
                            }}
                        >
                            Aceptar
                    </button>
                    </div >
                );
            }
        });
    }
    finalizarTurno = async () => { //genera una peticion get por axios a la api de usuarios
        var { id } = this.props.match.params;
        confirmAlert({
            customUI: ({ onClose }) => {
                return (
                    <div className='custom-confirm '>
                        <p>¿Está seguro de finalizar el turno?</p>
                        <button className="boton-generico btazulalt" onClick={onClose}>Cancelar</button>
                        <button className="boton-generico btazul"
                            onClick={async () => {
                                const res = Axios.post('/api/users/worker/turnos/finalizar/', { id: id }, {
                                    headers: authHeader()
                                })
                                    .then(respuesta => {
                                        if (respuesta.data.estado === "success") {
                                            toast.success(respuesta.data.mensaje, toastoptions);
                                            onClose();
                                        }
                                    })
                                    .catch(function (err) { //en el caso de que se ocurra un error, axios lo atrapa y procesa
                                        handleResponse(err.response);  //invocamos al manejador para ver el tipo de error y ejecutar la accion pertinente
                                        onClose();
                                        toast.error("Ha habido un error al enviar los datos", toastoptions);
                                    });
                            }}
                        >
                            Aceptar
                    </button>
                    </div >
                );
            }
        });
    }

    async componentDidMount() {
        await this.obtenerTurnos();
    }
    async componentWillUnmount() {

    }

    render() {
        let fecha = new Date(this.state.turnos.fecha);
        let turnos;
        if (this.state.trabajadores && this.state.trabajadores.length !== 0) {
            turnos = this.state.trabajadores.map((hora, index) =>
                <tr>
                    <td >
                        <span>
                            {hora.rut}
                        </span>
                    </td>
                    <td >
                        <span>
                            {hora.nombre}
                        </span>
                    </td>
                    <td >
                        <span>
                            {hora.apellido}
                        </span>
                        <span>
                            {/* {hora.datosSectores.nombre} */}
                        </span>
                    </td>
                    <td >
                        {hora.estado === 1 &&
                            <span>Asiste</span>
                        }
                        {hora.estado === 2 &&
                            <span>Atrasado</span>
                        }
                        {hora.estado === 3 &&
                            <span>Falta</span>
                        }
                    </td>
                    <td >
                        {this.state.turnos.estado === 0 &&
                            <span>-</span>
                        }
                        {this.state.turnos.estado === 1 &&  hora.estado === 0 &&
                            <button className="azul button btazul lecturaQR" onClick={this.manejadorModals} data-objetivo="LectorQR" >Lectura QR</button>
                        }
                        {this.state.turnos.estado === 1 && hora.estado === 1 &&
                            <span className="grisclaro">Lectura realizada</span>
                        }
                    </td>
                </tr>
            )
        } else {
            turnos = <tr><td colSpan="4">No hay</td></tr>
        }
        return (
            <div className="principal" id="component-listar-trabajadores">
                <div>
                    <h2 className="naranjo"><Link to="/personas/asistencias/control-asistencia"> <Bamarillorev /> </Link> Asistencias <strong>/ Control Asistencia </strong></h2>
                </div>
                <div className="panel-dashboard-link">
                    <div className="seccion">
                        <h3><span> {(this.state.turnos.fecha) ? funciones.nombreDia(fecha) : ""} {moment(this.state.turnos.fecha).format("DD - MM - YYYY")}</span></h3>
                    </div>
                </div>
                <div className="listado">
                    <div className="encabezado">
                        {this.state.turnos.estado === 0 &&
                            <h3 className="amarillo"><span>Turno Pendiente</span> <button onClick={this.iniciarTurno}><span className="flex"><Plus /> Iniciar Turno</span></button></h3>
                        }
                        {this.state.turnos.estado === 1 &&
                            <h3 className="amarillo"><span>Turno en curso</span> </h3>
                        }
                        {this.state.turnos.estado === 2 &&
                            <h3 className="amarillo"><span>Asistencia Subida</span> </h3>
                        }
                        {this.state.turnos.estado === 3 &&
                            <h3 className="amarillo"><span>Turno finalizado</span> </h3>
                        }
                    </div>
                    <table>
                        <thead>
                            <th>Fecha/jornada</th>
                            <th>Servicio / sector</th>
                            <th>Cliente</th>
                            <th>Lider Cuadrilla</th>
                        </thead>
                        <tbody>
                            {this.state.turnos &&
                                <tr>
                                    <td className="columna">
                                        <span>
                                            {moment(this.state.turnos.fecha).format("DD-MM-YYYY")}
                                        </span>
                                        <span>
                                            {this.state.turnos.inicio} - {this.state.turnos.termino}
                                        </span>
                                    </td>
                                    <td className="columna">
                                        <span>
                                            {this.state.turnos.datosServicio.nombre}
                                        </span>
                                        <span>
                                            {this.state.turnos.datosSectores.nombre}
                                        </span>
                                    </td>
                                    <td className="columna">
                                        <span>
                                            {this.state.turnos.datosCliente.nombre}
                                        </span>
                                    </td>
                                    <td className="columna">
                                        <span>
                                            {this.state.turnos.datosJefe.nombre}
                                        </span>
                                    </td>
                                </tr>
                            }
                        </tbody>
                    </table>
                </div>
                <div className="listado">
                    <table>
                        <thead>
                            <th>Rut</th>
                            <th>Nombre</th>
                            <th>Apellidos</th>
                            <th>Asistencia</th>
                            <th>Lectura QR</th>
                        </thead>
                        <tbody>
                            {turnos}
                        </tbody>
                    </table>
                </div>
                {this.state.turnos.estado === 0 &&
                    <div className="form-group buttons">
                        <button className="boton-generico btgris" disabled="true" type="button">Subir Asistencia</button>
                        <button className="boton-generico btgris" disabled="true" type="button" onClick={this.retorno}>Evaluacion</button>
                    </div>
                }
                {this.state.turnos.estado === 1 &&
                    <div className="form-group buttons">
                        <button className="boton-generico btazul" type="button" onClick={this.subirAsistencia}>Subir Asistencia</button>
                        <button className="boton-generico btgris" disabled="true" type="button" onClick={this.retorno}>Evaluacion</button>
                    </div>
                }
                {this.state.turnos.estado === 2 &&
                    <div className="form-group buttons">
                        <button className="boton-generico btgris" disabled="true" type="button" onClick={this.subirAsistencia}>Subir Asistencia</button>
                        <button className="boton-generico btazul" type="button" onClick={this.evaluar}>Evaluacion</button>
                    </div>
                }
                {this.state.turnos.estado === 3 &&
                    <div className="form-group buttons">
                        <button className="boton-generico btazul" type="button" onClick={this.verEvaluacion}>Ver evaluación</button>
                    </div>
                }
                <div id="modales">
                    <Modal
                        name="LectorQR"  //nombre del estado que controla el modal
                        show={this.state.showLectorQR} //indicamos la propiedad show con el estado que controlara al modal
                        contenido={<LectorQR />} //entregamos el componente que se renderizara en el modal 
                        toogleModal={this.manejadorModals}
                        capturaQR={this.capturaQR}
                    />
                </div>
            </div>

        )
    }
}

