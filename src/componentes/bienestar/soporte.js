// importaciones de bibliotecas 
import React, { Component } from "react";
import { autenticacion } from '../../servicios/autenticacion';
import { Link } from 'react-router-dom';
import Axios from '../../helpers/axiosconf';
import { authHeader } from '../../helpers/auth-header';
import { handleResponse } from '../../helpers/manejador';

// importaciones de estilos 
import '../../styles/fichaTrabajador.css';

import edit from "../../assets/iconos/edit.svg";
import ojo from "../../assets/iconos/ojo.svg";
import basurero from "../../assets/iconos/basurero.svg";

//modal
import Modal from '../includes/modal';
import { toogleModalCore } from '../includes/funciones';

import AgregarMensaje from './soporte/nuevoMensaje';

// importaciones de iconos 
import { ReactComponent as Bamarillorev } from "../../assets/iconos/bamarillorev.svg";
import { toast } from "react-toastify";

const toastoptions = {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
}

export default class ResultadosEncuestas extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentUser: autenticacion.currentUserValue,
            datosUsuarios: "",
            showAgregarMensaje: '',
            consultas: []
        };
    }

    toogleModal = toogleModalCore; //copiamos la funcion modal a una funcion local

    manejadorModals = (e, res) => {
        this.toogleModal(e, res);
    }

    async componentDidMount() {
        await this.obtenerConsultas();
        console.log(this.state.encuestas);
    }

    agregarConsulta = async (asunto, primerMensaje) => {
        const res = Axios.post('/api/bienestar/soporte/consulta/crear', {
            asunto, primerMensaje
        }, { headers: authHeader() }).then(resp => {
            console.log(resp);
        }).catch(err => {
            console.log(err);
        })
    }

    obtenerConsultas = async () => { //genera una peticion get por axios a la api de usuarios
        var componente = this;
        const res = Axios.get('/api/bienestar/soporte', { headers: authHeader() }) //se envia peticion axios con el token sesion guardado en local storage como cabecera
            .then(function (res) {   //si la peticion es satisfactoria entonces
                console.log(res.data.data);
                componente.setState({ consultas: res.data.data });  //almacenamos el listado de usuarios en el estado usuarios (array)
            })
            .catch(function (err) { //en el caso de que se ocurra un error, axios lo atrapa y procesa
                handleResponse(err.response);  //invocamos al manejador para ver el tipo de error y ejecutar la accion pertinente
                return;
            });
    }
    eliminarEncuesta = async (e) => {
        var componente = this;
        var id = e.currentTarget.dataset.id;
        await Axios.post('/api/bienestar/encuestas/delete/', {
            id: id
        }, { headers: authHeader() })
            .then(respuesta => {
                toast.success(respuesta.mensaje, toastoptions);
                componente.obtenerEncuestas();
                console.log(respuesta);
            });
    }


    render() {
        let items;
        if (this.state.consultas) {
            items = this.state.consultas.map((encuesta, index) =>

                <tr className="elemento">
                    <td><Link to="/bienestar/soporte/ver-mensaje/"><span>{encuesta.asunto}</span><span>{encuesta.autor}</span></Link></td>
                    <td><span>15-01-2021 12:34 </span><span>Juan Pérez</span></td>
                    <td>Pendiente</td>
                    <td className="acciones ml">
                        <button><img src={basurero} /></button>
                    </td>
                </tr>
            )
        }

        return (
            <div className="principal menu-lista-dashboard">
                <div>
                    <h2 className="naranjo"><Link to="/bienestar"> <Bamarillorev /></Link>  <strong>Soporte Técnico</strong></h2>
                </div>
                <div>
                    <div className="prehead">
                        <h3 className="tituloencuesta amarillo">Mensajes</h3>
                        <button className="ml" onClick={this.manejadorModals} data-objetivo="AgregarMensaje">+ Nuevo Mensaje</button>
                    </div>
                    <table className="listado-simple tabla">
                        <thead>
                            <th>Asunto</th>
                            <th>Última respuesta</th>
                            <th>Estado</th>
                            <th><img src={basurero} /></th>
                        </thead>
                        <tbody>
                            {items}
                        </tbody>
                    </table>
                </div>
                <div id="modales">
                    <Modal
                        name="AgregarMensaje"  //nombre del estado que controla el modal
                        show={this.state.showAgregarMensaje} //indicamos la propiedad show con el estado que controlara al modal
                        contenido={<AgregarMensaje />} //entregamos el componente que se renderizara en el modal 
                        toogleModal={this.manejadorModals} //traspasamos la funcion que permitira abrir y cerrar el modal
                        agregarConsulta={this.agregarConsulta}
                    />
                </div>
            </div>
        );
    }
}