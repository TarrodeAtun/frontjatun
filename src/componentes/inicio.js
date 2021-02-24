import React, { Component } from "react";
import { autenticacion } from '../servicios/autenticacion';
import { Link } from 'react-router-dom';

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
            users: null
        };
    }

    async componentDidMount() {
        this.setState({ datosUsuarios: this.state.currentUser.data.usuariobd });
        console.log(this.props);
        console.log(this.state.datosUsuarios);
        // this.props.impFuncion();
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
                    <div className="opPer">
                        <img src={gestion} alt="Gestion personas" />
                        <h3><strong>Gestión</strong><span> de personas</span></h3>
                        <Link to="/usuarios/listar-usuarios"> <Amarillo /> </Link>
                    </div>
                    <div className="opRed">
                        <img src={residuo} alt="Gestion residuos" />
                        <h3><strong>Gestión</strong><span> de residuos</span></h3>
                        <Link to="/residuos/gestion"> <Verde /> </Link>
                    </div>
                </div>

            </div>
        );
    }
}