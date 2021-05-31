//importaciones de bibliotecas
import React, { Component } from "react";
import { autenticacion } from '../../../servicios/autenticacion';
import { Link } from 'react-router-dom';
import Axios from '../../../helpers/axiosconf';
import { authHeader } from '../../../helpers/auth-header';
import { handleResponse } from '../../../helpers/manejador';
import { historial } from '../../../helpers/historial';
import { funciones } from '../../../servicios/funciones';
import moment from 'moment';
import '../../../styles/listarTrabajadores.css';

import Modal from '../../includes/modal';
import { toogleModalCore } from '../../includes/funciones';
import ModalFoto from '../../modalFoto';

// importaciones de iconos 
import { ReactComponent as Bamarillorev } from "../../../assets/iconos/bamarillorev.svg";
import { ReactComponent as Plus } from "../../../assets/iconos/plusNaranjo.svg";


const openInNewTab = (url) => {
    let direccion = "http://localhost:4000/media";
    direccion = direccion + url;
    const newWindow = window.open(direccion, '_blank', 'noopener,noreferrer')
    if (newWindow) newWindow.opener = null
}

export default class ListarTrabajadores extends Component {

    constructor(props) {
        super(props);

        this.state = {
            trabajadores: [],
            turnos: '',
            fotoGrupal: {
                name: '',
                link: ''
            },
            fotoObservaciones: {
                name: '',
                link: ''
            },
            showModalFoto:false,
            imgload:''

        };
    }

    toogleModal = toogleModalCore; //copiamos la funcion modal a una funcion local

    manejadorModals = (e, res) => {
        this.toogleModal(e, res);
    }

    abreImagen = async (e) =>{
        console.log(e.currentTarget.dataset.url);
        await this.setState({imgload:e.currentTarget.dataset.url, showModalFoto:true});
    }

    formatearRutListado = (rutCrudo, dv) => {
        var sRut = new String(rutCrudo);
        var sRutFormateado = '';
        while (sRut.length > 3) {
            sRutFormateado = "." + sRut.substr(sRut.length - 3) + sRutFormateado;
            sRut = sRut.substring(0, sRut.length - 3);
        }
        sRutFormateado = sRut + sRutFormateado;
        sRutFormateado += "-" + dv;
        return sRutFormateado;
    }

    obtenerTurnos = async () => { //genera una peticion get por axios a la api de usuarios
        var componente = this;
        var { id } = this.props.match.params;
        const res = Axios.get('/api/users/worker/turnos/detalle/' + id, { headers: authHeader() }) //se envia peticion axios con el token sesion guardado en local storage como cabecera
            .then(function (res) {   //si la peticion es satisfactoria entonces
                console.log(res.data.data[0]);
                componente.setState({ turnos: res.data.data[0], trabajadores: res.data.data[0].trabajadores });
                res.data.data[0].imagen.forEach(archivo => {
                    console.log(archivo);
                    componente.setState({
                        [archivo.input]: {
                            name: [archivo.input],
                            link: [archivo.url]
                        }
                    })
                });  //almacenamos el listado de usuarios en el estado usuarios (array)
            })
            .catch(function (err) { //en el caso de que se ocurra un error, axios lo atrapa y procesa
                console.log(err);
                handleResponse(err.response);  //invocamos al manejador para ver el tipo de error y ejecutar la accion pertinente
                return;
            });
    }

