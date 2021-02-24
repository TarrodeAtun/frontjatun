import React, { Component } from "react";
import { autenticacion } from '../../servicios/autenticacion';
import { Link } from 'react-router-dom';

import '../../styles/fichaTrabajador.css';

import  fichaper  from "../../assets/iconos/fichaper.svg";
import  turnos  from "../../assets/iconos/turnos.svg";

import { ReactComponent as Bcelesterev } from "../../assets/iconos/bcelesterev.svg";
import { ReactComponent as Flechacel } from "../../assets/iconos/flechacel.svg";

export default class GestionUsuarios extends Component {

    constructor(props) {
        super(props);

        this.state = {
            currentUser: autenticacion.currentUserValue,
            datosUsuarios: "",
            users: null
        };
    }

    render() {
        return (
            <div className="principal gestion-personas menu-lista-dashboard">
                <div>
                <h2><Link to="/"> <Bcelesterev/></Link> Turnos</h2>
                    <div className="fichaPerfil">
                        <div className="seccion">
                            <h3><span>Historial</span><button><Flechacel/></button></h3>
                        </div>
                        <div className="seccion">
                            <h3><span>Reemplazos</span><button><Flechacel/></button></h3>
                        </div>
                        <div className="seccion">
                            <h3><span>Mis Solicitudes</span><button><Flechacel/></button></h3>
                        </div>
                    </div>
                </div>
                <div className="opciones">
                        <div>
                            <img src={fichaper} />
                            <Link to="/perfil">Volver al Perfil</Link>
                        </div>
                        <div>
                            <img src={turnos} />
                            <Link to="/perfil/ficha-personal">Ficha Personal</Link>
                        </div>
                    </div>

            </div>
        );
    }
}