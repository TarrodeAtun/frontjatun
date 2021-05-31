//importaciones de bibliotecas
import React, { Component } from "react";
import { autenticacion } from '../../servicios/autenticacion';
import { Link } from 'react-router-dom';
import Axios from '../../helpers/axiosconf';
import { authHeader } from '../../helpers/auth-header';
import { handleResponse } from '../../helpers/manejador';
import { funciones } from '../../servicios/funciones';
import moment from 'moment';

import Modal from '../includes/modal';
import { toogleModalCore } from '../includes/funciones';
import ModalFoto from '../modalFoto';

import '../../styles/listarTrabajadores.css';


// importaciones de iconos 
import { ReactComponent as Bcelesterev } from "../../assets/iconos/bcelesterev.svg";
import { ReactComponent as Basurero } from "../../assets/iconos/basurero.svg";
import { ReactComponent as Ojo } from "../../assets/iconos/ojo.svg";
import { ReactComponent as Descarga } from "../../assets/iconos/descarga.svg";
import { ReactComponent as Flechaam } from "../../assets/iconos/flechaam.svg";
import { ReactComponent as Plus } from "../../assets/iconos/X.svg";



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
            currentUser: autenticacion.currentUserValue,
            datosUsuario: "",
            registros: [],
            imgload:'',
            showModalFoto:false

        };
    }

    toogleModal = toogleModalCore; //copiamos la funcion modal a una funcion local

    manejadorModals = (e, res) => {
        this.toogleModal(e, res);
    }

    registrosGraficos = async () => {
        var componente = this;
        await Axios.get('/api/users/worker/turnos/registros/' + autenticacion.currentUserValue.data.usuariobd.rut, { headers: authHeader() }) //se envia peticion axios con el token sesion guardado en local storage como cabecera
            .then(function (res) {   //si la peticion es satisfactoria entonces
                componente.setState({ registros: res.data.data });
            })
            .catch(function (err) { //en el caso de que se ocurra un error, axios lo atrapa y procesa
                // handleResponse(err.response);  //invocamos al manejador para ver el tipo de error y ejecutar la accion pertinente
                return;
            });
    }
    abreImagen = async (e) =>{
        console.log(e.currentTarget.dataset.url);
        await this.setState({imgload:e.currentTarget.dataset.url, showModalFoto:true});
    }

    async componentDidMount() {
        await this.registrosGraficos();
    }

    render() {

        let registros;
        if (this.state.registros.length > 0) {
            registros = this.state.registros.map(registro => {
                var url = '';
                registro.imagen.forEach(archivo => {
                    if (archivo.input === "fotoGrupal") {
                        url = archivo.url;
                    }
                });
                return (<tr>
                    <td className="columna">
                        <span>{moment(registro.fecha).utc().format("DD/MM/YYYY")}</span>
                        <span>{registro.inicio} - {registro.termino}</span>

                    </td>
                    <td className="columna">
                        <span>{registro.datosServicio.nombre}</span>
                        <span>{registro.datosSectores.nombre}</span>
                    </td>
                    <td className="acciones">
                        <span onClick={this.abreImagen} data-url={url}><Ojo /></span>
                    </td>
                </tr>)
            })
        } else {
            <tr><td colSpan="3">No hay turnos registrados para esta fecha</td></tr>
        }

        return (
            <div className="principal" id="component-listar-trabajadores">
                <div>
                    <h2 className="celeste"><Link to="/perfil/ficha-personal"> <Bcelesterev /> </Link> Ficha Personal <strong>/ Registros Gráficos</strong></h2>
                </div>
                <div className="filtros">
                    <div className="sup">
                        <button>Filtros</button>
                    </div>
                    <div>
                        <form>
                            <div className="form-group justify-center">
                                <input type="date" className="input-generico" placeholder="Nombre o Rut" />
                                <button className="boton-generico btazul" type="button">Filtrar</button>
                                <button className="boton-generico btblanco" type="button">Limpiar</button>
                            </div>
                        </form>
                    </div>
                </div>
                <div className="listado">
                    <table>
                        <thead>
                            <th>Fecha / Jornada</th>
                            <th>Servicio / Sector</th>
                            <th>Foto Turno</th>
                        </thead>
                        <tbody>
                            {registros}
                        </tbody>
                    </table>
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

