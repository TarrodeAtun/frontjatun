//importaciones de bibliotecas
import React, { Component } from "react";
import { autenticacion } from '../../servicios/autenticacion';
import { Link } from 'react-router-dom';
import Axios from '../../helpers/axiosconf';
import { authHeader } from '../../helpers/auth-header';
import { handleResponse } from '../../helpers/manejador';
import { historial } from '../../helpers/historial';
import { toast } from 'react-toastify';
import moment from 'moment';
import { confirmAlert } from 'react-confirm-alert';

// importaciones de iconos 
import imagen from "../../assets/persona.svg";
import { ReactComponent as Basurero } from "../../assets/iconos/basurero.svg";
import { ReactComponent as Doc } from "../../assets/iconos/doc.svg";
import { ReactComponent as Plus } from "../../assets/iconos/plusNaranjo.svg";
import { ReactComponent as Edit } from "../../assets/iconos/edit.svg";
import { ReactComponent as Bamarillorev } from "../../assets/iconos/bamarillorev.svg";

import '../../styles/perfil.css';

const toastoptions = {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
}
const openInNewTab = (url) => {
    let direccion = "http://localhost:4000/media/users";
    direccion = direccion + url;
    const newWindow = window.open(direccion, '_blank', 'noopener,noreferrer')
    if (newWindow) newWindow.opener = null
}

