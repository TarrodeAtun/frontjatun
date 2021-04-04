// importaciones de bibliotecas 
import React, { Component } from "react";
import { autenticacion } from '../../../servicios/autenticacion';
import { Link } from 'react-router-dom';
import Axios from '../../../helpers/axiosconf';
import { authHeader } from '../../../helpers/auth-header';
import { handleResponse } from '../../../helpers/manejador';

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

export default class ResultadosEncuestas extends Component {
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
        const res = Axios.get('/api/bienestar/encuestas', { headers: authHeader() }) //se envia peticion axios con el token sesion guardado en local storage como cabecera
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
            items = this.state.encuestas.map((encuesta, index) =>
                <tr key={index} className="elemento">
                    <td>{encuesta.nombre}</td>
                    <td></td>
                    <td className="acciones ml">
                        <Link to={`/bienestar/encuestas/ver-resultados/${encuesta._id}`}><img src={ojo} /></Link>
                        <button onClick={this.eliminarEncuesta} data-id={encuesta._id}><img src={basurero} /></button>
                    </td>
                </tr>
            )
        }

        return (
            <div className="principal menu-lista-dashboard">
                <div>
                    <h2 className="naranjo"><Link to="/bienestar/encuestas"> <Bamarillorev /></Link> Encuestas / <strong>ResultadosEncuestas</strong></h2>
                </div>
                <table className="listado-simple tabla">
                    <thead>
                      <th>Nombre</th>
                      <th>N° Contestadas</th>
                      <th>Acciones</th>
                    </thead>
                    <tbody>
                        {items}
                    </tbody>
                </table>
            </div>
        );
    }
}