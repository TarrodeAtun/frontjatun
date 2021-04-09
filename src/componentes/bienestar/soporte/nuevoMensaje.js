import React, { Component, useState, Fragment } from 'react';

import { autenticacion } from '../../../servicios/autenticacion';

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

export default class NuevoMensaje extends Component {

    constructor(props) {
        super(props);

        this.state = {
            currentUser: autenticacion.currentUserValue,
            asunto: '',
            primerMensaje: '',
        };
    }


    // agregarPregunta = this.props.agregaPregunta;

    onChangeInput = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }
    enviarDatos = async (e) => {
        console.log("1");
        if (this.state.asunto) {
            console.log("2");
            if (this.state.primerMensaje) {
                console.log("3");
                var primerMensaje = this.state.primerMensaje;
                primerMensaje = primerMensaje.replace("\n", "<br/>");
                console.log(primerMensaje);
                await this.props.props.agregarConsulta(this.state.asunto, primerMensaje);
                toast.success("Consulta ingresada exitosamente, se le notificará cuando sea respondida", toastoptions);
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
    
        return (
            <div className="modalPreguntaEncuesta">
                <div className="form-mensaje">
                    <button onClick={this.props.closeModal}><h3 className="amarillo"> Mensajes</h3></button>
                    <div>
                        <div>
                            <input name="asunto"  value={this.state.asunto} onChange={this.onChangeInput} className="input-generico" placeholder="Nombre Asunto" />
                        </div>
                        <div>
                            <textarea
                                className="input-generico"
                                value={this.state.primerMensaje}
                                placeholder="Escribe tu mensaje"
                                rows="8"
                                onChange={this.onChangeInput}
                                name="primerMensaje"
                            />
                        </div>
                    </div>
                    <div className="form-group buttons">
                        <button className="boton-generico btazulalt" onClick={this.props.closeModal}>Cancelar</button>
                        <button className="boton-generico btazul" onClick={this.enviarDatos} type="button">Enviar</button>
                    </div>
                </div>
            </div>
        )
    }
}