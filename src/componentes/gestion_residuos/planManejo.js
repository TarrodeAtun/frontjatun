// importaciones de bibliotecas 
import React, { Component } from "react";
import { autenticacion } from '../../servicios/autenticacion';
import { Link } from 'react-router-dom';
import { confirmAlert } from 'react-confirm-alert';
import Axios from '../../helpers/axiosconf';
import { authHeader } from '../../helpers/auth-header';
import { handleResponse } from '../../helpers/manejador';
import { historial } from "../../helpers/historial";

// importaciones de estilos 
import '../../styles/fichaTrabajador.css';


// importaciones de iconos 
import fichaper from "../../assets/iconos/fichaper.svg";
import turnos from "../../assets/iconos/turnos.svg";
import { ReactComponent as Bverderev } from "../../assets/iconos/bverderev.svg";
import { ReactComponent as Flechaver } from "../../assets/iconos/flechaver.svg";
// importaciones de iconos 

import { ReactComponent as Bamarillorev } from "../../assets/iconos/bamarillorev.svg";
import { ReactComponent as Basurero } from "../../assets/iconos/basurero.svg";
import { ReactComponent as Ojo } from "../../assets/iconos/ojo.svg";
import { ReactComponent as Descarga } from "../../assets/iconos/descarga.svg";
import { ReactComponent as Plus } from "../../assets/iconos/X.svg";

export default class GestionResiduos extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentUser: autenticacion.currentUserValue,
            datosUsuarios: "",
            users: null
        };
    }
    componentDidMount = () => {
        this.obtenerClientes();
    }
    obtenerClientes = async () => { //genera una peticion get por axios a la api de usuarios
        var componente = this;
        const res = Axios.get('/api/generales/clientes/', { headers: authHeader() }) //se envia peticion axios con el token sesion guardado en local storage como cabecera
            .then(function (res) {   //si la peticion es satisfactoria entonces
                componente.setState({ clientes: res.data.data });  //almacenamos el listado de usuarios en el estado usuarios (array)
            })
            .catch(function (err) { //en el caso de que se ocurra un error, axios lo atrapa y procesa
                handleResponse(err.response);  //invocamos al manejador para ver el tipo de error y ejecutar la accion pertinente
                return;
            });
    }
    render() {

        let clientes;
        if (this.state.clientes) {
            clientes = this.state.clientes.map((cliente, index) =>
                <div className="seccion">
                    <h3><Link to={`/residuos/plan-manejo-cliente/${cliente._id}`}><span>{cliente.nombre}</span><button><Flechaver /></button></Link></h3>
                </div>

            )
        }

        return (
            <div className="principal gestion-personas menu-lista-dashboard" id="component-listar-trabajadores">
                <div>
                    <h2 className="verde"><Link to="/residuos/gestion"> <Bverderev /></Link> <span className="verde">Gestion de Residuos / </span> <strong>Plan Manejo de Residuos</strong></h2>
                </div>
                <div className="filtros">
                    <div className="sup">
                        <button>Filtros</button>
                        <Link className="fix" to=""><Plus /> Crear Plan</Link>
                    </div>
                    <div>
                        <form>
                            <div className="form-group justify-center filtros-or">
                                <select className="input-generico">
                                    <option>Cliente</option>
                                    <option>Cliente1</option>
                                    <option>Cliente2</option>
                                </select>
                                <button className="boton-generico btazul" type="button">Filtrar</button>
                                <button className="boton-generico btblanco" type="button">Limpiar</button>
                            </div>
                        </form>
                    </div>
                </div>
                <div className="fichaPerfil">
                   {clientes}
                </div>
            </div>

        );
    }
}