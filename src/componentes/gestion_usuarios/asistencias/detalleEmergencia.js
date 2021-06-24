// importaciones de bibliotecas 
import React, { Component, useState } from "react";
import { autenticacion } from '../../../servicios/autenticacion';
import { confirmAlert } from 'react-confirm-alert';
import Axios from '../../../helpers/axiosconf';
import { authHeader } from '../../../helpers/auth-header';
import { handleResponse } from '../../../helpers/manejador';
import { funciones } from '../../../servicios/funciones';
import { toast } from 'react-toastify';
import moment from 'moment';

// importaciones de estilos 
import '../../../styles/fichaTrabajador.css';

// importaciones de iconos 
import { ReactComponent as Bamarillorev } from "../../../assets/iconos/bamarillorev.svg";
import { historial } from "../../../helpers/historial";

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
    let direccion = "http://localhost:4000/media";
    direccion = direccion + url;
    const newWindow = window.open(direccion, '_blank', 'noopener,noreferrer')
    if (newWindow) newWindow.opener = null
}

export default class CrearRetiro extends Component {

    constructor(props) {
        super(props);
        this.myRef = React.createRef();
        this.state = {
            currentUser: autenticacion.currentUserValue,
            datosUsuarios: "",
            emergencia: '',
        };

    }


    componentDidMount = async () => {
        var componente = this;
        var { id } = this.props.match.params;
        const res = Axios.get('/api/users/worker/turnos/asistencia/emergencias/detalle/' + id, { headers: authHeader() }) //se envia peticion axios con el token sesion guardado en local storage como cabecera
            .then(function (res) {   //si la peticion es satisfactoria entonces
                console.log(res.data)
                if (res.data.data.length > 0) {
                    componente.setState({
                        emergencia: res.data.data[0]
                    });
                }
            })
            .catch(function (err) { //en el caso de que se ocurra un error, axios lo atrapa y procesa
                console.log(err);
                handleResponse(err.response);  //invocamos al manejador para ver el tipo de error y ejecutar la accion pertinente
                return;
            });
    }


    render() {

        let componente = this;
        let sector;
        if (this.state.emergencia) {
            this.state.emergencia.datosCliente[0].sectores.find(function (elem, ind) {
                if (parseInt(elem.key) === parseInt(componente.state.emergencia.sector)) {
                    sector = elem.nombre;
                }
            });
        }
        let jornada;
        if (this.state.emergencia) {
            jornada = this.state.emergencia.datosTurno[0].inicio + " - " + this.state.emergencia.datosTurno[0].termino;
        }

        return (
            <div className="principal" id="component-perfil">
                <div>
                    <h2 className="amarillo"><button className="boton-vacio" onClick={this.volver}> <Bamarillorev /> </button><span>Emergencias</span> / <strong>Crear Emergencia</strong></h2>
                    <div className="fichaPerfil">
                        <div className="seccion">
                            <h3 className="amarillo">Emergencia</h3>
                            <div>
                                <span>Fecha</span>
                                <span>
                                    {this.state.emergencia && moment(this.state.emergencia.datosTurno[0].fecha).utc().format("DD/MM/YYYY")}
                                </span>
                            </div>
                            <div>
                                <span>Cliente</span>
                                <span>
                                    {this.state.emergencia && this.state.emergencia.datosCliente[0].nombre}
                                </span>
                            </div>
                            <div>
                                <span>Sector</span>
                                <span>
                                    {sector}
                                </span>
                            </div>
                            <div>
                                <span>Servicio</span>
                                <span>
                                    {this.state.emergencia && this.state.emergencia.datosServicio[0].nombre}
                                </span>
                            </div>
                            <div>
                                <span>Jornada</span>
                                <span>
                                    {this.state.emergencia && jornada}
                                </span>
                            </div>
                            <div>
                                <span>Hora</span>
                                <span>
                                    {this.state.emergencia && this.state.emergencia.hora}
                                </span>
                            </div>
                            <div>
                                <span>Tipo Emergencia</span>
                                <span>
                                    {this.state.emergencia && this.state.emergencia.tipo === 1 && "Laboral"}
                                    {this.state.emergencia && this.state.emergencia.tipo === 2 && "Servicio"}
                                </span>
                            </div>
                            <div>
                                <span>Clasificación Emergencia</span>
                                <span>
                                    {this.state.emergencia && this.state.emergencia.clasificacion === 1 && "Robo"}
                                    {this.state.emergencia && this.state.emergencia.clasificacion === 2 && "Accidente"}

                                </span>
                            </div>
                            <div>
                                <span>Observaciones</span>
                                <span>
                                    <textarea name="observaciones" value={this.state.emergencia && this.state.emergencia.observaciones} disabled readOnly className="input-generico">
                                        {this.state.emergencia && this.state.emergencia.observaciones}
                                    </textarea>
                                </span>
                            </div>
                            <div>
                                <span>Adjunto (opcional)</span>
                                {this.state.emergencia &&
                                    <span className="spanlink" onClick={() => openInNewTab(this.state.emergencia.imagen[0].url)}>{this.state.emergencia.imagen[0].input}</span>
                                }
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        );
    }
}