import React, { Component, Fragment } from "react";
import { autenticacion } from '../servicios/autenticacion';
import { Link } from 'react-router-dom';
import Axios from '../helpers/axiosconf';
import { authHeader } from '../helpers/auth-header';
import { handleResponse } from '../helpers/manejador';
import { toast } from 'react-toastify';
import Modal from './includes/modal';
import { toogleModalCore } from './includes/funciones';
import GeneradorQR from './generadorQR';

import persona from "../assets/persona.svg";
import gestion from "../assets/iconogestionusuarios.svg";
import residuo from "../assets/iconoresiduos.svg";

import { ReactComponent as Bceleste } from "../assets/iconos/bceleste.svg";
import { ReactComponent as Amarillo } from "../assets/iconos/bamarillo.svg";
import { ReactComponent as Verde } from "../assets/iconos/bverde.svg";


import '../styles/inicio.css';


export default class inicio extends Component {

    constructor(props) {
        super(props);
        this.state = {
            currentUser: autenticacion.currentUserValue,
            datosUsuarios: "",
            users: null,
            showGeneradorQR: false,
            datosQR: '',
        };
    }

    toogleModal = toogleModalCore; //copiamos la funcion modal a una funcion local

    manejadorModals = (e, res) => {
        this.toogleModal(e, res);
    }

    async componentDidMount() {

        await this.setState({ datosUsuarios: this.state.currentUser.data.usuariobd });
        if (this.state.datosUsuarios.rut) {
            this.consultarTurno();
        }
        console.log(this.state.datosUsuarios);
        // this.props.impFuncion();
    }

    confirmaTurno = async () => {
        console.log("logrado");
    }

    consultarTurno = async () => {
        var componente = this;
        let rut = this.state.datosUsuarios.rut;
        const res = Axios.get('/api/users/worker/turnos/turnoVigente/' + rut, { headers: authHeader() }) //se envia peticion axios con el token sesion guardado en local storage como cabecera
            .then(function (res) {   //si la peticion es satisfactoria entonces
                console.log(res.data.data);
                if (res.data.ok && res.data.data.length !== 0) {
                    let datos = { id: res.data.data[0]._id, rut: rut }
                    componente.setState({ datosQR: datos })
                    componente.setState({ showGeneradorQR: true });
                }

                // componente.setState({ turnos: res.data.data[0], trabajadores: res.data.data[0].trabajadores });  //almacenamos el listado de usuarios en el estado usuarios (array)
            })
            .catch(function (err) { //en el caso de que se ocurra un error, axios lo atrapa y procesa
                console.log(err);
                handleResponse(err.response);  //invocamos al manejador para ver el tipo de error y ejecutar la accion pertinente
                return;
            });
    }

    render() {
        return (
            <div id="component-inicio" className="principal">
                <div>
                    <h2>¡Hola! {this.state.datosUsuarios.nombre} {this.state.datosUsuarios.apellido}</h2>
                </div>
                <div>
                    <div className="opPerfil">
                        <img src={persona} alt="perfil" />
                        <h3><strong>Mi Perfil</strong><span> de usuario</span></h3>
                        <Link to="/perfil"> <span><Bceleste /></span> </Link>
                    </div>
                    {this.state.currentUser.data.perfilSesion !== 3 &&
                        <Fragment>
                            <div className="opPer">
                                <img src={gestion} alt="Gestion personas" />
                                <h3><strong>Gestión</strong><span> de personas</span></h3>
                                <Link to="/personas/gestion"> <Amarillo /> </Link>
                            </div>
                            <div className="opRed">
                                <img src={residuo} alt="Gestion residuos" />
                                <h3><strong>Gestión</strong><span> de residuos</span></h3>
                                <Link to="/residuos/gestion"> <Verde /> </Link>
                            </div>
                        </Fragment>
                    }

                </div>
                <div id="modales">
                    <Modal
                        name="GeneradorQR"  //nombre del estado que controla el modal
                        show={this.state.showGeneradorQR} //indicamos la propiedad show con el estado que controlara al modal
                        contenido={<GeneradorQR />} //entregamos el componente que se renderizara en el modal 
                        toogleModal={this.manejadorModals}
                        datos={this.state.datosQR}
                        confirmaTurno={this.confirmaTurno}
                    />
                </div>
            </div>
        );
    }
}