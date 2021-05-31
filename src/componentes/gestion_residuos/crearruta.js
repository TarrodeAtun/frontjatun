// importaciones de bibliotecas 
import React, { Component, Fragment } from "react";
import { autenticacion } from '../../servicios/autenticacion';
import { confirmAlert } from 'react-confirm-alert';
import Axios from '../../helpers/axiosconf';
import { authHeader } from '../../helpers/auth-header';
import { handleResponse } from '../../helpers/manejador';
import moment from 'moment';
import { toast } from 'react-toastify';
import { funciones } from '../../servicios/funciones';

// importaciones de estilos 
import '../../styles/fichaTrabajador.css';

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
            listaRetiros: '',
            listaVehiculos: '',
            listaServicios: '',
            listaConductores: '',
            nombreConductor: '',
            rutConductor: '',
            selectRetiros: '',
            form: {
                patente: '',
                servicio: '',
                conductor: '',
                fecha: '',
                inicio: '00:00',
                termino: '00:00',
                enlace: ''
            },
            ordenes: []
        };

    }

    componentDidMount = () => {
        this.obtenerVehiculos();
        this.obtenerRetiros();
        this.obtenerServicios();
        this.obtenerCondutores();
    }

    obtenerVehiculos = (e) => {
        var componente = this;
        const res = Axios.get('/api/generales/vehiculos/', { headers: authHeader() }) //se envia peticion axios con el token sesion guardado en local storage como cabecera
            .then(function (res) {   //si la peticion es satisfactoria entonces
                componente.setState({ listaVehiculos: res.data.data });  //almacenamos el listado de usuarios en el estado usuarios (array)
            })
            .catch(function (err) { //en el caso de que se ocurra un error, axios lo atrapa y procesa
                handleResponse(err.response);  //invocamos al manejador para ver el tipo de error y ejecutar la accion pertinente
                return;
            });
    }
    obtenerRetiros = (e) => {
        var fecha;
        fecha = this.state.form.fecha;
        if (fecha) {
            var componente = this;
            const res = Axios.get('/api/gestion-residuos/retirosnoasignados/' + fecha, { headers: authHeader() }) //se envia peticion axios con el token sesion guardado en local storage como cabecera
                .then(function (res) {   //si la peticion es satisfactoria entonces
                    componente.setState({ listaRetiros: res.data.data });  //almacenamos el listado de usuarios en el estado usuarios (array)
                })
                .catch(function (err) { //en el caso de que se ocurra un error, axios lo atrapa y procesa
                    handleResponse(err.response);  //invocamos al manejador para ver el tipo de error y ejecutar la accion pertinente
                    return;
                });
        }
    }
    obtenerServicios = (e) => {
        var componente = this;
        const res = Axios.get('/api/generales/servicios/', { headers: authHeader() }) //se envia peticion axios con el token sesion guardado en local storage como cabecera
            .then(function (res) {   //si la peticion es satisfactoria entonces
                console.log(res.data.data)
                componente.setState({ listaServicios: res.data.data });  //almacenamos el listado de usuarios en el estado usuarios (array)
            })
            .catch(function (err) { //en el caso de que se ocurra un error, axios lo atrapa y procesa
                handleResponse(err.response);  //invocamos al manejador para ver el tipo de error y ejecutar la accion pertinente
                return;
            });
    }
    obtenerCondutores = (e) => {
        var componente = this;
        const res = Axios.get('/api/users/conductores/', { headers: authHeader() }) //se envia peticion axios con el token sesion guardado en local storage como cabecera
            .then(function (res) {   //si la peticion es satisfactoria entonces
                console.log(res.data.data);
                componente.setState({ listaConductores: res.data.data });  //almacenamos el listado de usuarios en el estado usuarios (array)
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
    onChangeFecha = async (e) => {
        await this.setState({
            form: {
                ...this.state.form, [e.target.name]: e.target.value
            }
        })
        this.obtenerRetiros();
        this.setState({ordenes:[]});
    }
    onChangeConductor = async (e) => {
        var rut = e.target.value;
        var dv = e.target[e.target.selectedIndex].dataset.dv;
        await this.setState({
            form: {
                ...this.state.form, [e.target.name]: e.target.value
            },
            nombreConductor: e.target[e.target.selectedIndex].dataset.nombre
        })
        await funciones.getRutFormateado(rut, dv).then(res => { this.setState({ rutConductor: res }) });
    }

    volver = () => {
        var componente = this;
        confirmAlert({
            customUI: ({ onClose }) => {
                return (
                    <div className='custom-confirm '>
                        <p>¿Quieres guardar antes de salir de la sección crear ruta?</p>
                        <button className="boton-generico btazulalt" onClick={onClose}>Cancelar</button>
                        <button className="boton-generico btazul" onClick={function () { componente.pushLista(); onClose(); }}>No guardar</button>
                        <button className="boton-generico btazul"
                            onClick={this.enviaDatos}
                        >
                            Aceptar
                    </button>
                    </div>
                );
            }
        });
    }
    resetConductor = () => {
        this.setState({
            form: {
                ...this.state.form, conductor: ''
            }
        })
    }
    changeOrden = (e) => {
        console.log("change");
        var or = e.target.value;
        var cliente = e.target[e.target.selectedIndex].dataset.cliente
        var inicio = e.target[e.target.selectedIndex].dataset.inicio
        var termino = e.target[e.target.selectedIndex].dataset.termino
        var id = e.target[e.target.selectedIndex].dataset.id
        var ordenes = this.state.ordenes;
        var igual = false;
        for (let orden of ordenes) {
            if (orden.or === e.target.value) {
                igual = true;
            }

        }
        if (!igual) {
            ordenes.push({ retiro: id, or: or, cliente: cliente, inicio: inicio, termino: termino });
            this.setState({
                ordenes: ordenes,
            });
        }
        this.setState({
            selectRetiros: ''
        })
    }
    eliminaOrden = (e) => {
        console.log("elimina");
        var ordenes = this.state.ordenes;
        ordenes.splice(e, 1);
        this.setState({
            ordenes: ordenes
        })
    }
    pushLista = () => {
        historial.push("/residuos/control-logistico");
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
        console.log(this.state.ordenes);
        if (!campoVacio) {
            const res = await Axios.post('/api/gestion-residuos/rutas/create/', {
                patente: this.state.form.patente,
                servicio: this.state.form.servicio,
                conductor: this.state.form.conductor,
                fecha: this.state.form.fecha,
                inicio: this.state.form.inicio,
                termino: this.state.form.termino,
                enlace: this.state.form.enlace,
                ordenes: this.state.ordenes
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

        let vehiculos;
        if (this.state.listaVehiculos) {
            console.log(this.state.listaVehiculos);
            vehiculos = this.state.listaVehiculos.map((vehiculo, index) =>
                <option value={vehiculo.patente}>{vehiculo.patente}</option>
            )
        }
        let servicios;
        if (this.state.listaServicios) {
            servicios = this.state.listaServicios.map((servicio, index) =>
                <option value={servicio.key}>{servicio.nombre}</option>
            )
        }
        let retiros;
        if (this.state.listaRetiros) {
            console.log(this.state.listaRetiros);
            retiros = this.state.listaRetiros.map((retiro, index) =>
                <option value={retiro.or} data-id={retiro._id} data-cliente={retiro.datosCliente[0].nombre} data-inicio={retiro.inicio} data-termino={retiro.termino}>{retiro.or}</option>
            )
        }
        let conductores;
        if (this.state.listaConductores) {
            conductores = this.state.listaConductores.map((conductor, index) =>
                <option value={conductor.rut} data-dv={conductor.dv} data-nombre={`${conductor.nombre}  ${conductor.apellido}`}>{conductor.nombre} {conductor.apellido}</option>
            )
        }
        let retirosAsignados;
        if (this.state.ordenes) {
            retirosAsignados = this.state.ordenes.map((retiroAsignado, index) =>
                <div>
                    <span>OR {retiroAsignado.or}</span>
                    <span className="spanConductor">
                        <button onClick={e => this.eliminaOrden(index)}>X</button>
                        <span>{retiroAsignado.cliente}</span>
                        <span>{retiroAsignado.inicio} - {retiroAsignado.termino}</span>
                    </span>
                </div>
            )

        }

        return (
            <div className="principal" id="component-perfil">
                <div>
                    <h2 className="verde"><button className="boton-vacio" onClick={this.volver}> <Bverderev /> </button><span>Control Logistico</span> / <strong>Crear ruta</strong></h2>
                    <div className="fichaPerfil">
                        <div className="seccion">
                            <h3 className="verde">Datos vehiculo y conductor/a *</h3>
                            <div>
                                <span>Patente</span>
                                <span>
                                    <select name="patente" onChange={this.onChangeInput} className="input-generico" value={this.state.form.patente} >
                                        <option>Seleccionar</option>
                                        {vehiculos}
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
                                <span>Conductor</span>
                                {this.state.form.conductor === ''
                                    ? <span>
                                        <select name="conductor" onChange={this.onChangeConductor} value={this.state.form.conductor} className="input-generico">
                                            <option>Seleccionar</option>
                                            {conductores}
                                        </select>
                                    </span>
                                    : <span className="spanConductor">
                                        <button onClick={this.resetConductor}>X</button>
                                        <span>{this.state.nombreConductor}</span>
                                        <span>{this.state.rutConductor}</span>
                                    </span>
                                }
                            </div>
                            <h3 className="verde">OR Asociada *</h3>
                            <div>
                                <span>Fecha</span>
                                <span><input type="date" onChange={this.onChangeFecha} value={this.state.form.fecha} className="input-generico" name="fecha" /></span>
                            </div>
                            <div>
                                <span>N° OR</span>
                                <span>
                                    <select name="selectRetiros" onChange={this.changeOrden} value={this.state.selectRetiros} className="input-generico">
                                        <option>Seleccionar</option>
                                        {retiros}
                                    </select>
                                </span>
                            </div>

                            {retirosAsignados}

                            <h3 className="verde">Ruta*</h3>
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
                                <span>Link Ruta</span>
                                <span><input type="text" onChange={this.onChangeInput} value={this.state.form.enlace} className="input-generico" name="enlace" /></span>
                            </div>
                            <div className="form-group buttons">
                                <button className="boton-generico btazulalt" data-objetivo="FrecuenciaRetiro" onClick={this.volver} >Cancelar</button>
                                <button className="boton-generico btazul" onClick={this.enviaDatos} type="button" >Guardar</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}