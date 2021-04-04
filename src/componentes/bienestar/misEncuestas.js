// importaciones de bibliotecas 
import React, { Component } from "react";
import { autenticacion } from '../../servicios/autenticacion';
import { Link } from 'react-router-dom';

// importaciones de estilos 
import '../../styles/fichaTrabajador.css';

import edit from "../../assets/iconos/edit.svg";
import ojo from "../../assets/iconos/ojo.svg";
import basurero from "../../assets/iconos/basurero.svg";


// importaciones de iconos 
import { ReactComponent as Bamarillorev } from "../../assets/iconos/bamarillorev.svg";
import { ReactComponent as Flechaam } from "../../assets/iconos/flechaam.svg";

export default class MisEncuestas extends Component {
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
            <div className="principal menu-lista-dashboard">
                <div>
                    <h2 className="naranjo"><Link to="/personas/gestion"> <Bamarillorev /></Link> Encuestas / <strong>Mis Encuestas</strong></h2>
                </div>
                <div className="listado-simple">
                    <div className="encabezado">
                        <h3 className="amarillo">Mis Encuestas</h3>
                        <Link to="/bienestar/encuestas/nueva-encuesta" className="ml">+ Nueva Encuesta</Link>
                    </div>
                    <div className="elementos">
                        <div className="elemento">
                            <span>Nombre encuesta</span>
                            <div className="acciones ml">
                                <Link><img src={ojo} /></Link>
                                <Link><img src={edit}/></Link>
                                <button><img src={basurero}/></button>
                            </div>
                        </div>
                        <div className="elemento">
                            <span>Nombre encuesta</span>
                            <div className="acciones ml">
                                <Link><img src={ojo} /></Link>
                                <Link><img src={edit}/></Link>
                                <button><img src={basurero}/></button>
                            </div>
                        </div>
                        <div className="elemento">
                            <span>Nombre encuesta</span>
                            <div className="acciones ml">
                                <Link><img src={ojo} /></Link>
                                <Link><img src={edit}/></Link>
                                <button><img src={basurero}/></button>
                            </div>
                        </div>
                        <div className="elemento">
                            <span>Nombre encuesta</span>
                            <div className="acciones ml">
                                <Link><img src={ojo} /></Link>
                                <Link><img src={edit}/></Link>
                                <button><img src={basurero}/></button>
                            </div>
                        </div>
                        <div className="elemento">
                            <span>Nombre encuesta</span>
                            <div className="acciones ml">
                                <Link><img src={ojo} /></Link>
                                <Link><img src={edit}/></Link>
                                <button><img src={basurero}/></button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}