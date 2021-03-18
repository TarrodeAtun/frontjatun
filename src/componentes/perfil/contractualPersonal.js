//importaciones de bibliotecas
import React, { Component } from "react";
import { autenticacion } from '../../servicios/autenticacion';
import { Link } from 'react-router-dom';
import Axios from '../../helpers/axiosconf';
import { authHeader } from '../../helpers/auth-header';
import { handleResponse } from '../../helpers/manejador';
import { historial } from '../../helpers/historial';
import { funciones } from '../../servicios/funciones';
import { toast } from 'react-toastify';

// importaciones de iconos 
import imagen from "../../assets/persona.svg";
import edit from "../../assets/iconos/edit.svg";
import { ReactComponent as Bcelesterev } from "../../assets/iconos/bcelesterev.svg";

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
const openInNewTab = (url) => {
    let direccion = "http://localhost:4000/media/users";
    direccion = direccion + url;
    const newWindow = window.open(direccion, '_blank', 'noopener,noreferrer')
    if (newWindow) newWindow.opener = null
}
export default class EquipoTrabajador extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentUser: autenticacion.currentUserValue,
            datosUsuario: "",
            datosContractuales: "",
            form: {
                formDireccion: '',
                formComuna: '',
                formCiudad: '',
                formNacionalidad: '',
                formProfesion: '',
                formEstadocivil: '',
                formHijos: '',
                formCarga: '',
                formFechainic: '',
                formFechaterm: '',
                formTipoContrato: '',
            },
            formCedula: '',
            formAntecedentes: '',
            formContrato: '',
            formFiniquito: '',
            formRenuncia: '',

            antecedentes: {
                name: '',
                link: ''
            },
            cedula: {
                name: '',
                link: ''
            },
            contrato: {
                name: '',
                link: ''
            },
            finiquito: {
                name: '',
                link: ''
            },
            renuncia: {
                name: '',
                link: ''
            },

            showModificar: false,
            showOptions: true,
            idUsuario: ''
        };
    }
    async componentDidMount() {
        var componente = this;
        //datos contractuales trabajador
        await this.setState({
            datosUsuario: this.state.currentUser.data.usuariobd
        });
        await Axios.get('/api/users/worker/ficha/contractuales/' + autenticacion.currentUserValue.data.usuariobd.rut, { headers: authHeader() }) //se envia peticion axios con el token sesion guardado en local storage como cabecera
            .then(function (res) {   //si la peticion es satisfactoria entonces
                componente.setState({
                    form: {
                        formDireccion: res.data.direccion,
                        formComuna: res.data.comuna,
                        formCiudad: res.data.ciudad,
                        formNacionalidad: res.data.nacionalidad,
                        formProfesion: res.data.profesion,
                        formEstadocivil: res.data.estadocivil,
                        formHijos: res.data.hijos,
                        formCarga: res.data.carga,
                        formFechainic: res.data.fechainic,
                        formFechaterm: res.data.fechaterm,
                        formTipoContrato: res.data.tipoContrato,
                    }
                });
                this.state.res.data.archivos.forEach(archivo=>{
                    this.setState({
                        [archivo.input]:{
                            name:[archivo.input],
                            link: [archivo.url]
                        }
                    })
                });
            })
            .catch(function (err) { //en el caso de que se ocurra un error, axios lo atrapa y procesa
                // handleResponse(err.response);  //invocamos al manejador para ver el tipo de error y ejecutar la accion pertinente
                return;
            });
    }
    render() {
        return (
            <div className="principal" id="component-perfil">
                <div>
                    <h2 className="celeste"><Link to={`/perfil/ficha-personal`}> <Bcelesterev /> </Link><strong>Ficha Personal</strong></h2>
                    <div className="fichaPerfil">
                        <div className="seccion encabezado">
                            <div className="fotoperfil">
                                <img src={imagen} />
                            </div>
                            <div className="datosPersonales">
                                <h3><span>{this.state.datosUsuario.nombre} {this.state.datosUsuario.apellido}</span><span>{this.state.datosUsuario.rut}-{this.state.datosUsuario.dv}</span></h3>
                            </div>
                        </div>
                        <div className="seccion">
                            <h3>Contractual</h3>
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
                                    ? <span><input className="input-generico" name="formComuna" value={this.state.form.formComuna} onChange={this.onChangeInput} /></span>
                                    : <span>{this.state.form.formComuna}</span>
                                }
                            </div>
                            <div>
                                <span>Ciudad</span>
                                {this.state.showModificar
                                    ? <span><input className="input-generico" name="formCiudad" value={this.state.form.formCiudad} onChange={this.onChangeInput} /></span>
                                    : <span>{this.state.form.formCiudad}</span>
                                }
                            </div>
                            <div>
                                <span>Nacionalidad</span>
                                {this.state.showModificar
                                    ? <span><input className="input-generico" name="formNacionalidad" value={this.state.form.formNacionalidad} onChange={this.onChangeInput} /></span>
                                    : <span>{this.state.form.formNacionalidad}</span>
                                }
                            </div>
                            <div>
                                <span>Profesión u oficio</span>
                                {this.state.showModificar
                                    ? <span><input className="input-generico" name="formProfesion" value={this.state.form.formProfesion} onChange={this.onChangeInput} /></span>
                                    : <span>{this.state.form.formProfesion}</span>
                                }
                            </div>
                            <div>
                                <span>Estado Civil</span>
                                {this.state.showModificar
                                    ? <span><input className="input-generico" name="formEstadocivil" value={this.state.form.formEstadocivil} onChange={this.onChangeInput} /></span>
                                    : <span>{this.state.form.formEstadocivil}</span>
                                }
                            </div>
                            <div>
                                <span>N° de Hijos</span>
                                {this.state.showModificar
                                    ? <span><input className="input-generico" name="formHijos" value={this.state.form.formHijos} onChange={this.onChangeInput} /></span>
                                    : <span>{this.state.form.formHijos}</span>
                                }
                            </div>
                            <div>
                                <span>Carga Familiar</span>
                                {this.state.showModificar
                                    ? <span className="formRadio" name="formCarga" onChange={this.onChangeInput}>
                                        <input type="radio" value="1" name="formCarga" /> Si
                                        <input type="radio" value="0" name="formCarga" /> No
                                      </span>
                                    : <span>
                                        {this.state.form.formPerfil1 === "1" && 'Si'}
                                        {this.state.form.formPerfil1 === "0" && 'Nno'}
                                    </span>
                                }
                            </div>
                            <div>
                                <span>Cedula de identidad</span>
                                {this.state.showModificar
                                    ? <span><input type="file" onChange={this.onChangeFileInput} className="input-generico" name="formCedula" /></span>
                                    : <span className="spanlink" onClick={() => openInNewTab(this.state.cedula.link)}>{this.state.cedula.name}</span>
                                }
                            </div>
                            <div>
                                <span>Certificado de antecedentes</span>
                                {this.state.showModificar
                                    ? <span><input type="file" onChange={this.onChangeFileInput} className="input-generico" name="formAntecedentes" /></span>
                                    : <span className="spanlink" onClick={() => openInNewTab(this.state.antecedentes.link)}>{this.state.antecedentes.name}</span>
                                }
                            </div>
                            <h3>Condiciones del contrato</h3>
                            <div>
                                <span>Fecha de inicio</span>
                                {this.state.showModificar
                                    ? <span><input className="input-generico" type="date" name="formFechainic" onChange={this.onChangeInput} value={this.state.form.formFechainic} /></span>
                                    : <span>{this.state.form.formFechainic}</span>
                                }
                            </div>
                            <div>
                                <span>Fecha de termino</span>
                                {this.state.showModificar
                                    ? <span className="formCheckbox">
                                        <input type="checkbox" name="formTermUndefined" /> indefinido
                                            <input className="input-generico" type="date" disabled name="formFechaterm" value={this.state.form.formFechaterm} onChange={this.onChangeInput} />
                                    </span>
                                    : <span>{this.state.form.formFechaterm}</span>
                                }
                            </div>
                            <div>
                                <span>Tipo de contrato</span>
                                {this.state.showModificar
                                    ? <span>
                                        <select name="formTipoContrato" onChange={this.onChangeInput} value={this.state.form.formTipoContrato} className="input-generico" >
                                            <option>Seleccione un tipo de contrato</option>
                                            <option value="1">Fijo</option>
                                            <option value="2">Indefinido</option>
                                            <option value="3">Otro</option>
                                        </select>
                                    </span>
                                    :
                                    <span>
                                        {this.state.form.formTipoContrato === "1" && 'Fijo'}
                                        {this.state.form.formTipoContrato === "2" && 'Indefinido'}
                                        {this.state.form.formTipoContrato === "3" && 'Otro'}
                                    </span>
                                }
                            </div>
                            <div>
                                <span>Contrato</span>
                                {this.state.showModificar
                                    ? <span><input type="file" onChange={this.onChangeFileInput} className="input-generico" name="formContrato" /></span>
                                    : <span className="spanlink" onClick={() => openInNewTab(this.state.contrato.link)}>{this.state.contrato.name}</span>
                                }
                            </div>
                            <h3>Desvinculación</h3>
                            <div>
                                <span>Finiquito</span>
                                {this.state.showModificar
                                    ? <span><input type="file" onChange={this.onChangeFileInput} className="input-generico" name="formFiniquito" /></span>
                                    : <span className="spanlink" onClick={() => openInNewTab(this.state.finiquito.link)}>{this.state.finiquito.name}</span>
                                }
                            </div>
                            <div>
                                <span>Carta Aviso/Renuncia</span>
                                {this.state.showModificar
                                    ? <span><input type="file" onChange={this.onChangeFileInput} className="input-generico" name="formRenuncia" /></span>
                                    : <span className="spanlink" onClick={() => openInNewTab(this.state.renuncia.link)}>{this.state.renuncia.name}</span>
                                }
                            </div>
                            {this.state.showModificar &&
                                <div className="form-group buttons">
                                    <button className="boton-generico btazul" onClick={this.enviaDatos}>Guardar</button>
                                    <button className="boton-generico btgris" type="button" onClick={this.retorno}>Cancelar</button>
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </div >
        );
    }
}

