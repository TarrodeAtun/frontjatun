// importaciones de bibliotecas 
import React, { Component } from "react";
import { autenticacion } from '../../servicios/autenticacion';
import { Link } from 'react-router-dom';
import Axios from '../../helpers/axiosconf';
import { authHeader } from '../../helpers/auth-header';
import { handleResponse } from '../../helpers/manejador';

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
            encuestas: []
        };
    }

    async componentDidMount() {
        await this.obtenerEncuestas();
        console.log(this.state.encuestas);
    }

    obtenerEncuestas = async () => { //genera una peticion get por axios a la api de usuarios
        var componente = this;
        const res = Axios.post('/api/bienestar/mis-encuestas', { rut: autenticacion.currentUserValue.data.usuariobd.rut }, { headers: authHeader() }) //se envia peticion axios con el token sesion guardado en local storage como cabecera
            .then(function (res) {   //si la peticion es satisfactoria entonces
                console.log(res.data.data);
                componente.setState({ encuestas: res.data.data });  //almacenamos el listado de usuarios en el estado usuarios (array)
            })
            .catch(function (err) { //en el caso de que se ocurra un error, axios lo atrapa y procesa
                handleResponse(err.response);  //invocamos al manejador para ver el tipo de error y ejecutar la accion pertinente
                return;
            });
    }
    eliminarEncuesta = async (e) => {
        var componente = this;
        var id = e.currentTarget.dataset.id;
        await Axios.post('/api/bienestar/encuestas/delete/', {
            id: id
        }, { headers: authHeader() })
            .then(respuesta => {
                toast.success(respuesta.mensaje, toastoptions);
                componente.obtenerEncuestas();
                console.log(respuesta);
            });
    }


    render() {
        let items;
        if (this.state.encuestas) {
            if (this.state.encuestas.length > 0) {
                items = this.state.encuestas.map((encuesta, index) =>
                    <div key={index} className="elemento elemento-encuestas">
                        <span className="encuestas-nombre">{encuesta.nombre}</span>
                        <div className="acciones ml">

                            <Link to={`/perfil/ficha-personal/encuestas/contestar-encuesta/${encuesta._id}`}><img src={ojo} /></Link>
                            {/* <Link to={`/bienestar/encuestas/editar-encuesta/${encuesta._id}`}><img src={edit} /></Link> */}
                            {/* <button onClick={this.eliminarEncuesta} data-id={encuesta._id}><img src={basurero} /></button> */}
                        </div>
                    </div>
                )
            } else {
                items = <div className="elemento">
                    <span>No hay encuestas disponibles para responder</span>
                </div>
            }
        }

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
            </div>
        );
    }
}