import React, { Component, useState, Fragment } from 'react';

import { autenticacion } from '../../servicios/autenticacion';
import Axios from '../../helpers/axiosconf';
import { authHeader } from '../../helpers/auth-header';
import { handleResponse } from '../../helpers/manejador';
import { funciones } from '../../servicios/funciones';

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

export default class CambiarPass extends Component {

    constructor(props) {
        super(props);

        this.state = {
            currentUser: autenticacion.currentUserValue,
            rut: '',
            vehiculos: '',
            conductores: '',

            fecha: '',
            hora: '',
            patente: '',
            conductor: '',
            hito: '',
            imagen: '',
            opciones: []
        };
    }
    componentDidMount = async () => {
        await this.setState({ vehiculos: await funciones.obtenerPatentesVehiculos() });
        await this.setState({ conductores: await funciones.obtenerConductores() });
    }

    // agregarPregunta = this.props.agregaPregunta;

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

    enviarDatos = async (e) => {
        var componente = this;
        var formData = new FormData();
        formData.append('fecha', this.state.fecha);
        formData.append('hora', this.state.hora);
        formData.append('patente', this.state.patente);
        formData.append('conductor', this.state.conductor);
        formData.append('hito', this.state.hito);
        formData.append('imagen', this.state.imagen);
        const res = await Axios.post('/api/gestion-residuos/emergencias/vehiculos/crear/', formData, { headers: authHeader() })
            .then(respuesta => {
                if (respuesta.data.estado === "success") {
                    toast.success(respuesta.data.mensaje, toastoptions);
                     this.props.closeModal();
                     this.props.props.actualizaLista()
                    // historial.push("/residuos/trazabilidad");
                } else if (respuesta.data.estado === "warning") {
                    // this.props.props.funcion();
                    toast.warning(respuesta.data.mensaje, toastoptions);
                }
            })
            .catch(function (err) { //en el caso de que se ocurra un error, axios lo atrapa y procesa
                handleResponse(err.response);  //invocamos al manejador para ver el tipo de error y ejecutar la accion pertinente
                toast.error("Ha habido un error al enviar los datos", toastoptions);
            });
    }


    render() {
        const compo = this;

        let vehiculos;
        if (this.state.vehiculos) {
            vehiculos = this.state.vehiculos.map((vehiculo, index) =>
                <option value={vehiculo.patente} >{vehiculo.patente}</option>
            )
        }

        let conductores;
        if (this.state.conductores) {
            conductores = this.state.conductores.map((conductor, index) =>
                <option value={conductor.rut} data-dv={conductor.dv} data-nombre={conductor.nombre} data-apellido={conductor.apellido}>{conductor.nombre} {conductor.apellido}</option>
            )
        }


        return (
            <div className="modalPreguntaEncuesta vEmergencia">
                <div>
                    <h3>Nuevo Hito Emergencia</h3>
                    <div>
                        <div className="elemento">
                            <input type="date" className="input-generico w100" onChange={this.onChangeInput} name="fecha"></input>
                        </div>
                        <div className="elemento">
                            <select onChange={this.onChangeInput} name="hora" className="input-generico">
                                <option value="">Hora</option>
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
                        </div>
                        <div className="elemento">
                            <select name="patente" onChange={this.onChangeInput} className="input-generico">
                                <option>Patente</option>
                                {vehiculos}
                            </select>
                        </div>
                        <div className="elemento">
                            <select name="conductor" onChange={this.onChangeInput} className="input-generico">
                                <option>Conductor</option>
                                {conductores}
                            </select>
                        </div>
                        <div className="elemento">
                            <textarea name="hito" onChange={this.onChangeInput} className="input-generico" placeholder="Hito emergencia"></textarea>
                        </div>
                        <div className="elemento">
                            <input type="file" className="input-generico w100" onChange={this.onChangeFileInput} name="imagen"></input>
                        </div>
                        <div className="form-group buttons">
                            <button className="boton-generico btazul" onClick={this.props.closeModal} type="submit">Cancelar</button>
                            <button className="boton-generico btazul" onClick={this.enviarDatos} type="button">Aceptar</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}