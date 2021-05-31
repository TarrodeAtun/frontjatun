// importaciones de bibliotecas 
import React, { Component } from "react";
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

// importaciones de estilos 
import '../../styles/fichaTrabajador.css';

//componentes
import FrecuenciaRetiro from './frecuenciaRetiro';


// importaciones de iconos 
import { ReactComponent as Bverderev } from "../../assets/iconos/bverderev.svg";
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
            centros: '',
            clientes: '',
            comunas: '',
            ordenesNoAsignadas: '',
            frecuenciaArray: [],
            DOMretiros: '',
            showFrecuenciaRetiro: '',
            frecuencia: '',
            codigos: '',
            categorias: '',
            form: {
                centro: '',
                clienterut: '',
                direccion: '',
                comuna: '',
                codigoler: '',
                categoria: '',
                fecha: '',
                inicio: '00:00',
                termino: '00:00',
            },
            retiros: []
        };

    }

    toogleModal = toogleModalCore; //copiamos la funcion modal a una funcion local

    manejadorModals = (e, res) => {
        this.toogleModal(e, res);
    }

    componentDidMount = () => {
        this.obtenerClientes();
        this.obtenerCentros();
        this.obtenerComunas();
        this.obtenerOrdenesNoAsignadas();
        this.obtenerCodigosLer();
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
    obtenerCentros = async () => { //genera una peticion get por axios a la api de usuarios
        var componente = this;
        const res = Axios.get('/api/generales/centroscostos/', { headers: authHeader() }) //se envia peticion axios con el token sesion guardado en local storage como cabecera
            .then(function (res) {   //si la peticion es satisfactoria entonces
                console.log(res.data.data)
                componente.setState({ centros: res.data.data });  //almacenamos el listado de usuarios en el estado usuarios (array)
            })
            .catch(function (err) { //en el caso de que se ocurra un error, axios lo atrapa y procesa
                handleResponse(err.response);  //invocamos al manejador para ver el tipo de error y ejecutar la accion pertinente
                return;
            });
    }
    obtenerOrdenesNoAsignadas = async () => { //genera una peticion get por axios a la api de usuarios
        var componente = this;
        const res = Axios.get('/api/gestion-residuos/ordenes-retiro/no-asignados', { headers: authHeader() }) //se envia peticion axios con el token sesion guardado en local storage como cabecera
            .then(function (res) {   //si la peticion es satisfactoria entonces
                console.log(res.data.data);
                componente.setState({ ordenesNoAsignadas: res.data.data });  //almacenamos el listado de usuarios en el estado usuarios (array)
            })
            .catch(function (err) { //en el caso de que se ocurra un error, axios lo atrapa y procesa
                handleResponse(err.response);  //invocamos al manejador para ver el tipo de error y ejecutar la accion pertinente
                return;
            });
    }
    obtenerComunas = async () => { //genera una peticion get por axios a la api de usuarios
        var componente = this;
        const res = Axios.get('/api/generales/comunas/', { headers: authHeader() }) //se envia peticion axios con el token sesion guardado en local storage como cabecera
            .then(function (res) {   //si la peticion es satisfactoria entonces
                componente.setState({ comunas: res.data.data });  //almacenamos el listado de usuarios en el estado usuarios (array)
            })
            .catch(function (err) { //en el caso de que se ocurra un error, axios lo atrapa y procesa
                handleResponse(err.response);  //invocamos al manejador para ver el tipo de error y ejecutar la accion pertinente
                return;
            });
    }
    obtenerCodigosLer = async () => { //genera una peticion get por axios a la api de usuarios
        var componente = this;
        const res = Axios.get('/api/generales/codigosler/', { headers: authHeader() }) //se envia peticion axios con el token sesion guardado en local storage como cabecera
            .then(function (res) {   //si la peticion es satisfactoria entonces
                console.log(res.data.data);
                componente.setState({ codigos: res.data.data });  //almacenamos el listado de usuarios en el estado usuarios (array)
            })
            .catch(function (err) { //en el caso de que se ocurra un error, axios lo atrapa y procesa
                handleResponse(err.response);  //invocamos al manejador para ver el tipo de error y ejecutar la accion pertinente
                return;
            });
    }
    obtenerCategoriasLer = async () => { //genera una peticion get por axios a la api de usuarios
        var componente = this;
        console.log(this.state.form.codigoler);
        const res = Axios.post('/api/generales/categoriasler/', { codigo: this.state.form.codigoler }, { headers: authHeader() }) //se envia peticion axios con el token sesion guardado en local storage como cabecera
            .then(function (res) {   //si la peticion es satisfactoria entonces
                console.log(res.data.data);
                componente.setState({ categorias: res.data.data });  //almacenamos el listado de usuarios en el estado usuarios (array)
            })
            .catch(function (err) { //en el caso de que se ocurra un error, axios lo atrapa y procesa
                handleResponse(err.response);  //invocamos al manejador para ver el tipo de error y ejecutar la accion pertinente
                return;
            });
    }

    changeOR = async (index, e) => {
        console.log(e);
        var retiros = await this.state.retiros;
        console.log(retiros);
        retiros[index].or = e.target.value;
        this.setState({ retiros: retiros });
    }

    onChangeInputFrecuencia = async (e) => {
        await this.setState({ frecuencia: e.target.value });
        this.onChangeFrecuencia();
    }
    onChangeInputFecha = async (e) => {
        await this.setState({
            form: {
                ...this.state.form, [e.target.name]: e.target.value
            }
        })
        this.onChangeFrecuencia();
    }

    onChangeInput = (e) => {
        this.setState({
            form: {
                ...this.state.form, [e.target.name]: e.target.value
            }
        })
    }

    onChangeCodigo = async (e) => {
        console.log(e.target.value);
        await this.setState({
            form: {
                ...this.state.form, [e.target.name]: e.target.value
            }
        })
        if (e.target.value !== "") {
            this.obtenerCategoriasLer();
        }

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
                var otrafecha = new Date(fecha);
                var dia = otrafecha.getDate() + 1;
                var registro = {};
                var arrayasd = [];
                var retiros = [];
                var preDOM;
                registro = await {
                    fecha: new Date(otrafecha.getFullYear(), otrafecha.getMonth(), dia),
                    horaInicio: inicio,
                    horaTermino: termino
                }
                await arrayasd.push(registro);
                await componente.setState({ frecuenciaArray: arrayasd });
                preDOM = await arrayasd.map((orden, index) => {
                    retiros.push({ fecha: moment(orden.fecha).utc().format('YYYY-MM-DD'), or: '' });
                    return (<tr>
                        <td><input type="hidden" value={orden.fecha} />{funciones.nombreDia(orden.fecha)} {orden.fecha.getDate()}/{orden.fecha.getMonth() + 1}/{orden.fecha.getFullYear()} </td>
                        <td>{this.state.form.inicio} - {this.state.form.termino}</td>
                        <td>
                            <select onChange={e => this.changeOR(index, e)}>
                                <option>Seleccione...</option>
                                {this.optionsOrdenesAsignadas(orden.fecha)}
                            </select>
                        </td>
                    </tr>)
                });
                await componente.setState({ DOMretiros: preDOM, retiros: retiros });
            } else {
                toast.warning("Debe seleccionar una fecha primero", toastoptions);
                this.setState({ frecuencia: '' });
            }
        }
        if (eleccion === "2") {
            if (fecha) {
                var otrafecha = new Date(fecha);
                var primer = new Date(otrafecha.getFullYear(), otrafecha.getMonth(), 1);
                var ultimo = new Date(otrafecha.getFullYear(), otrafecha.getMonth() + 1, 0);
                var numdias = ultimo.getDate();
                var registro = {};
                var arrayasd = [];
                var preDOM;
                var dia = otrafecha.getDate() + 1;
                var retiros = [];
                for (dia; dia <= numdias; dia++) {
                    registro = {
                        fecha: new Date(otrafecha.getFullYear(), otrafecha.getMonth(), dia),
                        horaInicio: inicio,
                        horaTermino: termino
                    }
                    arrayasd.push(registro);
                }
                console.log(arrayasd);
                await componente.setState({ frecuenciaArray: arrayasd });
                preDOM = await arrayasd.map((orden, index) => {
                    console.log(orden.fecha);
                    retiros.push({ fecha: moment(orden.fecha).utc().format('YYYY-MM-DD'), or: '' });
                    return (<tr>
                        <td><input type="hidden" value={orden.fecha} />{funciones.nombreDia(orden.fecha)} {orden.fecha.getDate()}/{orden.fecha.getMonth() + 1}/{orden.fecha.getFullYear()} </td>
                        <td>{this.state.form.inicio} - {this.state.form.termino}</td>
                        <td>
                            <select onChange={e => this.changeOR(index, e)}>
                                <option>Seleccione...</option>
                                {this.optionsOrdenesAsignadas(orden.fecha)}
                            </select>
                        </td>
                    </tr>)
                }
                );
                await this.setState({ retiros: retiros });
                console.log(this.state.retiros);
                await componente.setState({ DOMretiros: preDOM });
            } else {
                toast.warning("Debe seleccionar una fecha primero", toastoptions);
                this.setState({ frecuencia: '' });
            }
        }

        if (eleccion === "3") {
            if (fecha) {
                var otrafecha = new Date(fecha);
                var actual = otrafecha.getDate();
                var ultimo = new Date(otrafecha.getFullYear(), otrafecha.getMonth() + 1, 0);
                var numdias = ultimo.getDate();
                var nextweek = new Date(otrafecha.getFullYear(), otrafecha.getMonth(), otrafecha.getDate() + 7);
                var dia = otrafecha.getDate() + 1
                var registro = {};
                var arrayasd = [];
                var preDOM;
                var retiros = [];
                for (dia; dia <= numdias; dia = dia + 7) {
                    registro = {
                        fecha: new Date(otrafecha.getFullYear(), otrafecha.getMonth(), dia),
                        horaInicio: inicio,
                        horaTermino: termino
                    }
                    arrayasd.push(registro);
                }
                await componente.setState({ frecuenciaArray: arrayasd });
                preDOM = await arrayasd.map((orden, index) => {
                    retiros.push({ fecha: moment(orden.fecha).utc().format('YYYY-MM-DD'), or: '' });
                    return (<tr>
                        <td><input type="hidden" value={orden.fecha} />{funciones.nombreDia(orden.fecha)} {orden.fecha.getDate()}/{orden.fecha.getMonth() + 1}/{orden.fecha.getFullYear()} </td>
                        <td>{this.state.form.inicio} - {this.state.form.termino}</td>
                        <td>
                            <select onChange={e => this.changeOR(index, e)}>
                                <option>Seleccione...</option>
                                {this.optionsOrdenesAsignadas(orden.fecha)}
                            </select>
                        </td>
                    </tr>)
                }
                );
                await componente.setState({ retiros: retiros });
                await componente.setState({ DOMretiros: preDOM });
                console.log(nextweek);
            } else {
                toast.warning("Debe seleccionar una fecha primero", toastoptions);
                this.setState({ frecuencia: '' });
            }
        }

        if (eleccion === "4") {
            if (fecha) {
                var otrafecha = new Date(fecha);
                var primer = new Date(otrafecha.getFullYear(), otrafecha.getMonth(), 1);
                var ultimo = new Date(otrafecha.getFullYear(), otrafecha.getMonth() + 1, 0);
                var numdias = ultimo.getDate();
                var dia = otrafecha.getDate() + 1;
                var registro = {};
                var arrayasd = [];
                var preDOM;
                var retiros = [];
                for (dia; dia <= numdias; dia++) {
                    var fechaProvisoria = new Date(otrafecha.getFullYear(), otrafecha.getMonth(), dia);
                    if (fechaProvisoria.getDay() !== 0 && fechaProvisoria.getDay() !== 6) {
                        registro = {
                            fecha: new Date(otrafecha.getFullYear(), otrafecha.getMonth(), dia),
                            horaInicio: inicio,
                            horaTermino: termino
                        }
                        arrayasd.push(registro);
                    }
                }
                await componente.setState({ frecuenciaArray: arrayasd });
                preDOM = await arrayasd.map((orden, index) => {
                    retiros.push({ fecha: moment(orden.fecha).utc().format('YYYY-MM-DD'), or: '' });
                    return (<tr>
                        <td><input type="hidden" value={orden.fecha} />{funciones.nombreDia(orden.fecha)} {orden.fecha.getDate()}/{orden.fecha.getMonth() + 1}/{orden.fecha.getFullYear()} </td>
                        <td>{this.state.form.inicio} - {this.state.form.termino}</td>
                        <td>
                            <select onChange={e => this.changeOR(index, e)}>
                                <option>Seleccione...</option>
                                {this.optionsOrdenesAsignadas(orden.fecha)}
                            </select>
                        </td>
                    </tr>)
                }
                );
                await componente.setState({ retiros: retiros });
                await componente.setState({ DOMretiros: preDOM });
            } else {
                toast.warning("Debe seleccionar una fecha primero", toastoptions);
                this.setState({ frecuencia: '' });
            }
        }
        if (eleccion === "5") {
            if (fecha) {
                this.setState({ showFrecuenciaRetiro: true });
            } else {
                toast.warning("Debe seleccionar una fecha primero", toastoptions);
                this.setState({ frecuencia: '' });
            }
        }
    }
    optionsOrdenesAsignadas = (fecha) => {
        let ordenes;
        console.log(fecha);
        var fechaRe = moment(fecha).utc().format('YYYY-MM-DD')
        if (this.state.ordenesNoAsignadas) {
            console.log(this.state.ordenesNoAsignadas);
            ordenes = this.state.ordenesNoAsignadas.map((orden, index) => {
                console.log(moment(orden.retiro).utc().format('YYYY-MM-DD'));
                console.log(fechaRe);
                if (moment(orden.retiro).utc().format('YYYY-MM-DD') === fechaRe) {
                    return (<option value={orden.idor} >{orden.idor}</option>)
                }
                else {console.log("no");}
            }
            )
        }
        return ordenes;
    }
    frecuenciaPersonalizada = (datos) => {
        var retiros = [];
        var preDOM = datos.map((orden, index) => {
            var fecha = moment(orden.fecha).utc().format('YYYY-MM-DD');
            console.log(orden.fecha);
            console.log(fecha);
            retiros.push({ fecha: moment(orden.fecha).utc().format('YYYY-MM-DD'), or: '' });
            return (<tr>
                <td><input type="hidden" value={orden.fecha} />{funciones.nombreDia(orden.fecha)} {orden.fecha.getDate()}/{orden.fecha.getMonth() + 1}/{orden.fecha.getFullYear()} </td>
                <td>{this.state.form.inicio} - {this.state.form.termino}</td>
                <td>
                    <select onChange={e => this.changeOR(index, e)}>
                        <option value="">Seleccione...</option>
                        {this.optionsOrdenesAsignadas(orden.fecha)}
                    </select>
                </td>
            </tr>)
        }
        );
        this.setState({ retiros: retiros });
        this.setState({ DOMretiros: preDOM });
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
                                Axios.post('/api/bienestar/soporte/consulta/finalizar', {

                                },
                                    { headers: authHeader() }) //se envia peticion axios con el token sesion guardado en local storage como cabecera
                                    .then(function (res) {   //si la peticion es satisfactoria entonces
                                        componente.cargarMensajes();
                                        componente.setState({ estado: "1" });
                                        toast.success("¡Se ha finalizado la consulta, no se pueden agregar más mensajes!")
                                        onClose();
                                    })
                                    .catch(function (err) { //en el caso de que se ocurra un error, axios lo atrapa y procesa
                                        handleResponse(err.response);  //invocamos al manejador para ver el tipo de error y ejecutar la accion pertinente
                                        return;
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

    pushLista = () => {
        historial.push("/residuos/control-retiro/programacion-retiro");
    }



    enviaDatos = async e => {
        e.preventDefault();
        var campoVacio = false;
        console.log(this.state.retiros);
        console.log(this.state.form);
        await Object.entries(this.state.form).map((t, k) => {
            if (t[1] === "" || t[1] === null) {
                campoVacio = true;
            }
        });
        if (!campoVacio) {
            const res = await Axios.post('/api/gestion-residuos/retiros/create/', {
                centro: this.state.form.centro,
                clienterut: this.state.form.clienterut,
                direccion: this.state.form.direccion,
                comuna: this.state.form.comuna,
                codigoler: this.state.form.codigoler,
                categoria: this.state.form.categoria,
                fecha: this.state.form.fecha,
                inicio: this.state.form.inicio,
                termino: this.state.form.termino,
                or: this.state.retiros
            }, { headers: authHeader() })
                .then(respuesta => {
                    // this.setState({ idUsuario: respuesta.data.id });
                    if (respuesta.data.estado === "success") {
                        // toast.success(respuesta.data.mensaje, toastoptions);
                        // historial.push("/residuos/control-retiro/programacion-retiro");
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

        let centrocostos;
        if (this.state.centros) {
            centrocostos = this.state.centros.map((centro, index) =>
                <option value={centro.key} >{centro.nombre}</option>
            )
        }

        let codigosler;
        if (this.state.codigos) {
            codigosler = this.state.codigos.map((codigo, index) =>
                <option value={codigo.codigo} >{codigo.codigo}</option>
            )
        }
        let categoriasler;
        if (this.state.categorias) {
            categoriasler = this.state.categorias.map((categoria, index) =>
                <option value={categoria.key} >{categoria.categoria}</option>
            )
        }
        let comunas;
        if (this.state.comunas) {
            this.state.comunas.map((region, index) => {
                comunas = region.comunas.map((comuna, ind) =>
                    <option value={ind} >{comuna}</option>
                )
            })
        }


        return (
            <div className="principal" id="component-perfil">
                <div>
                    <h2 className="verde"><button className="boton-vacio" onClick={this.volver}> <Bverderev /> </button><span>Programación Retiro</span> / <strong>Crear Retiro</strong></h2>
                    <div className="fichaPerfil">
                        <div className="seccion">
                            <h3 className="verde">Cliente *</h3>
                            <div>
                                <span>Cliente</span>
                                <span>
                                    <select name="clienterut" onChange={this.onChangeInput} className="input-generico" value={this.state.form.clienterut} >
                                        <option>Seleccione Cliente</option>
                                        {clientes}
                                    </select>
                                </span>
                            </div>
                            <div>
                                <span>Centro Costos</span>
                                <span>
                                    <select name="centro" onChange={this.onChangeInput} value={this.state.form.centro} className="input-generico">
                                        <option>Seleccione Centro de Costos</option>
                                        {centrocostos}
                                    </select>
                                </span>
                            </div>
                            <h3 className="verde">Establecimiento *</h3>
                            <div>
                                <span>Direccion</span>
                                <span><input type="text" onChange={this.onChangeInput} value={this.state.form.direccion} name="direccion" className="input-generico" /></span>
                            </div>
                            {/* <div>
                                <span>Ciudad</span>
                                <span><select className="input-generico">
                                    <option>Cliente 1</option>
                                    <option>Cliente 2</option>
                                    <option>Cliente 3</option>
                                </select></span>
                            </div> */}
                            <div>
                                <span>Comuna</span>
                                <span><select name="comuna" value={this.state.form.comuna} onChange={this.onChangeInput} className="input-generico">
                                    <option>Seleccione Comuna</option>
                                    {comunas}
                                </select></span>
                            </div>
                            <h3 className="verde">Tipo residuo (código LER) *</h3>
                            <div>
                                <span>Código</span>
                                <span><select name="codigoler" onChange={this.onChangeCodigo} value={this.state.form.codigoler} className="input-generico">
                                    <option value="">Seleccione un código</option>
                                    {codigosler}
                                </select></span>
                            </div>
                            <div>
                                <span>Categoria</span>
                                <span>
                                    <select name="categoria" onChange={this.onChangeInput} value={this.state.form.categoria} className="input-generico">
                                        <option>Seleccione una categoría</option>
                                        {categoriasler}
                                    </select>
                                </span>
                            </div>
                            <h3 className="verde">Fecha y Frecuencia*</h3>
                            <div>
                                <span>Fecha</span>
                                <span><input type="date" onChange={this.onChangeInputFecha} value={this.state.form.fecha} className="input-generico" name="fecha" /></span>
                            </div>
                            <div>
                                <span>Horario Inicio</span>
                                <span>
                                    <select name="inicio" onChange={this.onChangeInputFecha} value={this.state.form.inicio} className="input-generico">
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
                                    <select name="termino" onChange={this.onChangeInputFecha} value={this.state.form.termino} className="input-generico">
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
                            <h3 className="verde">retiros*</h3>
                            <div>
                                <table>
                                    <thead>
                                        <th>Fecha</th>
                                        <th>hora</th>
                                        <th>OR</th>
                                    </thead>
                                    <tbody ref={this.myRef}>
                                        {this.state.DOMretiros}
                                    </tbody>
                                </table>
                            </div>
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
                        contenido={<FrecuenciaRetiro />} //entregamos el componente que se renderizara en el modal 
                        fecha={this.state.form.fecha}
                        toogleModal={this.manejadorModals}
                        inicio={this.state.form.inicio}
                        termino={this.state.form.termino}
                        frecuenciaPersonalizada={this.frecuenciaPersonalizada}//traspasamos la funcion que permitira abrir y cerrar el modal
                    // agregaPregunta={this.agregaPregunta} //agregamos la funcion que se le enviara al modal
                    />
                </div>
            </div>
        );
    }
}