export default class HojaDeVida extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentUser: autenticacion.currentUserValue,
            datosUsuario: "",
            tabControl: '0',
            idUsuario: '',
            amonestaciones: '',
            capacitaciones: '',
            amonestacionesActivo: '',
            capacitacionesActivo: 'activo'
        };
    }
    async componentWillMount() {

    }
    async componentDidMount() {
        var componente = this;

        var { id } = this.props.match.params;
        this.setState({ idUsuario: id });
        await Axios.get('/api/users/worker/' + id, { headers: authHeader() }) //se envia peticion axios con el token sesion guardado en local storage como cabecera
            .then(function (res) {   //si la peticion es satisfactoria entonces
                componente.setState({ datosUsuario: res.data });
            })
            .catch(function (err) { //en el caso de que se ocurra un error, axios lo atrapa y procesa
                return;
            });
        await this.cargarCapacitaciones();
        await this.cargarAmonestaciones();
    }
    cargarCapacitaciones = async () => {
        var componente = this;
        await Axios.get('/api/users/worker/ficha/hojavida/capacitaciones/' + this.state.datosUsuario.rut, { headers: authHeader() }) //se envia peticion axios con el token sesion guardado en local storage como cabecera
            .then(function (res) {   //si la peticion es satisfactoria entonces
                componente.setState({ capacitaciones: res.data.data });
            })
            .catch(function (err) { //en el caso de que se ocurra un error, axios lo atrapa y procesa
                // handleResponse(err.response);  //invocamos al manejador para ver el tipo de error y ejecutar la accion pertinente
                return;
            });
    }
    cargarAmonestaciones = async () => {
        var componente = this;
        await Axios.get('/api/users/worker/ficha/hojavida/amonestaciones/' + this.state.datosUsuario.rut, { headers: authHeader() }) //se envia peticion axios con el token sesion guardado en local storage como cabecera
            .then(function (res) {   //si la peticion es satisfactoria entonces
                componente.setState({ amonestaciones: res.data.data });
            })
            .catch(function (err) { //en el caso de que se ocurra un error, axios lo atrapa y procesa
                // handleResponse(err.response);  //invocamos al manejador para ver el tipo de error y ejecutar la accion pertinente
                return;
            });
    }
    onChangeInput = (e) => {
        console.log(e.target.value);
        this.setState({
            form: {
                ...this.state.form, [e.target.name]: e.target.value
            }
        })
    }
    editar = async event => {
        console.log("asd");
        var objetivo = event.currentTarget.dataset.objetivo;
        objetivo = "show" + objetivo;
        if (this.state[objetivo]) {
            this.setState({ [objetivo]: false });
        } else {
            this.setState({ [objetivo]: true });
        }
    }
    retorno = (e) => {
        historial.push('/personas/gestion');
    }
    changeTab = (e) => {
        var valor = e.currentTarget.dataset.opcion;
        if (valor === "0") {
            this.setState({ tabControl: valor, capacitacionesActivo: "activo", amonestacionesActivo: "" });
        } else {
            this.setState({ tabControl: valor, capacitacionesActivo: "", amonestacionesActivo: "activo" });
        }
    }
    eliminarCapacitacion = (e) => {
        var componente = this;
        var id = e.currentTarget.dataset.id;
        confirmAlert({
            customUI: ({ onClose }) => {
                return (
                    <div className='custom-confirm '>
                        <p>¿Quieres eliminar esta capacitación?</p>
                        <button className="boton-generico btazulalt" onClick={onClose}>Cancelar</button>
                        <button className="boton-generico btazul"
                            onClick={async () => {
                                const res = await Axios.post('/api/users/worker/ficha/hojavida/eliminarCapacitacion', { id: id }, { headers: authHeader() })
                                    .then(respuesta => {
                                        if (respuesta.data.estado === "success") {
                                            toast.success(respuesta.data.mensaje, toastoptions);
                                            componente.cargarCapacitaciones();
                                            onClose();
                                        } else if (respuesta.data.estado === "warning") {
                                            toast.warning(respuesta.data.mensaje, toastoptions);
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
                    </div>
                );
            }
        });
    }

    eliminarAmonestacion = (e) => {
        var componente = this;
        var id = e.currentTarget.dataset.id;
        confirmAlert({
            customUI: ({ onClose }) => {
                return (
                    <div className='custom-confirm '>
                        <p>¿Quieres eliminar esta amonestacion?</p>
                        <button className="boton-generico btazulalt" onClick={onClose}>Cancelar</button>
                        <button className="boton-generico btazul"
                            onClick={async () => {
                                const res = await Axios.post('/api/users/worker/ficha/hojavida/eliminarAmonestacion', { id: id }, { headers: authHeader() })
                                    .then(respuesta => {
                                        if (respuesta.data.estado === "success") {
                                            toast.success(respuesta.data.mensaje, toastoptions);
                                            componente.cargarAmonestaciones();
                                            onClose();
                                        } else if (respuesta.data.estado === "warning") {
                                            toast.warning(respuesta.data.mensaje, toastoptions);
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
                    </div>
                );
            }
        });
    }

    render() {

        let capacitaciones;
        if (this.state.capacitaciones && this.state.capacitaciones.length !== 0) {
            capacitaciones = this.state.capacitaciones.map((capacitacion, index) =>
                <div>
                    <div>
                        <h4><strong>{capacitacion.curso}</strong></h4>
                        <h4>{capacitacion.responsable}</h4>
                        <label>{capacitacion.duracion} ·{moment(capacitacion.fecha).format('MM/YYYY')}</label>
                        <h4><strong>{capacitacion.tematica}</strong></h4>
                        <p>{capacitacion.descripcion}</p>
                    </div>
                    <div className="acciones">
                        <span title="Ver Certificado" className="spanlink" data-url={capacitacion.certificado[0].url} onClick={() => openInNewTab(capacitacion.certificado[0].url)}><Doc /></span>
                        <Link to={`/personas/ficha-trabajador/hoja-de-vida/modificar-capacitacion/${capacitacion._id}`}><Edit /></Link>
                        <button onClick={this.eliminarCapacitacion} data-id={capacitacion._id}><Basurero /></button>
                    </div>
                </div>
            )
        } else {
            capacitaciones = <div>
                <div>
                    <h4><strong>Este trabajador no presenta capacitaciones</strong></h4>
                </div>
            </div>
        }

        let amonestaciones;
        if (this.state.amonestaciones && this.state.amonestaciones.length !== 0) {
            amonestaciones = this.state.amonestaciones.map((amonestacion, index) =>
                <div>
                    <div>
                        <h4><strong>Tipo de amonestación tipo {amonestacion.tipo}</strong></h4>
                        <h4>{amonestacion.responsable}</h4>
                        <label>{moment(amonestacion.fecha).format('DD/MM/YYYY')}</label>
                        <p>Descripción / {amonestacion.descripcion}</p>
                    </div>
                    <div className="acciones">
                        <Link to={`/personas/ficha-trabajador/hoja-de-vida/modificar-amonestacion/${amonestacion._id}`}><Edit /></Link>
                        <button onClick={this.eliminarAmonestacion} data-id={amonestacion._id}><Basurero /></button>
                    </div>
                </div>
            )
        } else {
            amonestaciones = <div>
                <div>
                    <h4><strong>Este trabajador no presenta amonestaciones</strong></h4>
                </div>
            </div>
        }

        return (
            <div className="principal hoja-vida" id="component-perfil">
                <div>
                    <h2 className="amarillo"><Link to={`/personas/ficha-trabajador/${this.state.idUsuario}`}> <Bamarillorev /> </Link><span>Trabajadores</span> / <strong>Hoja de Vida</strong></h2>
                    <div className="fichaPerfil">
                        <div className="seccion encabezado">
                            <div className="fotoperfil">
                                <img src={imagen} />
                            </div>
                            <div className="datosPersonales">
                                <h3><span>{this.state.datosUsuario.nombre} {this.state.datosUsuario.apellido}</span><span>{this.state.datosUsuario.rut}-{this.state.datosUsuario.dv}</span></h3>
                            </div>
                        </div>
                        <div>
                            <p className="tabselectcontainer">
                                <label className={this.state.capacitacionesActivo} data-opcion="0" onClick={this.changeTab}>Capacitaciones</label>
                                <label className={this.state.amonestacionesActivo} data-opcion="1" onClick={this.changeTab}>Amonestaciones</label>
                            </p>
                        </div>

                        {this.state.tabControl === "0"
                            ? <div className="seccion">
                                <Link to={`/personas/ficha-trabajador/hoja-de-vida/crear-capacitacion/${this.state.idUsuario}`} className="edit-button" ><Plus /></Link>
                                <h3>Capacitaciones</h3>
                                {capacitaciones}
                            </div>
                            : <div className="seccion">
                                <Link to={`/personas/ficha-trabajador/hoja-de-vida/crear-amonestacion/${this.state.idUsuario}`} className="edit-button" ><Plus /></Link>
                                <h3>Amonestaciones</h3>
                                {amonestaciones}
                            </div>
                        }
                    </div>
                </div>
            </div >
        );
    }
}

