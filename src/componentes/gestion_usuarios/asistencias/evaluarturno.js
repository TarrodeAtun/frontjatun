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
import { confirmAlert } from 'react-confirm-alert';
import { toast } from 'react-toastify';

// importaciones de iconos 
import { ReactComponent as Bamarillorev } from "../../../assets/iconos/bamarillorev.svg";
import { ReactComponent as Plus } from "../../../assets/iconos/plusNaranjo.svg";

const toastoptions = {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
}

export default class ListarTrabajadores extends Component {

    constructor(props) {
        super(props);

        this.state = {
            trabajadores: [],
            turnos: '',
            fotoGrupal: '',
            rendimiento: '',
            bolsas: false,
            guantes: false,
            basureros: false,
            escobillon: false,
            palas: false,
            observaciones: '',
            fotoObservaciones: '',
            ruta: '',
            calle: '',
            metas: '',
            comentariometas: ''


        };
    }

    onChangeInput = (e) => {
        if (e.target.type === "checkbox") {
            this.setState({
                [e.target.name]: e.target.checked
            })
        } else {
            this.setState({
                [e.target.name]: e.target.value
            })
        }
    }

    onChangeEquipamiento = async (e) => {
        console.log(e.target.value);
        const llave = e.target.dataset.key;
        let trabajadores = this.state.trabajadores;
        trabajadores[llave][e.target.name] = e.target.checked;
        await this.setState({ trabajadores: trabajadores });
        console.log(this.state.trabajadores);
    }

