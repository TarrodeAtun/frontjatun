// importaciones de bibliotecas 
import React, { Component, useState } from "react";
import { autenticacion } from '../../../servicios/autenticacion';
import { confirmAlert } from 'react-confirm-alert';
import Axios from '../../../helpers/axiosconf';
import { authHeader } from '../../../helpers/auth-header';
import { handleResponse } from '../../../helpers/manejador';
import { funciones } from '../../../servicios/funciones';
import { toast } from 'react-toastify';

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



export default class CrearRetiro extends Component {

    constructor(props) {
        super(props);
        this.myRef = React.createRef();
        this.state = {
            currentUser: autenticacion.currentUserValue,
            datosUsuarios: "",
            form: {
                fecha: '',
                clienteRut: '',
                sector: '',
                servicio: '',
                jornada: '',
                hora: '',
                tipoEmergencia: '',
                clasificacionEmergencia: '',
                observaciones: '',
            },
            clientes: '',
            servicios: '',
            sectores: '',
            jornadas: '',
            imagen: '',
        };

    }


    componentDidMount = async() => {
        await this.setState({ clientes: await funciones.obtenerClientes() });
        await this.setState({ servicios: await funciones.obtenerServicios() });
        // this.obtenerServicios();
        // this.obtenerTiposTurno();
        // this.obtenerTrabajadores();
        // this.obtenerJefesCuadrilla();
    }

    onChangeInput = async (e) => {
        await this.setState({
            form: {
                ...this.state.form, [e.target.name]: e.target.value
            }
        });
        if (this.state.form.fecha !== '' && this.state.form.clienteRut !== '' && this.state.form.sector !== '' && this.state.form.servicio !== '') {
            console.log("obteniendo");
            this.obtenerJornadas();
        } else {
            console.log(this.state.form);
            console.log("asd")
        }
    }

    onChangeFileInput = (e) => {
        console.log(e.target.files[0]);
        this.setState({
            [e.target.name]: e.target.files[0]
        })
    }

    obtenerJornadas = async () => { //genera una peticion get por axios a la api de usuarios
        var componente = this;
        const res = Axios.post('/api/generales/jornadas/', {
            fecha: this.state.form.fecha,
            clienteRut: this.state.form.clienteRut,
            sector: this.state.form.sector,
            servicio: this.state.form.servicio
        }, { headers: authHeader() }) //se envia peticion axios con el token sesion guardado en local storage como cabecera
            .then(function (res) {   //si la peticion es satisfactoria entonces
                console.log(res.data)
                if (res.data.data.length > 0) {
                    componente.setState({
                        jornadas: res.data.data
                    });
                }else{
                    toast.warning("No se registran turnos con estos datos", toastoptions);
                }
            })
            .catch(function (err) { //en el caso de que se ocurra un error, axios lo atrapa y procesa
                console.log(err);
                handleResponse(err.response);  //invocamos al manejador para ver el tipo de error y ejecutar la accion pertinente
                return;
            });
    }

