// importaciones de bibliotecas 
import React, { Component, useState } from "react";
import { autenticacion } from '../../servicios/autenticacion';
import { Link } from 'react-router-dom';
import { confirmAlert } from 'react-confirm-alert';
import Axios from '../../helpers/axiosconf';
import { authHeader } from '../../helpers/auth-header';
import { handleResponse } from '../../helpers/manejador';
import { ReactComponent as Ojo } from "../../assets/iconos/ojo.svg";
import moment from 'moment';
import { toast } from 'react-toastify';
import { funciones } from '../../servicios/funciones';
import Modal from '../includes/modal';
import { toogleModalCore, toogleModalCoreEsp } from '../includes/funciones';
import MultiSelect from "react-multi-select-component";

// importaciones de estilos 
import '../../styles/fichaTrabajador.css';

//componentes
import FrecuenciaTurno from './frecuenciaTurno';


// importaciones de iconos 
import { ReactComponent as Bamarillorev } from "../../assets/iconos/bamarillorev.svg";
import { historial } from "../../helpers/historial";

const toastoptions = {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
}



export default class CrearRetiro extends Component {

    constructor(props) {
        super(props);
        this.myRef = React.createRef();
        this.state = {
            currentUser: autenticacion.currentUserValue,
            datosUsuarios: "",
            users: null,
            frecuenciaArray: [],
            DOMretiros: '',
            showFrecuenciaRetiro: '',
            frecuencia: '',
            clientes: '',
            sectores: '',
            tirposturno: '',
            servicios: '',
            trabajadores: '',
            jefes: '',
            trabajadoresSelect: [],
            selectTrabajador: '',
            form: {
                clienterut: '',
                sector: '',
                servicio: '',
                tipoTurno: '',
                fecha: '',
                inicio: '00:00',
                termino: '00:00',
                jefe: '',
            },
            labelFrecuencia: ''
        };

    }

    toogleModal = toogleModalCore; //copiamos la funcion modal a una funcion local
    manejadorModals = (e, res) => {
        this.toogleModal(e, res);
    }
    componentDidMount = () => {
        this.obtenerClientes();
        this.obtenerServicios();
        this.obtenerTiposTurno();
        this.obtenerTrabajadores();
        this.obtenerJefesCuadrilla();
    }

