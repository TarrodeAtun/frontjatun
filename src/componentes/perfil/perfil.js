//importaciones de bibliotecas
import React, { Component } from "react";
import { autenticacion } from '../../servicios/autenticacion';
import { Link } from 'react-router-dom';
import Axios  from '../../helpers/axiosconf';
import { authHeader } from '../../helpers/auth-header';
import { handleResponse } from '../../helpers/manejador';

//importaciones de componentes
import Basicos from './editarBasicos';
import Password from './cambiarContraseña';
import Emergencias from './cambiarEmergencia';

// importaciones de iconos 
import imagen from "../../assets/persona.svg";
import { ReactComponent as Bcelesterev } from "../../assets/iconos/bcelesterev.svg";
import edit from "../../assets/iconos/edit.svg";

import fichaper from "../../assets/iconos/fichaper.svg";
import turnos from "../../assets/iconos/turnos.svg";


//importamos manejadores de modal
import Modal from '../includes/modal';
import { toogleModalCore } from '../includes/funciones';

import '../../styles/perfil.css';

export default class Perfil extends Component {

    toogleModal = toogleModalCore; //copiamos la funcion modal a una funcion local

    manejadorModals = (e, res) => { //creamos una funcion que reciba parametros para pasarlo al toogle modal (esta funcion la pasaremos al cuerpo del modal como propiedad para ejecutarse por autoreferencia)
        this.toogleModal(e, res);
    }

    onChangeInput = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    editar = async event => {
        console.log("asd");
        var objetivo = event.currentTarget.dataset.objetivo;
        objetivo = "show" + objetivo;
        if (this.state[objetivo]) {
            this.setState({ [objetivo]: false });
        } else {
            this.setState({ [objetivo]: true });
        }

    }

    constructor(props) {
        super(props);

        this.state = {
            currentUser: autenticacion.currentUserValue,
            datosUsuarios: "",
            users: null,
            showCambiarPass: false,
            showCambiarBasicos: false,
            showCambiarEmergencias: false,

            formEmail: '',
            formTelefono: '',

            formContacto: '',
            formParentesco: '',
            formTelefonoFijo: '',
            formTelefonoMovil: '',
            formDireccion: '',
            formComuna: '',
            formCiudad: ''
        };
    }

    async componentDidMount() {
        console.log(this.state.currentUser.data.usuariobd);
        await this.setState({
            datosUsuarios: this.state.currentUser.data.usuariobd
        });
        await this.setState({
            formEmail: this.state.datosUsuarios.email,
            formTelefono: this.state.datosUsuarios.telefono,
            formContacto: this.state.datosUsuarios.emergencias.contacto,
            formParentesco: this.state.datosUsuarios.emergencias.parentesco,
            formTelefonoFijo: this.state.datosUsuarios.emergencias.telefono1,
            formTelefonoMovil: this.state.datosUsuarios.emergencias.telefono2,
            formDireccion: this.state.datosUsuarios.emergencias.direccion,
            formComuna: this.state.datosUsuarios.emergencias.comuna,
            formCiudad: this.state.datosUsuarios.emergencias.ciudad
        });
    }

    async getRut() {

    }
    async componentWillUnmount() {

    }
    actualizaPerfil = async event => {
        autenticacion.actualizar();
        await this.setState({ currentUser: autenticacion.currentUserValue });
        await this.setState({ datosUsuarios: this.state.currentUser.data.usuariobd });
    }

    actualizaBasicos = async e => {
        e.preventDefault();
        const res = await Axios.put('http://localhost:4000/api/users/worker/basic', {
            id: this.state.currentUser.data.usuariobd._id,
            email: this.state.formEmail,
            telefono: this.state.formTelefono
        }, { headers: authHeader() })
            .then(usuario => {
                localStorage.setItem('usuarioActual', JSON.stringify(usuario));
                this.actualizaPerfil();
                this.setState({ showCambiarBasicos: false });
                //notificacion cambio aqui va
            })
            .catch(function (err) { //en el caso de que se ocurra un error, axios lo atrapa y procesa
                handleResponse(err.response);  //invocamos al manejador para ver el tipo de error y ejecutar la accion pertinente
            });
    }

