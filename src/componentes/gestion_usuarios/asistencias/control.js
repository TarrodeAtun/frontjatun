//importaciones de bibliotecas
import React, { Component } from "react";
import { autenticacion } from '../../../servicios/autenticacion';
import { Link } from 'react-router-dom';
import Axios from '../../../helpers/axiosconf';
import { authHeader } from '../../../helpers/auth-header';
import { handleResponse } from '../../../helpers/manejador';
import { funciones } from '../../../servicios/funciones';
import moment from 'moment';
import '../../../styles/listarTrabajadores.css';


// importaciones de iconos 
import { ReactComponent as Bamarillorev } from "../../../assets/iconos/bamarillorev.svg";
import { ReactComponent as Basurero } from "../../../assets/iconos/basurero.svg";
import { ReactComponent as Ojo } from "../../../assets/iconos/ojo.svg";
import { ReactComponent as Descarga } from "../../../assets/iconos/descarga.svg";
import { ReactComponent as Flechaam } from "../../../assets/iconos/flechaam.svg";
import { ReactComponent as Plus } from "../../../assets/iconos/X.svg";


//importamos manejadores de modal
import Modal from '../../includes/modal';
import { toogleModalCore } from '../../includes/funciones';


export default class ListarTrabajadores extends Component {



    constructor(props) {
        super(props);

        this.state = {
            trabajadores: [],
            fecha: ''
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

    obtenerTurnos = async (fecha) => { //genera una peticion get por axios a la api de usuarios
        var componente = this;
        console.log(fecha);
        const res = Axios.post('/api/users/worker/turnos/especifico/', { fecha: fecha }, { headers: authHeader() }) //se envia peticion axios con el token sesion guardado en local storage como cabecera
            .then(function (res) {   //si la peticion es satisfactoria entonces
                console.log(res.data.data);
                componente.setState({ turnos: res.data.data });  //almacenamos el listado de usuarios en el estado usuarios (array)
            })
            .catch(function (err) { //en el caso de que se ocurra un error, axios lo atrapa y procesa
                handleResponse(err.response);  //invocamos al manejador para ver el tipo de error y ejecutar la accion pertinente
                return;
            });
    }

    async componentDidMount() {
        let fecha = new Date();
        console.log(fecha);
        this.setState({ fecha: fecha });
        fecha = moment(fecha).utc().format("YYYY-MM-DD");
        await this.obtenerTurnos(fecha);
    }
    changeFecha = async (e) => {
        console.log(e.target.value)
        let fecha = await new Date(e.target.value);
        let Fechautc = new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate() + 1);
        this.setState({ fecha: Fechautc });
        await this.obtenerTurnos(fecha);
    }

    render() {

        let turnos;
        if (this.state.turnos && this.state.turnos.length !== 0) {
            console.log(this.state.turnos);
            turnos = this.state.turnos.map((hora, index) => {
                var curestado = '';
                if (hora.estado === 3) curestado = "turnoFinalizado"
                if (hora.estado === 1 || hora.estado === 2) curestado = "turnoEncurso"
                return (<tr className={curestado}>
                     <td className="columna onlymovil">
                        <span>fecha Jornada</span>
                     </td>
                    <td className="columna">
                        <span>
                            {moment(hora.fecha).utc().format("DD-MM-YYYY")}
                        </span>
                        <span>
                            {hora.inicio} - {hora.termino}
                        </span>
                    </td>
                    <td className="columna onlymovil">
                        <span>Servicio/Sector</span>
                     </td>
                    <td className="columna">
                        <span>
                            {hora.datosServicio.nombre}
                        </span>
                        <span>
                            {hora.datosSectores.nombre}
                        </span>
                    </td>
                    <td className="columna onlymovil">
                        <span>Cliente</span>
                     </td>
                    <td className="columna">
                        <span>
                            {hora.datosCliente.nombre}
                        </span>
                    </td>
                    <td className="columna onlymovil">
                        <span>Ir al turno  <Link to={`/personas/asistencias/control-asistencia/turno/${hora._id}`}><Ojo /></Link></span>
                     </td>
                    <td className="columna onlydesktop">
                        <Link to={`/personas/asistencias/control-asistencia/turno/${hora._id}`}><Ojo /></Link>
                    </td>
                </tr>)
            }
            )
        } else {
            turnos = <tr><td colSpan="4">No hay</td></tr>
        }

        return (
            <div className="principal" id="component-listar-trabajadores">
                <div>
                    <h2 className="naranjo"><Link to="/personas/asistencias"> <Bamarillorev /> </Link> Asistencias <strong>/ Control Asistencia</strong></h2>
                </div>

                <div className="panel-dashboard-link">
                    <div className="seccion">
                        <h3><span>{this.state.fecha && funciones.nombreDia(this.state.fecha)} {moment(this.state.fecha).format("DD - MM - YYYY")} </span> <input className="fechaProgra input-generico" onChange={this.changeFecha} type="date"></input></h3>
                    </div>
                </div>
                <div className="filtros">
                    <div className="sup">
                        <button>Filtros</button>
                    </div>
                    <div>
                        <form>
                            <div className="form-group justify-center">
                                <input className="input-generico" placeholder="Desactivado" />
                                <select className="input-generico">
                                    {/* <option>Centro de costos</option> */}
                                </select>
                                <select className="input-generico">
                                    {/* <option>Estado de contrato</option> */}
                                </select>
                            </div>
                            <div className="form-group buttons">
                                <button className="boton-generico btazul" type="button">Filtrar</button>
                                <button className="boton-generico btblanco" type="button">Limpiar</button>
                            </div>
                        </form>
                    </div>
                </div>
                <div className="listado">
                    <div className="encabezado">
                        <h3 className="amarillo">Turnos</h3>
                    </div>
                    <table className="tabla">
                        <thead >
                            <th>Fecha/jornada</th>
                            <th>Servicio / sector</th>
                            <th>Cliente</th>
                            <th>Ir al Turno</th>
                        </thead>
                        <tbody>
                            {turnos}
                        </tbody>
                    </table>
                </div>
            </div>

        )
    }
}