    obtenerClientes = async () => { //genera una peticion get por axios a la api de usuarios
        var componente = this;
        const res = Axios.get('/api/generales/clientes/', { headers: authHeader() }) //se envia peticion axios con el token sesion guardado en local storage como cabecera
            .then(function (res) {   //si la peticion es satisfactoria entonces
                componente.setState({ clientes: res.data.data });  //almacenamos el listado de usuarios en el estado usuarios (array)
            })
            .catch(function (err) { //en el caso de que se ocurra un error, axios lo atrapa y procesa
                handleResponse(err.response);  //invocamos al manejador para ver el tipo de error y ejecutar la accion pertinente
                return;
            });
    }
    obtenerServicios = async () => { //genera una peticion get por axios a la api de usuarios
        var componente = this;
        const res = Axios.get('/api/generales/servicios/', { headers: authHeader() }) //se envia peticion axios con el token sesion guardado en local storage como cabecera
            .then(function (res) {   //si la peticion es satisfactoria entonces
                console.log(res.data.data)
                componente.setState({ servicios: res.data.data });  //almacenamos el listado de usuarios en el estado usuarios (array)
            })
            .catch(function (err) { //en el caso de que se ocurra un error, axios lo atrapa y procesa
                handleResponse(err.response);  //invocamos al manejador para ver el tipo de error y ejecutar la accion pertinente
                return;
            });
    }
    obtenerTiposTurno = async () => { //genera una peticion get por axios a la api de usuarios
        var componente = this;
        const res = Axios.get('/api/generales/tiposTurno', { headers: authHeader() }) //se envia peticion axios con el token sesion guardado en local storage como cabecera
            .then(function (res) {   //si la peticion es satisfactoria entonces
                console.log(res.data.data);
                componente.setState({ tiposturno: res.data.data });  //almacenamos el listado de usuarios en el estado usuarios (array)
            })
            .catch(function (err) { //en el caso de que se ocurra un error, axios lo atrapa y procesa
                handleResponse(err.response);  //invocamos al manejador para ver el tipo de error y ejecutar la accion pertinente
                return;
            });
    }
    obtenerTrabajadores = async () => { //genera una peticion get por axios a la api de usuarios
        var componente = this;
        const res = Axios.get('/api/users/worker/obtenertrabajadores', { headers: authHeader() }) //se envia peticion axios con el token sesion guardado en local storage como cabecera
            .then(function (res) {   //si la peticion es satisfactoria entonces
                console.log(res.data.data);
                componente.setState({ trabajadores: res.data.data });  //almacenamos el listado de usuarios en el estado usuarios (array)
            })
            .catch(function (err) { //en el caso de que se ocurra un error, axios lo atrapa y procesa
                handleResponse(err.response);  //invocamos al manejador para ver el tipo de error y ejecutar la accion pertinente
                return;
            });
    }
    obtenerJefesCuadrilla = async () => { //genera una peticion get por axios a la api de usuarios
        var componente = this;
        const res = Axios.get('/api/users/worker/obtenerjefes', { headers: authHeader() }) //se envia peticion axios con el token sesion guardado en local storage como cabecera
            .then(function (res) {   //si la peticion es satisfactoria entonces
                console.log(res.data.data);
                componente.setState({ jefes: res.data.data });  //almacenamos el listado de usuarios en el estado usuarios (array)
            })
            .catch(function (err) { //en el caso de que se ocurra un error, axios lo atrapa y procesa
                handleResponse(err.response);  //invocamos al manejador para ver el tipo de error y ejecutar la accion pertinente
                return;
            });
    }
    onChangeInputFrecuencia = async (e) => {
        await this.setState({ frecuencia: e.target.value });
        this.onChangeFrecuencia();
    }
    onChangeInput = (e) => {
        this.setState({
            form: {
                ...this.state.form, [e.target.name]: e.target.value
            }
        })
    }
    onChangeFecha = (e) => {

        this.setState({
            form: {
                ...this.state.form, [e.target.name]: e.target.value
            },
            frecuenciaArray: [],
            labelFrecuencia: '',
            frecuencia: ''
        })
    }
    onChangeTrabajadores = (e) => {
        console.log("change");
        var rut = e.target.value;
        var dv = e.target[e.target.selectedIndex].dataset.dv
        var nombre = e.target[e.target.selectedIndex].dataset.nombre
        var apellido = e.target[e.target.selectedIndex].dataset.apellido
        var trabajadoresSelect = this.state.trabajadoresSelect;
        console.log(trabajadoresSelect);
        var igual = false;
        for (let trabajador of trabajadoresSelect) {
            if (trabajador.rut === e.target.value) {
                igual = true;
            }
        }
        if (!igual) {
            trabajadoresSelect.push({ rut: rut, dv: dv, nombre: nombre, apellido: apellido });
            this.setState({
                trabajadoresSelect: trabajadoresSelect,
            });
        }
        this.setState({
            selectTrabajador: ''
        })
    }

    onChangeCliente = async (e) => {
        var clienteRut = e.target.value;
        if (e.target.value) {
            await this.setState({ form: { ...this.state.form, clienterut: clienteRut } })
            await this.setState({ form: { ...this.state.form, sector: '' } })
            let clientes = await this.state.clientes;
            let clienteSelect = await clientes.find(cliente => parseInt(cliente.rut) === parseInt(clienteRut));
            this.setState({ sectores: clienteSelect.sectores });
        } else {
            console.log("no");
            await this.setState({ form: { ...this.state.form, clienterut: '' } })
            await this.setState({ form: { ...this.state.form, sector: '' } })
            await this.setState({ sectores: '' });
        }
    }

    eliminaTrabajador = (e) => {
        console.log("elimina");
        var trabajadores = this.state.trabajadoresSelect;
        trabajadores.splice(e, 1);
        this.setState({
            trabajadoresSelect: trabajadores
        })
    }