    onChangeCliente = async (e) => {
        var clienteRut = e.target.value;
        if (e.target.value) {
            await this.setState({ form: { ...this.state.form, clienteRut: clienteRut } })
            await this.setState({ form: { ...this.state.form, sector: '' } })
            let clientes = await this.state.clientes;
            let clienteSelect = await clientes.find(cliente => parseInt(cliente.rut) === parseInt(clienteRut));
            this.setState({ sectores: clienteSelect.sectores });
        } else {
            console.log("no");
            await this.setState({ form: { ...this.state.form, clienteRut: '' } })
            await this.setState({ form: { ...this.state.form, sector: '' } })
            await this.setState({ sectores: '' });
        }
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
                                componente.enviaDatos();
                                onClose();
                            }} >
                            Aceptar
                        </button>
                    </div>
                );
            }
        });
    }

    pushLista = () => {
        historial.push("/personas/turnos");
    }



    enviaDatos = async e => {
        var componente = this;
        var formData = new FormData();
        var campoVacio = false;
        console.log(this.state.form);
        await Object.entries(this.state.form).map((t, k) => {
            if (t[1] === "" || t[1] === null) {
                campoVacio = true;
            }
        });
       
        if (!campoVacio) {
            formData.append('cliente', this.state.form.clienteRut);
            formData.append('sector', this.state.form.sector);
            formData.append('servicio', this.state.form.servicio);
            formData.append('fecha', this.state.form.fecha);
            formData.append('turno', this.state.form.jornada);
            formData.append('hora', this.state.form.hora);
            formData.append('tipo', this.state.form.tipoEmergencia);
            formData.append('clasificacion', this.state.form.clasificacionEmergencia);
            formData.append('observaciones', this.state.form.observaciones);
            formData.append('imagen', this.state.imagen);
            console.log("campo vacio");
            const res = await Axios.post('/api/users/worker/turnos/asistencia/emergencias/crear/', formData
            , { headers: authHeader() })
                .then(respuesta => {
                    console.log(respuesta);
                    // this.setState({ idUsuario: respuesta.data.id });
                    if (respuesta.data.estado === "success") {
                        toast.success(respuesta.data.mensaje, toastoptions);
                        historial.push("/personas/asistencias/emergencias/");
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

        // let clientes;
        // if (this.state.clientes) {
        //     clientes = this.state.clientes.map((cliente, index) =>
        //         <option value={cliente.rut} data-dv={cliente.dv}>{cliente.nombre}</option>
        //     )
        // }
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
        let jornadas;
        if (this.state.jornadas) {
            console.log(this.state.jornadas);
            jornadas = this.state.jornadas.map((jornada, index) =>
                <option value={jornada._id}>{jornada.inicio} - {jornada.termino}</option>
            )
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
                                    <input name="fecha" onChange={this.onChangeInput} value={this.state.form.fecha} className="input-generico" type="date" />
                                </span>
                            </div>
                            <div>
                                <span>Cliente</span>
                                <span>
                                    <select name="clienteRut" onChange={this.onChangeCliente} className="input-generico" value={this.state.form.clienteRut} >
                                        <option value="">Seleccionar</option>
                                        {clientes}
                                    </select>
                                </span>
                            </div>
                            <div>
                                <span>Sector</span>
                                <span>
                                    <select name="sector" onChange={this.onChangeInput} value={this.state.form.sector} className="input-generico">
                                        <option value="">Seleccionar</option>
                                        {sectores}
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
                                <span>Jornada</span>
                                <span>
                                    <select name="jornada" onChange={this.onChangeInput} value={this.state.form.jornada} className="input-generico">
                                        <option>Seleccionar</option>
                                        {jornadas}
                                    </select>
                                </span>
                            </div>
                            <div>
                                <span>Hora</span>
                                <span>
                                    <select name="hora" onChange={this.onChangeInput} value={this.state.form.hora} className="input-generico">
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
                                <span>Tipo Emergencia</span>
                                <span>
                                    <select name="tipoEmergencia" onChange={this.onChangeInput} value={this.state.form.tipoEmergencia} className="input-generico">
                                        <option>Seleccionar</option>
                                        <option value="1">Laboral</option>
                                        <option value="2">Servicio</option>
                                    </select>
                                </span>
                            </div>
                            <div>
                                <span>Clasificación Emergencia</span>
                                <span>
                                    <select name="clasificacionEmergencia" onChange={this.onChangeInput} value={this.state.form.clasificacionEmergencia} className="input-generico">
                                        <option>Seleccionar</option>
                                        <option value="1">Robo</option>
                                        <option value="2">Accidente</option>
                                    </select>
                                </span>
                            </div>
                            <div>
                                <span>Observaciones</span>
                                <span>
                                    <textarea name="observaciones" onChange={this.onChangeInput} value={this.state.form.observaciones} className="input-generico">
                                    </textarea>
                                </span>
                            </div>
                            <div>
                                <span>Adjunto (opcional)</span>
                                <span>
                                    <input type="file" onChange={this.onChangeFileInput} name="imagen" className="input-generico" />
                                </span>
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