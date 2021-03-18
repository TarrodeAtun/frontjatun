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
            <div className="principal" id="component-perfil">
                <div>
                    <h2 className="verde"><Link to='/residuos/control-retiro/orden-retiro'> <Bverderev /> </Link><span>OR</span> / <strong>Nueva OR</strong></h2>
                    <div className="fichaPerfil">
                        <div className="seccion">
                            <h3 className="verde">Tallas Equipo</h3>
                            <div>
                                <span>N° OR</span>
                                <span> 00000 000011</span>
                            </div>
                            <div>
                                <span>Fecha Creacion</span>
                                <span>03/03/2021</span>
                            </div>
                            <div>
                                <span>Fecha Retiro</span>
                                <span><input type="date" className="input-generico" name="formZapato" /></span>
                            </div>
                            <div>
                                <span>N° Tarjeta</span>
                                <span><input className="input-generico" name="formZapato" /></span>
                            </div>
                            <h3 className="verde">Datos Cliente</h3>
                            <div>
                                <span>Cliente</span>
                                <span><select className="input-generico">
                                    <option>Cliente 1</option>
                                    <option>Cliente 2</option>
                                    <option>Cliente 3</option>
                                </select></span>
                            </div>
                            <div>
                                <span>Rut</span>
                                <span>xx.xxx.xxx-x</span>
                            </div>
                            <div>
                                <span>Establecimiento</span>
                                <span>
                                    Dirección, Comuna, Ciudad ID VU-RETC<br></br>ID <br></br>VU-RECT
                                </span>
                            </div>
                            <div>
                                <span>Nombre Contacto</span>
                                <span><input className="input-generico" name="formZapato" /></span>
                            </div>
                            <div>
                                <span>Email Contacto</span>
                                <span><input className="input-generico" name="formZapato" /></span>
                            </div>
                            <h3 className="verde">Observaciones</h3>
                            <div>
                                <span>Detalle del Retiro</span>
                                <span><textarea  rows="6" className="input-generico" name="formZapato" /></span>
                            </div>
                            <div className="form-group buttons">
                                    <button className="boton-generico btazul" >Guardar</button>
                                    <button className="boton-generico btgris" type="button" >Cancelar</button>
                                </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}