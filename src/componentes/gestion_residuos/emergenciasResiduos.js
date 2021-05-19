// importaciones de bibliotecas 
import React, { Component, Fragment } from "react";
import { autenticacion } from '../../servicios/autenticacion';
import { Link } from 'react-router-dom';
import Axios from '../../helpers/axiosconf';
import { authHeader } from '../../helpers/auth-header';
import { handleResponse } from '../../helpers/manejador';

// importaciones de estilos 
import '../../styles/fichaTrabajador.css';

import AgregarEmergencia from './crearEmergenciaResiduos';
import ModificarEmergencia from './modificarEmergenciaResiduos';

import Modal from '../includes/modal';
import { toogleModalCore } from '../includes/funciones';
import moment from 'moment';


// importaciones de iconos 
import { ReactComponent as Edit } from "../../assets/iconos/edit.svg";
import { ReactComponent as Ojo } from "../../assets/iconos/ojo.svg";
import { ReactComponent as Basurero } from "../../assets/iconos/basurero.svg";
import { ReactComponent as Bverderev } from "../../assets/iconos/bverderev.svg";
import { ReactComponent as Flechaver } from "../../assets/iconos/flechaver.svg";

export default class EmergenciasResiduos extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentUser: autenticacion.currentUserValue,
            datosUsuarios: "",
            users: null,
            showAgregarEmergencia: '',
            showModificarEmergencia: '',
            idModificar:''
        };
    }

    toogleModal = toogleModalCore; 

    manejadorModals = (e, res) => {
        this.toogleModal(e, res);
    }

    async componentDidMount() {
        var componente = this;
        var { id } = this.props.match.params;
        this.setState({ idCliente: id });
        const res = Axios.get('/api/gestion-residuos/emergencias/residuos/', { headers: authHeader() }) //se envia peticion axios con el token sesion guardado en local storage como cabecera
            .then(function (res) {
                componente.setState({
                    emergencias: res.data.data
                });  //almacenamos el listado de usuarios en el estado usuarios (array)
            })
            .catch(function (err) { //en el caso de que se ocurra un error, axios lo atrapa y procesa
                handleResponse(err.response);  //invocamos al manejador para ver el tipo de error y ejecutar la accion pertinente
                return;
            });
    }

    modificarEmergencia = async (e) => {
        console.log(e.currentTarget.dataset.id);
        this.setState({idModificar:e.currentTarget.dataset.id});
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
                        <span><Link to={`/residuos/emergencias/residuos/ver/${emergencia._id}`}><Ojo /></Link></span>
                        <span><button onClick={this.modificarEmergencia} data-objetivo="ModificarEmergencia" data-id={emergencia._id}><Edit /></button></span>
                        <span><Link ><Basurero /></Link></span>
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
                </div>
                <div id="modales">
                    <Modal
                        name="AgregarEmergencia"  //nombre del estado que controla el modal
                        show={this.state.showAgregarEmergencia} //indicamos la propiedad show con el estado que controlara al modal
                        contenido={<AgregarEmergencia />} //entregamos el componente que se renderizara en el modal 
                        toogleModal={this.manejadorModals} //traspasamos la funcion que permitira abrir y cerrar el modal
                        agregaPregunta={this.agregaPregunta}
                    />
                    <Modal
                        name="ModificarEmergencia"  //nombre del estado que controla el modal
                        show={this.state.showModificarEmergencia} //indicamos la propiedad show con el estado que controlara al modal
                        contenido={<ModificarEmergencia />} //entregamos el componente que se renderizara en el modal 
                        toogleModal={this.manejadorModals} //traspasamos la funcion que permitira abrir y cerrar el modal
                        id={this.state.idModificar}
                    />
                   
                </div>
            </Fragment>
        );
    }
}