    onChangeFrecuencia = async (e) => {
        console.log(this.state.frecuencia);
        var eleccion = this.state.frecuencia;

        var fecha = this.state.form.fecha;
        var inicio = this.state.form.inicio;
        var termino = this.state.form.termino;
        var componente = this;
        if (eleccion === "1") {
            if (fecha) {
                var arrayasd = [];
                console.log(fecha);
                var otrafecha = new Date(moment(fecha).utc().format());
                registro = {
                    fecha: otrafecha
                }
                arrayasd.push(registro);
                await componente.setState({ frecuenciaArray: arrayasd, labelFrecuencia: "No se repite" });
            } else {
                this.setState({
                    frecuenciaArray: [],
                    labelFrecuencia: '',
                    frecuencia: ''
                });
                toast.warning("Debe seleccionar una fecha primero", toastoptions);
            }
        }
        if (eleccion === "2") {
            if (fecha) {
                var otrafecha = new Date(moment(fecha).utc().format());
                var primer = new Date(otrafecha.getFullYear(), otrafecha.getMonth(), 1);
                var ultimo = new Date(otrafecha.getFullYear(), otrafecha.getMonth() + 1, 0);
                var numdias = ultimo.getDate();
                var registro = {};
                var arrayasd = [];
                var preDOM;
                var dia = otrafecha.getDate() + 1;
                var retiros = [];
                let label = "Se repite cada dia desde el " + moment(primer).utc().format("DD/MM/YYYY") + " hasta el " + moment(ultimo).utc().format("DD/MM/YYYY");
                for (dia; dia <= numdias; dia++) {
                    registro = {
                        fecha: new Date(otrafecha.getFullYear(), otrafecha.getMonth(), dia)
                    }
                    arrayasd.push(registro);
                }

                console.log(arrayasd);
                await componente.setState({ frecuenciaArray: arrayasd, labelFrecuencia: label });
            } else {
                this.setState({
                    frecuenciaArray: [],
                    labelFrecuencia: '',
                    frecuencia: ''
                });
                toast.warning("Debe seleccionar una fecha primero", toastoptions);
            }
        }

        if (eleccion === "3") {
            if (fecha) {
                var otrafecha = new Date(moment(fecha).utc().format());
                var actual = otrafecha.getDate();
                var ultimo = new Date(otrafecha.getFullYear(), otrafecha.getMonth() + 1, 0);
                var numdias = ultimo.getDate();
                var nextweek = new Date(otrafecha.getFullYear(), otrafecha.getMonth(), otrafecha.getDate() + 7);
                var dia = otrafecha.getDate();
                var registro = {};
                var arrayasd = [];
                var preDOM;
                var retiros = [];
                let label = "Se repite cada " + funciones.nombreDia(otrafecha) + "  desde el " + moment(otrafecha).utc().format("DD/MM/YYYY") + " hasta el " + moment(ultimo).utc().format("DD/MM/YYYY");
                for (dia; dia <= numdias; dia = dia + 7) {
                    registro = {
                        fecha: new Date(otrafecha.getFullYear(), otrafecha.getMonth(), dia)
                    }
                    arrayasd.push(registro);
                }
                await componente.setState({ frecuenciaArray: arrayasd, labelFrecuencia: label });
            } else {
                this.setState({
                    frecuenciaArray: [],
                    labelFrecuencia: '',
                    frecuencia: ''
                });
                toast.warning("Debe seleccionar una fecha primero", toastoptions);
            }
        }

        if (eleccion === "4") {
            if (fecha) {
                var otrafecha = new Date(moment(fecha).utc().format());
                var primer = new Date(otrafecha.getFullYear(), otrafecha.getMonth(), 1);
                var ultimo = new Date(otrafecha.getFullYear(), otrafecha.getMonth() + 1, 0);
                var numdias = ultimo.getDate();
                var dia = otrafecha.getDate();
                var registro = {};
                var arrayasd = [];
                var preDOM;
                var retiros = [];
                let label = "Se repite de lunes a viernes a partir del" + moment(primer).utc().format("DD/MM/YYYY") + " hasta el " + moment(ultimo).utc().format("DD/MM/YYYY");

                for (dia; dia <= numdias; dia++) {
                    var fechaProvisoria = new Date(otrafecha.getFullYear(), otrafecha.getMonth(), dia);
                    if (fechaProvisoria.getDay() !== 0 && fechaProvisoria.getDay() !== 6) {
                        registro = {
                            fecha: new Date(otrafecha.getFullYear(), otrafecha.getMonth(), dia)
                        }
                        arrayasd.push(registro);
                    }
                }
                await componente.setState({ frecuenciaArray: arrayasd, labelFrecuencia: label });
            } else {
                this.setState({
                    frecuenciaArray: [],
                    labelFrecuencia: '',
                    frecuencia: ''
                });
                toast.warning("Debe seleccionar una fecha primero", toastoptions);
            }
        }
        if (eleccion === "5") {
            if (fecha) {
                this.setState({ showFrecuenciaRetiro: true });
            } else {
                this.setState({
                    frecuenciaArray: [],
                    labelFrecuencia: '',
                    frecuencia: ''
                });
                toast.warning("Debe seleccionar una fecha primero", toastoptions);
            }
        }
        console.log(this.state.frecuenciaArray);
    }
    frecuenciaPersonalizada = async (datos, label) => {
        var arrayasd = [];
        var registro = {};
        for await (let dias of datos) {
            var fechapre = dias.fecha
            registro = {
                fecha: new Date(fechapre)
            }
            arrayasd.push(registro);
        }
        await this.setState({ frecuenciaArray: arrayasd, labelFrecuencia: label });
    }

