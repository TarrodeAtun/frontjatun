// importaciones de bibliotecas 
import React, { Component } from "react";
import { autenticacion } from '../../servicios/autenticacion';
import { Link } from 'react-router-dom';

// importaciones de estilos 
import '../../styles/fichaTrabajador.css';


// importaciones de iconos 
import  fichaper  from "../../assets/iconos/fichaper.svg";
import  turnos  from "../../assets/iconos/turnos.svg";
import { ReactComponent as Bverderev } from "../../assets/iconos/bverderev.svg";
import { ReactComponent as Flechaver } from "../../assets/iconos/flechaver.svg";

export default class GestionResiduos extends Component {
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
                <h2 className="verde"><Link to="/residuos/gestion"> <Bverderev/></Link><span className="verde"> Gestión de residuos</span> / <strong>Control de Retiro</strong></h2>
                    <div className="fichaPerfil">
                        <div className="seccion">
                            <h3><Link to="/residuos/control-retiro/orden-retiro"><span>OR (orden de retiro)</span><button><Flechaver/></button></Link></h3>
                        </div>
                        <div className="seccion">
                            <h3><span>Programación de retiro</span><button><Flechaver/></button></h3>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}