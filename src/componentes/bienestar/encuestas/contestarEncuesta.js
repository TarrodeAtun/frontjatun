// importaciones de bibliotecas 
import React, { Component } from "react";
import { autenticacion } from '../../../servicios/autenticacion';
import { Link } from 'react-router-dom';
import Axios from '../../../helpers/axiosconf';
import { authHeader } from '../../../helpers/auth-header';
import { handleResponse } from '../../../helpers/manejador';
import { historial } from '../../../helpers/historial';

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


const toastoptions = {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
}

export default class ContestarEncuesta extends Component {
    constructor(props) {
        super(props);
        this.myRef = React.createRef();
        this.state = {
            currentUser: autenticacion.currentUserValue,
            datosUsuarios: "",
            users: null,
            idEncuesta: '',
            nombreEncuesta: '',
            preguntas: [],
            respuestas: []
        };
    }

    toogleModal = toogleModalCore; //copiamos la funcion modal a una funcion local

    onChangeInput = (e) => {
        console.log(e.target.value);
        this.setState({
            respuestas: {
                ...this.state.respuestas, [e.target.name]: e.target.value
            }
        });
        console.log(this.state.respuestas);
    }

    async componentDidMount() {
        await this.cargarEncuesta();
    }

    cargarEncuesta = async () => { //genera una peticion get por axios a la api de usuarios
        var { id } = this.props.match.params;
        var componente = this;
        const res = Axios.get('/api/bienestar/encuestas/' + id, { headers: authHeader() }) //se envia peticion axios con el token sesion guardado en local storage como cabecera
            .then(function (res) {   //si la peticion es satisfactoria entonces
                let datos = res.data.data;
                componente.setState({
                    idEncuesta: datos._id,
                    nombreEncuesta: datos.nombre,
                    preguntas: datos.preguntas
                });
            })
            .catch(function (err) { //en el caso de que se ocurra un error, axios lo atrapa y procesa
                handleResponse(err.response);  //invocamos al manejador para ver el tipo de error y ejecutar la accion pertinente
                return;
            }).then(function () {
                var respuestas = [];
                componente.state.preguntas.map((pregunta, index) => {
                    respuestas[index] = '';
                });
                console.log(respuestas);
                componente.setState({ respuestas: respuestas });
            });

    }

    onSubmit = async (e) => {
        var campoVacio = false;
        await Object.entries(this.state.respuestas).map((t, k) => {
            if (t[1] === "" || t[1] === null) {
                campoVacio = true;
                console.log("vacio");
            }
        });
        if (!campoVacio) {
            const res = await Axios.post('/api/bienestar/encuestas/responder/', {
                idUsuario: this.state.currentUser.data.usuariobd._id,
                idEncuesta: this.state.idEncuesta,
                respuestas: this.state.respuestas
            }, { headers: authHeader() })
                .then(respuesta => {
                    console.log(respuesta);
                    toast.success("La encuesta ha sido respondida exitosamente", toastoptions);
                    historial.push("/bienestar/encuestas/mis-encuestas");
                });
        }else{
            toast.warning("Debe llenar todos los campos", toastoptions);
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
                    </div>
                    <div className="respuestas">
                        {pregunta.tipo === "1"
                            ? <div>
                                <ul>
                                    {
                                        pregunta.opciones.map((opcion, subindex) =>
                                            <li>
                                                <input onChange={this.onChangeInput} type="radio" value={subindex} name={index} />
                                                <label>{opcion.value}</label>
                                            </li>
                                        )
                                    }
                                </ul>
                            </div>
                            : <div>
                                <textarea onChange={this.onChangeInput} name={index}></textarea>
                            </div>
                        }
                    </div>
                </div>
            );
        }
        return (
            <div className="principal menu-lista-dashboard listaPreguntas">
                <div>
                    <h2 className="naranjo"><Link to="/bienestar/encuestas/mis-encuestas"> <Bamarillorev /></Link> Mis Encuestas / <strong>Responder Encuesta</strong></h2>
                </div>
                <div className="listado-simple">
                    <div className="encabezado">
                        <h3 className="tituloencuesta">{this.state.nombreEncuesta}</h3>
                    </div>
                    <div ref={this.myref} className="elementos">
                        {items}
                    </div>
                </div>
                <div className="enviar">
                    <button className="boton-generico btazul" onClick={this.onSubmit}>Enviar</button>
                </div>
            </div>
        );
    }
}