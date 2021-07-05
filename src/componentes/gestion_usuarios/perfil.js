//importaciones de bibliotecas
import React, { Component, Fragment } from "react";
import { autenticacion } from '../../servicios/autenticacion';
import { Link } from 'react-router-dom';
import Axios from '../../helpers/axiosconf';
import { authHeader } from '../../helpers/auth-header';
import { handleResponse } from '../../helpers/manejador';
import moment from 'moment';
import { funciones } from '../../servicios/funciones';

import { ToastContainer, toast } from 'react-toastify';


// importaciones de iconos 
import imagen from "../../assets/persona.svg";
import { ReactComponent as Bamarillorev } from "../../assets/iconos/bamarillorev.svg";
import edit from "../../assets/iconos/edit.svg";

import fichaper from "../../assets/iconos/fichaper.svg";
import turnos from "../../assets/iconos/turnos.svg";
import camara from "../../assets/iconos/camara.svg";

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
const direccionImagen = funciones.obtenerRutaUsuarios();

export default class Perfil extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentUser: autenticacion.currentUserValue,
            showModificar: false,
            datosUsuario: "",
            rutFormateado: "",
            centrosCostos: '',
            idUsuario: '',
            form: {
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
                formCentro: '',
            },
            fotoPerfil: '',
            imagen: ''
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
        var { id } = this.props.match.params;
        this.setState({ idUsuario: id });
        await this.setState({ centrosCostos: await funciones.obtenerCentrosCostos() });
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
    onChangeImage = (e) => {
        console.log(e.target.files[0]);
        this.setState({
            fotoPerfil: URL.createObjectURL(e.target.files[0]),
            imagen: e.target.files[0]

        })
    }
    cargarDatos = async e => {
        var componente = this;
        const { id } = this.props.match.params;
        await Axios.get('/api/users/worker/' + id, { headers: authHeader() }) //se envia peticion axios con el token sesion guardado en local storage como cabecera
            .then(function (res) {   //si la peticion es satisfactoria entonces
                console.log(res.data);
                componente.setState({ datosUsuario: res.data });  //almacenamos el listado de usuarios en el estado usuarios (array)
            })
            .catch(function (err) { //en el caso de que se ocurra un error, axios lo atrapa y procesa
                // handleResponse(err.response);  //invocamos al manejador para ver el tipo de error y ejecutar la accion pertinente
                return;
            });
        await funciones.getRutFormateado(this.state.datosUsuario.rut, this.state.datosUsuario.dv).then(res => { this.setState({ rutFormateado: res }) });
        await this.setState({
            form: {
                formRut: this.state.rutFormateado,
                formNombre: this.state.datosUsuario.nombre,
                formApellido: this.state.datosUsuario.apellido,
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
                formNumCuenta: this.state.datosUsuario.bancarios.numero,
                formCentro: this.state.datosUsuario.centroCosto
            },

        });
        if (this.state.datosUsuario.imagen) {
            if (this.state.datosUsuario.imagen.length > 0) {
                this.setState({
                    fotoPerfil: direccionImagen + this.state.datosUsuario.imagen[0].url
                })
            } else {
                this.setState({
                    fotoPerfil: imagen
                })
            }
        } else {
            this.setState({
                fotoPerfil: imagen
            })
        }

    }
    cancelar = async e => {
        this.setState({ showModificar: false });
        toast.warning("Operacion cancelada, se han retornado los datos originales", toastoptions);
        this.cargarDatos();
    }
    actualizaDatos = async () => {
        const { id } = this.props.match.params;
        var campoVacio = false;
        var formData = new FormData();
        formData.append('id', id);
        formData.append('nombre', this.state.form.formNombre);
        formData.append('apellido', this.state.form.formApellido);
        formData.append('rut', this.state.form.formRut);
        formData.append('fechaNac', this.state.form.formFechanac);
        formData.append('email', this.state.form.formEmail);
        formData.append('telefono', this.state.form.formTelefono);
        formData.append('hijos', this.state.form.formHijos);
        formData.append('emergencias', JSON.stringify({
            contacto: this.state.form.formContacto,
            parentesco: this.state.form.formParentesco,
            telefono1: this.state.form.formTelefonoFijo,
            telefono2: this.state.form.formTelefonoMovil,
            direccion: this.state.form.formDireccion,
            comuna: this.state.form.formComuna,
            ciudad: this.state.form.formCiudad
        }));
        formData.append('perfil', this.state.form.formPerfil1);
        formData.append('perfilSec', this.state.form.formPerfil2);
        formData.append('cargo', this.state.form.formCargo);
        formData.append('bancarios', JSON.stringify({
            banco: this.state.form.formBanco,
            tipo: this.state.form.formTipoCuenta,
            numero: this.state.form.formNumCuenta
        }));
        formData.append('centroCosto', this.state.form.formCentro);
        for (var elem of formData.entries()) {
            console.log(elem);
            if (elem[1] === "" || elem[1] === null) {
                campoVacio = true;
            }
        }
        if (this.state.imagen) {
            formData.append('imagen', this.state.imagen);
        }

        console.log(formData);

        if (!campoVacio) {
            const res = await Axios.put('/api/users/worker/update/', formData
                , { headers: authHeader() })
                .then(respuesta => {
                    if (respuesta.data.estado === "success") {
                        toast.success(respuesta.data.mensaje, toastoptions);
                        this.setState({ showModificar: false });
                    } else if (respuesta.data.estado === "warning") {
                        toast.warning(respuesta.data.mensaje, toastoptions);
                    }
                })
                .catch(function (err) { //en el caso de que se ocurra un error, axios lo atrapa y procesa
                    handleResponse(err.response);  //invocamos al manejador para ver el tipo de error y ejecutar la accion pertinente
                });
        } else {
            toast.warning("Debes llenar todos los campos", toastoptions);
        }
    }
    render() {
        var componente = this;
        // console.log(this.state.form);
        let centrosCostos;
        if (this.state.centrosCostos) {
            // console.log(this.state.centrosCostos);
            centrosCostos = this.state.centrosCostos.map((centro, index) => {
                return (<option value={centro.key} data-key={centro.key}>{centro.nombre}</option>)
            });
        }
        let centro;
        if((this.state.form.formCentro !== "") && (this.state.centrosCostos.length > 0)){
            console.log(this.state.form.formCentro)
            this.state.centrosCostos.find(function(cen){
                if(parseInt(cen.key) === parseInt(componente.state.form.formCentro)){
                    centro = cen.nombre;
                }
            });
        }

        return (
            <div className="principal" id="component-perfil">
                <div>
                    <h2 className="amarillo"><Link to="/personas/listar-trabajadores"> <Bamarillorev /> </Link><span>Trabajadores /</span> Perfil Trabajador</h2>
                    <div className="fichaPerfil">
                        <div className="seccion">
                            <a className="edit-button" onClick={this.editar} data-objetivo="Modificar"><img src={edit} /></a>
                            <div className="fotoperfil">
                                <div className="foto-container">
                                    {this.state.fotoPerfil &&
                                        <img className="imgPerfil" src={this.state.fotoPerfil} />
                                    }
                                    {this.state.showModificar &&
                                        <Fragment>
                                            <input type="file" onChange={this.onChangeImage} id="editaFoto"></input>
                                            <label id="labelEditaFoto" for="editaFoto"><img src={camara} /></label>
                                        </Fragment>
                                    }
                                </div>
                            </div>
                            <div>
                                <span>Nombre</span>
                                {this.state.showModificar
                                    ? <span><input className="input-generico" name="formNombre" onChange={this.onChangeInput} value={this.state.form.formNombre} /></span>
                                    : <span>{this.state.form.formNombre}</span>
                                }
                            </div>
                            <div>
                                <span>Apellidos</span>
                                {this.state.showModificar
                                    ? <span><input className="input-generico" name="formApellido" onChange={this.onChangeInput} value={this.state.form.formApellido} /></span>
                                    : <span>{this.state.form.formApellido}</span>
                                }
                            </div>
                            <div>
                                <span>Rut</span>
                                {this.state.showModificar
                                    ? <span><input className="input-generico" name="formRut" onChange={this.onChangeRut} value={this.state.form.formRut} placeholder="RUN" maxLength="12" /></span>
                                    : <span>{this.state.form.formRut}</span>
                                }
                            </div>
                            <div>
                                <span>Fecha de Nacimiento</span>
                                {this.state.showModificar
                                    ? <span><input className="input-generico" type="date" name="formFechanac" onChange={this.onChangeInput} value={this.state.form.formFechanac} /></span>
                                    : <span>{this.state.form.formFechanac}</span>
                                }
                            </div>
                            <div>
                                <span>Email</span>
                                {this.state.showModificar
                                    ? <span><input className="input-generico" name="formEmail" onChange={this.onChangeInput} value={this.state.form.formEmail} /></span>
                                    : <span>{this.state.form.formEmail}</span>
                                }
                            </div>
                            <div>
                                <span>Teléfono</span>
                                {this.state.showModificar
                                    ? <span><input className="input-generico" name="formTelefono" onChange={this.onChangeInput} value={this.state.form.formTelefono} /></span>
                                    : <span>{this.state.form.formTelefono}</span>
                                }
                            </div>
                            <div>
                                <span>Número de hijos</span>
                                {this.state.showModificar
                                    ? <span><input className="input-generico" name="formHijos" onChange={this.onChangeInput} value={this.state.form.formHijos} /></span>
                                    : <span>{this.state.form.formHijos}</span>
                                }</div>
                        </div>

                        <div className="seccion">
                            <h3>Contacto de emergencia</h3>
                            <div>
                                <span>Nombre Apellido</span>
                                {this.state.showModificar
                                    ? <span><input className="input-generico" name="formContacto" onChange={this.onChangeInput} value={this.state.form.formContacto} /></span>
                                    : <span>{this.state.form.formContacto}</span>
                                }
                            </div>
                            <div>
                                <span>Parentesco</span>
                                {this.state.showModificar
                                    ? <span><input className="input-generico" name="formParentesco" onChange={this.onChangeInput} value={this.state.form.formParentesco} /></span>
                                    : <span>{this.state.form.formParentesco}</span>
                                }
                            </div>
                            <div>
                                <span>Teléfono 1</span>
                                {this.state.showModificar
                                    ? <span><input className="input-generico" name="formTelefonoFijo" onChange={this.onChangeInput} value={this.state.form.formTelefonoFijo} /></span>
                                    : <span>{this.state.form.formTelefonoFijo}</span>
                                }
                            </div>
                            <div>
                                <span>Teléfono 2</span>
                                {this.state.showModificar
                                    ? <span><input className="input-generico" name="formTelefonoMovil" onChange={this.onChangeInput} value={this.state.form.formTelefonoMovil} /></span>
                                    : <span>{this.state.form.formTelefonoMovil}</span>
                                }
                            </div>
                            <div>
                                <span>Dirección</span>
                                {this.state.showModificar
                                    ? <span><input className="input-generico" name="formDireccion" onChange={this.onChangeInput} value={this.state.form.formDireccion} /></span>
                                    : <span>{this.state.form.formDireccion}</span>
                                }
                            </div>
                            <div>
                                <span>Comuna</span>
                                {this.state.showModificar
                                    ? <span><input className="input-generico" name="formComuna" onChange={this.onChangeInput} value={this.state.form.formComuna} /></span>
                                    : <span>{this.state.form.formComuna}</span>
                                }
                            </div>
                            <div>
                                <span>Ciudad</span>
                                {this.state.showModificar
                                    ? <span><input className="input-generico" name="formCiudad" onChange={this.onChangeInput} value={this.state.form.formCiudad} /></span>
                                    : <span>{this.state.form.formCiudad}</span>
                                }
                            </div>

                        </div>
                        <div className="seccion">
                            <h3>Permisos en la plataforma</h3>
                            <div>
                                <span>Perfil 1</span>
                                {this.state.showModificar
                                    ? <span>
                                        <select name="formPerfil1" onChange={this.onChangeInput} value={this.state.form.formPerfil1} className="input-generico" >
                                            <option>Seleccione un perfil</option>
                                            <option value="1">Administrador</option>
                                            <option value="2">Jefe Cuadrilla</option>
                                            <option value="3">operador</option>
                                        </select>
                                    </span>
                                    :
                                    <span>
                                        {this.state.form.formPerfil1 === 1 && 'Administrador'}
                                        {this.state.form.formPerfil1 === 2 && 'Jefe Cuadrilla'}
                                        {this.state.form.formPerfil1 === 3 && 'Operador'}
                                    </span>

                                }
                            </div>
                            <div>
                                <span>Perfil 2</span>
                                {this.state.showModificar
                                    ? <span>
                                        <select name="formCargo" onChange={this.onChangeInput} value={this.state.form.formCargo} className="input-generico">
                                            <option>Seleccione un perfil</option>
                                            <option value="1">Jefe Cuadrilla</option>
                                            <option value="2">Operador</option>
                                        </select>
                                    </span>
                                    :
                                    <span>
                                        {this.state.form.formPerfil2 === 1 && 'Administrador'}
                                        {this.state.form.formPerfil2 === 2 && 'Jefe Cuadrilla'}
                                        {this.state.form.formPerfil2 === 3 && 'Operador'}
                                    </span>
                                }
                            </div>
                        </div>
                        <div className="seccion">
                            <h3>Puesto de trabajo</h3>
                            <div>
                                <span>Cargo</span>
                                {this.state.showModificar
                                    ? <span>
                                        <select name="formCargo" onChange={this.onChangeInput} value={this.state.form.formCargo} className="input-generico">
                                            <option>Seleccione un perfil</option>
                                            <option value="1">Jefe Cuadrilla</option>
                                            <option value="2">Operador</option>
                                        </select>
                                    </span>
                                    :
                                    <span>
                                        {this.state.form.formCargo === 1 && 'Jefe Cuadrilla'}
                                        {this.state.form.formCargo === 2 && 'Operador'}
                                    </span>
                                }
                            </div>
                            <div>
                                <span>Centro de costos</span>
                                {this.state.showModificar
                                    ? <span>
                                        <select name="formCentro" onChange={this.onChangeInput} value={this.state.form.formCentro} className="input-generico">
                                            <option>Seleccione un centro de costos</option>
                                            {centrosCostos}
                                        </select>
                                    </span>
                                    :
                                    <span>
                                        {centro}
                                    </span>
                                }
                            </div>
                        </div>
                        <div className="seccion">
                            <h3>Cuenta bancaria</h3>
                            <div>
                                <span>Banco</span>
                                {this.state.showModificar

                                    ? <span><input className="input-generico" name="formBanco" value={this.state.form.formBanco} onChange={this.onChangeInput} required /></span>
                                    : <span>{this.state.form.formBanco}</span>
                                }
                            </div>
                            <div>
                                <span>Tipo de cuenta</span>
                                {this.state.showModificar

                                    ? <span><input className="input-generico" name="formTipoCuenta" value={this.state.form.formTipoCuenta} onChange={this.onChangeInput} required /></span>
                                    : <span>{this.state.form.formTipoCuenta}</span>
                                }
                            </div>
                            <div>
                                <span>N° de cuenta</span>
                                {this.state.showModificar

                                    ? <span><input className="input-generico" name="formNumCuenta" value={this.state.form.formNumCuenta} onChange={this.onChangeInput} required /></span>
                                    : <span>{this.state.form.formNumCuenta}</span>
                                }
                            </div>
                        </div>
                        {this.state.showModificar &&
                            <div className="form-group buttons">
                                <button className="boton-generico btazul" onClick={this.actualizaDatos}>Guardar</button>
                                <button className="boton-generico btgris" onClick={this.cancelar} type="button">Cancelar</button>
                            </div>
                        }
                    </div>

                    <div className="opciones">
                        <div>
                            <img src={fichaper} />
                            <Link to={`/personas/ficha-trabajador/${this.state.idUsuario}`}>Ficha trabajador</Link>
                        </div>
                        <div>
                            <img src={turnos} />
                            <Link to={`/personas/turnos/trabajador/${this.state.idUsuario}`}>Turnos</Link>
                        </div>
                    </div>

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