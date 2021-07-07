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
            opciones: [],
            ordenes: []
        };
    }
    componentDidMount = () => {
        this.obtenerTrabajadores();
        this.obtenerordenesIniciadas();
        var componente = this;
        var  id  = this.props.props.id;

        console.log(id);
        const res = Axios.get('/api/gestion-residuos/emergencias/residuos/obtener/'+id, { headers: authHeader() }) //se envia peticion axios con el token sesion guardado en local storage como cabecera
            .then(function (res) {
                console.log(res.data.data);
                componente.setState({
                    fecha: moment(res.data.data.fecha).utc().format('YYYY-MM-DD'),
                    hora: res.data.data.hora,
                    turno: res.data.data.turno,
                    hito: res.data.data.hito,
                    trabajadoresSelect:res.data.data.involucrados,
                    imagen: '',
                });  //almacenamos el listado de usuarios en el estado usuarios (array)
            }).catch(function (err) { //en el caso de que se ocurra un error, axios lo atrapa y procesa
                console.log(err)
                handleResponse(err.response);  //invocamos al manejador para ver el tipo de error y ejecutar la accion pertinente
                return;
            });
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

    obtenerordenesIniciadas = async () => { //genera una peticion get por axios a la api de usuarios
        var componente = this;
        const res = Axios.post('/api/gestion-residuos/ordenes-retiro/ordenesIniciadas', {}, { headers: authHeader() }) //se envia peticion axios con el token sesion guardado en local storage como cabecera
            .then(function (res) {   //si la peticion es satisfactoria entonces
                console.log(res.data.data);
                componente.setState({ ordenes: res.data.data });  //almacenamos el listado de usuarios en el estado usuarios (array)
            })
            .catch(function (err) { //en el caso de que se ocurra un error, axios lo atrapa y procesa
                handleResponse(err.response);  //invocamos al manejador para ver el tipo de error y ejecutar la accion pertinente
                return;
            });
    }


    // agregarPregunta = this.props.agregaPregunta;
    onChangeTrabajadores = (e) => {
        console.log("change");
        var rut = e.target.value;
        var dv = e.target[e.target.selectedIndex].dataset.dv
        var nombre = e.target[e.target.selectedIndex].dataset.nombre
        var apellido = e.target[e.target.selectedIndex].dataset.apellido
        var trabajadoresSelect = this.state.trabajadoresSelect;
        console.log(trabajadoresSelect);
        var igual = false;
        for (let trabajador of trabajadoresSelect) {
            if (trabajador.rut === e.target.value) {
                igual = true;
            }
        }
        if (!igual) {
            trabajadoresSelect.push({ rut: rut, dv: dv, nombre: nombre, apellido: apellido });
            this.setState({
                trabajadoresSelect: trabajadoresSelect,
            });
        }
        this.setState({
            selectTrabajador: ''
        });
    }
    eliminaTrabajador = (e) => {
        console.log("elimina");
        var trabajadores = this.state.trabajadoresSelect;
        trabajadores.splice(e, 1);
        this.setState({
            trabajadoresSelect: trabajadores
        })
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
    enviarDatos = async (e) => {
        var componente = this;
        var formData = new FormData();
        formData.append('id', this.props.props.id);
        formData.append('fecha', this.state.fecha);
        formData.append('hora', this.state.hora);
        formData.append('turno', this.state.turno);
        formData.append('involucrados', JSON.stringify(this.state.trabajadoresSelect));
        formData.append('hito', this.state.hito);
        formData.append('imagen', this.state.imagen);
        const res = await Axios.post('/api/gestion-residuos/emergencias/residuos/modificar/', formData, { headers: authHeader() })
            .then(respuesta => {
                if (respuesta.data.estado === "success") {
                    toast.success(respuesta.data.mensaje, toastoptions);
                    // historial.push("/residuos/trazabilidad");
                } else if (respuesta.data.estado === "warning") {
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


        let trabajadores;
        if (this.state.trabajadores) {
            trabajadores = this.state.trabajadores.map((trabajador, index) =>
                <option value={trabajador.rut} data-dv={trabajador.dv} data-nombre={trabajador.nombre} data-apellido={trabajador.apellido}>{trabajador.nombre} {trabajador.apellido}</option>
            )
        }
        let trabajadoresAsignados;
        if (this.state.trabajadoresSelect) {
            trabajadoresAsignados = this.state.trabajadoresSelect.map((trabajador, index) =>
                <div>
                    <span className="spanConductor">
                        <button onClick={e => this.eliminaTrabajador(index)}>X</button>
                        <span>{trabajador.nombre} {trabajador.apellido}</span>
                        <span>{trabajador.rut}-{trabajador.dv}</span>
                    </span>
                    <hr></hr>
                </div>
            )

        }
        let ordenes;
        if (this.state.ordenes) {
            ordenes = this.state.ordenes.map((orden, index) =>
                <option value={orden.idor}>{orden.idor}</option>
            )
        }

        return (
            <div className="modalPreguntaEncuesta vEmergencia">
                <div>
                    <h3>Modificar Hito Emergencia</h3>
                    <div>
                        <div className="elemento">
                            <input type="date" className="input-generico w100" value={this.state.fecha} onChange={this.onChangeInput} name="fecha"></input>
                        </div>
                        <div className="elemento">
                            <select onChange={this.onChangeInput} name="hora" value={this.state.hora} className="input-generico">
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
                            <select name="turno" onChange={this.onChangeInput} value={this.state.turno} className="input-generico">
                                <option>Turno</option>
                                {ordenes}
                            </select>
                        </div>
                        <div className="elemento">
                            <select name="selectTrabajador" onChange={this.onChangeTrabajadores} value={this.state.selectTrabajador} className="input-generico">
                                <option>Involucrados</option>
                                {trabajadores}
                            </select>
                        </div>
                        {trabajadoresAsignados}
                        <div className="elemento">
                            <textarea name="hito" onChange={this.onChangeInput} value={this.state.hito} className="input-generico" placeholder="Hito emergencia"></textarea>
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