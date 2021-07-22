//importaciones de bibliotecas
import React, { Component } from "react";
import { autenticacion } from '../../servicios/autenticacion';
import { Link } from 'react-router-dom';
import { confirmAlert } from 'react-confirm-alert';
import Axios from '../../helpers/axiosconf';
import { authHeader } from '../../helpers/auth-header';
import { handleResponse } from '../../helpers/manejador';
import { funciones } from '../../servicios/funciones';
import { toast } from 'react-toastify';

import '../../styles/listarTrabajadores.css';


// importaciones de iconos 
import { ReactComponent as Bamarillorev } from "../../assets/iconos/bamarillorev.svg";
import { ReactComponent as Basurero } from "../../assets/iconos/basurero.svg";
import { ReactComponent as Ojo } from "../../assets/iconos/ojo.svg";
import { ReactComponent as Doc } from "../../assets/iconos/doc.svg";
import { ReactComponent as Descarga } from "../../assets/iconos/descarga.svg";
import { ReactComponent as Flechaam } from "../../assets/iconos/flechaam.svg";
import { ReactComponent as Plus } from "../../assets/iconos/X.svg";

import reloj from "../../assets/iconos/reloj.png";


//importamos manejadores de modal
import Modal from '../includes/modal';
import { toogleModalCore } from '../includes/funciones';

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
            centrosCostos: '',
            pagina: 1,
            paginas: '',

            rut: '',
            nombre: '',
            centro: '',
            estado: ''
        };
    }

    toogleModal = toogleModalCore; //copiamos la funcion modal a una funcion local
    paginacion = funciones.paginacion;
    manejadorModals = (e, res) => { //creamos una funcion que reciba parametros para pasarlo al toogle modal (esta funcion la pasaremos al cuerpo del modal como propiedad para ejecutarse por autoreferencia)
        this.toogleModal(e, res);
    }

    onChangeInput = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }
    onChangeRut = async e => {
        funciones.formatearRut(e.target.value, 1).then(res => {
            this.setState({
                rut: res
            })
        });
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

    obtenerTrabajadores = async () => { //genera una peticion get por axios a la api de usuarios
        var componente = this;
        const res = Axios.post('/api/users/worker/trabajadoresPost', { rut: this.state.rut, centro: this.state.centro, pagina: this.state.pagina, nombre:this.state.nombre }, { headers: authHeader() }) //se envia peticion axios con el token sesion guardado en local storage como cabecera
            .then(function (res) {   //si la peticion es satisfactoria entonces
                console.log(res.data);
                componente.setState({ trabajadores: res.data.data, paginas: res.data.paginas });  //almacenamos el listado de usuarios en el estado usuarios (array)
            })
            .catch(function (err) { //en el caso de que se ocurra un error, axios lo atrapa y procesa
                handleResponse(err.response);  //invocamos al manejador para ver el tipo de error y ejecutar la accion pertinente
                return;
            });
    }

    darBaja = async (e) => {
        let id = e.currentTarget.dataset.id;
        var componente = this;
        confirmAlert({
            customUI: ({ onClose }) => {
                return (
                    <div className='custom-confirm '>
                        <p>¿Estas seguro de dar de baja a este usuario?, no podrás recuperarlo</p>
                        <button className="boton-generico btazulalt" onClick={onClose}>Cancelar</button>
                        <button className="boton-generico btazul"
                            onClick={() => {
                                const res = Axios.post('/api/users/worker/eliminar',
                                    {
                                        id: id,
                                    },
                                    { headers: authHeader() }) //se envia peticion axios con el token sesion guardado en local storage como cabecera
                                    .then(function (res) {
                                        toast.success(res.data.mensaje, toastoptions);
                                        componente.obtenerTrabajadores();
                                        // componente.filtrar();
                                    })
                                    .catch(function (err) { //en el caso de que se ocurra un error, axios lo atrapa y procesa
                                        handleResponse(err.response);  //invocamos al manejador para ver el tipo de error y ejecutar la accion pertinente
                                        return;
                                    });
                                onClose();
                            }} >
                            Aceptar
                        </button>
                    </div>
                );
            }
        });

    }
    filtrar = async () => {
        this.obtenerTrabajadores();
    }
    limpiar = async () => {
        this.setState({
            rut: '', centro: ''
        })
    }
    paginar = async (e) => {
        console.log(e.currentTarget.dataset.pag);
        await this.setState({ pagina: e.currentTarget.dataset.pag })
        this.obtenerTrabajadores();
    }



    async componentDidMount() {
        await this.obtenerTrabajadores();
        await this.setState({ centrosCostos: await funciones.obtenerCentrosCostos() });
    }
    async componentWillUnmount() {

    }

    render() {

        let centrosCostos;
        if (this.state.centrosCostos) {
            centrosCostos = this.state.centrosCostos.map(centro => {
                return (<option value={centro.key} >{centro.nombre}</option>)
            });
        }
        let paginacion = funciones.paginacion(this.state.paginas, this.state.pagina, this.paginar);
        return (
            <div className="principal" id="component-listar-trabajadores">
                <div>
                    <h2 className="naranjo"><Link to="/personas/gestion"> <Bamarillorev /> </Link> Gestión de Personas <strong>/ Trabajadores</strong></h2>
                </div>

                <div className="panel-dashboard-link">
                    <div className="seccion">
                        <h3><Link to="/personas/crear-trabajador"><Plus /><span>  Crear Trabajador</span><button><Flechaam /></button></Link></h3>
                    </div>
                </div>
                <div className="filtros">
                    <div className="sup">
                        <button>Filtros</button>
                    </div>
                    <div>
                        <form>
                            <div className="form-group justify-center">
                                <input className="input-generico" name="nombre" value={this.state.nombre} onChange={this.onChangeInput} placeholder="Nombre" />
                                <input className="input-generico" name="rut" value={this.state.rut} onChange={this.onChangeRut} placeholder="Rut" />
                                
                                {/* <select className="input-generico">
                                    <option>Estado de contrato</option>
                                </select> */}
                            </div>
                            <div className="form-group justify-center">
                                <select className="input-generico" name="centro" onChange={this.onChangeInput}>
                                    <option value="">Centro de costos</option>
                                    {centrosCostos}
                                </select>
                                
                            </div>
                            <div className="form-group buttons">
                                <button className="boton-generico btazul" onClick={this.filtrar} type="button">Filtrar</button>
                                <button className="boton-generico btblanco" onClick={this.limpiar} type="button">Limpiar</button>
                            </div>
                        </form>
                    </div>
                </div>
                <div className="listado">
                    <table>
                        <thead>
                            <th className="onlymovil" colSpan="3">Trabajador</th>
                            <th className="onlydesktop primeracol">Trabajador</th>
                            <th className="onlydesktop">Centro Costos</th>
                            <th className="onlydesktop"> Acciones Ficha</th>
                        </thead>
                        <tbody>
                            {
                                this.state.trabajadores.map(usuario => {
                                    let centro;
                                    if (usuario.centroCosto && this.state.centrosCostos) {

                                        this.state.centrosCostos.find(function (cen) {
                                            if (parseInt(cen.key) === parseInt(usuario.centroCosto)) {
                                                centro = cen.nombre;
                                            }
                                        });


                                    }

                                    return (<tr key={usuario._id}>
                                        <td className="columna">
                                            <span className="pdtpbt">{usuario.nombre}  {usuario.apellido}</span>
                                            <span className="pdtpbt"><label className="onlymovil">Rut:</label>{this.formatearRutListado(usuario.rut, usuario.dv)}</span>
                                            <span className="pdtpbt"><label className="onlymovil">Estado Contrato:</label>Vigente</span>
                                        </td>
                                        <td className="centro pdtpbt"><label className="onlymovil">Centro Costos:</label>{centro}</td>
                                        <td className="columna onlymovil"><label>Acciones:</label></td>
                                        <td className="acciones pdtpbt">
                                            {/* <span className="incompleto">80%</span> */}
                                            <span><Link to={`/personas/perfil/${usuario._id}`}><Ojo /></Link></span>
                                            <span><Link to={`/personas/ficha-trabajador/${usuario._id}`} title="Ficha Trabajador"><Doc /></Link></span>
                                            <span><Link to={`/personas/turnos/trabajador/${usuario._id}`} title="Turnos Trabajador"><img className="icono" src={reloj} /></Link></span>
                                            {usuario.rut === 18706188
                                                ? ""
                                                : <span><Link onClick={this.darBaja} data-id={usuario._id} ><Basurero /></Link></span>
                                            }

                                            {/* <span><button type="button"><Descarga /></button></span> */}
                                        </td>
                                    </tr>)
                                }

                                )
                            }
                        </tbody>
                    </table>
                </div>
                <div>
                    <ul className="paginador">
                        {paginacion}
                    </ul>
                </div>
            </div>

        )
    }
}

