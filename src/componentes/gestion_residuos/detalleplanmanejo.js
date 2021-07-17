// importaciones de bibliotecas 
import React, { Component, Fragment } from "react";
import { autenticacion } from '../../servicios/autenticacion';
import { Link } from 'react-router-dom';
import { confirmAlert } from 'react-confirm-alert';
import Axios from '../../helpers/axiosconf';
import { authHeader } from '../../helpers/auth-header';
import { handleResponse } from '../../helpers/manejador';
import moment from 'moment';
import { toast } from 'react-toastify';
import Modal from '../includes/modal';
import { toogleModalCore } from '../includes/funciones';
import { funciones } from '../../servicios/funciones';

// importaciones de estilos 
import '../../styles/fichaTrabajador.css';

import AgregarResiduoPlan from './agregarResiduoPlan';

// importaciones de iconos 
import fichaper from "../../assets/iconos/fichaper.svg";
import turnos from "../../assets/iconos/turnos.svg";
import { ReactComponent as Bverderev } from "../../assets/iconos/bverderev.svg";
import { ReactComponent as Basurero } from "../../assets/iconos/basurero.svg";
import { ReactComponent as Flechaver } from "../../assets/iconos/flechaver.svg";
import { historial } from "../../helpers/historial";


const toastoptions = {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
}
const openInNewTab = (direccion) => {
    const newWindow = window.open(direccion, '_blank', 'noopener,noreferrer')
    if (newWindow) newWindow.opener = null
}
const direccionImagen = funciones.obtenerRutaPlanes();
export default class CrearPlanManejo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentUser: autenticacion.currentUserValue,
            datosUsuarios: "",
            centros: '',

            showAgregarResiduoPlan: false,

            datosCliente: '',
            nombreCliente: '',
            rut: '',

            clienteRut: '',
            nombre: '',
            fecha: '',
            centro: '',
            direccion: '',
            comuna: '',
            id: '',
            vuretc: '',
            recoleccion: '',
            valorizacion: '',
            residuos: '',
            techadoAltura: '',
            techadoSuperficie: '',
            superficie: '',
            imagen: '',
            comentarios: '',
            contenedores: '',

            residuosagregado: [],
            subcategorias: ''

        };
    }

    toogleModal = toogleModalCore;

    manejadorModals = (e, res) => {
        this.toogleModal(e, res);
    }

    componentDidMount = async () => {
        this.obtenerPlan();
        // this.obtenerCliente();
        this.obtenerCentros();
        this.obtenerComunas();

    }

    obtenerPlan = async () => { //genera una peticion get por axios a la api de usuarios
        var componente = this;
        var { id } = this.props.match.params;
        this.setState({ idCliente: id });
        const res = Axios.get('/api/gestion-residuos/plan-manejo/ver-plan/' + id, { headers: authHeader() }) //se envia peticion axios con el token sesion guardado en local storage como cabecera
            .then(function (res) {   //si la peticion es satisfactoria entonces
                console.log(res.data.data[0]);
                componente.setState({
                    clienteRut: res.data.data[0].clienteRut,
                    nombre: res.data.data[0].nombre,
                    fecha: res.data.data[0].fecha,
                    centro: res.data.data[0].centro,
                    direccion: res.data.data[0].direccion,
                    comuna: res.data.data[0].comuna,
                    id: res.data.data[0].id,
                    vuretc: res.data.data[0].vuretc,
                    recoleccion: res.data.data[0].recoleccion,
                    valorizacion: res.data.data[0].valorizacion,
                    residuosagregado: res.data.data[0].residuos,
                    techadoAltura: res.data.data[0].techadoAltura,
                    techadoSuperficie: res.data.data[0].techadoSuperficie,
                    superficie: res.data.data[0].superficie,
                    imagen: res.data.data[0].imagen,
                    comentarios: res.data.data[0].comentarios,
                    contenedores: res.data.data[0].contenedores,
                    residuosegregado: res.data.data[0].residuosegregado,
                    datosCliente: res.data.data[0].datosCliente[0],
                });  //almacenamos el listado de usuarios en el estado usuarios (array)

            })
            .catch(function (err) { //en el caso de que se ocurra un error, axios lo atrapa y procesa
                console.log(err);
                handleResponse(err.response);  //invocamos al manejador para ver el tipo de error y ejecutar la accion pertinente
                return;
            });
    }
    obtenerCentros = async () => { //genera una peticion get por axios a la api de usuarios
        var componente = this;
        const res = Axios.get('/api/generales/centroscostos/', { headers: authHeader() }) //se envia peticion axios con el token sesion guardado en local storage como cabecera
            .then(function (res) {   //si la peticion es satisfactoria entonces
                console.log(res.data.data)
                componente.setState({ centros: res.data.data });  //almacenamos el listado de usuarios en el estado usuarios (array)
            })
            .catch(function (err) { //en el caso de que se ocurra un error, axios lo atrapa y procesa
                handleResponse(err.response);  //invocamos al manejador para ver el tipo de error y ejecutar la accion pertinente
                return;
            });
    }
    obtenersubCategoriasLer = async (codigo, categoria) => {
        var componente = this;
        const res = Axios.post('/api/generales/subcategoriasler/', { codigo: codigo, categoria: categoria }, { headers: authHeader() }) //se envia peticion axios con el token sesion guardado en local storage como cabecera
            .then(res => {   //si la peticion es satisfactoria entonces
                componente.setState({ subcategorias: res.data.data })
            })
    }
    obtenerComunas = async () => { //genera una peticion get por axios a la api de usuarios
        var componente = this;
        const res = Axios.get('/api/generales/comunas/', { headers: authHeader() }) //se envia peticion axios con el token sesion guardado en local storage como cabecera
            .then(function (res) {   //si la peticion es satisfactoria entonces
                componente.setState({ comunas: res.data.data });  //almacenamos el listado de usuarios en el estado usuarios (array)
            })
            .catch(function (err) { //en el caso de que se ocurra un error, axios lo atrapa y procesa
                handleResponse(err.response);  //invocamos al manejador para ver el tipo de error y ejecutar la accion pertinente
                return;
            });
    }

    volver = () => {
        var componente = this;
        componente.pushLista();
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

    onChangeInput = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    onChangeFileInput = (e) => {
        console.log(e.target.files[0]);
        this.setState({
            [e.target.name]: e.target.files[0]
        })
    }

    onChangeResiduo = (e) => {
        const llave = e.target.dataset.key;
        let residuosagregado = this.state.residuosagregado;
        residuosagregado[llave][e.target.name] = e.target.value;
        this.setState({ residuosagregado: residuosagregado });
    }

    agregarResiduo = (datos) => {
        const residuo = {
            codigo: datos.codigo,
            categoria: datos.categoria,
            label: datos.label,
            proceso: '',
            cantidad: '',
            clasificacion: '',
            pretratamiento: '',
            pretratamientoValor: '',
            subcategorias: datos.subcategorias
        }
        this.setState({
            residuosagregado: [...this.state.residuosagregado, residuo]
        })
    }

    abrirmodal = () => {
        this.setState({ showAgregarResiduoPlan: true });
    }

    pushLista = () => {
        historial.push(`/residuos/plan-manejo-cliente/${this.state.datosCliente._id}`);
    }

    enviaDatos = async e => {
        console.log(this.state);
        var componente = this;
        var { id } = this.props.match.params;
        console.log(id);
        e.preventDefault();
        var campoVacio = false;
        var formData = new FormData();
        formData.append('_id', id);
        formData.append('clienteRut', parseInt(this.state.clienteRut));
        formData.append('nombre', this.state.nombre);
        formData.append('centro', this.state.centro);
        formData.append('direccion', this.state.direccion);
        formData.append('comuna', this.state.comuna);
        formData.append('fecha', this.state.fecha);
        formData.append('id', this.state.id);
        formData.append('vuretc', this.state.vuretc);
        formData.append('recoleccion', this.state.recoleccion);
        formData.append('valorizacion', this.state.valorizacion);
        formData.append('residuos', JSON.stringify(this.state.residuosagregado));
        formData.append('techadoAltura', this.state.techadoAltura);
        formData.append('techadoSuperficie', this.state.techadoSuperficie);
        formData.append('superficie', this.state.superficie);
        formData.append('imagen', this.state.imagen);
        formData.append('comentarios', this.state.comentarios);
        formData.append('contenedores', this.state.contenedores);
        formData.append('residuosegregado', this.state.residuosegregado);

        formData.entries();
        for (var elem of formData.entries()) {
            if (elem[1] === "" || elem[1] === null) {
                campoVacio = true;
            }
        }
        if (!campoVacio) {
            const res = await Axios.post('/api/gestion-residuos/plan-manejo/modificar/', formData, { headers: authHeader() })
                .then(respuesta => {
                    if (respuesta.data.estado === "success") {
                        toast.success(respuesta.data.mensaje, toastoptions);
                        historial.push("/residuos/plan-manejo-cliente/" + this.state.datosCliente._id);
                    } else if (respuesta.data.estado === "warning") {
                        toast.warning(respuesta.data.mensaje, toastoptions);
                    }
                })
                .catch(function (err) { //en el caso de que se ocurra un error, axios lo atrapa y procesa
                    handleResponse(err.response);  //invocamos al manejador para ver el tipo de error y ejecutar la accion pertinente
                    toast.error("Ha habido un error al enviar los datos", toastoptions);
                });
        } else {
            toast.warning("Debes llenar todos los campos", toastoptions);
        }
    }

    render() {

        let centrocostos;
        if (this.state.centros) {
            centrocostos = this.state.centros.map((centro, index) =>
                <option value={centro.key} >{centro.nombre}</option>
            )
        }
        let comunas;
        if (this.state.comunas) {
            this.state.comunas.map((region, index) => {
                comunas = region.comunas.map((comuna, ind) =>
                    <option value={ind} >{comuna}</option>
                )
            })
        }
        const items = this.state.residuosagregado.map((residuo, index) => {
            let categoriasler
            let componente = this;
            let subcategorias;
            // console.log(residuo);

            subcategorias = residuo.subcategorias.map((subcategoria, index) =>
                <option value={subcategoria.key} >{subcategoria.nombre}</option>
            )
            return (<Fragment key={index}>
                <div className="prehead wauto">
                    <h3 className="amarillo">{residuo.codigo} - {residuo.label}</h3>

                </div>
                <div>
                    <span>Proceso del cual proviene</span>
                    <span>{residuo.proceso}</span>
                </div>
                <div>
                    <span>Cantidad</span>
                    <span>{residuo.cantidad} </span>
                </div>
                <div>
                    <span>Clasificacion</span>
                    <span>
                        <select className="input-generico" disabled readOnly onChange={this.onChangeResiduo} value={residuo.clasificacion} data-key={index} name="clasificacion">
                            <option >Seleccionar</option>
                            {subcategorias}
                        </select>
                    </span>
                </div>
                <div>
                    <span>Pretratamiento</span>
                    <span className="introspan">
                        {parseInt(residuo.pretratamiento) === 1
                            ? <Fragment>
                                <span> <input type="radio" disabled onChange={this.onChangeResiduo} value="1" checked name={`pretratamiento${index}`} data-key={index} /> <label>Si</label> </span>
                                <span> <input type="radio" disabled onChange={this.onChangeResiduo} value="0" name={`pretratamiento${index}`} data-key={index} /> <label>No</label> </span>
                                <span> <input name="pretatamientoValor" value={residuo.pretratamientoValor} onChange={this.onChangeResiduo} data-key={index} /> </span>
                            </Fragment>
                            : <Fragment>
                                <span> <input type="radio" disabled onChange={this.onChangeResiduo} value="1" name={`pretratamiento${index}`} data-key={index} /> <label>Si</label> </span>
                                <span> <input type="radio" disabled onChange={this.onChangeResiduo} value="0" checked name={`pretratamiento${index}`} data-key={index} /> <label>No</label> </span>

                            </Fragment>

                        }

                    </span>
                </div>
            </Fragment>)
        }

        );
        return (
            <div className="principal" id="component-perfil">
                <div>
                    <h2 className="verde"><button className="boton-vacio" onClick={this.volver}> <Bverderev /> </button><span>{this.state.datosCliente.nombre}</span> / <strong>{this.state.nombre}</strong></h2>
                    <div className="fichaPerfil">
                        <div className="seccion">
                            <h3 className="verde">Detalle Plan</h3>
                            <div>
                                <span>Nombre plan</span>
                                <span>{this.state.nombre}</span>
                            </div>
                            <div>
                                <span>Fecha</span>
                                <span>{moment(this.state.fecha).utc().format('DD/MM/YYYY')}</span>
                            </div>
                            <div>
                                <span>Centro Costos</span>
                                <span>
                                    <select disabled name="centro" value={this.state.centro} onChange={this.onChangeInput} className="input-generico">
                                        <option>Seleccionar</option>
                                        {centrocostos}
                                    </select>
                                </span>
                            </div>
                            <div>
                                <span>Dirección faena</span>
                                <span> {this.state.direccion}</span>
                            </div>
                            <div>
                                <span>Comuna</span>
                                <span><select disabled name="comuna" value={this.state.comuna} onChange={this.onChangeInput} className="input-generico">
                                    <option>Seleccione Comuna</option>
                                    {comunas}
                                </select></span>
                            </div>
                            <div>
                                <span>ID</span>
                                <span> {this.state.id}</span>
                            </div>
                            <div>
                                <span>VU - RETC</span>
                                <span>{this.state.vuretc}</span>
                            </div>
                        </div>

                        <div className="seccion">
                            <h3 className="verde">1. Requerimientos</h3>
                            <div>
                                <span>Recoleccion residuos</span>
                                <span>
                                    <select disabled className="input-generico" onChange={this.onChangeInput} value={this.state.recoleccion} name="recoleccion">
                                        <option >Seleccionar</option>
                                        <option value="1">Recolección completa</option>
                                        <option value="2">Recoleccion parcial</option>
                                    </select>
                                </span>
                            </div>
                            <div>
                                <span>Valorización completa</span>
                                <span>
                                    <select disabled className="input-generico" onChange={this.onChangeInput} value={this.state.valorizacion} name="valorizacion">
                                        <option >Seleccionar</option>
                                        <option value="1">Solo Recolección</option>
                                        <option value="2">Todo</option>
                                    </select>
                                </span>
                            </div>
                        </div>

                        <div className="seccion">
                            <div className="prehead wauto">
                                <h3 className="verde">2. Volumen y clasificación del residuo</h3>

                            </div>
                            {items}
                        </div>

                        <div className="seccion">
                            <h3 className="verde">3. Condiciones Técnicas</h3>
                            <hr></hr>
                            <h3 className="gris">Espacio disponible para acopio: </h3>
                            <div>
                                <span>Techado</span>
                                <span> {this.state.techadoAltura} Mts Alto -  {this.state.techadoSuperficie} Mts Superficie</span>
                                
                            </div>
                            <div>
                                <span>Cielo Abierto</span>
                                <span> {this.state.superficie} Mts</span>
                            </div>
                            <div>
                                <span>Adjuntar Fotografía</span>
                                {
                                 this.state.imagen[0]   && 
                                 <span onClick onClick={() => openInNewTab(direccionImagen+this.state.imagen[0].url )}>{ this.state.imagen[0].input}</span>
                                }
                                
                            </div>
                            <div>
                                <span>Comentarios</span>
                                <span> <textarea disabled readOnly className="input-generico" onChange={this.onChangeInput} value={this.state.comentarios} name="comentarios"></textarea></span>
                            </div>
                            <h3 className="gris">¿Posee algún tipo de contenedores segregadores en la faena?</h3>
                            <div className="introspan spanseparado">
                                <span>
                                    <input className="input-generico" type="radio" name="nombre" value="1" placeholder="Superficie"></input><label>Si</label>
                                </span>
                                <span>
                                    <input className="input-generico" type="radio" name="nombre" value="0" placeholder="Superficie"></input><label>No</label>
                                </span>
                            </div>
                            <div>
                                <span>¿Cuantos?</span>
                                <span>{this.state.contenedores}</span>
                            </div>
                            <div>
                                <span>¿Que tipo de residuos segrega actualmente?</span>
                                <span> <textarea disabled readonly className="input-generico" onChange={this.onChangeInput} value={this.state.residuosegregado} name="residuosegregado"></textarea></span>
                            </div>
                            {/* <div className="form-group buttons">
                                <button className="boton-generico btazulalt" type="button" >Cancelar</button>
                                <button className="boton-generico btazul" onClick={this.enviaDatos}>Guardar</button>
                            </div> */}
                        </div>

                    </div>
                </div>
                <div id="modales">
                    <Modal
                        name="AgregarResiduoPlan"  //nombre del estado que controla el modal
                        show={this.state.showAgregarResiduoPlan} //indicamos la propiedad show con el estado que controlara al modal
                        contenido={<AgregarResiduoPlan />} //entregamos el componente que se renderizara en el modal 
                        toogleModal={this.manejadorModals}
                        agregarResiduo={this.agregarResiduo}//traspasamos la funcion que permitira abrir y cerrar el modal
                    />
                </div>
            </div>
        );
    }
}