    onChangeFileInput = (e) => {
        console.log(e.target.files[0]);
        this.setState({
            [e.target.name]: e.target.files[0]
        })
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
                componente.setState({ turnos: res.data.data[0], trabajadores: res.data.data[0].trabajadores });  //almacenamos el listado de usuarios en el estado usuarios (array)
            })
            .catch(function (err) { //en el caso de que se ocurra un error, axios lo atrapa y procesa
                console.log(err);
                handleResponse(err.response);  //invocamos al manejador para ver el tipo de error y ejecutar la accion pertinente
                return;
            });
    }

    finalizarTurno = async () => { //genera una peticion get por axios a la api de usuarios
        var { id } = this.props.match.params;
        var campoVacio = false;
        var formData = new FormData();
        formData.append('id', id);
        formData.append('trabajadores', JSON.stringify(this.state.trabajadores));
        formData.append('fotoGrupal', this.state.fotoGrupal);
        formData.append('rendimiento', this.state.rendimiento);
        formData.append('bolsas', this.state.bolsas);
        formData.append('guantes', this.state.guantes);
        formData.append('basureros', this.state.basureros);
        formData.append('escobillon', this.state.escobillon);
        formData.append('palas', this.state.palas);
        formData.append('fotoObservaciones', this.state.fotoObservaciones);
        formData.append('observaciones', this.state.observaciones);
        formData.append('ruta', this.state.ruta);
        formData.append('calle', this.state.calle);
        formData.append('metas', this.state.metas);
        formData.append('comentariometas', this.state.comentariometas);
        for (var elem of formData.entries()) {
            if (elem[1] === "" || elem[1] === null) {
                campoVacio = true;
            }
        }
        console.log(formData);
        console.log(this.state);
        if (!campoVacio) {
            confirmAlert({
                customUI: ({ onClose }) => {
                    return (
                        <div className='custom-confirm '>
                            <p>¿Está seguro de finalizar el turno?</p>
                            <button className="boton-generico btazulalt" onClick={onClose}>Cancelar</button>
                            <button className="boton-generico btazul"
                                onClick={async () => {
                                    const res = Axios.post('/api/users/worker/turnos/finalizar/', formData, {
                                        headers: authHeader()
                                    })
                                        .then(respuesta => {
                                            if (respuesta.data.estado === "success") {
                                                toast.success(respuesta.data.mensaje, toastoptions);
                                                onClose();
                                            }
                                        })
                                        .catch(function (err) { //en el caso de que se ocurra un error, axios lo atrapa y procesa
                                            handleResponse(err.response);  //invocamos al manejador para ver el tipo de error y ejecutar la accion pertinente
                                            onClose();
                                            toast.error("Ha habido un error al enviar los datos", toastoptions);
                                        });
                                }}
                            >
                                Aceptar
                    </button>
                        </div >
                    );
                }
            });
        } else {
            toast.warning("Debes llenar todos los campos", toastoptions);
        }
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
                        <input type="checkbox" onChange={this.onChangeEquipamiento} value="1" data-key={index} name="chaleco" />
                    </td>
                    <td>
                        <input type="checkbox" onChange={this.onChangeEquipamiento} value="1" data-key={index} name="zapatos" />
                    </td>
                    <td>
                        <input type="checkbox" onChange={this.onChangeEquipamiento} value="1" data-key={index} name="gorro" />
                    </td>
                    <td>
                        <input type="checkbox" onChange={this.onChangeEquipamiento} value="1" data-key={index} name="casco" />
                    </td>
                    <td>
                        <input type="checkbox" onChange={this.onChangeEquipamiento} value="1" data-key={index} name="audio" />
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
                                <span className="inline"><input name="fotoGrupal" onChange={this.onChangeFileInput} type="file" /></span>
                            </div>
                            <div className="elemento">
                                <div>¿Cómo fue el trabajo en equipo realizado durante el turno?</div>
                                <div class="respuestas">
                                    <div>
                                        <ul>
                                            <li><input type="radio" name="rendimiento" onChange={this.onChangeInput} value="0" /><label>Muy malo</label></li>
                                            <li><input type="radio" name="rendimiento" onChange={this.onChangeInput} value="1" /><label>Malo</label></li>
                                            <li><input type="radio" name="rendimiento" onChange={this.onChangeInput} value="3" /><label>Bueno</label></li>
                                            <li><input type="radio" name="rendimiento" onChange={this.onChangeInput} value="4" /><label>Muy bueno</label></li>
                                            <li><input type="radio" name="rendimiento" onChange={this.onChangeInput} value="5" /><label>Excelente</label></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="listado-simple seccion">
                        <div class="encabezado"><h3 class="amarillo">Implementos(grupal)</h3></div>
                        <div className="elementos">
                            <div className="elemento">
                                <span className="inline"><input type="checkbox" name="bolsas" onChange={this.onChangeInput} />Bolsas plasticas</span>
                            </div>
                            <div className="elemento">
                                <span className="inline"><input type="checkbox" name="guantes" onChange={this.onChangeInput} />Guantes</span>
                            </div>
                            <div className="elemento">
                                <span className="inline"><input type="checkbox" name="basureros" onChange={this.onChangeInput} />Basureros</span>
                            </div>
                            <div className="elemento">
                                <span className="inline"><input type="checkbox" name="escobillon" onChange={this.onChangeInput} />Escobillón</span>
                            </div>
                            <div className="elemento">
                                <span className="inline"><input type="checkbox" name="palas" onChange={this.onChangeInput} />Palas</span>
                            </div>
                            <div className="elemento">
                                <div>Observaciones generales</div>
                                <div><textarea className="input-generico" onChange={this.onChangeInput} name="observaciones" rows="3"></textarea></div>
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
                                <th>Chaleco <br /> Reflectante</th>
                                <th>Zapatos de <br /> Seguridad</th>
                                <th>Gorros</th>
                                <th>Cascos</th>
                                <th>Proteccion  <br /> Auditiva</th>
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
                                <span className="inline"><input type="file" onChange={this.onChangeFileInput} name="fotoObservaciones" /></span>
                            </div>
                            <div className="elemento">
                                <span className="inline">Ruta</span>
                                <span className="inline"><input type="text" name="ruta" onChange={this.onChangeInput} className="input-generico" placeholder="Nombre" /></span>
                            </div>
                            <div className="elemento">
                                <span className="inline">Calle</span>
                                <span className="inline"><input type="text" name="calle" onChange={this.onChangeInput} className="input-generico" placeholder="Nombre" /></span>
                            </div>
                            <div className="elemento">
                                <span className="inline-auto">¿Se cumplieron las metas propuestas para este turno?</span>
                                <span className="inline-auto">
                                    <input type="radio" name="metas" value="0" onChange={this.onChangeInput} /><label>Si</label>
                                    <input type="radio" name="metas" value="1" onChange={this.onChangeInput} /><label>No</label>
                                </span>
                            </div>
                            <div className="elemento">
                                <div><textarea className="input-generico" name="comentariometas" onChange={this.onChangeInput} rows="3"></textarea></div>
                            </div>
                        </div>
                    </div>
                </div>

                {this.state.turnos.estado === 2 &&
                    <div className="form-group buttons">
                        <button className="boton-generico btgris" disabled="true" type="button" onClick={this.subirAsistencia}>Subir Asistencia</button>
                        <button className="boton-generico btazul" type="button" onClick={this.finalizarTurno}>Evaluacion</button>
                    </div>
                }
            </div>

        )
    }
}

