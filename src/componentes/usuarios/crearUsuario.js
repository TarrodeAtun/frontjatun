
//importaciones de bibliotecas
import React, { Component } from "react";
import { autenticacion } from '../../servicios/autenticacion';
import { Link } from 'react-router-dom';
import Axios from '../../helpers/axiosconf';
import { authHeader } from '../../helpers/auth-header';
import { handleResponse } from '../../helpers/manejador';
import moment from 'moment';
import { historial } from '../../helpers/historial';
import { funciones } from '../../servicios/funciones';

import { ToastContainer, toast } from 'react-toastify';



//importaciones de componentes
// import Password from './cambiarContraseña';

// importaciones de iconos 
import imagen from "../../assets/persona.svg";
import { ReactComponent as Bamarillorev } from "../../assets/iconos/bamarillorev.svg";
import edit from "../../assets/iconos/edit.svg";

import fichaper from "../../assets/iconos/fichaper.svg";
import turnos from "../../assets/iconos/turnos.svg";

//importamos manejadores de modal
import Modal from '../includes/modal';
import { toogleModalCore } from '../includes/funciones';

import '../../styles/perfil.css';


const toastoptions = {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
}

export default class CrearUsuario extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentUser: autenticacion.currentUserValue,
            datosUsuario: "",
            form: {
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
            },
            showIngresar: false,
            showOptions: true,
            idUsuario: ''
        };
    }
    async componentDidMount() {

    }
    async componentWillUnmount() {

    }
    toogleModal = toogleModalCore; //copiamos la funcion modal a una funcion local
    manejadorModals = (e, res) => { //creamos una funcion que reciba parametros para pasarlo al toogle modal (esta funcion la pasaremos al cuerpo del modal como propiedad para ejecutarse por autoreferencia)
        this.toogleModal(e, res);
    }
    onChangeInput = (e) => {
        console.log(e.target.value);
        this.setState({
            form: {
                ...this.state.form, [e.target.name]: e.target.value
            }
        })
    }
    onChangeRut = async e => {
        funciones.formatearRut(e.target.value, 1).then(res => {
            this.setState({
                form: {
                    ...this.state.form, formRut: res
                }
            })
        });
    }

    retorno = (e) => {
        historial.push('/personas/gestion');
    }

    enviaDatos = async e => {
        e.preventDefault();
        var campoVacio = false;
        await Object.entries(this.state.form).map((t, k) => {
            if (t[1] === "" || t[1] === null) {
                campoVacio = true;
            }
        });
        if (!campoVacio) {
            const res = await Axios.post('/api/users/worker/create/', {
                id: this.state.currentUser.data.usuariobd._id,
                nombre: this.state.form.formNombre,
                apellido: this.state.form.formApellido,
                rut: this.state.form.formRut,
                fechaNac: this.state.form.formFechanac,
                email: this.state.form.formEmail,
                telefono: this.state.form.formTelefono,
                hijos: this.state.form.formHijos,
                password: this.state.form.formPass,
                emergencias: {
                    contacto: this.state.form.formContacto,
                    parentesco: this.state.form.formParentesco,
                    telefono1: this.state.form.formTelefonoFijo,
                    telefono2: this.state.form.formTelefonoMovil,
                    direccion: this.state.form.formDireccion,
                    comuna: this.state.form.formComuna,
                    ciudad: this.state.form.formCiudad
                },
                perfil: this.state.form.formPerfil1,
                perfilSec: this.state.form.formPerfil2,
                cargo: this.state.form.formCargo,
                bancarios: {
                    banco: this.state.form.formBanco,
                    tipo: this.state.form.formTipoCuenta,
                    numero: this.state.form.formNumCuenta
                }
            }, { headers: authHeader() })
                .then(respuesta => {
                    this.setState({ idUsuario: respuesta.data.id });
                    if (respuesta.data.estado === "success") {
                        toast.success(respuesta.data.mensaje, toastoptions);
                        this.setState({ showIngresar: true, showOptions: false });
                    } else if (respuesta.data.estado === "warning") {
                        toast.warning(respuesta.data.mensaje, toastoptions);
                    }

                })
                .catch(function (err) { //en el caso de que se ocurra un error, axios lo atrapa y procesa
                    handleResponse(err.response);  //invocamos al manejador para ver el tipo de error y ejecutar la accion pertinente
                    toast.error("Ha habido un error al enviar los datos", toastoptions);
                });
        }else{
            toast.warning("Debes llenar todos los campos", toastoptions);
        }
    }
    render() {
        return (
            <div className="principal" id="component-perfil">
                <div>
                    <h2 class="amarillo"><Link to="/personas/gestion/listar-trabajadores"> <Bamarillorev /> </Link><span>Trabajadores </span>/ <strong>Crear Trabajador</strong></h2>
                    <div className="fichaPerfil">
                        <div className="seccion">
                            <div className="fotoperfil">
                                <img src={imagen} />
                            </div>
                            <div>
                                <span>Nombre</span>
                                {this.state.showIngresar
                                    ? <span>{this.state.form.formNombre}</span>
                                    : <span><input className="input-generico" name="formNombre" onChange={this.onChangeInput} value={this.state.form.formNombre} /></span>
                                }
                            </div>
                            <div>
                                <span>Apellidos</span>
                                {this.state.showIngresar
                                    ? <span>{this.state.form.formApellido}</span>
                                    : <span><input className="input-generico" name="formApellido" value={this.state.form.formApellido} onChange={this.onChangeInput} required /></span>
                                }
                            </div>
                            <div>
                                <span>Rut</span>
                                {this.state.showIngresar
                                    ? <span>{this.state.form.formRut}</span>
                                    : <span><input className="input-generico" maxLength="12" name="formRut" value={this.state.form.formRut} placeholder="RUN" onChange={this.onChangeRut} required /></span>
                                }
                            </div>
                            <div>
                                <span>Fecha de Nacimiento</span>
                                {this.state.showIngresar
                                    ? <span>{this.state.form.formFechanac}</span>
                                    : <span><input className="input-generico" type="date" name="formFechanac" value={this.state.form.formFechanac} onChange={this.onChangeInput} required /></span>
                                }
                            </div>
                            <div>
                                <span>Email</span>
                                {this.state.showIngresar
                                    ? <span>{this.state.form.formEmail}</span>
                                    : <span><input className="input-generico" name="formEmail" value={this.state.form.formEmail} onChange={this.onChangeInput} /></span>
                                }
                            </div>
                            <div>
                                <span>Teléfono</span>
                                {this.state.showIngresar
                                    ? <span>{this.state.form.formTelefono}</span>
                                    : <span><input className="input-generico" name="formTelefono" value={this.state.form.formTelefono} onChange={this.onChangeInput} required /></span>
                                }
                            </div>
                            <div>
                                <span>Número de hijos</span>
                                {this.state.showIngresar
                                    ? <span>{this.state.form.formHijos}</span>
                                    : <span><input className="input-generico" name="formHijos" value={this.state.form.formHijos} onChange={this.onChangeInput} required /></span>
                                }
                            </div>
                        </div>
                        <div className="seccion">
                            <div>
                                <span>Contraseña</span>
                                {this.state.showIngresar
                                    ? <span>{this.state.form.formPass}</span>
                                    : <span><input className="input-generico" name="formPass" value={this.state.form.formPass} onChange={this.onChangeInput} required /></span>
                                }
                            </div>
                        </div>

                        <div className="seccion">
                            <h3>Contacto de emergencia</h3>
                            <div>
                                <span>Nombre Apellido</span>
                                {this.state.showIngresar
                                    ? <span>{this.state.form.formContacto}</span>
                                    : <span><input className="input-generico" name="formContacto" value={this.state.form.formContacto} onChange={this.onChangeInput} required /></span>
                                }
                            </div>
                            <div>
                                <span>Parentesco</span>
                                {this.state.showIngresar
                                    ? <span>{this.state.form.formParentesco}</span>
                                    : <span><input className="input-generico" name="formParentesco" value={this.state.form.formParentesco} onChange={this.onChangeInput} required /></span>
                                }
                            </div>
                            <div>
                                <span>Teléfono 1</span>
                                {this.state.showIngresar
                                    ? <span>{this.state.form.formTelefonoFijo}</span>
                                    : <span><input className="input-generico" name="formTelefonoFijo" value={this.state.form.formTelefonoFijo} onChange={this.onChangeInput} required /></span>
                                }
                            </div>
                            <div>
                                <span>Teléfono 2</span>
                                {this.state.showIngresar
                                    ? <span>{this.state.form.formTelefonoMovil}</span>
                                    : <span><input className="input-generico" name="formTelefonoMovil" value={this.state.form.formTelefonoMovil} onChange={this.onChangeInput} /></span>
                                }
                            </div>
                            <div>
                                <span>Dirección</span>
                                {this.state.showIngresar
                                    ? <span>{this.state.form.formDireccion}</span>
                                    : <span><input className="input-generico" name="formDireccion" value={this.state.form.formDireccion} onChange={this.onChangeInput} required /></span>
                                }
                            </div>
                            <div>
                                <span>Comuna</span>
                                {this.state.showIngresar
                                    ? <span>{this.state.form.formComuna}</span>
                                    : <span><input className="input-generico" name="formComuna" value={this.state.form.formComuna} onChange={this.onChangeInput} required /></span>
                                }
                            </div>
                            <div>
                                <span>Ciudad</span>
                                {this.state.showIngresar
                                    ? <span>{this.state.form.formCiudad}</span>
                                    : <span><input className="input-generico" name="formCiudad" value={this.state.form.formCiudad} onChange={this.onChangeInput} required /></span>
                                }
                            </div>

                        </div>
                        <div className="seccion">
                            <h3>Permisos en la plataforma</h3>
                            <div>
                                <span>Perfil 1</span>
                                {this.state.showIngresar
                                    ?
                                    <span>
                                        {this.state.form.formPerfil1 === "1" && 'Administrador'}
                                        {this.state.form.formPerfil1 === "2" && 'Jefe Cuadrilla'}
                                        {this.state.form.formPerfil1 === "3" && 'Operador'}
                                    </span>
                                    :
                                    <span>
                                        <select name="formPerfil1" onChange={this.onChangeInput} value={this.state.form.formPerfil1} className="input-generico" >
                                            <option>Seleccione un perfil</option>
                                            <option value="1">Administrador</option>
                                            <option value="2">Jefe Cuadrilla</option>
                                            <option value="3">Operador</option>
                                        </select>
                                    </span>
                                }
                            </div>
                            <div>
                                <span>Perfil 2</span>
                                {this.state.showIngresar
                                    ?
                                    <span>
                                        {this.state.form.formPerfil2 === "1" && 'Administrador'}
                                        {this.state.form.formPerfil2 === "2" && 'Jefe Cuadrilla'}
                                        {this.state.form.formPerfil2 === "3" && 'Operador'}
                                    </span>
                                    :
                                    <span>
                                        <select name="formPerfil2" onChange={this.onChangeInput} value={this.state.form.formPerfil2} className="input-generico" >
                                            <option>Seleccione un perfil</option>
                                            <option value="1" >Administrador</option>
                                            <option value="2" >Jefe Cuadrilla</option>
                                            <option value="3" >Operador</option>
                                        </select>
                                    </span>
                                }
                            </div>
                        </div>
                        <div className="seccion">
                            <h3>Puesto de trabajo</h3>
                            <div>
                                <span>Cargo</span>
                                {this.state.showIngresar
                                    ? <span>
                                        {this.state.form.formCargo === "1" && 'Jefe Cuadrilla'}
                                        {this.state.form.formCargo === "2" && 'Operador'}
                                    </span>
                                    : <span>
                                        <select name="formCargo" onChange={this.onChangeInput} value={this.state.form.formCargo} className="input-generico">
                                            <option>Seleccione un perfil</option>
                                            <option value="1">Jefe Cuadrilla</option>
                                            <option value="2">Operador</option>
                                        </select>
                                    </span>
                                }
                            </div>
                            <div>
                                <span>Centro de costos</span><span>Provisorio</span>
                            </div>
                        </div>
                        <div className="seccion">
                            <h3>Cuenta bancaria</h3>
                            <div>
                                <span>Banco</span>
                                {this.state.showIngresar
                                    ? <span>{this.state.form.formBanco}</span>
                                    : <span><input className="input-generico" name="formBanco" value={this.state.form.formBanco} onChange={this.onChangeInput} required /></span>
                                }
                            </div>
                            <div>
                                <span>Tipo de cuenta</span>
                                {this.state.showIngresar
                                    ? <span>{this.state.form.formTipoCuenta}</span>
                                    : <span><input className="input-generico" name="formTipoCuenta" value={this.state.form.formTipoCuenta} onChange={this.onChangeInput} required /></span>
                                }
                            </div>
                            <div>
                                <span>N° de cuenta</span>
                                {this.state.showIngresar
                                    ? <span>{this.state.form.formNumCuenta}</span>
                                    : <span><input className="input-generico" name="formNumCuenta" value={this.state.form.formNumCuenta} onChange={this.onChangeInput} required /></span>
                                }

                            </div>
                        </div>
                        {this.state.showOptions &&
                        <div className="form-group buttons">
                            <button className="boton-generico btazul" onClick={this.enviaDatos}>Guardar</button>
                            <button className="boton-generico btgris" type="button" onClick={this.retorno}>Cancelar</button>
                        </div>
                        }

                    </div>
                    {this.state.showIngresar &&
                        <div className="opciones">
                            <div>
                                <img src={fichaper} />
                                <Link to={`/personas/ficha-trabajador/${this.state.idUsuario}`}>Ficha personal</Link>
                            </div>
                            <div>
                                <img src={turnos} />
                                <Link to={`/personas/turnos/${this.state.idUsuario}`}>Turnos</Link>
                            </div>
                        </div>
                    }
                </div>
            </div >
        );
    }
}

