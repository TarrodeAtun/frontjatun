// importaciones de bibliotecas 
import React, { Component } from "react";
import { autenticacion } from '../../../servicios/autenticacion';
import { Link } from 'react-router-dom';
import Axios from '../../../helpers/axiosconf';
import { authHeader } from '../../../helpers/auth-header';
import { handleResponse } from '../../../helpers/manejador';
import { funciones } from '../../../servicios/funciones';
import { confirmAlert } from 'react-confirm-alert';

// importaciones de estilos 
import '../../../styles/fichaTrabajador.css';

import edit from "../../../assets/iconos/edit.svg";
import ojo from "../../../assets/iconos/ojo.svg";
import basurero from "../../../assets/iconos/basurero.svg";


// importaciones de iconos 
import { ReactComponent as Bamarillorev } from "../../../assets/iconos/bamarillorev.svg";
import { ReactComponent as Flechaam } from "../../../assets/iconos/flechaam.svg";
import { async } from "rxjs";
import { toast } from "react-toastify";

const toastoptions = {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
}

export default class MisEncuestas extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentUser: autenticacion.currentUserValue,
            datosUsuarios: "",
            encuestas: [],

            pagina: 1,
            paginas: '',

        };
    }


    paginacion = funciones.paginacion;
    paginar = async (e) => {
        console.log(e.currentTarget.dataset.pag);
        await this.setState({ pagina: e.currentTarget.dataset.pag })
        this.obtenerEncuestas();
    }

    async componentDidMount() {
        await this.obtenerEncuestas();
        console.log(this.state.encuestas);
    }

    obtenerEncuestas = async () => { //genera una peticion get por axios a la api de usuarios
        var componente = this;
        const res = Axios.post('/api/bienestar/encuestas', {pagina: this.state.pagina}, { headers: authHeader() }) //se envia peticion axios con el token sesion guardado en local storage como cabecera
            .then(function (res) {   //si la peticion es satisfactoria entonces
                console.log(res.data.data);
                componente.setState({ encuestas: res.data.data, paginas: res.data.paginas });  //almacenamos el listado de usuarios en el estado usuarios (array)
            })
            .catch(function (err) { //en el caso de que se ocurra un error, axios lo atrapa y procesa
                handleResponse(err.response);  //invocamos al manejador para ver el tipo de error y ejecutar la accion pertinente
                return;
            });
    }
    eliminarEncuesta = async (e) => {
        let componente = this;
        confirmAlert({
            customUI: ({ onClose }) => {
                return (
                    <div className='custom-confirm '>
                        <p>¿Estas seguro de eliminar la encuesta, los datos no se pueden recuperar?</p>
                        <button className="boton-generico btazulalt" onClick={onClose}>Cancelar</button>
                        <button className="boton-generico btazul"
                            onClick={async () => {
                                var id = e.currentTarget.dataset.id;
                                await Axios.post('/api/bienestar/encuestas/delete/', {
                                    id: id
                                }, { headers: authHeader() })
                                    .then(respuesta => {
                                        toast.success(respuesta.mensaje, toastoptions);
                                        componente.obtenerEncuestas();
                                        console.log(respuesta);
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


    render() {
        let items;
        if (this.state.encuestas) {
            if (this.state.encuestas.length > 0) {
                items = this.state.encuestas.map((encuesta, index) =>
                    <div key={index} className="elemento">
                        <span>{encuesta.nombre}</span>
                        <div className="acciones ml">
                            {/* <Link to={`/bienestar/encuestas/contestar-encuesta/${encuesta._id}`}><img src={ojo} /></Link> */}
                            <Link to={`/bienestar/encuestas/editar-encuesta/${encuesta._id}`}><img src={edit} /></Link>
                            <button onClick={this.eliminarEncuesta} data-id={encuesta._id}><img src={basurero} /></button>
                        </div>
                    </div>
                )
            } else {
                items = <div className="elemento">
                <span>No hay encuestas creadas</span>
            </div>
            }
        }
        let paginacion = funciones.paginacion(this.state.paginas, this.state.pagina, this.paginar);
        return (
            <div className="principal menu-lista-dashboard">
                <div>
                    <h2 className="naranjo"><Link to="/bienestar/encuestas"> <Bamarillorev /></Link> Encuestas / <strong>Mis Encuestas</strong></h2>
                </div>
                <div className="listado-simple">
                    <div className="encabezado">
                        <h3 className="amarillo">Mis Encuestas</h3>
                        <Link to="/bienestar/encuestas/nueva-encuesta" className="ml">+ Nueva Encuesta</Link>
                    </div>
                    <div className="elementos">
                        {items}
                    </div>
                </div>
                <div>
                    <ul className="paginador">
                        {paginacion}
                    </ul>
                </div>
            </div>
        );
    }
}