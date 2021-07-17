// importaciones de bibliotecas 
import React, { Component } from "react";
import { autenticacion } from '../../servicios/autenticacion';
import { Link } from 'react-router-dom';
import Axios from '../../helpers/axiosconf';
import { authHeader } from '../../helpers/auth-header';
import { handleResponse } from '../../helpers/manejador';
import { historial } from '../../helpers/historial';

import { toast } from 'react-toastify';

// importaciones de estilos 
import '../../styles/fichaTrabajador.css';

import edit from "../../assets/iconos/edit.svg";
import basurero from "../../assets/iconos/basurero.svg";



//modal
import Modal from '../includes/modal';
import { toogleModalCore } from '../includes/funciones';


// importaciones de iconos 
import { ReactComponent as Bamarillorev } from "../../assets/iconos/bamarillorev.svg";


const toastoptions = {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
}

export default class EditarEncuesta extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentUser: autenticacion.currentUserValue,
            datosUsuarios: "",
            users: null,
            idEncuesta: '',
            nombreEncuesta: '',
            preguntas: [],
            respuestas: [],
        };
    }

    toogleModal = toogleModalCore; //copiamos la funcion modal a una funcion local


    onChangeInput = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    async componentDidMount() {
        await this.cargarEncuesta();
    }

    cargarEncuesta = async () => { //genera una peticion get por axios a la api de usuarios
        var { id } = this.props.match.params;
        var componente = this;
        await Axios.get('/api/bienestar/encuestas/' + id, { headers: authHeader() }) //se envia peticion axios con el token sesion guardado en local storage como cabecera
            .then(async function (res) {   //si la peticion es satisfactoria entonces
                console.log(res.data.data);
                let datos = res.data.data;
                await componente.setState({
                    idEncuesta: datos._id,
                    nombreEncuesta: datos.nombre,
                    preguntas: datos.preguntas,
                    trabajadoresSelect: datos.trabajadores
                });
                await Axios.post('/api/bienestar/encuestas/respuestas/', { id: datos._id, rut: componente.state.currentUser.data.usuariobd.rut }, { headers: authHeader() }) //se envia peticion axios con el token sesion guardado en local storage como cabecera
                    .then(function (res) {   //si la peticion es satisfactoria entonces
                        console.log(res.data.data);
                        componente.setState({
                            respuestas: res.data.data.respuestas,
                        });
                    })
                    .catch(function (err) { //en el caso de que se ocurra un error, axios lo atrapa y procesa
                        handleResponse(err.response);  //invocamos al manejador para ver el tipo de error y ejecutar la accion pertinente
                        return;
                    });
            })
            .catch(function (err) { //en el caso de que se ocurra un error, axios lo atrapa y procesa
                console.log(err);
                handleResponse(err.response);  //invocamos al manejador para ver el tipo de error y ejecutar la accion pertinente
                return;
            });

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



    onSubmit = async (e) => {
        if (this.state.preguntas.length !== 0) {
            const res = await Axios.post('/api/bienestar/encuestas/modify/', {
                id: this.state.idEncuesta,
                nombre: this.state.nombreEncuesta,
                preguntas: this.state.preguntas,
            }, { headers: authHeader() })
                .then(respuesta => {
                    toast.success("Encuesta modificada satisfactoriamente", toastoptions);
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
                    </div>
                    <div className="respuestas">
                        {pregunta.tipo === "1"
                            ? <div>
                                <ul>
                                    {
                                        pregunta.opciones.map((opcion, index2) => {
                                            let respuesta = compo.state.respuestas[index];
                                            console.log(respuesta);
                                            console.log(index2);
                                            if (parseInt(respuesta) === index2) {
                                                return (<li value={opcion.index}>
                                                    <input checked type="radio" disabled />
                                                    <label> {opcion.value}</label>
                                                </li>)
                                            } else {
                                                return (<li value={opcion.index}>
                                                    <input type="radio" disabled />
                                                    <label> {opcion.value}</label>
                                                </li>)
                                            }
                                        }
                                        )
                                    }
                                </ul>
                            </div>
                            : <div>
                                <textarea readOnly>{compo.state.respuestas[index]}</textarea>
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
                    <h2 className="naranjo"><Link to="/perfil/ficha-personal/encuestas/mis-encuestas"> <Bamarillorev /></Link> Mis Encuestas / <strong>Ver Encuesta</strong></h2>
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
            </div>
        );
    }
}