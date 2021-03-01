//importaciones de bibliotecas
import React, { Component } from "react";
import { autenticacion } from '../../servicios/autenticacion';
import { Link } from 'react-router-dom';
import Axios from '../../helpers/axiosconf';
import { authHeader } from '../../helpers/auth-header';
import { handleResponse } from '../../helpers/manejador';
import moment from 'moment';

//importaciones de componentes
// import Password from './cambiarContraseña';

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
    constructor(props) {
        super(props);
        this.state = {
            currentUser: autenticacion.currentUserValue,
            showModificar: false,
            datosUsuario: "",
            formNombre: '',
            formApellido: '',
            formRut: '',
            formFechanac: '',
            formEmail: '',
            formTelefono: '',
            formHijos: '',
            formContacto: '',
            formParentesco: '',
            formTelefonoFijo: '',
            formTelefonoMovil: '',
            formDireccion: '',
            formComuna: '',
            formCiudad: '',
            formPerfil1: '',
            formPerfil2: '',
            formCargo: '',
            formBanco: '',
            formTipoCuenta: '',
            formNumCuenta: '',
        };
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
    async componentDidMount() {
        this.cargarDatos();
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
    cargarDatos = async e => {
        var componente = this;
        const { id } = this.props.match.params;
        await Axios.get('/api/users/worker/' + id, { headers: authHeader() }) //se envia peticion axios con el token sesion guardado en local storage como cabecera
            .then(function (res) {   //si la peticion es satisfactoria entonces

                componente.setState({ datosUsuario: res.data });  //almacenamos el listado de usuarios en el estado usuarios (array)
            })
            .catch(function (err) { //en el caso de que se ocurra un error, axios lo atrapa y procesa
                // handleResponse(err.response);  //invocamos al manejador para ver el tipo de error y ejecutar la accion pertinente
                return;
            });
        await this.setState({
            formNombre: this.state.datosUsuario.nombre,
            formApellido: this.state.datosUsuario.apellido,
            formRut: this.state.datosUsuario.rut,
            formEmail: this.state.datosUsuario.email,
            formFechanac: moment(this.state.datosUsuario.fechaNac).format('YYYY-MM-DD'),
            formHijos: this.state.datosUsuario.hijos,
            formTelefono: this.state.datosUsuario.telefono,
            formContacto: this.state.datosUsuario.emergencias.contacto,
            formParentesco: this.state.datosUsuario.emergencias.parentesco,
            formTelefonoFijo: this.state.datosUsuario.emergencias.telefono1,
            formTelefonoMovil: this.state.datosUsuario.emergencias.telefono2,
            formDireccion: this.state.datosUsuario.emergencias.direccion,
            formComuna: this.state.datosUsuario.emergencias.comuna,
            formCiudad: this.state.datosUsuario.emergencias.ciudad,
            formPerfil1: this.state.datosUsuario.perfil,
            formPerfil2: this.state.datosUsuario.perfilSec,
            formCargo: this.state.datosUsuario.cargo,
            formBanco: this.state.datosUsuario.bancarios.banco,
            formTipoCuenta: this.state.datosUsuario.bancarios.tipo,
            formNumCuenta: this.state.datosUsuario.bancarios.numero
        });
        console.log(this.state.formFechanac);
        console.log(this.state.datosUsuario);
    }
    actualizaDatos = async e => {
        const { id } = this.props.match.params;
        e.preventDefault();
        const res = await Axios.put('/api/users/worker/update/', {
            id: this.state.currentUser.data.usuariobd._id,
            nombre: this.state.formNombre,
            apellido: this.state.formApellido,
            rut: this.state.formRut,
            fechaNac: this.state.formFechanac,
            email: this.state.formEmail,
            telefono: this.state.formTelefono,
            hijos: this.state.formHijos,
            emergencias: {
                contacto: this.state.formContacto,
                parentesco: this.state.formParentesco,
                telefono1: this.state.formTelefonoFijo,
                telefono2: this.state.formTelefonoMovil,
                direccion: this.state.formDireccion,
                comuna: this.state.formComuna,
                ciudad: this.state.formCiudad
            },
            perfil: this.state.formPerfil1,
            perfilSec: this.state.formPerfil2,
            cargo: this.state.formCargo,
            bancarios: {
                banco: this.state.formBanco,
                tipo: this.state.formTipoCuenta,
                numero: this.state.formNumCuenta
            }
        }, { headers: authHeader() })
            .then(usuario => {
                this.setState({ showModificar: false });
            })
            .catch(function (err) { //en el caso de que se ocurra un error, axios lo atrapa y procesa
                handleResponse(err.response);  //invocamos al manejador para ver el tipo de error y ejecutar la accion pertinente
            });
    }
    render() {
        return (
            <div className="principal" id="component-perfil">
                <div>
                    <h2><Link to="/"> <Bcelesterev /> </Link> perfil del trabajador</h2>
                    <div className="fichaPerfil">
                        <div className="seccion">
                            <a className="edit-button" onClick={this.editar} data-objetivo="Modificar"><img src={edit} /></a>
                            <div className="fotoperfil">
                                <img src={imagen} />
                                {/* {this.state.showModificar
                                ?
                                :
                                } */}
                            </div>
                            <div>
                                <span>Nombre</span>
                                {this.state.showModificar
                                    ? <span><input className="input-generico" name="formNombre" onChange={this.onChangeInput} value={this.state.formNombre} /></span>
                                    : <span>{this.state.formNombre}</span>
                                }
                            </div>
                            <div>
                                <span>Apellidos</span>
                                {this.state.showModificar
                                    ? <span><input className="input-generico" name="formApellido" onChange={this.onChangeInput} value={this.state.formApellido} /></span>
                                    : <span>{this.state.formApellido}</span>
                                }
                            </div>
                            <div>
                                <span>Rut</span>
                                {this.state.showModificar
                                    ? <span><input className="input-generico" name="formRut" onChange={this.onChangeInput} value={this.state.formRut} /></span>
                                    : <span>{this.state.formRut}</span>
                                }
                            </div>
                            <div>
                                <span>Fecha de Nacimiento</span>
                                {this.state.showModificar
                                    ? <span><input className="input-generico" type="date" name="formFechanac" onChange={this.onChangeInput} value={this.state.formFechanac} /></span>
                                    : <span>{this.state.formFechanac}</span>
                                }
                            </div>
                            <div>
                                <span>Email</span>
                                {this.state.showModificar
                                    ? <span><input className="input-generico" name="formEmail" onChange={this.onChangeInput} value={this.state.formEmail} /></span>
                                    : <span>{this.state.formEmail}</span>
                                }
                            </div>
                            <div>
                                <span>Teléfono</span>
                                {this.state.showModificar
                                    ? <span><input className="input-generico" name="formTelefono" onChange={this.onChangeInput} value={this.state.formTelefono} /></span>
                                    : <span>{this.state.formTelefono}</span>
                                }
                            </div>
                            <div>
                                <span>Número de hijos</span>
                                {this.state.showModificar
                                    ? <span><input className="input-generico" name="formHijos" onChange={this.onChangeInput} value={this.state.formHijos} /></span>
                                    : <span>{this.state.formHijos}</span>
                                }</div>
                        </div>
                        {/* <div className="seccion">
                            <a className="edit-button" onClick={this.manejadorModals} data-objetivo="CambiarPass"><img src={edit} /></a>
                            <div>
                                <span>Contraseña</span><span>*********</span>
                            </div>
                        </div> */}

                        <div className="seccion">
                            <h3>Contacto de emergencia</h3>
                            <div>
                                <span>Nombre Apellido</span>
                                {this.state.showModificar
                                    ? <span><input className="input-generico" name="formContacto" onChange={this.onChangeInput} value={this.state.formContacto} /></span>
                                    : <span>{this.state.formContacto}</span>
                                }
                            </div>
                            <div>
                                <span>Parentesco</span>
                                {this.state.showModificar
                                    ? <span><input className="input-generico" name="formParentesco" onChange={this.onChangeInput} value={this.state.formParentesco} /></span>
                                    : <span>{this.state.formParentesco}</span>
                                }
                            </div>
                            <div>
                                <span>Teléfono 1</span>
                                {this.state.showModificar
                                    ? <span><input className="input-generico" name="formTelefonoFijo" onChange={this.onChangeInput} value={this.state.formTelefonoFijo} /></span>
                                    : <span>{this.state.formTelefonoFijo}</span>
                                }
                            </div>
                            <div>
                                <span>Teléfono 2</span>
                                {this.state.showModificar
                                    ? <span><input className="input-generico" name="formTelefonoMovil" onChange={this.onChangeInput} value={this.state.formTelefonoMovil} /></span>
                                    : <span>{this.state.formTelefonoMovil}</span>
                                }
                            </div>
                            <div>
                                <span>Dirección</span>
                                {this.state.showModificar
                                    ? <span><input className="input-generico" name="formDireccion" onChange={this.onChangeInput} value={this.state.formDireccion} /></span>
                                    : <span>{this.state.formDireccion}</span>
                                }
                            </div>
                            <div>
                                <span>Comuna</span>
                                {this.state.showModificar
                                    ? <span><input className="input-generico" name="formComuna" onChange={this.onChangeInput} value={this.state.formComuna} /></span>
                                    : <span>{this.state.formComuna}</span>
                                }
                            </div>
                            <div>
                                <span>Ciudad</span>
                                {this.state.showModificar
                                    ? <span><input className="input-generico" name="formCiudad" onChange={this.onChangeInput} value={this.state.formCiudad} /></span>
                                    : <span>{this.state.formCiudad}</span>
                                }
                            </div>

                        </div>
                        <div className="seccion">
                            <h3>Permisos en la plataforma</h3>
                            <div>
                                <span>Perfil 1</span>
                                <span>
                                    <select name="formPerfil1" className="input-generico" readonly={this.state.showModificar == false}>
                                        <option>Seleccione un perfil</option>
                                        <option value="1" selected={this.state.formPerfil1 === "1"}>Administrador</option>
                                        <option value="2" selected={this.state.formPerfil1 === "2"}>Jefe Cuadrilla</option>
                                        <option value="3" selected={this.state.formPerfil1 === "3"}>Operario</option>
                                    </select>
                                </span>
                            </div>
                            <div>
                                <span>Perfil 2</span>
                                <span>
                                    <select name="formPerfil2" className="input-generico">
                                        <option>Seleccione un perfil</option>
                                        <option value="1" selected={this.state.formPerfil2 === "1"}>Administrador</option>
                                        <option value="2" selected={this.state.formPerfil2 === "2"}>Jefe Cuadrilla</option>
                                        <option value="3" selected={this.state.formPerfil2 === "3"}>Operario</option>
                                    </select>
                                </span>
                            </div>
                        </div>
                        <div className="seccion">
                            <h3>Puesto de trabajo</h3>
                            <div>
                                <span>Cargo</span>
                                <span>
                                    <select name="formCargo" className="input-generico">
                                        <option>Seleccione un perfil</option>
                                        <option value="1" selected={this.state.formCargo === "1"}>Jefe Cuadrilla</option>
                                        <option value="2" selected={this.state.formCargo === "2"}>Operario</option>
                                        <option value="3" selected={this.state.formCargo === "3"}>Operario</option>
                                    </select>
                                </span>
                            </div>
                            <div>
                                <span>Centro de costos</span><span>Provisorio</span>
                            </div>
                        </div>
                        <div className="seccion">
                            <h3>Cuenta bancaria</h3>
                            <div>
                                <span>Banco</span>
                                {this.state.showModificar
                                    ? <span><input className="input-generico" name="formBanco" onChange={this.onChangeInput} value={this.state.formBanco} /></span>
                                    : <span>{this.state.formBanco}</span>
                                }
                            </div>
                            <div>
                                <span>Tipo de cuenta</span>
                                {this.state.showModificar
                                    ? <span><input className="input-generico" name="formTipoCuenta" onChange={this.onChangeInput} value={this.state.formTipoCuenta} /></span>
                                    : <span>{this.state.formTipoCuenta}</span>
                                }
                            </div>
                            <div>
                                <span>N° de cuenta</span>
                                {this.state.showModificar
                                    ? <span><input className="input-generico" name="formNumCuenta" onChange={this.onChangeInput} value={this.state.formNumCuenta} /></span>
                                    : <span>{this.state.formNumCuenta}</span>
                                }
                            </div>
                        </div>
                        {this.state.showModificar &&
                            <div className="form-group buttons">
                                <button className="boton-generico btazul" onClick={this.actualizaDatos}>Guardar</button>
                                <button className="boton-generico btgris" type="button">Cancelar</button>
                            </div>
                        }
                    </div>

                    {/* <div className="opciones">
                        <div>
                            <img src={fichaper} />
                            <Link to="/perfil/ficha-personal">Ficha personal</Link>
                        </div>
                        <div>
                            <img src={turnos} />
                            <Link to="/perfil/turnos">Turnos</Link>
                        </div>
                    </div> */}

                </div>
                <div id="modales">
                    {/* <Modal
                        name="CambiarPass"  //nombre del estado que controla el modal
                        show={this.state.showCambiarPass} //indicamos la propiedad show con el estado que controlara al modal
                        contenido={<Password />} //entregamos el componente que se renderizara en el modal 
                        toogleModal={this.manejadorModals} //traspasamos la funcion que permitira abrir y cerrar el modal

                    /> */}
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