// importaciones de bibliotecas 
import React, { Component } from "react";
import { autenticacion } from '../../servicios/autenticacion';
import { Link } from 'react-router-dom';

// importaciones de estilos 
import '../../styles/fichaTrabajador.css';


// importaciones de iconos 
import fichaper from "../../assets/iconos/fichaper.svg";
import turnos from "../../assets/iconos/turnos.svg";
import { ReactComponent as Bamarillorev } from "../../assets/iconos/bamarillorev.svg";
import { ReactComponent as Flechaam } from "../../assets/iconos/flechaam.svg";

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
                    <h2 className="naranjo"><Link to="/personas/gestion"> <Bamarillorev /></Link>Asistencia</h2>
                    <div className="fichaPerfil">
                        <div className="seccion">
                            <h3><Link to="/personas/asistencias/control-asistencia"><span>Control Asistencia</span><button><Flechaam /></button></Link></h3>
                        </div>
                        <div className="seccion">
                            <h3><Link to="/personas/turnos"><span>Emergencias</span><button><Flechaam /></button></Link></h3>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}