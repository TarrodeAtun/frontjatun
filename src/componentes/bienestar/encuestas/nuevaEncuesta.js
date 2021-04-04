// importaciones de bibliotecas 
import React, { Component } from "react";
import { autenticacion } from '../../../servicios/autenticacion';
import { Link } from 'react-router-dom';
import Axios from '../../../helpers/axiosconf';
import { authHeader } from '../../../helpers/auth-header';
import { handleResponse } from '../../../helpers/manejador';

import { toast } from 'react-toastify';

// importaciones de estilos 
import '../../../styles/fichaTrabajador.css';

import edit from "../../../assets/iconos/edit.svg";
import basurero from "../../../assets/iconos/basurero.svg";

//componentes
import AgregarPregunta from './nuevaPregunta';
import EditarPregunta from './editarPregunta';

//modal
import Modal from '../../includes/modal';
import { toogleModalCore } from '../../includes/funciones';


// importaciones de iconos 
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

export default class NuevaEncuesta extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentUser: autenticacion.currentUserValue,
            datosUsuarios: "",
            users: null,
            nombreEncuesta: '',
            preguntas: [],
            showAgregaPregunta: '',
            modifyTarget: '',
            modifyTargetIndex: ''
        };
    }

    toogleModal = toogleModalCore; //copiamos la funcion modal a una funcion local


    onChangeInput = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    manejadorModals = (e, res) => {
        this.toogleModal(e, res);
    }
    modalPregunta = (e, res) => {
        var index = e.currentTarget.dataset.index;
        var target = this.state.preguntas[index];
        this.setState({ modifyTarget: target, modifyTargetIndex: index });
        this.manejadorModals(e, res);
    }
    agregaPregunta = (pregunta, tipo, opciones) => {
        let preguntaNueva = { pregunta, tipo, opciones };
        this.setState({
            preguntas: [...this.state.preguntas, preguntaNueva]
        });
        console.log(this.state.preguntas);
    }

    modificaPregunta = (index, pregunta, tipo, opciones) => {
        let preguntaNueva = this.state.preguntas;
        console.log(preguntaNueva);
        preguntaNueva[index].pregunta = pregunta;
        preguntaNueva[index].tipo = tipo;
        preguntaNueva[index].opciones = opciones;
        console.log(preguntaNueva);
        this.setState({ preguntas: preguntaNueva });
    }

    eliminaPregunta = (e) => {
        const llave = e.target.dataset.key;
        let preguntas = this.state.preguntas;
        preguntas.splice(llave, 1);
        this.setState({ preguntas: preguntas });
    }



    onSubmit = async (e) => {
        if (this.state.preguntas.length !== 0) {
            const res = await Axios.post('/api/bienestar/encuestas/create/', {
                nombre: this.state.nombreEncuesta,
                preguntas: this.state.preguntas,
            }, { headers: authHeader() })
                .then(respuesta => {
                    toast.success("Encuesta agregada satisfactoriamente", toastoptions);
                    historial.push("/bienestar/encuestas/mis-encuestas");
                    console.log(respuesta);
                });
        }
        else {
            toast.warning("Debes agregar al menos una pregunta", toastoptions);
        }

    }

    render() {

        const compo = this;
        let items;
        if (this.state.preguntas.length !== 0) {
            items = this.state.preguntas.map((pregunta, index) =>
                <div key={index} data-key={index} className="elemento">
                    <div className="enunciado">
                        <p>{index + 1}. {pregunta.pregunta}</p>
                        <div class="actions">
                            <button onClick={this.modalPregunta} data-objetivo="ModificarPregunta" data-index={index}><img src={edit} /></button>
                            <button onClick={this.eliminaPregunta}><img src={basurero} /></button>
                        </div>
                    </div>
                    <div className="respuestas">
                        {pregunta.tipo === "1"
                            ? <div>
                                <ul>
                                    {
                                        pregunta.opciones.map((opcion, index) =>
                                            <li value={opcion.index}>
                                                <input type="radio" disabled />
                                                <label> {opcion.value}</label>
                                            </li>
                                        )
                                    }
                                </ul>
                            </div>
                            : <div>
                                <textarea readOnly></textarea>
                            </div>
                        }
                    </div>
                </div>
            );
        }
        else {
            items =
                <div className="elemento">
                    <div className="enunciado">
                        <p>Sin preguntas</p>
                        <div class="actions">
                            <button><img src={edit} /></button>
                            <button><img src={basurero} /></button>
                        </div>
                    </div>
                </div>
        }
        return (
            <div className="principal menu-lista-dashboard listaPreguntas">
                <div>
                    <h2 className="naranjo"><Link to="/bienestar/encuestas/mis-encuestas"> <Bamarillorev /></Link> Mis Encuestas / <strong>Nueva Encuesta</strong></h2>
                </div>
                <div className="listado-simple">
                    <div className="encabezado">
                        <input className="form-control" onChange={this.onChangeInput} name="nombreEncuesta" value={this.state.nombreEncuesta} placeholder="Nombre encuesta" />
                        <button className="ml" onClick={this.manejadorModals} data-objetivo="AgregarPregunta">+ Agregar pregunta</button>
                    </div>
                    <div className="elementos">
                        {items}
                    </div>
                </div>
                <div className="enviar">
                    {this.state.preguntas.length !== 0
                    ?<button className="boton-generico btazul" onClick={this.onSubmit}>Enviar</button>
                    :<button className="boton-generico btgris">Enviar</button>
                    }
                </div>
                <div id="modales">
                    <Modal
                        name="AgregarPregunta"  //nombre del estado que controla el modal
                        show={this.state.showAgregarPregunta} //indicamos la propiedad show con el estado que controlara al modal
                        contenido={<AgregarPregunta />} //entregamos el componente que se renderizara en el modal 
                        toogleModal={this.manejadorModals} //traspasamos la funcion que permitira abrir y cerrar el modal
                        agregaPregunta={this.agregaPregunta}
                    />
                    <Modal
                        name="ModificarPregunta"  //nombre del estado que controla el modal
                        show={this.state.showModificarPregunta} //indicamos la propiedad show con el estado que controlara al modal
                        contenido={<EditarPregunta />} //entregamos el componente que se renderizara en el modal 
                        toogleModal={this.manejadorModals} //traspasamos la funcion que permitira abrir y cerrar el modal
                        modificaPregunta={this.modificaPregunta}
                        index={this.state.modifyTargetIndex}
                        pregunta={this.state.modifyTarget}
                    />
                </div>
            </div>
        );
    }
}