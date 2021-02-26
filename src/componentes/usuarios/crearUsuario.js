
//importaciones de bibliotecas
import React, { Component } from "react";
import { autenticacion } from '../../servicios/autenticacion';
import { Link } from 'react-router-dom';
import Axios from '../../helpers/axiosconf';
import { authHeader } from '../../helpers/auth-header';
import { handleResponse } from '../../helpers/manejador';
import moment from 'moment';
import { historial } from '../../helpers/historial';



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

const { validate, clean, format, getCheckDigit } = require('rut.js');

export default class CrearUsuario extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentUser: autenticacion.currentUserValue,
            datosUsuario: "",
            formNombre: '',
            formApellido: '',
            formRut: '',
            formFechanac: '',
            formEmail: '',
            formTelefono: '',
            formHijos: '',
            formPass: '',
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
    async componentDidMount() {

    }
    async componentWillUnmount() {

    }
    // actualizaPerfil = async event => {
    //     autenticacion.actualizar();
    //     await this.setState({ currentUser: autenticacion.currentUserValue });
    //     await this.setState({ datosUsuarios: this.state.currentUser.data.usuariobd });
    // }
    toogleModal = toogleModalCore; //copiamos la funcion modal a una funcion local
    manejadorModals = (e, res) => { //creamos una funcion que reciba parametros para pasarlo al toogle modal (esta funcion la pasaremos al cuerpo del modal como propiedad para ejecutarse por autoreferencia)
        this.toogleModal(e, res);
    }
    onChangeInput = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }
    onChangeRut = (e) => {
        var rut = e.target.value
        var rutformateado = format(rut);
        this.setState({
            [e.target.name]: rutformateado
        })
    }

    retorno = (e) => {
        historial.push('/personas/gestion');
    }

    enviaDatos = async e => {
        const { id } = this.props.match.params;
        e.preventDefault();
        const res = await Axios.post('http://localhost:4000/api/users/worker/create/', {
            id: this.state.currentUser.data.usuariobd._id,
            nombre: this.state.formNombre,
            apellido: this.state.formApellido,
            rut: this.state.formRut,
            fechaNac: this.state.formFechanac,
            email: this.state.formEmail,
            telefono: this.state.formTelefono,
            hijos: this.state.formHijos,
            password: this.state.formPass,
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
                historial.push('/personas/gestion');
            })
            .catch(function (err) { //en el caso de que se ocurra un error, axios lo atrapa y procesa
                handleResponse(err.response);  //invocamos al manejador para ver el tipo de error y ejecutar la accion pertinente
            });
    }
    render() {
        return (
            <div className="principal" id="component-perfil">
                <div>
                    <h2><Link to="/personas/gestion"> <Bcelesterev /> </Link>Trabajadores / <strong>Crear Trabajador</strong></h2>
                    <div className="fichaPerfil">
                        <div className="seccion">
                            <div className="fotoperfil">
                                <img src={imagen} />
                            </div>
                            <div>
                                <span>Nombre</span>
                                <span><input className="input-generico" name="formNombre" onChange={this.onChangeInput} required /></span>
                            </div>
                            <div>
                                <span>Apellidos</span>
                                <span><input className="input-generico" name="formApellido" onChange={this.onChangeInput} required /></span>
                            </div>
                            <div>
                                <span>Rut</span>
                                <span><input className="input-generico" name="formRut" onChange={this.onChangeInput} required /></span>
                            </div>
                            <div>
                                <span>Fecha de Nacimiento</span>
                                <span><input className="input-generico" type="date" name="formFechanac" onChange={this.onChangeInput} required /></span>
                            </div>
                            <div>
                                <span>Email</span>
                                <span><input className="input-generico" name="formEmail" onChange={this.onChangeInput} /></span>
                            </div>
                            <div>
                                <span>Teléfono</span>
                                <span><input className="input-generico" name="formTelefono" onChange={this.onChangeInput} required /></span>
                            </div>
                            <div>
                                <span>Número de hijos</span>
                                <span><input className="input-generico" name="formHijos" onChange={this.onChangeInput} required /></span>
                            </div>
                        </div>
                        <div className="seccion">
                            <div>
                                <span>Contraseña</span><span><input className="input-generico" name="formPass" onChange={this.onChangeInput} required /></span>
                            </div>
                        </div>

                        <div className="seccion">
                            <h3>Contacto de emergencia</h3>
                            <div>
                                <span>Nombre Apellido</span>
                                <span><input className="input-generico" name="formContacto" onChange={this.onChangeInput} required /></span>

                            </div>
                            <div>
                                <span>Parentesco</span>
                                <span><input className="input-generico" name="formParentesco" onChange={this.onChangeInput} required /></span>

                            </div>
                            <div>
                                <span>Teléfono 1</span>
                                <span><input className="input-generico" name="formTelefonoFijo" onChange={this.onChangeInput} required /></span>

                            </div>
                            <div>
                                <span>Teléfono 2</span>
                                <span><input className="input-generico" name="formTelefonoMovil" onChange={this.onChangeInput} /></span>

                            </div>
                            <div>
                                <span>Dirección</span>
                                <span><input className="input-generico" name="formDireccion" onChange={this.onChangeInput} required /></span>

                            </div>
                            <div>
                                <span>Comuna</span>
                                <span><input className="input-generico" name="formComuna" onChange={this.onChangeInput} required /></span>

                            </div>
                            <div>
                                <span>Ciudad</span>
                                <span><input className="input-generico" name="formCiudad" onChange={this.onChangeInput} required /></span>

                            </div>

                        </div>
                        <div className="seccion">
                            <h3>Permisos en la plataforma</h3>
                            <div>
                                <span>Perfil 1</span>
                                <span>
                                    <select name="formPerfil1" className="input-generico" name="formPerfil1" onChange={this.onChangeInput}>
                                        <option>Seleccione un perfil</option>
                                        <option value="1" >Administrador</option>
                                        <option value="2" >Jefe Cuadrilla</option>
                                        <option value="3" >Operario</option>
                                    </select>
                                </span>
                            </div>
                            <div>
                                <span>Perfil 2</span>
                                <span>
                                    <select name="formPerfil2" className="input-generico" name="formPerfil2" onChange={this.onChangeInput}>
                                        <option>Seleccione un perfil</option>
                                        <option value="1" >Administrador</option>
                                        <option value="2" >Jefe Cuadrilla</option>
                                        <option value="3" >Operario</option>
                                    </select>
                                </span>
                            </div>
                        </div>
                        <div className="seccion">
                            <h3>Puesto de trabajo</h3>
                            <div>
                                <span>Cargo</span>
                                <span>
                                    <select name="formCargo" className="input-generico" onChange={this.onChangeInput}>
                                        <option>Seleccione un perfil</option>
                                        <option value="1" >Jefe Cuadrilla</option>
                                        <option value="2" >Operario</option>
                                        <option value="3" >Operario</option>
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
                                <span><input className="input-generico" name="formBanco" onChange={this.onChangeInput} required /></span>

                            </div>
                            <div>
                                <span>Tipo de cuenta</span>
                                <span><input className="input-generico" name="formTipoCuenta" onChange={this.onChangeInput} required /></span>

                            </div>
                            <div>
                                <span>N° de cuenta</span>

                                <span><input className="input-generico" name="formNumCuenta" onChange={this.onChangeInput} required /></span>


                            </div>
                        </div>
                        <div className="form-group buttons">
                            <button className="boton-generico btazul" onClick={this.enviaDatos}>Guardar</button>
                            <button className="boton-generico btgris" type="button" onClick={this.retorno}>Cancelar</button>
                        </div>

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

