// importaciones de bibliotecas 
import React, { Component } from "react";
import { autenticacion } from '../../../servicios/autenticacion';
import { Link } from 'react-router-dom';
import Axios from '../../../helpers/axiosconf';
import { authHeader } from '../../../helpers/auth-header';
import { handleResponse } from '../../../helpers/manejador';

import { toast } from 'react-toastify';

import edit from "../../../assets/iconos/edit.svg";
import basurero from "../../../assets/iconos/basurero.svg";

import { ReactComponent as Bamarillorev } from "../../../assets/iconos/bamarillorev.svg";
import { ReactComponent as Flechaam } from "../../../assets/iconos/flechaam.svg";
import { empty } from "rxjs";
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

export default class VerMensajeSoporte extends Component {

    constructor(props) {
        super(props);

        this.state = {
            currentUser: autenticacion.currentUserValue,
            pregunta: '',
            tipo: '',
            opciones: []
        };
    }


    // agregarPregunta = this.props.agregaPregunta;

    onChangeInput = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    onChangeOption = (e) => {
        const llave = e.target.dataset.key;
        let opciones = this.state.opciones;
        opciones[llave].value = e.target.value;
        this.setState({ opciones: opciones });
    }

    agregarOpcion = (e) => {
        console.log(this.state.opciones);
        const opcion = {
            value: '',
        }
        this.setState({
            opciones: [...this.state.opciones, opcion]
        })
    }
    eliminaOpcion = (e) => {
        const llave = e.target.dataset.key;
        let opciones = this.state.opciones;
        opciones.splice(llave, 1);
        this.setState({ opciones: opciones });
    }
    enviarDatos = async (e) => {
        if (this.state.pregunta) {
            if (this.state.tipo) {
                await this.props.props.agregaPregunta(this.state.pregunta, this.state.tipo, this.state.opciones);
                await this.props.closeModal();
            } else {
                toast.warning("Debe Seleccionar un tipo de respuesta", toastoptions);
            }
        }
        else {
            toast.warning("Debe llenar los campos", toastoptions);
        }

    }


    render() {
        const compo = this;
        const items = this.state.opciones.map((opcion, index) =>
            <div className="fila" key={index}>
                <input onChange={compo.onChangeOption} data-key={index} placeholder="Añadir opción" value={opcion.value} type="text" />
                <button onClick={compo.eliminaOpcion} data-key={index}>x</button>
            </div>

        );
        return (
            <div className="principal menu-lista-dashboard listaPreguntas">
                <div>
                    <h2 className="naranjo"><Link to="/bienestar/soporte"> <Bamarillorev /></Link> Soporte Técnico / <strong>Mensaje</strong></h2>
                </div>
                <div className="listado-simple">
                    <div className="encabezado">
                        <h3 className="amarillo">Mensajes</h3>
                        <Link to="/bienestar/encuestas/nueva-encuesta" className="ml celeste">Finalizar Consulta</Link>
                    </div>
                    <div className="elementos">
                        <div className="elemento-mensaje">
                            <div className="image">

                            </div>
                            <div className="content">
                                <h3>Nombre Asunto</h3>
                                <ul>
                                    <li>De: Lorem Ipsum</li>
                                    <li>Run: 11.111.111-1</li>
                                    <li>Fecha: 15-01-2021 16:32</li>
                                </ul>
                                <p>
                                Estimados: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis imperdiet tincidunt nulla rutrum venenatis. In faucibus, tortor vel rhoncus tincidunt, diam leo finibus libero, sed ultrices ex massa ac ligula. Duis vestibulum dolor eget arcu scelerisque viverra. 
                                Praesent orci urna, sollicitudin a mollis eu, tristique at est. Nunc gravida semper mollis. Pellentesque ultrices ante vel augue convallis, sed aliquam erat consectetur. Quisque id dapibus nisl. Mauris vel metus placerat, elementum sapien vitae, bibendum quam. Saludos
                                </p>
                            </div>
                        </div>
                        <div className="elemento-mensaje">
                            <div className="image">

                            </div>
                            <div className="content">
                                <ul>
                                    <li>De: Lorem Ipsum</li>
                                    <li>Fecha: 15-01-2021 16:32</li>
                                </ul>
                                <p>
                                Estimados: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis imperdiet tincidunt nulla rutrum venenatis. In faucibus, tortor vel rhoncus tincidunt, diam leo finibus libero, sed ultrices ex massa ac ligula. Duis vestibulum dolor eget arcu scelerisque viverra. 
                                Praesent orci urna, sollicitudin a mollis eu, tristique at est. Nunc gravida semper mollis. Pellentesque ultrices ante vel augue convallis, sed aliquam erat consectetur. Quisque id dapibus nisl. Mauris vel metus placerat, elementum sapien vitae, bibendum quam. Saludos
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="modalPreguntaEncuesta">
                    <div className="form-mensaje">
                        <button onClick={this.props.closeModal}><h3 className="amarillo"> Contestar</h3></button>
                        <div>
                            <div>
                                <textarea
                                    className="input-generico"
                                    value={this.state.pregunta}
                                    placeholder="Escribe tu mensaje"
                                    rows="8"
                                    onChange={this.onChangeInput}
                                    name="pregunta"
                                />
                            </div>
                        </div>
                        <div className="form-group buttons">
                            <button className="boton-generico btazulalt" onClick={this.actualizaDatos}>Cancelar</button>
                            <button className="boton-generico btazul" type="button">Enviar</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}