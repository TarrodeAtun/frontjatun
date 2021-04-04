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

export default class CambiarPass extends Component {

    constructor(props) {
        super(props);

        this.state = {
            currentUser: autenticacion.currentUserValue,
            index:'',
            pregunta: '',
            tipo: '',
            opciones: []
        };
    }

    componentDidMount = (e) =>{
        console.log(this.props.props);
        this.setState({
            index: this.props.props.index,
            pregunta: this.props.props.pregunta.pregunta,
            opciones: this.props.props.pregunta.opciones,
            tipo: this.props.props.pregunta.tipo
        })
    }

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
                await this.props.props.modificaPregunta(this.state.index, this.state.pregunta, this.state.tipo, this.state.opciones);
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
            <div className="modalPreguntaEncuesta">
                <div>
                    <h3>Editar pregunta</h3>
                    <div>
                        <div>
                            <textarea
                                className="input-generico"
                                value={this.state.pregunta}
                                placeholder="Escribe tu pregunta"
                                rows="6"
                                onChange={this.onChangeInput}
                                name="pregunta"
                            />
                        </div>
                        <div className="contenido">
                            <div className="opciones">
                                <input type="radio" checked = {this.state.tipo === '1'} value="1" onChange={this.onChangeInput} name="tipo"></input>
                                <label>Elige opción de respuesta</label>
                                <div>
                                    <button onClick={this.agregarOpcion}>+ Agregar Opción</button>
                                    {items}
                                </div>
                            </div>
                            <div className="corta">
                                <input type="radio" checked = {this.state.tipo === '2'} onChange={this.onChangeInput} value="2" name="tipo"></input>
                                <label>Respuesta corta</label>
                            </div>

                        </div>
                        <div className="form-group buttons">
                            <button className="boton-generico btazul" onClick={this.props.closeModal} type="submit">Cancelar</button>
                            <button className="boton-generico btazul" onClick={this.enviarDatos} type="button">Aceptar</button>
                        </div>
                        <div><p className="mensaje">{this.state.mensaje}</p></div>
                    </div>
                </div>
            </div>
        )
    }
}