    abrirmodal = () => {
        this.setState({ showFrecuenciaRetiro: true });
    }


    volver = () => {
        var componente = this;
        confirmAlert({
            customUI: ({ onClose }) => {
                return (
                    <div className='custom-confirm '>
                        <p>¿Quieres guardar antes de salir de la sección crear OR?</p>
                        <button className="boton-generico btazulalt" onClick={onClose}>Cancelar</button>
                        <button className="boton-generico btazul" onClick={function () { componente.pushLista(); onClose(); }}>No guardar</button>
                        <button className="boton-generico btazul"
                            onClick={() => {
                                componente.enviaDatos();
                                onClose();
                            }} >
                            Aceptar
                        </button>
                    </div>
                );
            }
        });
    }

    pushLista = () => {
        historial.push("/personas/turnos");
    }



    enviaDatos = async e => {
        var campoVacio = false;
        console.log(this.state.form);
        await Object.entries(this.state.form).map((t, k) => {
            if (t[1] === "" || t[1] === null) {
                campoVacio = true;
            }
        });
        if (!campoVacio) {
            console.log("campo vacio");
            const res = await Axios.post('/api/users/worker/turnos/create/', {
                clienterut: this.state.form.clienterut,
                sector: this.state.form.sector,
                servicio: this.state.form.servicio,
                tipoTurno: this.state.form.tipoTurno,
                fecha: this.state.form.fecha,
                inicio: this.state.form.inicio,
                termino: this.state.form.termino,
                jefe: this.state.form.jefe,
                trabajadores: this.state.trabajadoresSelect,
                frecuencia: this.state.frecuenciaArray
            }, { headers: authHeader() })
                .then(respuesta => {
                    console.log(respuesta);
                    // this.setState({ idUsuario: respuesta.data.id });
                    if (respuesta.data.estado === "success") {
                        toast.success(respuesta.data.mensaje, toastoptions);
                        historial.push("/personas/turnos");
                        // this.setState({ showIngresar: true, showOptions: false });
                    } else if (respuesta.data.estado === "warning") {
                        toast.warning(respuesta.data.mensaje, toastoptions);
                    }

                })
                .catch(function (err) { //en el caso de que se ocurra un error, axios lo atrapa y procesa
                    handleResponse(err.response);  //invocamos al manejador para ver el tipo de error y ejecutar la accion pertinente
                    toast.error("Ha habido un error al enviar los datos", toastoptions);
                });
        } else {
            toast.warning("Debes llenar todos los campos", toastoptions);
        }
    }

