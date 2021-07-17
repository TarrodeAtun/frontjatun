// importaciones de bibliotecas 
import React, { Component } from "react";
import { autenticacion } from '../../servicios/autenticacion';
import { Link } from 'react-router-dom';
import Axios from '../../helpers/axiosconf';
import { authHeader } from '../../helpers/auth-header';
import { handleResponse } from '../../helpers/manejador';
import moment from 'moment';
import { confirmAlert } from 'react-confirm-alert';

import { toast } from 'react-toastify';

import edit from "../../assets/iconos/edit.svg";
import basurero from "../../assets/iconos/basurero.svg";

import { ReactComponent as Bamarillorev } from "../../assets/iconos/bamarillorev.svg";
import { ReactComponent as Flechaam } from "../../assets/iconos/flechaam.svg";
import { empty } from "rxjs";
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

export default class VerMensajeSoporte extends Component {

    constructor(props) {
        super(props);

        this.state = {
            currentUser: autenticacion.currentUserValue,
            pregunta: '',
            estado: '',
            mensajes: [],
            mensaje: ''
        };
    }


    // agregarPregunta = this.props.agregaPregunta;

    onChangeInput = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    async componentDidMount() {
        await this.cargarMensajes();
        console.log(this.state.encuestas);
        this.interval = setInterval(this.cargarMensajes, 10000)
    }
    componentWillUnmount() {
        // Clear the interval right before component unmount
        clearInterval(this.interval);
    }


    cargarMensajes = () => {
        var { id } = this.props.match.params;
        var componente = this;
        Axios.get('/api/bienestar/soporte/consultas/' + id, { headers: authHeader() }) //se envia peticion axios con el token sesion guardado en local storage como cabecera
            .then(function (res) {   //si la peticion es satisfactoria entonces
                console.log(res.data.data);
                console.log(res.data.estadoConsulta);
                componente.setState({ mensajes: res.data.data, estado: res.data.estadoConsulta });  //almacenamos el listado de usuarios en el estado usuarios (array)
            })
            .catch(function (err) { //en el caso de que se ocurra un error, axios lo atrapa y procesa
                handleResponse(err.response);  //invocamos al manejador para ver el tipo de error y ejecutar la accion pertinente
                return;
            });
    }
    responder = () => {
        var { id } = this.props.match.params;
        var componente = this;
        Axios.post('/api/bienestar/soporte/consulta/responder', {
            id: id,
            mensaje: this.state.mensaje
        },
            { headers: authHeader() }) //se envia peticion axios con el token sesion guardado en local storage como cabecera
            .then(function (res) {   //si la peticion es satisfactoria entonces
                console.log(res);
                componente.cargarMensajes();
                toast.success("¡Mensaje enviado!")
            })
            .catch(function (err) { //en el caso de que se ocurra un error, axios lo atrapa y procesa
                console.log(err);
                handleResponse(err.response);  //invocamos al manejador para ver el tipo de error y ejecutar la accion pertinente
                return;
            });
    }

    finalizarConsulta = () => {
        var { id } = this.props.match.params;
        var componente = this;
        confirmAlert({
            customUI: ({ onClose }) => {
                return (
                    <div className='custom-confirm '>
                        <p>¿Estás seguro(a) que deseas finalizar la consulta?</p>
                        <button className="boton-generico btazulalt" onClick={onClose}>Cancelar</button>
                        <button className="boton-generico btazul"
                            onClick={() => {
                                Axios.post('/api/bienestar/soporte/consulta/finalizar', {
                                    id: id
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

    eliminaOpcion = (e) => {
        const llave = e.target.dataset.key;
        let opciones = this.state.opciones;
        opciones.splice(llave, 1);
        this.setState({ opciones: opciones });
    }


    render() {
        let items = [];
        if (this.state.mensajes.length !== 0) {
            items = this.state.mensajes.map((mensaje, index) =>
                <div className="elemento-mensaje">
                    <div className="image">

                    </div>
                    <div className="content">
                        <h3>{mensaje.asd[0].asunto}</h3>
                        <ul>
                            <li>De: {mensaje.datosAutor[0].nombre} {mensaje.datosAutor[0].apellido}</li>
                            <li>Run: {mensaje.datosAutor[0].nombre}</li>
                            <li>Fecha: {moment(mensaje.fechaRespuesta).format('DD-MM-YYYY  HH:mm')}</li>
                        </ul>
                        <p dangerouslySetInnerHTML={{ __html: mensaje.mensaje }} />
                    </div>
                </div>
            )
        } else {
            items = <div className="elemento-mensaje">No mensajes en este hilo</div>
        }
        return (
            <div className="principal menu-lista-dashboard listaPreguntas">
                <div>
                    <h2 className="naranjo"><Link to="/perfil/bienestar/soporte"> <Bamarillorev /></Link> Soporte Técnico / <strong>Mensaje</strong></h2>
                </div>
                <div className="listado-simple chat">
                    <div className="encabezado">
                        <h3 className="amarillo">Mensajes</h3>
                        {this.state.estado === 0
                            ? <button onClick={this.finalizarConsulta} className="ml celeste">Finalizar Consulta</button>
                            : <div></div>
                        }
                    </div>
                    <div className="elementos">
                        {items}
                    </div>
                </div>
                {this.state.estado === 0
                    ? <div className="modalPreguntaEncuesta">
                        <div className="form-mensaje">
                            <button onClick={this.props.closeModal}><h3 className="amarillo"> Contestar</h3></button>
                            <div>
                                <div>
                                    <textarea
                                        className="input-generico"
                                        value={this.state.mensaje}
                                        placeholder="Escribe tu mensaje"
                                        rows="8"
                                        onChange={this.onChangeInput}
                                        name="mensaje"
                                    />
                                </div>
                            </div>
                            <div className="form-group buttons">
                                <button className="boton-generico btazulalt">Cancelar</button>
                                <button className="boton-generico btazul" type="button" onClick={this.responder}>Enviar</button>
                            </div>
                        </div>
                    </div>
                    : <div></div>
                }

            </div>
        )
    }
}