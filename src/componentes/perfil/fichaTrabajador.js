import React, { Component } from "react";
import { autenticacion } from '../../servicios/autenticacion';
import { Link } from 'react-router-dom';

import '../../styles/fichaTrabajador.css';

import fichaper from "../../assets/iconos/fichaper.svg";
import turnos from "../../assets/iconos/turnos.svg";

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

    componentDidMount = () =>{
        this.props.impFuncion();
    }

    render() {
        return (
            <div className="principal menu-lista-dashboard" id="component-fichaTrabajador">
                <div>
                    <h2 className="celeste"><Link to="/"> <Bcelesterev /></Link> Ficha Personal</h2>
                    <div className="fichaPerfil">
                        <div className="seccion">
                            <h3><Link to={`/perfil/ficha-personal/equipo`}> <span>Tallas Equipo</span><button><Flechacel /></button></Link></h3>
                        </div>
                        <div className="seccion">
                            <h3><Link to={`/perfil/ficha-personal/contractual`}><span>Contractual</span><button><Flechacel /></button> </Link></h3>
                        </div>
                        <div className="seccion">
                            <h3><Link to={`/perfil/ficha-personal/prevision`}><span>Previsión Social</span><button><Flechacel /></button></Link></h3>
                        </div>
                        <div className="seccion">
                            <h3><Link to={`/perfil/ficha-personal/hoja-de-vida`}><span>Hoja de Vida</span><button><Flechacel /></button></Link></h3>
                        </div>
                        <div className="seccion">
                            <h3><Link to={`/perfil/ficha-personal/registros-graficos`}><span>Registros gráficos</span><button><Flechacel /></button></Link></h3>
                        </div>
                        <div className="seccion">
                            <h3><Link to={`/perfil/ficha-personal/indicadores-desempeño`}><span>Indicadores de desempeño</span><button><Flechacel /></button></Link></h3>
                        </div>
                        <div className="seccion">
                            <h3><Link to={`/perfil/ficha-personal/encuestas/mis-encuestas`}><span>Mis Encuestas</span><button><Flechacel /></button></Link></h3>
                        </div>
                        <div className="seccion">
                            <h3><Link to={`/perfil/bienestar/soporte`}><span>Soporte</span><button><Flechacel /></button></Link></h3>
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