import React, { Component, useState, Fragment } from 'react';

import { autenticacion } from '../../servicios/autenticacion';
import Axios from '../../helpers/axiosconf';
import { authHeader } from '../../helpers/auth-header';
import { funciones } from '../../servicios/funciones';
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
            patente: '',
            conductor: '',
            hito: '',
            imagen: '',
            selectTrabajador: '',
            trabajadoresSelect: [],
            opciones: []
        };
    }
    componentDidMount = () => {
        var componente = this;
        var id = this.props.props.id;

        console.log(id);
        const res = Axios.get('/api/gestion-residuos/emergencias/vehiculos/obtener/' + id, { headers: authHeader() }) //se envia peticion axios con el token sesion guardado en local storage como cabecera
            .then(function (res) {
                componente.setState({
                    fecha: moment(res.data.data[0].fecha).utc().format('DD-MM-YYYY'),
                    hora: res.data.data[0].hora,
                    patente: res.data.data[0].turno,
                    conductor: res.data.data[0].turno,
                    hito: res.data.data[0].hito,
                    datosConductor: res.data.data[0].datosConductor,
                    imagen: res.data.data[0].imagen
                });  //almacenamos el listado de usuarios en el estado usuarios (array)
            })
            .catch(function (err) { //en el caso de que se ocurra un error, axios lo atrapa y procesa
                console.log(err)
                handleResponse(err.response);  //invocamos al manejador para ver el tipo de error y ejecutar la accion pertinente
                return;
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
    render() {
        const compo = this;


       
        let conductor;
        if (this.state.datosConductor) {
            conductor = <span>
                <span className="w100 block">{this.state.datosConductor.nombre}  {this.state.datosConductor.apellido}</span>
                <span className="w100 block">{compo.formatearRutListado(this.state.datosConductor.rut, this.state.datosConductor.dv)}</span>
            </span>
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
                            <span>Patente</span>
                            <span>{this.state.patente}</span>
                        </div>
                        <div className="elemento">
                            <span>Conductor</span>
                            {conductor}
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