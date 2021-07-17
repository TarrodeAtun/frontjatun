// importaciones de bibliotecas 
import React, { Component } from "react";
import { autenticacion } from '../../servicios/autenticacion';
import { Link } from 'react-router-dom';
import Axios from '../../helpers/axiosconf';
import { authHeader } from '../../helpers/auth-header';
import { handleResponse } from '../../helpers/manejador';
import { funciones } from '../../servicios/funciones';

// importaciones de estilos 
import '../../styles/fichaTrabajador.css';

import edit from "../../assets/iconos/edit.svg";
import ojo from "../../assets/iconos/ojo.svg";
import basurero from "../../assets/iconos/basurero.svg";


// importaciones de iconos 
import { ReactComponent as Bamarillorev } from "../../assets/iconos/bamarillorev.svg";
import { ReactComponent as Flechaam } from "../../assets/iconos/flechaam.svg";
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

    async componentDidMount() {
        await this.obtenerEncuestas();
        console.log(this.state.encuestas);
    }

    paginacion = funciones.paginacion;
    paginar = async (e) => {
        console.log(e.currentTarget.dataset.pag);
        await this.setState({ pagina: e.currentTarget.dataset.pag })
        this.obtenerEncuestas();
    }

    obtenerEncuestas = async () => { //genera una peticion get por axios a la api de usuarios
        var componente = this;
        const res = Axios.post('/api/bienestar/mis-encuestas', { rut: autenticacion.currentUserValue.data.usuariobd.rut, pagina: this.state.pagina }, { headers: authHeader() }) //se envia peticion axios con el token sesion guardado en local storage como cabecera
            .then(function (res) {   //si la peticion es satisfactoria entonces
                console.log(res.data.data);
                componente.setState({ encuestas: res.data.data, paginas: res.data.paginas });  //almacenamos el listado de usuarios en el estado usuarios (array)
            })
            .catch(function (err) { //en el caso de que se ocurra un error, axios lo atrapa y procesa
                handleResponse(err.response);  //invocamos al manejador para ver el tipo de error y ejecutar la accion pertinente
                return;
            });
    }


    render() {
        let componente = this;
        let items;
        if (this.state.encuestas) {
            if (this.state.encuestas.length > 0) {
                items = this.state.encuestas.map((encuesta, index) => {
                    var respondido = false;
                    encuesta.trabajadores.find(function (value, index) {
                        if (value.rut === componente.state.currentUser.data.usuariobd.rut) {
                            console.log("iguales");
                            if (value.estado === 1) {
                                respondido = true;
                            }
                        }
                    });
                    return (<div key={index} className="elemento elemento-encuestas">
                        <span className="encuestas-nombre">{encuesta.nombre}</span>
                        <div className="acciones ml">
                            {respondido === true &&
                                <Link className="regular link" to={`/perfil/ficha-personal/encuestas/ver-encuesta/${encuesta._id}`}>Ver</Link>
                            }
                            {respondido === false &&
                                <Link className="regular link" to={`/perfil/ficha-personal/encuestas/contestar-encuesta/${encuesta._id}`}>Responder</Link>
                            }

                            {/* <Link to={`/bienestar/encuestas/editar-encuesta/${encuesta._id}`}><img src={edit} /></Link> */}
                            {/* <button onClick={this.eliminarEncuesta} data-id={encuesta._id}><img src={basurero} /></button> */}
                        </div>
                    </div>)
                })
            } else {
                items = <div className="elemento">
                    <span>No hay encuestas disponibles para responder</span>
                </div>
            }
        }
        let paginacion = funciones.paginacion(this.state.paginas, this.state.pagina, this.paginar);
        return (
            <div className="principal menu-lista-dashboard">
                <div>
                    <h2 className="naranjo"><Link to="/perfil/ficha-personal"> <Bamarillorev /></Link> Encuestas / <strong>Mis Encuestas</strong></h2>
                </div>
                <div className="listado-simple">
                    <div className="encabezado">
                        <h3 className="amarillo">Mis Encuestas</h3>
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