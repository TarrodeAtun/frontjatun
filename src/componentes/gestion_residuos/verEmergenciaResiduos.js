import React, { Component, useState, Fragment } from 'react';

import { autenticacion } from '../../servicios/autenticacion';
import Axios from '../../helpers/axiosconf';
import { authHeader } from '../../helpers/auth-header';
import { handleResponse } from '../../helpers/manejador';
import moment from 'moment';

import { ToastContainer, toast } from 'react-toastify';

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
export default class CambiarPass extends Component {

    constructor(props) {
        super(props);

        this.state = {
            currentUser: autenticacion.currentUserValue,
            rut: '',
            fecha: '',
            hora: '',
            turno: '',
            hito: '',
            imagen: '',
            selectTrabajador: '',
            trabajadoresSelect: [],
            opciones: []
        };
    }
    componentDidMount = () => {
        this.obtenerTrabajadores();
        var componente = this;
        var id = this.props.props.id;

        console.log(id);
        const res = Axios.get('/api/gestion-residuos/emergencias/residuos/obtener/' + id, { headers: authHeader() }) //se envia peticion axios con el token sesion guardado en local storage como cabecera
            .then(function (res) {
                console.log(res.data.data);
                componente.setState({
                    fecha: moment(res.data.data.fecha).utc().format('DD-MM-YYYY'),
                    hora: res.data.data.hora,
                    turno: res.data.data.turno,
                    hito: res.data.data.hito,
                    imagen: res.data.data.imagen,
                    trabajadoresSelect:res.data.data.involucrados,
                });  //almacenamos el listado de usuarios en el estado usuarios (array)
            })
            .catch(function (err) { //en el caso de que se ocurra un error, axios lo atrapa y procesa
                console.log(err)
                handleResponse(err.response);  //invocamos al manejador para ver el tipo de error y ejecutar la accion pertinente
                return;
            });
    }

    pad = (num, size) => {
        var s = "00000000" + num;
        s = s.substr(s.length - size);
        var f = s.substr(0, 4);
        var l = s.substr(4, 7);

        return f + " " + l;
    }
    obtenerTrabajadores = async () => { //genera una peticion get por axios a la api de usuarios
        var componente = this;
        const res = Axios.get('/api/users/worker/obtenertrabajadores', { headers: authHeader() }) //se envia peticion axios con el token sesion guardado en local storage como cabecera
            .then(function (res) {   //si la peticion es satisfactoria entonces
                // console.log(res.data.data);
                componente.setState({ trabajadores: res.data.data });  //almacenamos el listado de usuarios en el estado usuarios (array)
            })
            .catch(function (err) { //en el caso de que se ocurra un error, axios lo atrapa y procesa
                handleResponse(err.response);  //invocamos al manejador para ver el tipo de error y ejecutar la accion pertinente
                return;
            });
    }

    render() {
        const compo = this;


        let trabajadores;
        if (this.state.trabajadores) {
            trabajadores = this.state.trabajadores.map((trabajador, index) =>
                <option value={trabajador.rut} data-dv={trabajador.dv} data-nombre={trabajador.nombre} data-apellido={trabajador.apellido}>{trabajador.nombre} {trabajador.apellido}</option>
            )
        }
        let trabajadoresAsignados;
        if (this.state.trabajadoresSelect) {
            trabajadoresAsignados = this.state.trabajadoresSelect.map((trabajador, index) =>
                <span>{trabajador.nombre} {trabajador.apellido}, </span>
            )

        }

        return (
            <div className="modalPreguntaEncuesta verEmergencia">
                <div>
                    <h3>Emergencia</h3>
                    <div>
                        <div className="elemento">
                            <span>Fecha</span>
                            <span>{this.state.fecha}</span>

                        </div>
                        <div className="elemento">
                            <span>Hora</span>
                            <span>{this.state.hora}</span>
                        </div>
                        <div className="elemento">
                            <span>Turno/OR</span>
                            <span>{this.pad(this.state.turno)}</span>
                        </div>
                        <div className="elemento">
                            <span>Involucrados</span>
                            <span>{trabajadoresAsignados}</span>
                        </div>
                        <div className="elemento">
                            <span>Hito Emergencia</span>
                            <span>{this.state.hito}</span>
                        </div>
                        {this.state.imagen &&
                            <div className="elemento">
                                <span>Adjunto</span>
                                <span className="spanlink" onClick={() => openInNewTab(this.state.imagen[0].url)}>{this.state.imagen[0].input}</span>
                            </div>
                        }
                    </div>
                </div>
            </div>
        )
    }
}