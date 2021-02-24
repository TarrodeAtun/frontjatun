import React, { Component } from 'react'
import axios from 'axios'
import '../../styles/listarUsuarios.css'
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

//manejadores
import { authHeader } from '../../helpers/auth-header';
import { handleResponse } from '../../helpers/manejador';

//componentes
import Filtro from './filtro';
import CrearUsuario from './crearUsuario';
import Modal from '../includes/modal';

export default class listarUsuarios extends Component {

    state = {
        usuarios: [],
        showcrearusuario: false,
        modUsuario: ''
    }

    toogleModal = (e, res = null) => {  //funcion para manejar la apertura y cerrado del componente modal, puede haber mas de un modal renderizado a la vez... o eso espero.
        var modal = '';
        if (e !== null) {
            var objetivo = e.target.dataset.objetivo;
            modal = "show" + objetivo;
        } else {
            modal = "show" + res;
        }
        if (this.state[modal]) {
            this.setState({ [modal]: false });
        } else {
            this.setState({ [modal]: true });
        }
    }

    obtenerUsuarios = async () => { //genera una peticion get por axios a la api de usuarios
        var componente = this;
        const res =  axios.get('http://localhost:4000/api/users', { headers: authHeader() }) //se envia peticion axios con el token sesion guardado en local storage como cabecera
        .then(function(res){   //si la peticion es satisfactoria entonces
            componente.setState({ usuarios: res.data.data });  //almacenamos el listado de usuarios en el estado usuarios (array)
        })
        .catch(function(err){ //en el caso de que se ocurra un error, axios lo atrapa y procesa
            handleResponse(err.response);  //invocamos al manejador para ver el tipo de error y ejecutar la accion pertinente
            return;
        });
    }

    eliminarUsuario = (id) => {
        confirmAlert({
            customUI: ({ onClose }) => {
                return (
                    <div className='custom-ui'>
                        <h1>¿Estas seguro de eliminar este usuario?</h1>
                        <p>No habra vuelta atras</p>
                        <button onClick={onClose}>No</button>
                        <button
                            onClick={async () => {
                                var componente = this;
                                const res = await axios.delete('http://localhost:4000/api/users/' + id, {headers: authHeader()})
                                .then(componente.obtenerUsuarios())
                                .catch(function(err){ //en el caso de que se ocurra un error, axios lo atrapa y procesa
                                    handleResponse(err.response);  //invocamos al manejador para ver el tipo de error y ejecutar la accion pertinente
                                })
                                .then(onClose());
                            }
                        }
                        >Si, Eliminar
                        </button>
                    </div>
                );
            }
        });
    }

    modificarUsuario = async (id) => {
        await this.setState({ modUsuario: id });
        this.toogleModal();
    }

    async componentDidMount() { //al montar el componente se cargará la funcion que llama a los usuarios
        await this.obtenerUsuarios();
    }

    render() {
        return (
            <div className="contenedor">

                <div className="barrita">
                    <Filtro toogleModal={this.toogleModal} />
                </div>
                <div>
                    <table>
                        <thead>
                            <th>nombre</th>
                            <th>apellido</th>
                            <th>edad</th>
                        </thead>
                        <tbody>
                            {
                                this.state.usuarios.map(usuario => ( //recorremos el array almacenado en el estado usuarios
                                    <tr key={usuario._id}  >
                                        <td>{usuario.nombre}</td>
                                        <td>{usuario.apellido}</td>
                                        <td>{usuario.edad}</td>
                                        <td className="acciones">
                                            <button type="button"
                                                onClick={() => this.eliminarUsuario(usuario._id)}>
                                                Eliminar
                                            </button>
                                            <button type="button"
                                                onClick={() => this.modificarUsuario(usuario._id)}
                                                data-objetivo="modificarUsuario"
                                            >
                                                Modificar
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
                <div id="modales">
                    <Modal
                        name="crearusuario"  //nombre del estado que controla el modal
                        show={this.state.showcrearusuario} //indicamos la propiedad show con el estado que controlara al modal
                        contenido={<CrearUsuario obtenerUsuarios={this.obtenerUsuarios} />} //entregamos el componente que se renderizara en el modal 
                        toogleModal={this.toogleModal} //traspasamos la funcion que permitira abrir y cerrar el modal
                    />
                    <Modal
                        name="modificarUsuario"  //nombre del estado que controla el modal
                        show={this.state.showcrearusuario} //indicamos la propiedad show con el estado que controlara al modal
                        contenido={<CrearUsuario obtenerUsuarios={this.obtenerUsuarios} />} //entregamos el componente que se renderizara en el modal 
                    //toogleModal={this.toogleModal} //traspasamos la funcion que permitira abrir y cerrar el modal
                    //idUsuario ={this.state.modUsuario}
                    />
                </div>
            </div>
        )
    }
}
