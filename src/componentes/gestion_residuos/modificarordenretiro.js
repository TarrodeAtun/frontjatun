// importaciones de bibliotecas 
import React, { Component } from "react";
import { autenticacion } from '../../servicios/autenticacion';
import { Link } from 'react-router-dom';
import { confirmAlert } from 'react-confirm-alert';
import Axios from '../../helpers/axiosconf';
import { authHeader } from '../../helpers/auth-header';
import { handleResponse } from '../../helpers/manejador';
import moment from 'moment';
import { toast } from 'react-toastify';

// importaciones de estilos 
import '../../styles/fichaTrabajador.css';


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


export default class ModificarOrdenRetiro extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentUser: autenticacion.currentUserValue,
            datosUsuarios: "",
            users: null,
            centros: '',
            clientes: '',
            comunas: '',
            idOrden:'',
            clienteSelectRut: '',
            form: {
                idor:'',
                centro: '',
                retiro: '',
                tarjeta: '',
                clienterut: '',
                contactoNombre: '',
                contactoEmail: '',
                direccion: '',
                comuna: '',
                establecimientoID: '',
                vuretc: '',
                detalle: ''
            },
            creado:''
        };
    }

    componentDidMount = () => {
        this.obtenerOrden();
        this.obtenerClientes();
        this.obtenerCentros();
        this.obtenerComunas();
    }

    pad = (num, size) => {
        var s = "00000000" + num;
        s = s.substr(s.length - size);
        var f = s.substr(0, 4);
        var l = s.substr(4, 7);

        return f + " " + l;
    }
    obtenerOrden = async () => {
        var componente = this;
        var { id } = this.props.match.params;
        this.setState({idOrden: id});
        const res = Axios.get('/api/gestion-residuos/ordenes-retiro/obtener/' + id, { headers: authHeader() }) //se envia peticion axios con el token sesion guardado en local storage como cabecera
            .then(function (res) {   //si la peticion es satisfactoria entonces
                console.log(res.data)
                componente.setState({
                    form: {
                        idor:res.data.data.idor,
                        retiro: moment(res.data.data.retiro).utc().format('YYYY-MM-DD'),
                        centro: res.data.data.centro,
                        tarjeta: res.data.data.tarjeta,
                        clienterut: res.data.data.clienterut,
                        contactoNombre: res.data.data.contactoNombre,
                        contactoEmail: res.data.data.contactoEmail,
                        direccion: res.data.data.direccion,
                        comuna: res.data.data.comuna,
                        establecimientoID: res.data.data.establecimientoID,
                        vuretc: res.data.data.vuretc,
                        detalle: res.data.data.detalle
                    },
                    creado: moment(res.data.data.createdAt).utc().format('DD/MM/YYYY')
                });  //almacenamos el listado de usuarios en el estado usuarios (array)
            })
            .catch(function (err) { //en el caso de que se ocurra un error, axios lo atrapa y procesa
                handleResponse(err.response);  //invocamos al manejador para ver el tipo de error y ejecutar la accion pertinente
                return;
            });
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

    onChangeInput = (e) => {
        this.setState({
            form: {
                ...this.state.form, [e.target.name]: e.target.value
            }
        })
    }

    onChangeSelectCiente = (e) => {
        var rut = e.target.value;
        var dv = e.target[e.target.selectedIndex].dataset.dv;
        this.setState({
            form: {
                ...this.state.form, [e.target.name]: e.target.value
            },
            clienteSelectRut: this.formatearRutListado(rut, dv)
        })
    }

    pushLista = () => {
        historial.push("/residuos/control-retiro/orden-retiro");
    }

    enviaDatos = async e => {
        var componente = this;
        var { id } = this.props.match.params;
        e.preventDefault();
        var campoVacio = false;
        console.log(this.state.form);
        await Object.entries(this.state.form).map((t, k) => {
            if (t[1] === "" || t[1] === null) {
                campoVacio = true;
            }
        });
        if (!campoVacio) {
            const res = await Axios.post('/api/gestion-residuos/ordenes-retiro/modificar/', {
                id:this.state.idOrden,
                centro: this.state.form.centro,
                retiro: this.state.form.retiro,
                tarjeta: this.state.form.tarjeta,
                clienterut: this.state.form.clienterut,
                contactoNombre: this.state.form.contactoNombre,
                contactoEmail: this.state.form.contactoEmail,
                direccion: this.state.form.direccion,
                comuna: this.state.form.comuna,
                establecimientoID: this.state.form.establecimientoID,
                vuretc: this.state.form.vuretc,
                detalle: this.state.form.detalle
            }, { headers: authHeader() })
                .then(respuesta => {
                    // this.setState({ idUsuario: respuesta.data.id });
                    if (respuesta.data.estado === "success") {
                        toast.success(respuesta.data.mensaje, toastoptions);
                        historial.push("/residuos/control-retiro/orden-retiro");
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
                    <h2 className="verde"><button className="boton-vacio" onClick={this.volver}> <Bverderev /> </button><span>OR</span> / <strong>OR {this.pad(this.state.form.idor, 8)}</strong></h2>
                    <div className="fichaPerfil">
                        <div className="seccion">
                            <h3 className="verde">Datos OR</h3>
                            <div>
                                <span>N° OR</span>
                                <span> {this.pad(this.state.form.idor, 8)}</span>
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
                            <div>
                                <span>Fecha Creación</span>
                                <span>{this.state.creado}</span>
                            </div>
                            <div>
                                <span>Fecha Retiro</span>
                                <span><input name="retiro" onChange={this.onChangeInput} value={this.state.form.retiro} type="date" className="input-generico" /></span>
                            </div>
                            <div>
                                <span>N° Tarjeta</span>
                                <span><input name="tarjeta" onChange={this.onChangeInput} value={this.state.form.tarjeta} className="input-generico" /></span>
                            </div>
                            <h3 className="verde">Datos Cliente</h3>
                            <div>
                                <span>Cliente</span>
                                <span>
                                    <select name="clienterut" className="input-generico" value={this.state.form.clienterut} onChange={this.onChangeSelectCiente}>
                                        <option>Seleccione Cliente</option>
                                        {clientes}
                                    </select>
                                </span>
                            </div>
                            <div>
                                <span>Rut</span>
                                <span>{this.state.clienteSelectRut}</span>
                            </div>
                            <div>
                                <span>Nombre Contacto</span>
                                <span><input name="contactoNombre" onChange={this.onChangeInput} value={this.state.form.contactoNombre} className="input-generico" /></span>
                            </div>
                            <div>
                                <span>Email Contacto</span>
                                <span><input name="contactoEmail" onChange={this.onChangeInput} value={this.state.form.contactoEmail} className="input-generico" /></span>
                            </div>
                            <h3 className="verde">Establecimiento</h3>
                            <div>
                                <span>Direccion</span>
                                <span><input name="direccion" onChange={this.onChangeInput} value={this.state.form.direccion} className="input-generico" /></span>
                            </div>
                            {/* <div>
                                <span>Ciudad</span>
                                <span><select className="input-generico">
                                    <option>Ciudad 1</option>
                                    <option>Ciudad 2</option>
                                    <option>Ciudad 3</option>
                                </select></span>
                            </div> */}
                            <div>
                                <span>Comuna</span>
                                <span><select name="comuna" onChange={this.onChangeInput} value={this.state.form.comuna} className="input-generico">
                                    <option>Seleccione Comuna</option>
                                    {comunas}
                                </select></span>
                            </div>
                            <div>
                                <span>ID</span>
                                <span><input name="establecimientoID" onChange={this.onChangeInput} value={this.state.form.establecimientoID} className="input-generico" /></span>
                            </div>
                            <div>
                                <span>VU-RETC</span>
                                <span><input name="vuretc" onChange={this.onChangeInput} value={this.state.form.vuretc} className="input-generico" /></span>
                            </div>
                            <h3 className="verde">Observaciones</h3>
                            <div>
                                <span>Detalle del Retiro</span>
                                <span><textarea name="detalle" onChange={this.onChangeInput} value={this.state.form.detalle} rows="6" className="input-generico"
                                /></span>
                            </div>
                            <div className="form-group buttons">
                                <button className="boton-generico btazul" onClick={this.enviaDatos}>Guardar</button>
                                <button className="boton-generico btgris" type="button" >Cancelar</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}