// importaciones de bibliotecas 
import React, { Component, Fragment } from "react";
import { autenticacion } from '../../../servicios/autenticacion';
import { Link } from 'react-router-dom';
import { confirmAlert } from 'react-confirm-alert';
import Axios from '../../../helpers/axiosconf';
import { authHeader } from '../../../helpers/auth-header';
import { handleResponse } from '../../../helpers/manejador';
import { funciones } from '../../../servicios/funciones';
import { toast } from 'react-toastify';

// importaciones de estilos 
import '../../../styles/fichaTrabajador.css';



import moment from 'moment';


// importaciones de iconos 
import { ReactComponent as Edit } from "../../../assets/iconos/edit.svg";
import { ReactComponent as Ojo } from "../../../assets/iconos/ojo.svg";
import { ReactComponent as Basurero } from "../../../assets/iconos/basurero.svg";
import { ReactComponent as Bamarillorev } from "../../../assets/iconos/bamarillorev.svg";

const toastoptions = {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
}


export default class EmergenciasResiduos extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentUser: autenticacion.currentUserValue,
            datosUsuarios: "",
            users: null,
            fecha: '',
            clientes: '',
            servicios: '',
            sectores: '',

            clienteRut: '',
            servicio: '',
            sector: '',
            tipo: ''
        };
    }
    async componentDidMount() {
        var componente = this;
        const res = Axios.post('/api/users/worker/turnos/asistencia/emergencias/', { headers: authHeader() }) //se envia peticion axios con el token sesion guardado en local storage como cabecera
            .then(function (res) {
                componente.setState({
                    emergencias: res.data.data
                });
            })
            .catch(function (err) { //en el caso de que se ocurra un error, axios lo atrapa y procesa
                handleResponse(err.response);  //invocamos al manejador para ver el tipo de error y ejecutar la accion pertinente
                return;
            });
        await this.setState({ clientes: await funciones.obtenerClientes() });
        await this.setState({ servicios: await funciones.obtenerServicios() });
    }
    onChangeInput = async (e) => {
        await this.setState({
            [e.target.name]: e.target.value

        });
    }
    onChangeCliente = async (e) => {
        var clienteRut = e.target.value;
        if (e.target.value) {
            await this.setState({ clienteRut: clienteRut })
            await this.setState({ sector: '' })
            let clientes = await this.state.clientes;
            let clienteSelect = await clientes.find(cliente => parseInt(cliente.rut) === parseInt(clienteRut));
            this.setState({ sectores: clienteSelect.sectores });
        } else {
            console.log("no");
            await this.setState({ clienteRut: '' })
            await this.setState({ sector: '' })
            await this.setState({ sectores: '' });
        }
    }
    limpiar = (e) => {
        this.setState({
            clienteRut: '',
            cliente: '',
            servicio: '',
            sector: '',
            sectores: '',
            tipo: ''
        });
    }
    filtrar = async (e) => {
        var componente = this;
        const res = Axios.post('/api/users/worker/turnos/asistencia/emergencias/',
            {
                fecha: this.state.fecha,
                cliente: this.state.clienteRut,
                sector: this.state.sector,
                servicio: this.state.servicio,
                tipo: this.state.tipo,
            },
            { headers: authHeader() }) //se envia peticion axios con el token sesion guardado en local storage como cabecera
            .then(function (res) {
                componente.setState({
                    emergencias: res.data.data
                });
            })
            .catch(function (err) { //en el caso de que se ocurra un error, axios lo atrapa y procesa
                handleResponse(err.response);  //invocamos al manejador para ver el tipo de error y ejecutar la accion pertinente
                return;
            });
    }
    eliminar = async (e) => {
        let id = e.currentTarget.dataset.id;
        var componente = this;
        confirmAlert({
            customUI: ({ onClose }) => {
                return (
                    <div className='custom-confirm '>
                        <p>¿Estas seguro de eliminar esta emergencia?</p>
                        <button className="boton-generico btazulalt" onClick={onClose}>Cancelar</button>
                        <button className="boton-generico btazul"
                            onClick={() => {
                                const res = Axios.post('/api/users/worker/turnos/asistencia/emergencias/eliminar',
                                    {
                                        emergencia: id,
                                    },
                                    { headers: authHeader() }) //se envia peticion axios con el token sesion guardado en local storage como cabecera
                                    .then(function (res) {
                                        toast.success(res.data.mensaje, toastoptions);
                                        componente.filtrar();
                                    })
                                    .catch(function (err) { //en el caso de que se ocurra un error, axios lo atrapa y procesa
                                        handleResponse(err.response);  //invocamos al manejador para ver el tipo de error y ejecutar la accion pertinente
                                        return;
                                    });
                                onClose();
                            }} >
                            Aceptar
                        </button>
                    </div>
                );
            }
        });

    }

    render() {
        var componente = this;

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

        let emergencias;
        if (this.state.emergencias && this.state.emergencias.length !== 0) {
            emergencias = this.state.emergencias.map((emergencia, index) => {
                let sector;
                emergencia.datosCliente[0].sectores.find(function (elem, ind) {
                    if (parseInt(elem.key) === parseInt(emergencia.sector)) {
                        sector = elem.nombre;
                    }
                });
                return (<tr className="">
                    <td>
                        <span>{moment(emergencia.fecha).utc().format("DD-MM-YYYY")}</span>
                        <span>{emergencia.datosTurno[0].inicio} - {emergencia.datosTurno[0].termino}</span>
                    </td>
                    <td>
                        <span>{emergencia.datosServicio[0].nombre}</span>
                        <span>{sector}</span>
                    </td>
                    <td>
                        {emergencia.tipo === 1 && "Laboral"}
                        {emergencia.tipo === 2 && "Servicio"}
                    </td>
                    <td className="acciones">
                        <span><Link to={`/personas/asistencias/emergencias/detalle/${emergencia._id}`}><Ojo /></Link></span>
                        {/* <span><Link onClick={this.modificarEmergencia} data-objetivo="ModificarEmergencia" data-id={emergencia._id}><Edit /></Link></span> */}
                        <span><button data-id={emergencia._id} onClick={componente.eliminar}><Basurero /></button></span>
                    </td>
                </tr>)
            })
        } else {
            emergencias = <tr className="" >
                <td colSpan="4">
                    No se han registrado emergencias
                </td>
            </tr>
        }


        return (
            <div className="principal" id="component-listar-trabajadores">
                <div>
                    <h2 className="amarillo"><Link to="/perfil/turnos"> <Bamarillorev /> </Link> Asistencias <strong>/ Emergencias</strong></h2>
                </div>
                <div className="filtros">
                    <div className="sup">
                        <button>Filtros</button>
                    </div>
                    <div>
                        <form>
                            <div className="form-group form-fix ">
                                <input className="input-generico" name="fecha" value={this.state.fecha} onChange={this.onChangeInput} type="date" />
                                <select className="input-generico" value={this.state.clienteRut} onChange={this.onChangeCliente} name="clienteRut">
                                    <option value="">Cliente</option>
                                    {clientes}
                                </select>
                                <select className="input-generico" value={this.state.sector} onChange={this.onChangeInput} name="sector">
                                    <option>Sector</option>
                                    {sectores}
                                </select>
                            </div>
                            <div className="form-group form-fix">
                                <select className="input-generico" value={this.state.servicio} onChange={this.onChangeInput} name="servicio">
                                    <option>Servicio</option>
                                    {servicios}
                                </select>
                                <select className="input-generico" value={this.state.tipo} onChange={this.onChangeInput} name="tipo">
                                    <option value="">Tipo Emergencia</option>
                                    <option value="1">Laboral</option>
                                    <option value="2">Servicio</option>
                                </select>
                            </div>
                            <div className="form-group buttons">
                                <button className="boton-generico btazul" onClick={this.filtrar} type="button">Filtrar</button>
                                <button className="boton-generico btblanco" type="button" onClick={this.limpiar}>Limpiar</button>
                            </div>
                        </form>
                    </div>
                </div>
                <div className="listado listado-simple">
                    <div className="encabezado">
                        <h3 className="amarillo inline-block">Emergencias</h3>
                        <Link to={`/personas/asistencias/emergencias/agregar`} className="ml">+ Emergencia</Link>
                    </div>
                    <table>
                        <thead>
                            <th>Fecha / Jornada</th>
                            <th>Servicio / Sector</th>
                            <th>Tipo Emergencia</th>
                            <th>Acciones</th>
                        </thead>
                        <tbody>
                            {emergencias}
                        </tbody>
                    </table>
                    <div>
                        <ul className="paginador">
                            {/* {paginacion} */}
                        </ul>
                    </div>
                </div>
            </div >
        );
    }
}