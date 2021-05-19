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

export default class CrearRetiro extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentUser: autenticacion.currentUserValue,
            datosUsuarios: "",
            users: null,
            centros: '',
            clientes: '',
            comunas: '',
            ordenesNoAsignadas: '',
            idRetiro: '',
            ordenActual: '',
            fechaActual: '',
            codigos: '',
            categorias: '',
            domOrdenes: '',
            domOrdenOriginal: '',
            form: {
                centro: '',
                clienterut: '',
                direccion: '',
                comuna: '',
                codigoler: '',
                categoria: '',
                fecha: '',
                inicio: '',
                termino: '',
                or: ''
            }
        };
    }


    componentDidMount = async () => {
        await this.obtenerRetiro();
        this.obtenerClientes();
        this.obtenerCentros();
        this.obtenerComunas();
        this.obtenerOrdenesNoAsignadas();
        await this.obtenerCodigosLer();
        await this.obtenerCategoriasLer();
    }

    obtenerRetiro = async () => {
        var componente = this;
        var { id } = this.props.match.params;
        const res = Axios.get('/api/gestion-residuos/retiros/obtener/' + id, { headers: authHeader() }) //se envia peticion axios con el token sesion guardado en local storage como cabecera
            .then(function (res) {   //si la peticion es satisfactoria entonces
                console.log(res.data)
                componente.setState({
                    idOrden: id,
                    form: {
                        centro: res.data.data.centro,
                        clienterut: res.data.data.clienterut,
                        direccion: res.data.data.direccion,
                        comuna: res.data.data.comuna,
                        codigoler: res.data.data.codigoler,
                        categoria: res.data.data.categoria,
                        fecha: moment(res.data.data.fecha).utc().format('YYYY-MM-DD'),
                        inicio: res.data.data.inicio,
                        termino: res.data.data.termino,
                        or: res.data.data.or
                    },
                    ordenActual: res.data.data.or,
                    fechaActual: moment(res.data.data.fecha).utc().format('YYYY-MM-DD')
                });  //almacenamos el listado de usuarios en el estado usuarios (array)
                componente.optionsOrdenesAsignadas(res.data.data.fecha);
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
    onChangeInputFecha = async (e) => {
        await this.setState({
            form: {
                ...this.state.form, [e.target.name]: e.target.value
            }
        })
        this.optionsOrdenesAsignadas(e.target.value);
    }

    optionsOrdenesAsignadas = (fecha) => {
        let ordenes;
        let original;
        var fechaRe = moment(fecha).utc().format('YYYY-MM-DD')
        if (this.state.ordenesNoAsignadas) {
            ordenes = this.state.ordenesNoAsignadas.map((orden, index) => {
                if (moment(orden.retiro).utc().format('YYYY-MM-DD') === fechaRe) {
                    return (<option value={orden.idor} >{orden.idor}</option>)
                }
                else { console.log("no"); }
            }
            )
        }
        if (fechaRe === this.state.fechaActual) {
            console.log("original")
            original = <option value={this.state.ordenActual} >{this.state.ordenActual}</option>
        }else{
            console.log("no original")
            original = '';
        }
        // return ordenes;
        this.setState({ domOrdenes: ordenes, domOrdenOriginal: original });
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
        console.log(this.state.form);
        await Object.entries(this.state.form).map((t, k) => {
            if (t[1] === "" || t[1] === null) {
                campoVacio = true;
            }
        });
        if (!campoVacio) {
            const res = await Axios.post('/api/gestion-residuos/retiros/modificar/', {
                id: this.state.idOrden,
                centro: this.state.form.centro,
                clienterut: this.state.form.clienterut,
                direccion: this.state.form.direccion,
                comuna: this.state.form.comuna,
                codigoler: this.state.form.codigoler,
                categoria: this.state.form.categoria,
                fecha: this.state.form.fecha,
                inicio: this.state.form.inicio,
                termino: this.state.form.termino,
                or: this.state.form.or,
                ordenActual: this.state.ordenActual
            }, { headers: authHeader() })
                .then(respuesta => {
                    // this.setState({ idUsuario: respuesta.data.id });
                    if (respuesta.data.estado === "success") {
                        toast.success(respuesta.data.mensaje, toastoptions);
                        historial.push("/residuos/control-retiro/programacion-retiro");
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

        let ordenes;
        if (this.state.ordenesNoAsignadas) {
            ordenes = this.state.ordenesNoAsignadas.map((orden, index) => {
                if (moment(orden.retiro).utc().format('YYYY-MM-DD') === moment(this.state.form.fecha).utc().format('YYYY-MM-DD'))
                    return (<option value={orden.idor} >{orden.idor}</option>)

            }
            )
        }

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


        return (
            <div className="principal" id="component-perfil">
                <div>
                    <h2 className="verde"><button className="boton-vacio" onClick={this.volver}> <Bverderev /> </button><span>Programación Retiro</span> / <strong>Detalle Retiro</strong></h2>
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
                                <span>OR Referencia</span>
                                <span>
                                    <select name="or" onChange={this.onChangeInput} value={this.state.form.or} className="input-generico">
                                        <option>Seleccione una orden</option>
                                        {this.state.domOrdenOriginal}
                                        {this.state.domOrdenes}
                                    </select>
                                </span>
                            </div>
                            {/* <div>
                                <span>Frecuencia</span>
                                <span><select className="input-generico">
                                    <option>Cliente 1</option>
                                    <option>Cliente 2</option>
                                    <option>Cliente 3</option>
                                </select></span>
                            </div> */}
                            {/* <h3 className="verde">retiros</h3>
                            <div className="listado-simple tabla full">
                            <table>
                                <thead>
                                    <th>Fecha</th>
                                    <th>Hora</th>
                                    <th>OR</th>
                                
                                </thead>
                                <tbody className="retiros">
                                    <tr className="elemento ">
                                        <td> Municipalidad de Recoleta</td>
                                        <td>Proyecto 1</td>
                                        <td>Proyecto 1</td>
                                    </tr>
                                    <tr className="elemento">
                                        <td> Municipalidad de Recoleta</td>
                                        <td>Proyecto 1</td>
                                        <td>Proyecto 1</td>
                                    </tr>
                                    <tr className="elemento">
                                        <td> Municipalidad de Recoleta</td>
                                        <td>Proyecto 1</td>
                                        <td>Proyecto 1</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div> */}

                            <div className="form-group buttons">
                                <button className="boton-generico btazulalt" >Cancelar</button>
                                <button className="boton-generico btazul" onClick={this.enviaDatos} type="button" >Guardar</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}