    async componentDidMount() {
        await this.obtenerTurnos();
    }
    render() {
        let fechaProv = new Date(moment(this.state.turnos.fecha).utc().format("YYYY-MM-DD"));
        let fecha = new Date(fechaProv.getFullYear(), fechaProv.getMonth(), fechaProv.getDate());
        let turnos;
        if (this.state.trabajadores && this.state.trabajadores.length !== 0) {
            turnos = this.state.trabajadores.map((trabajador, index) =>
                <tr>
                    <td >
                        <span>
                            {trabajador.rut}
                        </span>
                    </td>
                    <td >
                        <span>
                            {trabajador.nombre}
                        </span>
                    </td>
                    <td >
                        <span>
                            {trabajador.apellido}
                        </span>

                    </td>
                    <td>
                        {trabajador.chaleco &&
                            <span className="circulogris" />
                        }
                    </td>
                    <td>
                        {trabajador.zapatos &&
                            <span className="circulogris" />
                        }
                    </td>
                    <td>
                        {trabajador.gorro &&
                            <span className="circulogris" />
                        }
                    </td>
                    <td>
                        {trabajador.casco &&
                            <span className="circulogris" />
                        }
                    </td>
                    <td>
                        {trabajador.audio &&
                            <span className="circulogris" />
                        }
                    </td>
                </tr >
            )
        } else {
            turnos = <tr><td colSpan="4">No hay</td></tr>
        }
        return (
            <div className="principal" id="component-listar-trabajadores">
                <div>
                    <h2 className="naranjo"><Link to={`/personas/asistencias/control-asistencia/turno/${this.props.match.params.id}`}> <Bamarillorev /> </Link> Asistencias <strong>/ Control Asistencia </strong></h2>
                </div>
                <div className="panel-dashboard-link">
                    <div className="seccion">
                        <h3><span> {(this.state.turnos.fecha) ? funciones.nombreDia(fecha) : ""} {moment(this.state.turnos.fecha).utc().format("DD - MM - YYYY")}</span></h3>
                    </div>
                    <div className="listado-simple seccion">
                        <div class="encabezado"><h3 class="amarillo">Foto grupal</h3></div>
                        <div className="elementos">
                            <div className="elemento">
                                <span className="inline">Foto Grupal</span>
                                <span className="inline spanlink" onClick={this.abreImagen} data-url={this.state.fotoGrupal.link}>{this.state.fotoGrupal.name}</span>
                            </div>
                            <div className="elemento">
                                <div>¿Cómo fue el trabajo en equipo realizado durante el turno?</div>
                                <div class="respuestas">
                                    <div>
                                        <ul>
                                            <li><input type="radio" name="rendimiento" checked={(this.state.turnos.rendimiento === 1) ? true : false} /><label>Muy malo</label></li>
                                            <li><input type="radio" name="rendimiento" checked={(this.state.turnos.rendimiento === 2) ? true : false} /><label>Malo</label></li>
                                            <li><input type="radio" name="rendimiento" checked={(this.state.turnos.rendimiento === 3) ? true : false} /><label>Bueno</label></li>
                                            <li><input type="radio" name="rendimiento" checked={(this.state.turnos.rendimiento === 4) ? true : false} /><label>Muy bueno</label></li>
                                            <li><input type="radio" name="rendimiento" checked={(this.state.turnos.rendimiento === 5) ? true : false} /><label>Excelente</label></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="listado-simple seccion">
                        <div class="encabezado"><h3 class="amarillo">Implementos(grupal)</h3></div>
                        <div className="elementos">
                            {this.state.turnos.bolsas &&
                                <div className="elemento">
                                    <span className="inline">Bolsas plasticas</span>
                                </div>
                            }
                            {this.state.turnos.guantes &&
                                <div className="elemento">
                                    <span className="inline">Guantes</span>
                                </div>
                            }
                            {this.state.turnos.basureros &&
                                <div className="elemento">
                                    <span className="inline">Basureros</span>
                                </div>
                            }
                            {this.state.turnos.escobillon &&
                                <div className="elemento">
                                    <span className="inline">Escobillón</span>
                                </div>
                            }
                            {this.state.turnos.palas &&
                                <div className="elemento">
                                    <span className="inline">Palas</span>
                                </div>
                            }
                            <div className="elemento">
                                <div>Observaciones generales</div>
                                <div><p>{this.state.turnos.observaciones}</p></div>
                            </div>
                        </div>
                    </div>
                    <div className="listado seccion">
                        <div className="encabezado">
                            <h3 className="amarillo">Equipamiento (Marcar si el trabajador lo llevó)</h3>
                        </div>
                        <table>
                            <thead>
                                <th>Rut</th>
                                <th>Nombre</th>
                                <th>Apellidos</th>
                                <th className="txc">Chaleco <br /> Reflectante</th>
                                <th className="txc">Zapatos de <br /> Seguridad</th>
                                <th className="txc">Gorros</th>
                                <th className="txc">Cascos</th>
                                <th className="txc">Proteccion  <br /> Auditiva</th>
                            </thead>
                            <tbody>
                                {turnos}
                            </tbody>
                        </table>
                    </div>
                    <div className="listado-simple seccion">
                        <div class="encabezado"><h3 class="amarillo">Observaciones del Turno</h3></div>
                        <div className="elementos">
                            <div className="elemento">
                                <span className="inline">Foto observaciones</span>
                                <span className="inline spanlink"onClick={this.abreImagen} data-url={this.state.fotoObservaciones.link}>{this.state.fotoObservaciones.name}</span>
                            </div>
                            <div className="elemento">
                                <span className="inline">Ruta</span>
                                <span className="inline">{this.state.turnos.ruta}</span>
                            </div>
                            <div className="elemento">
                                <span className="inline">Calle</span>
                                <span className="inline">{this.state.turnos.calle}</span>
                            </div>
                            <div className="elemento">
                                <span className="inline-auto">¿Se cumplieron las metas propuestas para este turno?</span>
                                <span className="inline-auto">
                                    {(this.state.turnos.metas === 1) ? "Si" : "No"}
                                </span>
                                <div><p>{this.state.turnos.comentariometas}</p></div>
                            </div>

                        </div>
                    </div>
                </div>
                <div id="modales">
                    <Modal
                        name="ModalFoto"  //nombre del estado que controla el modal
                        show={this.state.showModalFoto} //indicamos la propiedad show con el estado que controlara al modal
                        contenido={<ModalFoto />} //entregamos el componente que se renderizara en el modal 
                        toogleModal={this.manejadorModals}
                        img={this.state.imgload}
                    />
                </div>
            </div>

        )
    }
}