    render() {

        let clientes;
        if (this.state.clientes) {
            clientes = this.state.clientes.map((cliente, index) =>
                <option value={cliente.rut} data-dv={cliente.dv}>{cliente.nombre}</option>
            )
        }

        let sectores;
        if (this.state.sectores) {
            sectores = this.state.sectores.map((sector, index) =>
                <option value={sector.key} >{sector.nombre}</option>
            )
        }
        let servicios;
        if (this.state.servicios) {
            servicios = this.state.servicios.map((servicio, index) =>
                <option value={servicio.key} >{servicio.nombre}</option>
            )
        }
        let tiposturno;
        if (this.state.tiposturno) {
            tiposturno = this.state.tiposturno.map((tipoturno, index) =>
                <option value={tipoturno.key} >{tipoturno.nombre}</option>
            )
        }

        let jefes;
        if (this.state.jefes) {
            jefes = this.state.jefes.map((jefe, index) =>
                <option value={jefe.rut} >{jefe.nombre} {jefe.apellido}</option>
            )
        }

        let trabajadores;
        if (this.state.trabajadores) {
            trabajadores = this.state.trabajadores.map((trabajador, index) =>
                <option value={trabajador.rut} data-dv={trabajador.dv} data-nombre={trabajador.nombre} data-apellido={trabajador.apellido}>{trabajador.nombre} {trabajador.apellido}</option>
            )
        }
        let trabajadoresAsignados;
        if (this.state.trabajadoresSelect) {
            trabajadoresAsignados = this.state.trabajadoresSelect.map((trabajador, index) =>
                <div>
                    <span>Trabajador {index + 1}</span>
                    <span className="spanConductor">
                        <button onClick={e => this.eliminaTrabajador(index)}>X</button>
                        <span>{trabajador.nombre} {trabajador.apellido}</span>
                        <span>{trabajador.rut}-{trabajador.dv}</span>
                    </span>
                </div>
            )

        }
        let fechasSeleccionadas;

        return (
            <div className="principal" id="component-perfil">
                <div>
                    <h2 className="amarillo"><button className="boton-vacio" onClick={this.volver}> <Bamarillorev /> </button><span>Turnos</span> / <strong>Agregar turno</strong></h2>
                    <div className="fichaPerfil">
                        <div className="seccion">
                            <h3 className="amarillo">Cliente *</h3>
                            <div>
                                <span>Cliente</span>
                                <span>
                                    <select name="clienterut" onChange={this.onChangeCliente} className="input-generico" value={this.state.form.clienterut} >
                                        <option value="">Seleccionar</option>
                                        {clientes}
                                    </select>
                                </span>
                            </div>
                            <div>
                                <span>Sector</span>
                                <span>
                                    <select name="sector" onChange={this.onChangeInput} value={this.state.form.sector} className="input-generico">
                                        <option value="">Seleccionar</option>
                                        {sectores}
                                    </select>
                                </span>
                            </div>
                            <div>
                                <span>Servicio</span>
                                <span>
                                    <select name="servicio" onChange={this.onChangeInput} value={this.state.form.servicio} className="input-generico">
                                        <option>Seleccionar</option>
                                        {servicios}
                                    </select>
                                </span>
                            </div>
                            <div>
                                <span>Tipo de turno</span>
                                <span>
                                    <select name="tipoTurno" onChange={this.onChangeInput} value={this.state.form.tipoTurno} className="input-generico">
                                        <option>Seleccionar</option>
                                        {tiposturno}
                                    </select>
                                </span>
                            </div>
                            <h3 className="verde">Fecha y Frecuencia*</h3>
                            <div>
                                <span>Fecha</span>
                                <span><input type="date" onChange={this.onChangeFecha} value={this.state.form.fecha} className="input-generico" name="fecha" /></span>
                            </div>
                            <div>
                                <span>Horario Inicio</span>
                                <span>
                                    <select name="inicio" onChange={this.onChangeInput} value={this.state.form.inicio} className="input-generico">
                                        <option>00:00</option>
                                        <option>00:30</option>
                                        <option>01:00</option>
                                        <option>01:30</option>
                                        <option>02:00</option>
                                        <option>02:30</option>
                                        <option>03:00</option>
                                        <option>03:30</option>
                                        <option>04:00</option>
                                        <option>04:30</option>
                                        <option>05:00</option>
                                        <option>05:30</option>
                                        <option>06:00</option>
                                        <option>06:30</option>
                                        <option>07:00</option>
                                        <option>07:30</option>
                                        <option>08:00</option>
                                        <option>08:30</option>
                                        <option>09:00</option>
                                        <option>09:30</option>
                                        <option>10:00</option>
                                        <option>10:30</option>
                                        <option>11:00</option>
                                        <option>11:30</option>
                                        <option>12:00</option>
                                        <option>12:30</option>
                                        <option>13:00</option>
                                        <option>13:30</option>
                                        <option>14:00</option>
                                        <option>14:30</option>
                                        <option>15:00</option>
                                        <option>15:30</option>
                                        <option>16:00</option>
                                        <option>16:30</option>
                                        <option>17:00</option>
                                        <option>17:30</option>
                                        <option>18:00</option>
                                        <option>18:30</option>
                                        <option>19:00</option>
                                        <option>19:30</option>
                                        <option>20:00</option>
                                        <option>20:30</option>
                                        <option>21:00</option>
                                        <option>22:30</option>
                                        <option>23:00</option>
                                        <option>23:30</option>
                                    </select>
                                </span>
                            </div>
                            <div>
                                <span>Horario Termino</span>
                                <span>
                                    <select name="termino" onChange={this.onChangeInput} value={this.state.form.termino} className="input-generico">
                                        <option>00:00</option>
                                        <option>00:30</option>
                                        <option>01:00</option>
                                        <option>01:30</option>
                                        <option>02:00</option>
                                        <option>02:30</option>
                                        <option>03:00</option>
                                        <option>03:30</option>
                                        <option>04:00</option>
                                        <option>04:30</option>
                                        <option>05:00</option>
                                        <option>05:30</option>
                                        <option>06:00</option>
                                        <option>06:30</option>
                                        <option>07:00</option>
                                        <option>07:30</option>
                                        <option>08:00</option>
                                        <option>08:30</option>
                                        <option>09:00</option>
                                        <option>09:30</option>
                                        <option>10:00</option>
                                        <option>10:30</option>
                                        <option>11:00</option>
                                        <option>11:30</option>
                                        <option>12:00</option>
                                        <option>12:30</option>
                                        <option>13:00</option>
                                        <option>13:30</option>
                                        <option>14:00</option>
                                        <option>14:30</option>
                                        <option>15:00</option>
                                        <option>15:30</option>
                                        <option>16:00</option>
                                        <option>16:30</option>
                                        <option>17:00</option>
                                        <option>17:30</option>
                                        <option>18:00</option>
                                        <option>18:30</option>
                                        <option>19:00</option>
                                        <option>19:30</option>
                                        <option>20:00</option>
                                        <option>20:30</option>
                                        <option>21:00</option>
                                        <option>22:30</option>
                                        <option>23:00</option>
                                        <option>23:30</option>
                                    </select>
                                </span>
                            </div>
                            <div>
                                <span>Frecuencia</span>
                                <span>
                                    <select name="frecuencia" onChange={this.onChangeInputFrecuencia} value={this.state.frecuencia} className="input-generico">
                                        <option value="">Seleccione una categoría</option>
                                        <option value="1">No se repite</option>
                                        <option value="2">Cada día del mes</option>
                                        <option value="3">Cada semana del mes</option>
                                        <option value="4">Todos los días laborales del mes <br /> (de lunes a viernes)</option>
                                        <option value="5">Personalizado</option>
                                    </select>
                                </span>
                            </div>
                            {this.state.labelFrecuencia &&
                                <div>
                                    <span></span>
                                    <span>{this.state.labelFrecuencia}</span>
                                </div>
                            }
                            <h3 className="verde">Trabajadores*</h3>
                            <div>
                                <span>Jefe de Cuadrilla</span>
                                <span>
                                    <select name="jefe" onChange={this.onChangeInput} value={this.state.jefe} className="input-generico">
                                        <option>Seleccionar</option>
                                        {jefes}
                                    </select>
                                </span>
                            </div>
                            <div>
                                <span>trabajadores</span>
                                <span>
                                    <select name="selectTrabajador" onChange={this.onChangeTrabajadores} value={this.state.selectTrabajador} className="input-generico">
                                        <option>Seleccionar</option>
                                        {trabajadores}
                                    </select>
                                </span>
                            </div>
                            {trabajadoresAsignados}
                            <div className="form-group buttons">
                                <button className="boton-generico btazulalt" data-objetivo="FrecuenciaRetiro" onClick={this.volver} >Cancelar</button>
                                <button className="boton-generico btazul" onClick={this.enviaDatos} type="button" >Guardar</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="modales">
                    <Modal
                        name="FrecuenciaRetiro"  //nombre del estado que controla el modal
                        show={this.state.showFrecuenciaRetiro} //indicamos la propiedad show con el estado que controlara al modal
                        contenido={<FrecuenciaTurno />} //entregamos el componente que se renderizara en el modal 
                        fecha={this.state.form.fecha}
                        toogleModal={this.manejadorModals}
                        frecuenciaPersonalizada={this.frecuenciaPersonalizada}//traspasamos la funcion que permitira abrir y cerrar el modal
                    // agregaPregunta={this.agregaPregunta} //agregamos la funcion que se le enviara al modal
                    />
                </div>
            </div>
        );
    }
}