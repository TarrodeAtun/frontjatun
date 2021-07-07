// importaciones de bibliotecas 
import React, { Component, Fragment } from "react";
import { autenticacion } from '../../servicios/autenticacion';
import { Link } from 'react-router-dom';
import Axios from '../../helpers/axiosconf';
import { authHeader } from '../../helpers/auth-header';
import { handleResponse } from '../../helpers/manejador';
import { funciones } from '../../servicios/funciones';
import { confirmAlert } from 'react-confirm-alert';
import { toast } from 'react-toastify';

// importaciones de estilos 
import '../../styles/fichaTrabajador.css';

import AgregarEmergencia from './crearEmergenciaResiduos';
import ModificarEmergencia from './modificarEmergenciaResiduos';
import VerEmergencia from './verEmergenciaResiduos';

import Modal from '../includes/modal';
import { toogleModalCore } from '../includes/funciones';
import moment from 'moment';


// importaciones de iconos 
import { ReactComponent as Edit } from "../../assets/iconos/edit.svg";
import { ReactComponent as Ojo } from "../../assets/iconos/ojo.svg";
import { ReactComponent as Basurero } from "../../assets/iconos/basurero.svg";
import { ReactComponent as Bverderev } from "../../assets/iconos/bverderev.svg";
import { ReactComponent as Flechaver } from "../../assets/iconos/flechaver.svg";
import { async } from "rxjs";


const toastoptions = {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
}