    actualizaEmergencias = async e => {
        e.preventDefault();
        const res = await Axios.put('http://localhost:4000/api/users/worker/emergency', {
            id: this.state.currentUser.data.usuariobd._id,
            contacto: this.state.formContacto,
            parentesco: this.state.formParentesco,
            telefono1: this.state.formTelefonoFijo,
            telefono2: this.state.formTelefonoMovil,
            direccion: this.state.formDireccion,
            comuna: this.state.formComuna,
            ciudad: this.state.formCiudad
        }, { headers: authHeader() })
            .then(usuario => {
                localStorage.setItem('usuarioActual', JSON.stringify(usuario));
                this.actualizaPerfil();
                this.setState({ showCambiarEmergencias: false });
                //notificacion cambio aqui va
            })
            .catch(function (err) { //en el caso de que se ocurra un error, axios lo atrapa y procesa
                handleResponse(err.response);  //invocamos al manejador para ver el tipo de error y ejecutar la accion pertinente
            });
    }

    render() {
        return (
            <div className="principal" id="component-perfil">
                <div>
                    <h2><Link to="/"> <Bcelesterev /> </Link> Mi Perfil de Usuario</h2>
                    <div className="fichaPerfil">
                        <div className="seccion">
                            <a className="edit-button" onClick={this.editar} data-objetivo="CambiarBasicos"><img src={edit} /></a>
                            <div className="fotoperfil">
                                <img src={imagen} />
                            </div>
                            <div>
                                <span>Nombre</span><span>{this.state.datosUsuarios.nombre}</span>

                            </div>
                            <div>
                                <span>Apellido</span><span>{this.state.datosUsuarios.apellido}</span>
                            </div>
                            <div>
                                <span>Rut</span><span>{this.state.datosUsuarios.rut}</span>
                            </div>
                            <div>
                                <span>Fecha Nacimiento</span><span>{this.state.datosUsuarios.fechaNac}</span>
                            </div>
                            <div>
                                <span>Email</span>
                                {this.state.showCambiarBasicos
                                    ? <span><input className="input-generico" name="formEmail" onChange={this.onChangeInput} value={this.state.formEmail} /></span>
                                    : <span>{this.state.datosUsuarios.email}</span>
                                }
                            </div>
                            <div>
                                <span>Teléfono</span>
                                {this.state.showCambiarBasicos
                                    ? <span><input className="input-generico" name="formTelefono" onChange={this.onChangeInput} value={this.state.formTelefono} /></span>
                                    : <span>{this.state.datosUsuarios.telefono}</span>
                                }
                            </div>
                            <div>
                                <span>Número de hijos</span><span>{this.state.datosUsuarios.hijos}</span>
                            </div>
                            {this.state.showCambiarBasicos &&
                                <div className="form-group buttons">
                                    <button className="boton-generico btazul" onClick={this.actualizaBasicos}>Guardar</button>
                                    <button className="boton-generico btgris" type="button">Cancelar</button>
                                </div>
                            }
                        </div>
                        <div className="seccion">
                            <a className="edit-button" onClick={this.manejadorModals} data-objetivo="CambiarPass"><img src={edit} /></a>
                            <div>
                                <span>Contraseña</span><span>*********</span>
                            </div>
                        </div>
                        {this.state.datosUsuarios.emergencias
                            ?
                            <div className="seccion">
                                <a className="edit-button" onClick={this.manejadorModals} data-objetivo="CambiarEmergencias"><img src={edit} /></a>
                                <h3>Contacto de emergencia</h3>
                                <div>
                                    <span>Nombre Apellido</span>
                                    {this.state.showCambiarEmergencias
                                        ? <span><input className="input-generico" name="formContacto" onChange={this.onChangeInput} value={this.state.formContacto} /></span>
                                        : <span>{this.state.datosUsuarios.emergencias.contacto}</span>
                                    }
                                </div>
                                <div>
                                    <span>Parentesco</span>
                                    {this.state.showCambiarEmergencias
                                        ? <span><input className="input-generico" name="formParentesco" onChange={this.onChangeInput} value={this.state.formParentesco} /></span>
                                        : <span>{this.state.datosUsuarios.emergencias.parentesco}</span>
                                    }
                                </div>
                                <div>
                                    <span>Teléfono 1</span>
                                    {this.state.showCambiarEmergencias
                                        ? <span><input className="input-generico" name="formTelefonoFijo" onChange={this.onChangeInput} value={this.state.formTelefonoFijo} /></span>
                                        : <span>{this.state.datosUsuarios.emergencias.telefono1}</span>
                                    }
                                </div>
                                {this.state.datosUsuarios.emergencias.telefono2
                                    ? <div>
                                        <span>Teléfono 2</span>
                                        {this.state.showCambiarEmergencias
                                            ? <span><input className="input-generico" name="formTelefonoMovil" onChange={this.onChangeInput} value={this.state.formTelefonoMovil} /></span>
                                            : <span>{this.state.datosUsuarios.emergencias.telefono2}</span>
                                        }
                                    </div>
                                    : null
                                }
                                <div>
                                    <span>Dirección</span>
                                    {this.state.showCambiarEmergencias
                                        ? <span><input className="input-generico" name="formDireccion" onChange={this.onChangeInput} value={this.state.formDireccion} /></span>
                                        : <span>{this.state.datosUsuarios.emergencias.direccion}</span>
                                    }
                                </div>
                                <div>
                                    <span>Comuna</span>
                                    {this.state.showCambiarEmergencias
                                        ? <span><input className="input-generico" name="formComuna" onChange={this.onChangeInput} value={this.state.formComuna} /></span>
                                        : <span>{this.state.datosUsuarios.emergencias.comuna}</span>
                                    }
                                </div>
                                <div>
                                    <span>Ciudad</span>
                                    {this.state.showCambiarEmergencias
                                        ? <span><input className="input-generico" name="formCiudad" onChange={this.onChangeInput} value={this.state.formCiudad} /></span>
                                        : <span>{this.state.datosUsuarios.emergencias.ciudad}</span>
                                    }
                                </div>
                                {this.state.showCambiarEmergencias &&
                                <div className="form-group buttons">
                                    <button className="boton-generico btazul" onClick={this.actualizaEmergencias}>Guardar</button>
                                    <button className="boton-generico btgris" type="button">Cancelar</button>
                                </div>
                            }
                            </div>
                            : null
                        }


                        <div className="seccion">
                            <div>
                                <span>Tipo de Perfil</span><span>asdasdasd</span>
                            </div>
                            {this.state.datosUsuarios.puestos
                                ?
                                <div>
                                    <span>Puesto de trabajo</span>
                                    <span>
                                        {this.state.datosUsuarios.puestos.map(puesto => (
                                            <label>{puesto}</label>
                                        ))
                                        }

                                    </span>
                                </div>
                                : null
                            }
                            <div>
                                <span>Centro de costos</span><span>asdasdasd</span>
                            </div>
                        </div>
                        {this.state.datosUsuarios.bancarios
                            ? <div className="seccion">
                                <h3>Cuenta bancaria</h3>
                                <div>
                                    <span>Banco</span><span>{this.state.datosUsuarios.bancarios.banco}</span>
                                </div>
                                <div>
                                    <span>Tipo de Banco</span><span>{this.state.datosUsuarios.bancarios.tipo}</span>
                                </div>
                                <div>
                                    <span>N° de cuenta</span><span>{this.state.datosUsuarios.bancarios.numero}</span>
                                </div>
                            </div>
                            : null
                        }
                    </div>
                    <div className="opciones">
                        <div>
                            <img src={fichaper} />
                            <Link to="/perfil/ficha-personal">Ficha personal</Link>
                        </div>
                        <div>
                            <img src={turnos} />
                            <Link to="/perfil/turnos">Turnos</Link>
                        </div>
                    </div>
                </div>
                <div id="modales">
                    <Modal
                        name="CambiarPass"  //nombre del estado que controla el modal
                        show={this.state.showCambiarPass} //indicamos la propiedad show con el estado que controlara al modal
                        contenido={<Password />} //entregamos el componente que se renderizara en el modal 
                        toogleModal={this.manejadorModals} //traspasamos la funcion que permitira abrir y cerrar el modal

                    />
                    {/* <Modal
                        name="CambiarBasicos"  //nombre del estado que controla el modal
                        show={this.state.showCambiarBasicos} //indicamos la propiedad show con el estado que controlara al modal
                        contenido={<Basicos />} //entregamos el componente que se renderizara en el modal 
                        toogleModal={this.manejadorModals} //traspasamos la funcion que permitira abrir y cerrar el modal
                        funcion={this.actualizaPerfil}
                    /> */}
                    {/* <Modal
                        name="CambiarEmergencias"  //nombre del estado que controla el modal
                        show={this.state.showCambiarEmergencias} //indicamos la propiedad show con el estado que controlara al modal
                        contenido={<Emergencias />} //entregamos el componente que se renderizara en el modal 
                        toogleModal={this.manejadorModals} //traspasamos la funcion que permitira abrir y cerrar el modal
                    /> */}
                </div>
            </div >
        );
    }
}