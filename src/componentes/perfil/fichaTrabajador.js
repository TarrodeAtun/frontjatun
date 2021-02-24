import React, { Component } from "react";
import { autenticacion } from '../../servicios/autenticacion';
import { Link } from 'react-router-dom';

import '../../styles/fichaTrabajador.css';

import  fichaper  from "../../assets/iconos/fichaper.svg";
import  turnos  from "../../assets/iconos/turnos.svg";

import { ReactComponent as Flechacel } from "../../assets/iconos/flechacel.svg";
import { ReactComponent as Bcelesterev } from "../../assets/iconos/bcelesterev.svg";

export default class fichaTrabajador extends Component {

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
            <div className="principal" id="component-fichaTrabajador">
                <div>
                    <h2><Link to="/"> <Bcelesterev/></Link> Ficha Personal</h2>
                    <div className="fichaPerfil">
                        <div className="seccion">
                            <h3><span>Tallas Equipo</span><button><Flechacel/></button></h3>
                        </div>
                        <div className="seccion">
                            <h3><span>Contractual</span><button><Flechacel/></button></h3>
                        </div>
                        <div className="seccion">
                            <h3><span>Prevision Social</span><button><Flechacel/></button></h3>
                        </div>
                        <div className="seccion">
                            <h3><span>Hoja de Vida</span><button><Flechacel/></button></h3>
                        </div>
                        <div className="seccion">
                            <h3><span>Registros graficos</span><button><Flechacel/></button></h3>
                        </div>
                        <div className="seccion">
                            <h3><span>Asistencias</span><button><Flechacel/></button></h3>
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
                            <Link to="/perfil/turnos">Turnos</Link>
                        </div>
                    </div>

            </div>
        );
    }
}