// importaciones de bibliotecas 
import React, { Component } from "react";
import { autenticacion } from '../../servicios/autenticacion';
import { Link } from 'react-router-dom';

// importaciones de estilos 
import '../../styles/fichaTrabajador.css';

import edit from "../../assets/iconos/edit.svg";
import ojo from "../../assets/iconos/ojo.svg";
import basurero from "../../assets/iconos/basurero.svg";

//componentes
import AgregarPregunta from './nuevaPregunta';

//modal
import Modal from '../includes/modal';
import { toogleModalCore } from '../includes/funciones';


// importaciones de iconos 
import { ReactComponent as Bamarillorev } from "../../assets/iconos/bamarillorev.svg";
import { ReactComponent as Flechaam } from "../../assets/iconos/flechaam.svg";
import { empty } from "rxjs";

export default class NuevaEncuesta extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentUser: autenticacion.currentUserValue,
            datosUsuarios: "",
            users: null,
            preguntas: '',
            showAgregaPregunta: ''
        };
    }

    toogleModal = toogleModalCore; //copiamos la funcion modal a una funcion local

    manejadorModals = (e, res) => {
        this.toogleModal(e, res);
    }
    agregaPregunta = (pregunta, tipo, opciones) => {
        let preguntaNueva = { pregunta, tipo, opciones };
        this.setState({
            preguntas: [...this.state.preguntas, preguntaNueva]
        });
        console.log(this.state.preguntas);
    }

    eliminaPregunta = (e) => {
        const llave = e.target.dataset.key;
        let preguntas = this.state.preguntas;
        preguntas.splice(llave, 1);
        this.setState({ preguntas: preguntas });
    }

    render() {

        const compo = this;
        let items;
        if (this.state.preguntas || this.state.preguntas === empty) {
            items = this.state.preguntas.map((pregunta, index) =>
                <div key={index} data-key={index} className="elemento">
                    <div className="enunciado">
                        <p>{index + 1}. {pregunta.pregunta}</p>
                        <div class="actions">
                            <button><img src={edit} /></button>
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
                                <ul>

                                </ul>
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
                    <h2 className="naranjo"><Link to="/personas/gestion"> <Bamarillorev /></Link> Mis Encuestas / <strong>Nueva Encuesta</strong></h2>
                </div>
                <div className="listado-simple">
                    <div className="encabezado">
                        <input className="form-control" placeholder="Nombre encuesta" />
                        <button className="ml" onClick={this.manejadorModals} data-objetivo="AgregarPregunta">+ Agregar pregunta</button>
                    </div>
                    <div className="elementos">

                        {items}
                    </div>
                </div>
                <div id="modales">
                    <Modal
                        name="AgregarPregunta"  //nombre del estado que controla el modal
                        show={this.state.showAgregarPregunta} //indicamos la propiedad show con el estado que controlara al modal
                        contenido={<AgregarPregunta />} //entregamos el componente que se renderizara en el modal 
                        toogleModal={this.manejadorModals} //traspasamos la funcion que permitira abrir y cerrar el modal
                        agregaPregunta={this.agregaPregunta}
                    />
                </div>
            </div>
        );
    }
}