export default class EmergenciasResiduos extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentUser: autenticacion.currentUserValue,
            datosUsuarios: "",
            users: null,
            showAgregarEmergencia: '',
            showModificarEmergencia: '',
            idModificar: '',

            pagina: 1,
            paginas: '',
        };
    }

    toogleModal = toogleModalCore;

    manejadorModals = (e, res) => {
        this.toogleModal(e, res);
    }

    paginacion = funciones.paginacion;

    paginar = async (e) => {
        console.log(e.currentTarget.dataset.pag);
        await this.setState({ pagina: e.currentTarget.dataset.pag })
        this.obtenerEmergencias();
    }

    async componentDidMount() {
        this.obtenerEmergencias();
    }

    obtenerEmergencias = async (e) => {
        var componente = this;
        const res = Axios.post('/api/gestion-residuos/emergencias/residuos/', { pagina: this.state.pagina }, { headers: authHeader() }) //se envia peticion axios con el token sesion guardado en local storage como cabecera
            .then(function (res) {
                componente.setState({
                    emergencias: res.data.data,
                    paginas: res.data.paginas
                });  //almacenamos el listado de usuarios en el estado usuarios (array)
            })
            .catch(function (err) { //en el caso de que se ocurra un error, axios lo atrapa y procesa
                handleResponse(err.response);  //invocamos al manejador para ver el tipo de error y ejecutar la accion pertinente
                return;
            });
    }

    modificarEmergencia = async (e) => {
        console.log(e.currentTarget.dataset.id);
        this.setState({ idModificar: e.currentTarget.dataset.id });
        this.manejadorModals(e)
    }

    eliminarEmergencia = async (e) => {
        let id = e.currentTarget.dataset.id;
        var componente = this;
        confirmAlert({
            customUI: ({ onClose }) => {
                return (
                    <div className='custom-confirm '>
                        <p>¿Estas seguro de eliminar esta emergencia?, no podrás recuperarla</p>
                        <button className="boton-generico btazulalt" onClick={onClose}>Cancelar</button>
                        <button className="boton-generico btazul"
                            onClick={() => {
                                const res = Axios.post('/api/gestion-residuos/emergencias/residuos/eliminar',
                                    { id: id, },
                                    { headers: authHeader() }) //se envia peticion axios con el token sesion guardado en local storage como cabecera
                                    .then(function (res) {
                                        toast.success(res.data.mensaje, toastoptions);
                                        componente.obtenerEmergencias();
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

    verEmergencia = async (e) => {
        console.log(e.currentTarget.dataset.id);
        this.setState({ idModificar: e.currentTarget.dataset.id });
        this.manejadorModals(e)
    }

    render() {

        let emergencias;
        if (this.state.emergencias && this.state.emergencias.length !== 0) {
            emergencias = this.state.emergencias.map((emergencia, index) =>
                <tr className="elemento">
                    <td>
                        <span>{moment(emergencia.fecha).utc().format("DD-MM-YYYY")}</span>
                        <span>{emergencia.hora}</span>
                    </td>
                    <td>{emergencia.turno}</td>
                    <td>{emergencia.hito}</td>
                    <td className="acciones">
                        <span><button onClick={this.verEmergencia} data-objetivo="VerEmergencia" data-id={emergencia._id}><Ojo /></button></span>
                        {/* <span><button onClick={this.modificarEmergencia} data-objetivo="ModificarEmergencia" data-id={emergencia._id}><Edit /></button></span> */}
                        <span><button onClick={this.eliminarEmergencia} data-id={emergencia._id}><Basurero /></button></span>
                    </td>
                </tr>
            )
        } else {
            emergencias = <tr className="elemento" >
                <td colSpan="4">
                    No se han registrado emergencias aun
                </td>
            </tr>
        }
        let paginacion = funciones.paginacion(this.state.paginas, this.state.pagina, this.paginar);

        return (
            <Fragment>
                <div className="principal menu-lista-dashboard">
                    <div>
                        <h2 className="verde"><Link to="/residuos/emergencias/"> <Bverderev /></Link> Gestion de Residuos /  <strong>Emergencias</strong></h2>
                    </div>
                </div>
                <div className="principal menu-lista-dashboard">
                    <div>
                        <div className="prehead">
                            <h3 className="tituloencuesta verde">Emergencias Residuos</h3>
                            <button className="ml" onClick={this.manejadorModals} data-objetivo="AgregarEmergencia">+ Nuevo Hito Emergencia</button>
                        </div>
                        <table className="listado-simple tabla">
                            <thead>
                                <th>Fecha / hora</th>
                                <th>OR</th>
                                <th>Hito emergencia</th>
                                <th>Acciones</th>
                            </thead>
                            <tbody>
                                {emergencias}
                            </tbody>
                        </table>
                    </div>
                    <div>
                        <ul className="paginador">
                            {paginacion}
                        </ul>
                    </div>
                </div>
                <div id="modales">
                    <Modal
                        name="AgregarEmergencia"  //nombre del estado que controla el modal
                        show={this.state.showAgregarEmergencia} //indicamos la propiedad show con el estado que controlara al modal
                        contenido={<AgregarEmergencia />} //entregamos el componente que se renderizara en el modal 
                        toogleModal={this.manejadorModals} //traspasamos la funcion que permitira abrir y cerrar el modal
                        actualizaLista={this.obtenerEmergencias}
                    />
                    <Modal
                        name="ModificarEmergencia"  //nombre del estado que controla el modal
                        show={this.state.showModificarEmergencia} //indicamos la propiedad show con el estado que controlara al modal
                        contenido={<ModificarEmergencia />} //entregamos el componente que se renderizara en el modal 
                        toogleModal={this.manejadorModals} //traspasamos la funcion que permitira abrir y cerrar el modal
                        id={this.state.idModificar}
                    />
                    <Modal
                        name="VerEmergencia"  //nombre del estado que controla el modal
                        show={this.state.showVerEmergencia} //indicamos la propiedad show con el estado que controlara al modal
                        contenido={<VerEmergencia />} //entregamos el componente que se renderizara en el modal 
                        toogleModal={this.manejadorModals} //traspasamos la funcion que permitira abrir y cerrar el modal
                        id={this.state.idModificar}
                    />

                </div>
            </Fragment>
        );
    }
}