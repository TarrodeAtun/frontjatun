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
import { ReactComponent as Descarga } from "../../assets/iconos/descarga.svg";
import { ReactComponent as Flechaam } from "../../assets/iconos/flechaam.svg";
import { ReactComponent as Plus } from "../../assets/iconos/X.svg";


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
            rut: '',
            centro: '',
            estado: ''
        };
    }

    toogleModal = toogleModalCore; //copiamos la funcion modal a una funcion local

    manejadorModals = (e, res) => { //creamos una funcion que reciba parametros para pasarlo al toogle modal (esta funcion la pasaremos al cuerpo del modal como propiedad para ejecutarse por autoreferencia)
        this.toogleModal(e, res);
    }

    onChangeInput = (e) => {
        this.setState({
            [e.target.name]: e.target.value
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

    obtenerTrabajadores = async () => { //genera una peticion get por axios a la api de usuarios
        var componente = this;
        const res = Axios.post('/api/users/worker/trabajadoresPost',{rut: this.state.rut, }, { headers: authHeader() }) //se envia peticion axios con el token sesion guardado en local storage como cabecera
            .then(function (res) {   //si la peticion es satisfactoria entonces
                componente.setState({ trabajadores: res.data.data });  //almacenamos el listado de usuarios en el estado usuarios (array)
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
                        <p>¿Estas seguro de eliminar este usuario?</p>
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
    filtrar = async() =>{
        
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
            console.log(this.state.centrosCostos);
            centrosCostos = this.state.centrosCostos.map(centro => {
                <option value={centro.key} >{centro.nombre}</option>
            });
        }

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
                                <input className="input-generico" name="rut" onChange={this.onChangeInput} placeholder="Nombre o Rut" />
                                {/* <select className="input-generico" name="centro">
                                    <option>Centro de costos</option>
                                    {centrosCostos}
                                </select> */}
                                {/* <select className="input-generico">
                                    <option>Estado de contrato</option>
                                </select> */}
                            </div>
                            <div className="form-group buttons">
                                <button className="boton-generico btazul"  onClick={this.filtrar}type="button">Filtrar</button>
                                <button className="boton-generico btblanco" type="button">Limpiar</button>
                            </div>
                        </form>
                    </div>
                </div>
                <div className="listado">
                    <table>
                        <thead>
                            <th>Trabajador</th>
                            <th>Centro Costos</th>
                            <th>Acciones Ficha</th>
                        </thead>
                        <tbody>
                            {
                                this.state.trabajadores.map(usuario => (
                                    <tr key={usuario._id}>
                                        <td className="columna">
                                            <span>{usuario.nombre}  {usuario.apellido}</span>
                                            <span>{this.formatearRutListado(usuario.rut, usuario.dv)}</span>
                                            <span>Contrato Vigente</span>
                                        </td>
                                        <td className="centro">Proyecto 1</td>
                                        <td className="acciones">
                                            {/* <span className="incompleto">80%</span> */}
                                            <span><Link to={`/personas/perfil/${usuario._id}`}><Ojo /></Link></span>
                                            <span><Link onClick={this.darBaja} data-id={usuario._id} ><Basurero /></Link></span>
                                            <span><button type="button"><Descarga /></button></span>
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
            </div>

        )
    }
}

