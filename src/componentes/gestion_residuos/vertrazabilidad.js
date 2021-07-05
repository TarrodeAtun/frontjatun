// importaciones de bibliotecas 
import React, { Component, Fragment } from "react";
import { autenticacion } from '../../servicios/autenticacion';
import { Link } from 'react-router-dom';
import { confirmAlert } from 'react-confirm-alert';
import Axios from '../../helpers/axiosconf';
import { authHeader } from '../../helpers/auth-header';
import { handleResponse } from '../../helpers/manejador';
import moment from 'moment';
import { toast } from 'react-toastify';
import Modal from '../includes/modal';
import { toogleModalCore } from '../includes/funciones';


// importaciones de estilos 
import '../../styles/fichaTrabajador.css';

import AgregarResiduoTrazabilidad from './agregarResiduoTrazabilidad';

// importaciones de iconos 
import fichaper from "../../assets/iconos/fichaper.svg";
import turnos from "../../assets/iconos/turnos.svg";
import { ReactComponent as Bverderev } from "../../assets/iconos/bverderev.svg";
import { ReactComponent as Flechaver } from "../../assets/iconos/flechaver.svg";
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


export default class VerTrazabilidad extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentUser: autenticacion.currentUserValue,
            datosUsuarios: "",
            idor: '',
            retiro: '',
            tarjeta: '',
            contactoNombre: '',
            contactoEmail: '',
            direccion: '',
            comuna: '',
            establecimientoID: '',
            vuretc: '',
            detalle: '',
            datosCliente: '',
            datosCentro: '',
            datosConductor: '',
            datosServicio: '',
            datosTrazabilidad: '',
            datosRuta: '',
            datosRetiro: '',
            datosLer: '',

            codigoLer: '',
            categoriaLer: '',
            residuosagregado: [],

            pesoPrimer: '',
            nombreEntrega: '',
            rutEntrega: '',
            tipoTarjeta: '',
            comentarios: '',
            pesoSegundo: '',
            sacas: '',
            planificacion: '',
            codigo: '',

            imagen: '',
            guiadespacho: '',
            getimagen: {
                name: '',
                link: ''
            },
            getguiadespacho: {
                name: '',
                link: ''
            }

        };
    }

    toogleModal = toogleModalCore;

    manejadorModals = (e, res) => {
        this.toogleModal(e, res);
    }

    componentDidMount = () => {
        this.obtenerOrden();
    }

    pad = (num, size) => {
        var s = "00000000" + num;
        s = s.substr(s.length - size);
        var f = s.substr(0, 4);
        var l = s.substr(4, 7);

        return f + " " + l;
    }

    agregarResiduo = (datos) => {
        const residuo = {
            subcategoria: datos.subcategoria,
            label: datos.label,
            pesoClasif: '',
            sacas: '',
            planificacion: '',
            destino: ''
        }
        this.setState({
            residuosagregado: [...this.state.residuosagregado, residuo]
        })
    }

    obtenerOrden = async () => {
        var componente = this;
        var { id } = this.props.match.params;
        this.setState({ idOrden: id });
        const res = Axios.get('/api/gestion-residuos/trazabilidad/orden/' + id, { headers: authHeader() }) //se envia peticion axios con el token sesion guardado en local storage como cabecera
            .then(function (res) {   //si la peticion es satisfactoria entonces
                console.log(res.data.datosTrazabilidad);
                componente.setState({
                    idor: res.data.data.idor,
                    retiro: res.data.data.retiro,
                    tarjeta: res.data.data.tarjeta,
                    contactoNombre: res.data.data.contactoNombre,
                    contactoEmail: res.data.data.contactoEmail,
                    direccion: res.data.data.direccion,
                    comuna: res.data.data.comuna,
                    establecimientoID: res.data.data.establecimientoID,
                    vuretc: res.data.data.vuretc,
                    detalle: res.data.data.detalle,
                    datosCliente: res.data.data.datosCliente,
                    datosCentro: res.data.data.datosCentro,
                    datosConductor: res.data.data.idor,
                    datosConductor: res.data.data.datosConductor,
                    datosServicio: res.data.data.datosServicio,
                    datosTrazabilidad: res.data.data.datosTrazabilidad,
                    datosRuta: res.data.data.datosRuta,
                    datosRetiro: res.data.data.datosRetiro,
                    datosLer: res.data.data.datosLer,
                    codigoLer: res.data.data.datosRetiro[0].codigoler,
                    categoriaLer: res.data.data.datosRetiro[0].categoria,
                    residuosagregado: '',

                });
                if (componente.state.datosTrazabilidad[0]) {
                    console.log(":D");
                    if (componente.state.datosTrazabilidad[0].pesoPrimer) { componente.setState({ pesoPrimer: componente.state.datosTrazabilidad[0].pesoPrimer }) }
                    if (componente.state.datosTrazabilidad[0].nombreEntrega) { componente.setState({ nombreEntrega: componente.state.datosTrazabilidad[0].nombreEntrega }) }
                    if (componente.state.datosTrazabilidad[0].rutEntrega) { componente.setState({ rutEntrega: componente.state.datosTrazabilidad[0].rutEntrega }) }
                    if (componente.state.datosTrazabilidad[0].tipoTarjeta) { componente.setState({ tipoTarjeta: componente.state.datosTrazabilidad[0].tipoTarjeta }) }
                    if (componente.state.datosTrazabilidad[0].comentarios) { componente.setState({ comentarios: componente.state.datosTrazabilidad[0].comentarios }) }
                    if (componente.state.datosTrazabilidad[0].pesoSegundo) { componente.setState({ pesoSegundo: componente.state.datosTrazabilidad[0].pesoSegundo }) }
                    if (componente.state.datosTrazabilidad[0].sacas) { componente.setState({ sacas: componente.state.datosTrazabilidad[0].sacas }) }
                    if (componente.state.datosTrazabilidad[0].planificacion) { componente.setState({ planificacion: componente.state.datosTrazabilidad[0].planificacion }) }
                    if (componente.state.datosTrazabilidad[0].codigo) { componente.setState({ codigo: componente.state.datosTrazabilidad[0].codigo }) }
                }
            })
            .catch(function (err) { //en el caso de que se ocurra un error, axios lo atrapa y procesa
                console.log(err);
                handleResponse(err.response);  //invocamos al manejador para ver el tipo de error y ejecutar la accion pertinente
                return;
            });
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

    onChangeResiduo = (e) => {
        const llave = e.target.dataset.key;
        let residuosagregado = this.state.residuosagregado;
        residuosagregado[llave][e.target.name] = e.target.value;
        this.setState({ residuosagregado: residuosagregado });
    }
    onChangeInput = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }
    onChangeFileInput = (e) => {
        console.log(e.target.files[0]);
        this.setState({
            [e.target.name]: e.target.files[0]
        })
    }

    pushLista = () => {
        historial.push("/residuos/trazabilidad");
    }

    enviaDatosUno = async e => {
        var componente = this;
        var { id } = this.props.match.params;
        e.preventDefault();
        var campoVacio = false;
        var formData = new FormData();
        formData.append('idor', this.state.idor);
        formData.append('imagen', this.state.imagen);
        formData.append('guiadespacho', this.state.guiadespacho);
        formData.append('pesoPrimer', this.state.pesoPrimer);
        formData.append('nombreEntrega', this.state.nombreEntrega);
        formData.append('rutEntrega', this.state.rutEntrega);
        formData.append('tipoTarjeta', this.state.tipoTarjeta);
        formData.append('comentarios', this.state.comentarios);

        for (var elem of formData.entries()) {
            if (elem[1] === "" || elem[1] === null) {
                campoVacio = true;
            }
        }
        if (!campoVacio) {
            const res = await Axios.post('/api/gestion-residuos/trazabilidad/etapauno/', formData, { headers: authHeader() })
                .then(respuesta => {
                    // this.setState({ idUsuario: respuesta.data.id });
                    if (respuesta.data.estado === "success") {
                        toast.success(respuesta.data.mensaje, toastoptions);
                        historial.push("/residuos/trazabilidad");
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
    enviaDatosDos = async e => {
        var componente = this;
        var { id } = this.props.match.params;
        e.preventDefault();
        var campoVacio = false;
        var formData = new FormData();
        formData.append('idor', this.state.idor);
        formData.append('pesoSegundo', this.state.pesoSegundo);
        formData.append('sacas', this.state.sacas);
        formData.append('planificacion', this.state.planificacion);
        formData.append('codigo', this.state.codigo);
        for (var elem of formData.entries()) {
            if (elem[1] === "" || elem[1] === null) {
                campoVacio = true;
            }
        }
        if (!campoVacio) {
            const res = await Axios.post('/api/gestion-residuos/trazabilidad/etapados/', formData, { headers: authHeader() })
                .then(respuesta => {
                    // this.setState({ idUsuario: respuesta.data.id });
                    if (respuesta.data.estado === "success") {
                        toast.success(respuesta.data.mensaje, toastoptions);
                        historial.push("/residuos/trazabilidad");
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
    enviaDatosTres = async e => {
        var componente = this;
        var { id } = this.props.match.params;
        e.preventDefault();
        var campoVacio = false;
        await Object.entries(this.state.residuosagregado).map((t, k) => {
            let valores = t[1];
            const keys = Object.keys(valores);
            console.log(valores);
            keys.forEach((key, index) => {
                if (valores[key] === "" || valores[key] === null) {
                    campoVacio = true;
                }
            });
        });
        if (!campoVacio) {
            console.log(this.state.residuosagregado);
            const res = await Axios.post('/api/gestion-residuos/trazabilidad/etapatres/', {
                idor: this.state.idor,
                residuos: this.state.residuosagregado,
            }, { headers: authHeader() })
                .then(respuesta => {
                    // this.setState({ idUsuario: respuesta.data.id });
                    if (respuesta.data.estado === "success") {
                        toast.success(respuesta.data.mensaje, toastoptions);
                        // historial.push("/residuos/trazabilidad");
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
        let items;
        if (this.state.residuosagregado) {
            items = this.state.residuosagregado.map((residuo, index) => {
                return (<Fragment key={index}>
                    <div className="prehead wauto">
                        <h3 className="amarillo">{this.state.codigoLer} - {this.state.datosLer[0].categoria} - {residuo.label}</h3>
                        {/* <button className="ml verde"><Basurero /></button> */}
                    </div>
                    <div>
                        <span>Peso de acuerdo a clasif.</span>
                        <span><input type="number" className="input-generico" value={residuo.pesoClasif} onChange={this.onChangeResiduo} data-key={index} name="pesoClasif"></input></span>
                    </div>
                    <div>
                        <span>N° Sacas</span>
                        <span> <input type="number" className="input-generico" value={residuo.sacas} onChange={this.onChangeResiduo} data-key={index} name="sacas"></input></span>
                    </div>
                    <div>
                        <span>Planificación Tratamiento</span>
                        <span>
                            <select className="input-generico" value={residuo.planificacion} onChange={this.onChangeResiduo} data-key={index} name="planificacion">
                                <option value=""></option>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                            </select>
                        </span>
                    </div>
                    <div>
                        <span>Destino del residuo</span>
                        <span>
                            <select className="input-generico" value={residuo.destino} onChange={this.onChangeResiduo} data-key={index} name="destino">
                                <option value=""></option>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                            </select>
                        </span>
                    </div>
                </Fragment>
                )
            });
        }

        return (
            <div className="principal" id="component-perfil">
                <div>
                    <h2 className="verde"><button className="boton-vacio" onClick={this.volver}> <Bverderev /> </button><span>Trazabilidad Residuos</span> / <strong>OR {this.pad(this.state.idor, 8)}</strong></h2>
                    <div className="fichaPerfil">
                        <div className="seccion">
                            <h3 className="verde">Datos OR</h3>
                            <div>
                                <span>N° OR</span>
                                <span> {this.pad(this.state.idor, 8)}</span>
                            </div>
                            <div>
                                <span>Fecha Creación</span>
                                <span>{moment(this.state.createdAt).utc().format('DD/MM/YYYY')}</span>
                            </div>
                            <div>
                                <span>Fecha Retiro</span>
                                <span>{moment(this.state.retiro).utc().format('DD/MM/YYYY')}</span>
                            </div>
                            <div>
                                <span>N° Tarjeta</span>
                                <span>{this.state.tarjeta}</span>
                            </div>
                            <h3 className="verde">Datos Cliente</h3>
                            <div>
                                <span>Cliente</span>
                                {this.state.datosCliente &&
                                    <span>
                                        {this.state.datosCliente[0].nombre}
                                    </span>
                                }
                            </div>
                            <div>
                                <span>Rut</span>
                                {this.state.datosCliente &&
                                    <span>
                                        {this.formatearRutListado(this.state.datosCliente[0].rut, this.state.datosCliente[0].dv)}
                                    </span>
                                }
                            </div>
                            <div>
                                <span>Establecimiento</span>
                                <span className="spanConductor">
                                    <span>Direccion, Comuna</span>
                                    <span>ID {this.state.establecimientoID}</span>
                                    <span>VU-RETC {this.state.vuretc}</span>
                                </span>
                            </div>
                            <div>
                                <span>Nombre Contacto</span>
                                <span>{this.state.contactoEmail}</span>
                            </div>
                            <div>
                                <span>Email Contacto</span>
                                <span>{this.state.contactoEmail}</span>
                            </div>
                            <h3 className="verde">Observaciones</h3>
                            <div>
                                <span>Detalle del Retiro</span>
                                <span>{this.state.detalle}</span>
                            </div>
                            <h3 className="verde">Tipo Residuo (Código LER)</h3>
                            <div>
                                {this.state.datosRetiro &&
                                    <Fragment>
                                        <span>{this.state.datosRetiro[0].codigoler}</span>
                                        <span>{this.state.datosLer[0].categoria}</span>
                                    </Fragment>
                                }
                            </div>
                            {/* <div className="form-group buttons">
                                <button className="boton-generico btazul" onClick={this.enviaDatos}>Guardar</button>
                                <button className="boton-generico btgris" type="button" >Cancelar</button>
                            </div> */}
                        </div>


                        <div className="seccion">
                            <h3 className="verde">Etapa 1 - Conductor</h3>
                            <hr></hr>
                            <h3 className="amarillo">1ra Clasificacion</h3>
                            <div>
                                <span>Nombre Conductor</span>
                                {this.state.datosConductor &&
                                    <span>{this.state.datosConductor[0].nombre} {this.state.datosConductor[0].apellido}</span>
                                }
                            </div>
                            <div>
                                <span>Vehiculo</span>
                                {this.state.datosRuta &&
                                    <span>{this.state.datosRuta[0].patente}</span>
                                }
                            </div>
                            <div>
                                <span>Ruta OR</span>
                                {this.state.datosRuta &&
                                    <span><Link to={this.state.datosRuta[0].enlace}>{this.state.datosRuta[0].enlace}</Link></span>
                                }
                            </div>
                            <div>
                                <span>Tipo de Residuo</span>
                                {this.state.datosRetiro &&
                                    <span>{this.state.datosRetiro[0].codigoler} {this.state.datosRetiro[0].categoria}</span>
                                }
                            </div>
                            <div>
                                <span>Peso</span>
                                <span><input type="number" onChange={this.onChangeInput} className="input-generico" placeholder="kilos" value={this.state.pesoPrimer} name="pesoPrimer" /></span>
                            </div>
                            <div>
                                <span>Nombre quién entrega</span>
                                <span><input className="input-generico" onChange={this.onChangeInput} value={this.state.nombreEntrega} name="nombreEntrega" /></span>
                            </div>
                            <div>
                                <span>Rut quién entrega</span>
                                <span><input className="input-generico" onChange={this.onChangeInput} value={this.state.rutEntrega} name="rutEntrega" /></span>
                            </div>
                            <div>
                                <span>Fecha</span>
                                <span>{moment(this.state.retiro).utc().format('DD/MM/YYYY')}</span>
                            </div>
                            <div>
                                <span>Adjuntar imagen</span>
                                <span><input className="input-generico" onChange={this.onChangeFileInput} type="file" name="imagen" placeholder="Subir archivo" /></span>
                            </div>
                            <div>
                                <span>Tipo de Tarjeta</span>
                                <span><input className="input-generico" onChange={this.onChangeInput} type="number" value={this.state.tipoTarjeta} name="tipoTarjeta" /></span>
                            </div>
                            <div>
                                <span>Guia despacho</span>
                                <span><input className="input-generico" onChange={this.onChangeFileInput} type="file" name="guiadespacho" placeholder="Subir archivo" /></span>
                            </div>
                            <div>
                                <span>Comentarios</span>
                                <span><textarea className="input-generico" onChange={this.onChangeInput} value={this.state.comentarios} name="comentarios" ></textarea></span>
                            </div>
                            <div className="form-group buttons">
                                <button className="boton-generico btazul" onClick={this.enviaDatosUno}>Guardar</button>
                                <button className="boton-generico btgris" type="button" >Cancelar</button>
                            </div>
                        </div>

                        <div className="seccion">
                            <h3 className="verde">Etapa 2 - Jefe Taller</h3>
                            <hr></hr>
                            <h3 className="amarillo">2da Clasificacion</h3>
                            <div>
                                <span>Fecha</span>
                                <span>{moment(this.state.retiro).utc().format('DD/MM/YYYY')}</span>
                            </div>
                            <div>
                                <span>Nombre Jefe Taller</span>
                                {this.state.datosConductor &&
                                    <span>{this.state.datosConductor[0].nombre} {this.state.datosConductor[0].apellido}</span>
                                }
                            </div>
                            <div>
                                <span>Peso</span>
                                <span><input type="number" onChange={this.onChangeInput} className="input-generico" placeholder="kilos" value={this.state.pesoSegundo} name="pesoSegundo" /></span>
                            </div>
                            <div>
                                <span>N° sacas</span>
                                <span><input type="number" onChange={this.onChangeInput} className="input-generico" value={this.state.sacas} name="sacas" /></span>
                            </div>
                            <h3 className="amarillo">
                                {this.state.datosRetiro &&
                                    <Fragment>{this.state.datosRetiro[0].codigoler} -  {this.state.datosLer[0].categoria}</Fragment>
                                }
                            </h3>
                            <div>
                                <span>Planificación tratamiento</span>
                                <span>
                                    <select className="input-generico" onChange={this.onChangeInput} value={this.state.planificacion} name="planificacion">
                                        <option value="1">Separar</option>
                                        <option value="2">Eliminar</option>
                                    </select>
                                </span>
                            </div>
                            <div>
                                <span>Código tratamiento</span>
                                <span>
                                    <select className="input-generico" onChange={this.onChangeInput} value={this.state.codigo} name="codigo">
                                        <option value="11">11 - Relleno Sanitario</option>
                                        <option value="12">12 - Vertedero</option>
                                        <option value="13">13 - Monorelleno</option>
                                        <option value="30">30 - Basural</option>
                                    </select>
                                </span>
                            </div>
                            <div className="form-group buttons">
                                <button className="boton-generico btazul" onClick={this.enviaDatosDos}>Guardar</button>
                                <button className="boton-generico btgris" type="button" >Cancelar</button>
                            </div>
                        </div>


                        <div className="seccion">
                            <h3 className="verde">Etapa 3 - 3ra Clasificación</h3>
                            <hr></hr>
                            <h3 className="amarillo"> 3ra Clasificación</h3>
                            <div>
                                <span>Fecha</span>
                                <span>{moment(this.state.retiro).utc().format('DD/MM/YYYY')}</span>
                            </div>
                            <div>
                                <span>Nombre Operador</span>
                                {this.state.datosConductor &&
                                    <span>{this.state.datosConductor[0].nombre} {this.state.datosConductor[0].apellido}</span>
                                }
                            </div>
                            <hr></hr>
                            <div className="prehead wauto">
                                <h3 className="verde">Residuos</h3>
                                <button className="ml verde" onClick={this.manejadorModals} data-objetivo="AgregarResiduoTrazabilidad">+ Nuevo residuo</button>
                            </div>
                            {items}
                            <div className="form-group buttons">
                                <button className="boton-generico btazul" onClick={this.enviaDatosTres}>Guardar</button>
                                <button className="boton-generico btgris" type="button" >Cancelar</button>
                            </div>
                        </div>

                    </div>
                </div>
                <div id="modales">
                    <Modal
                        name="AgregarResiduoTrazabilidad"  //nombre del estado que controla el modal
                        show={this.state.showAgregarResiduoTrazabilidad} //indicamos la propiedad show con el estado que controlara al modal
                        contenido={<AgregarResiduoTrazabilidad />} //entregamos el componente que se renderizara en el modal 
                        toogleModal={this.manejadorModals}
                        codigo={this.state.codigoLer}
                        categoria={this.state.categoriaLer}
                        agregarResiduo={this.agregarResiduo}//traspasamos la funcion que permitira abrir y cerrar el modal
                    />
                </div>
            </div>
        );
    }
}