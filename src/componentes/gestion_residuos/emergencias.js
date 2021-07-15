// importaciones de bibliotecas 
import React, { Component } from "react";
import { autenticacion } from '../../servicios/autenticacion';
import { Link } from 'react-router-dom';

// importaciones de estilos 
import '../../styles/fichaTrabajador.css';


// importaciones de iconos 
import fichaper from "../../assets/iconos/fichaper.svg";
import turnos from "../../assets/iconos/turnos.svg";
import { ReactComponent as Bverderev } from "../../assets/iconos/bverderev.svg";
import { ReactComponent as Flechaver } from "../../assets/iconos/flechaver.svg";

export default class Emergencias extends Component {
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
            <div className="principal gestion-residuos menu-lista-dashboard">
                <div>
                    <h2 className="verde"><Link to="/"> <Bverderev /></Link> Gestión de residuos / <strong>Emergencias</strong></h2>
                    <div className="fichaPerfil">
                        {(this.state.currentUser.data.usuariobd.perfil === 1 || this.state.currentUser.data.usuariobd.perfil === 5 || this.state.currentUser.data.usuariobd.perfil === 6) &&
                            <div className="seccion">
                                <h3><Link to="/residuos/emergencias/residuos"><span>Emergencias Residuos</span><button><Flechaver /></button></Link></h3>
                            </div>
                        }
                        {(this.state.currentUser.data.usuariobd.perfil === 1 || this.state.currentUser.data.usuariobd.perfil === 5 || this.state.currentUser.data.usuariobd.perfil === 7) &&
                            <div className="seccion">
                                <h3><Link to="/residuos/emergencias/vehiculos/"><span>Emergencias Vehiculos</span><button><Flechaver /></button></Link></h3>
                            </div>
                        }
                    </div>
                </div>
            </div>
        );
    }
}