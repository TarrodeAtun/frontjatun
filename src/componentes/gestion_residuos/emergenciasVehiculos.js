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

export default class EmergenciasVehiculos extends Component {
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
                    <h2 className="verde"><Link to="/"> <Bverderev /></Link> Gestión de residuos</h2>
                    <div className="fichaPerfil">
                        <div className="seccion">
                            <h3><Link to="/residuos/control-retiro"><span>Control Retiro</span><button><Flechaver /></button></Link></h3>
                        </div>
                        <div className="seccion">
                            <h3><Link to="/residuos/trazabilidad"><span>Trazabilidad de residuos</span><button><Flechaver /></button></Link></h3>
                        </div>
                        <div className="seccion">
                            <h3><Link to="/residuos/plan-manejo"><span>Plan manejo de resudios</span><button><Flechaver /></button></Link></h3>
                        </div>
                        <div className="seccion">
                            <h3><Link to="/residuos/control-logistico"><span>Control Logistico</span><button><Flechaver /></button></Link></h3>
                        </div>
                        <div className="seccion">
                            <h3><span>Emergencias</span><button><Flechaver /></button></h3>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}