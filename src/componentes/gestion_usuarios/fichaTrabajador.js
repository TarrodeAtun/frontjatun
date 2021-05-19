import React, { Component } from "react";
import { autenticacion } from '../../servicios/autenticacion';
import { Link } from 'react-router-dom';

import '../../styles/fichaTrabajador.css';

import  fichaper  from "../../assets/iconos/fichaper.svg";
import  turnos  from "../../assets/iconos/turnos.svg";

import { ReactComponent as Flechacel } from "../../assets/iconos/flechacel.svg";
import { ReactComponent as Bamarillorev } from "../../assets/iconos/bamarillorev.svg";

export default class fichaTrabajador extends Component {

    constructor(props) {
        super(props);

        this.state = {
            currentUser: autenticacion.currentUserValue,
            datosUsuarios: "",
            users: null,
            idUsuario:''
        };
    }

    async componentDidMount() {
        var { id } = this.props.match.params;
        this.setState({idUsuario:id});
    }

    render() {
        return (
            <div className="principal menu-lista-dashboard" id="component-fichaTrabajador">
                <div>
                    <h2 class="amarillo"><Link to="/personas/listar-trabajadores"> <Bamarillorev/></Link><span>Trabajadores / </span> Ficha Trabajador</h2>
                    <div className="fichaPerfil">
                        <div className="seccion">
                            <h3><Link to={`/personas/ficha-trabajador/equipo/${this.state.idUsuario}`}> <span>Tallas Equipo</span><button><Flechacel/></button></Link></h3>
                        </div>
                        <div className="seccion">
                            <h3><Link to={`/personas/ficha-trabajador/contractual/${this.state.idUsuario}`}><span>Contractual</span><button><Flechacel/></button> </Link></h3>
                        </div>
                        <div className="seccion">
                            <h3><Link to={`/personas/ficha-trabajador/prevision/${this.state.idUsuario}`}><span>Prevision Social</span><button><Flechacel/></button></Link></h3>
                        </div>
                        <div className="seccion">
                            <h3><Link to={`/personas/ficha-trabajador/hoja-de-vida/${this.state.idUsuario}`}><span>Hoja de Vida</span><button><Flechacel/></button></Link></h3>
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
                            <Link to={`/personas/perfil/${this.state.idUsuario}`}>Volver al Perfil</Link>
                        </div>
                        <div>
                            <img src={turnos} />
                            <Link >Turnos</Link>
                        </div>
                    </div>

            </div>
        );
    }
}