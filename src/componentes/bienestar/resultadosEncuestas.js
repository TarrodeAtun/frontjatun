// importaciones de bibliotecas 
import React, { Component } from "react";
import { autenticacion } from '../../servicios/autenticacion';
import { Link } from 'react-router-dom';

// importaciones de estilos 
import '../../styles/fichaTrabajador.css';


// importaciones de iconos 
import { ReactComponent as Bamarillorev } from "../../assets/iconos/bamarillorev.svg";
import { ReactComponent as Flechaam } from "../../assets/iconos/flechaam.svg";

export default class ResultadoEncuestas extends Component {
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
                    <h2 className="naranjo"><Link to="/personas/gestion"> <Bamarillorev/></Link> sss</h2>
                    <div className="fichaPerfil">
                        <div className="seccion">
                            <h3><Link to="/bienestar/encuestas"><span>Encuestas</span><button><Flechaam /></button></Link></h3>
                        </div>
                        <div className="seccion">
                            <h3><Link to="/bienestar/soporte"><span>Soporte Técnico</span><button><Flechaam /></button></Link></h3>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}