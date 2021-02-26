//importaciones de bibliotecas
import React, { Component } from "react";
import { autenticacion } from '../../servicios/autenticacion';
import { Link } from 'react-router-dom';
import Axios from '../../helpers/axiosconf';
import { authHeader } from '../../helpers/auth-header';
import { handleResponse } from '../../helpers/manejador';

import '../../styles/listarTrabajadores.css';


// importaciones de iconos 
import { ReactComponent as Bamarillorev } from "../../assets/iconos/bamarillorev.svg";
import { ReactComponent as Basurero } from "../../assets/iconos/basurero.svg";
import { ReactComponent as Ojo } from "../../assets/iconos/ojo.svg";
import { ReactComponent as Descarga } from "../../assets/iconos/descarga.svg";


//importamos manejadores de modal
import Modal from '../includes/modal';
import { toogleModalCore } from '../includes/funciones';


export default class ListarTrabajadores extends Component {



    constructor(props) {
        super(props);

        this.state = {
            trabajadores: [],
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

    obtenerTrabajadores = async () => { //genera una peticion get por axios a la api de usuarios
        var componente = this;
        const res = Axios.get('/api/users', { headers: authHeader() }) //se envia peticion axios con el token sesion guardado en local storage como cabecera
            .then(function (res) {   //si la peticion es satisfactoria entonces
                componente.setState({ trabajadores: res.data.data });  //almacenamos el listado de usuarios en el estado usuarios (array)
            })
            .catch(function (err) { //en el caso de que se ocurra un error, axios lo atrapa y procesa
                handleResponse(err.response);  //invocamos al manejador para ver el tipo de error y ejecutar la accion pertinente
                return;
            });
    }

    async componentDidMount() {
        await this.obtenerTrabajadores();
    }
    async componentWillUnmount() {

    }

    render() {
        return (
            <div className="principal" id="component-listar-trabajadores">
                <div>
                    <h2 className="naranjo"><Link to="/personas/gestion"> <Bamarillorev /> </Link> Gestión de Personas <strong>/ Trabajadores</strong></h2>
                </div>
                <div className="filtros">
                    <div className="sup">
                        <button>Filtros</button>
                        <Link to="/personas/crear-trabajador">Crear Trabajador</Link>
                    </div>
                    <div>
                        <form>
                            <div className="form-group justify-center">
                                <input className="input-generico" placeholder="Nombre o Rut" />
                                <select className="input-generico">
                                    <option>Centro de costos</option>
                                </select>
                                <select className="input-generico">
                                    <option>Estado de contrato</option>
                                </select>
                            </div>
                            <div className="form-group buttons">
                                <button className="boton-generico btazul" type="button">Filtrar</button>
                                <button className="boton-generico btblanco" type="button">Limpiar</button>
                            </div>
                        </form>
                    </div>
                </div>
                <div className="listado">
                    <table>
                        <thead>
                            <th>Trabajador</th>
                            <th>Rut</th>
                            <th>Contrato</th>
                            <th>Centro Costos</th>
                            <th>Acciones Ficha</th>
                        </thead>
                        <tbody>
                            {
                                this.state.trabajadores.map(usuario => (
                                    <tr key={usuario._id}>
                                        <td>{usuario.nombre}  {usuario.apellido}</td>
                                        <td className="rut">{usuario.rut}</td>
                                        <td className="vigente">Vigente</td>
                                        <td className="centro">Proyecto 1</td>
                                        <td className="acciones">
                                            <span className="incompleto">80%</span>
                                            <span><Link to={`/personas/perfil/${usuario._id}`}><Ojo /></Link></span>
                                            <span><Link ><Basurero /></Link></span>
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

