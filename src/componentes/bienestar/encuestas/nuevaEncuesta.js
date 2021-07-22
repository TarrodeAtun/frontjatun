// importaciones de bibliotecas 
import React, { Component } from "react";
import { autenticacion } from '../../../servicios/autenticacion';
import { Link } from 'react-router-dom';
import Axios from '../../../helpers/axiosconf';
import { authHeader } from '../../../helpers/auth-header';
import { handleResponse } from '../../../helpers/manejador';
import { funciones } from '../../../servicios/funciones';
import { confirmAlert } from 'react-confirm-alert';

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
import { async, empty } from "rxjs";
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
            todos: 0,
            modifyTarget: '',
            modifyTargetIndex: '',

            trabajadores: '',
            trabajadoresSelect: [],
            selectTrabajador: ''
        };
    }

    toogleModal = toogleModalCore; //copiamos la funcion modal a una funcion local


    componentDidMount = async (e) => {
        await this.setState({ trabajadores: await funciones.obtenerTodosTrabajadores() });
    }
    onChangeInput = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    selectTodos = (e) => {
        if (e.target.checked === true) {
            this.setState({
                trabajadoresSelect: [],
                todos: 1
            })
        } else {
            this.setState({
                todos: 0
            })
        }
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
        })
    }

    eliminaTrabajador = (e) => {
        console.log("elimina");
        var trabajadores = this.state.trabajadoresSelect;
        trabajadores.splice(e, 1);
        this.setState({
            trabajadoresSelect: trabajadores
        })
    }

    enviaDatos = async (e) => {
        if (this.state.nombreEncuesta !== "") {
            if (this.state.preguntas.length !== 0) {
                if (this.state.trabajadoresSelect.length !== 0 || this.state.todos === 1) {
                    const res = await Axios.post('/api/bienestar/encuestas/create/', {
                        nombre: this.state.nombreEncuesta,
                        preguntas: this.state.preguntas,
                        trabajadores: this.state.trabajadoresSelect,
                        todos: this.state.todos
                    }, { headers: authHeader() })
                        .then(respuesta => {
                            toast.success("Encuesta agregada satisfactoriamente", toastoptions);
                            historial.push("/bienestar/encuestas/mis-encuestas");
                            console.log(respuesta);
                        });
                } else {
                    toast.warning("Debes agregar al menos un trabajador", toastoptions);
                }
            } else {
                toast.warning("Debes agregar al menos una pregunta", toastoptions);
            }
        } else {
            toast.warning("Debes agregar un nombre a la pregunta", toastoptions);
        }
    }

    onSubmit = async (e) => {
        let componente = this;
        confirmAlert({
            customUI: ({ onClose }) => {
                return (
                    <div className='custom-confirm '>
                        <p>¿Estas seguro de ingresar la encuesta, una vez enviada no se pueden agregar mas trabajadores?</p>
                        <button className="boton-generico btazulalt" onClick={onClose}>Cancelar</button>
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


        let trabajadores;
        console.log(this.state.trabajadores);
        if (this.state.trabajadores) {
            trabajadores = this.state.trabajadores.map((trabajador, index) =>
                <option value={trabajador.rut} data-dv={trabajador.dv} data-nombre={trabajador.nombre} data-apellido={trabajador.apellido}>{trabajador.nombre} {trabajador.apellido}</option>
            )
        }
        let trabajadoresAsignados;
        if (this.state.trabajadoresSelect) {
            trabajadoresAsignados = this.state.trabajadoresSelect.map((trabajador, index) =>
                <div className="div-trabajador">
                    <span>Trabajador {index + 1}</span>
                    <span className="spanConductor">
                        <button onClick={e => this.eliminaTrabajador(index)}>X</button>
                        <span>{trabajador.nombre} {trabajador.apellido}</span>
                        <span>{trabajador.rut}-{trabajador.dv}</span>
                    </span>
                </div>
            )

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
                <div className="seccion seccion-trabajadores-encuestas">
                    <div>
                        <span>Trabajadores Asignados </span>
                        <span className="block w100 separacion">Seleccionar Todos <input type="checkbox" name="todos" onChange={this.selectTodos} /></span>
                        <span className="select-container">
                            {this.state.todos === 1
                                ? <select name="selectTrabajador" disabled onChange={this.onChangeTrabajadores} value={this.state.selectTrabajador} className="input-generico">
                                    <option>Seleccionar</option>
                                    {trabajadores}
                                </select>
                                : <select name="selectTrabajador" onChange={this.onChangeTrabajadores} value={this.state.selectTrabajador} className="input-generico">
                                    <option>Seleccionar</option>
                                    {trabajadores}
                                </select>
                            }

                        </span>
                    </div>
                    {trabajadoresAsignados}
                </div>
                <div className="enviar">
                    {this.state.preguntas.length !== 0
                        ? <button className="boton-generico btazul" onClick={this.onSubmit}>Enviar</button>
                        : <button className="boton-generico btgris">Enviar</button>
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