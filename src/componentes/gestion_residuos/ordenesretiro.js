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
// importaciones de iconos 

import { ReactComponent as Bamarillorev } from "../../assets/iconos/bamarillorev.svg";
import { ReactComponent as Basurero } from "../../assets/iconos/basurero.svg";
import { ReactComponent as Ojo } from "../../assets/iconos/ojo.svg";
import { ReactComponent as Descarga } from "../../assets/iconos/descarga.svg";
import { ReactComponent as Flechaam } from "../../assets/iconos/flechaam.svg";
import { ReactComponent as Plus } from "../../assets/iconos/X.svg";

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
            <div className="principal gestion-personas" id="component-listar-trabajadores">
                <div>
                    <h2 className="verde"><Link to="/residuos/control-retiro"> <Bverderev /></Link> <span className="verde">Control de Retiro / </span> <strong>OR</strong></h2>
                </div>
                <div className="filtros">
                    <div className="sup">
                        <button>Filtros</button>
                        <Link to="/residuos/control-retiro/orden-retiro/nueva-orden"><Plus /> Nueva OR</Link>
                    </div>
                    <div>
                        <form>
                            <div className="form-group justify-center filtros-or">
                                <input className="input-generico" placeholder="Nº Tarjeta cliente asignado…" />
                                <input type="date" className="input-generico" placeholder="" />
                                <select className="input-generico">
                                    <option>Centro de costos</option>
                                </select>
                                <select className="input-generico">
                                    <option>Estado</option>
                                </select>
                            </div>
                            <div className="form-group buttons">
                                <button className="boton-generico btazul" type="button">Filtrar</button>
                                <button className="boton-generico btblanco" type="button">Limpiar</button>
                            </div>
                        </form>
                    </div>
                </div>
                <div className="listado">
                    <table className="tableor">
                        <thead>
                            <th>N° OR</th>
                            <th>N° Tarjeta</th>
                            <th>Fecha Retiro</th>
                            <th>Estado</th>
                            <th>Centro Costos</th>
                            <th>Acciones</th>
                        </thead>
                        <tbody>
                        <tr className="anulada">
                                <td>
                                    00000 00010
                                </td>
                                <td>1</td>
                                <td>08/03/2021</td>
                                <td className="verde">Anulada</td>
                                <td>Proyecto 1</td>
                                <td className="acciones">
                                    <span><Link><Ojo /></Link></span>
                                    <span><Link ><Basurero /></Link></span>
                                    {/* <span><button type="button"><Descarga /></button></span> */}
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    00000 00010
                                </td>
                                <td>1</td>
                                <td>08/03/2021</td>
                                <td className="verde">En proceso</td>
                                <td>Proyecto 1</td>
                                <td className="acciones">
                                    <span><Link><Ojo /></Link></span>
                                    <span><Link ><Basurero /></Link></span>
                                    {/* <span><button type="button"><Descarga /></button></span> */}
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    00000 00010
                                </td>
                                <td>1</td>
                                <td>08/03/2021</td>
                                <td className="amarillo">Finalizado</td>
                                <td>Proyecto 1</td>
                                <td className="acciones">
                                    <span><Link><Ojo /></Link></span>
                                    <span><Link ><Basurero /></Link></span>
                                    {/* <span><button type="button"><Descarga /></button></span> */}
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    00000 00010
                                </td>
                                <td>1</td>
                                <td>08/03/2021</td>
                                <td className="verde">En proceso</td>
                                <td>Proyecto 1</td>
                                <td className="acciones">
                                    <span><Link><Ojo /></Link></span>
                                    <span><Link ><Basurero /></Link></span>
                                    {/* <span><button type="button"><Descarga /></button></span> */}
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    00000 00010
                                </td>
                                <td>1</td>
                                <td>08/03/2021</td>
                                <td className="verde">En proceso</td>
                                <td>Proyecto 1</td>
                                <td className="acciones">
                                    <span><Link><Ojo /></Link></span>
                                    <span><Link ><Basurero /></Link></span>
                                    {/* <span><button type="button"><Descarga /></button></span> */}
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    00000 00010
                                </td>
                                <td>1</td>
                                <td>08/03/2021</td>
                                <td className="amarillo">Finalizado</td>
                                <td>Proyecto 1</td>
                                <td className="acciones">
                                    <span><Link><Ojo /></Link></span>
                                    <span><Link ><Basurero /></Link></span>
                                    {/* <span><button type="button"><Descarga /></button></span> */}
                                </td>
                            </tr>
                            <tr className="anulada">
                                <td>
                                    00000 00010
                                </td>
                                <td>1</td>
                                <td>08/03/2021</td>
                                <td className="verde">Anulada</td>
                                <td>Proyecto 1</td>
                                <td className="acciones">
                                    <span><Link><Ojo /></Link></span>
                                    <span><Link ><Basurero /></Link></span>
                                    {/* <span><button type="button"><Descarga /></button></span> */}
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    00000 00010
                                </td>
                                <td>1</td>
                                <td>08/03/2021</td>
                                <td className="verde">En proceso</td>
                                <td>Proyecto 1</td>
                                <td className="acciones">
                                    <span><Link><Ojo /></Link></span>
                                    <span><Link ><Basurero /></Link></span>
                                    {/* <span><button type="button"><Descarga /></button></span> */}
                                </td>
                            </tr>


                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}