//importaciones de bibliotecas
import React, { Component, Fragment } from "react";
import { autenticacion } from '../../servicios/autenticacion';
import { Link } from 'react-router-dom';
import Axios from '../../helpers/axiosconf';
import { authHeader } from '../../helpers/auth-header';
import { handleResponse } from '../../helpers/manejador';
import { historial } from '../../helpers/historial';
import { funciones } from '../../servicios/funciones';
import { toast } from 'react-toastify';
import moment from 'moment';

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
const direccionImagen = funciones.obtenerRutaUsuarios();
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
                formSueldo: '',
                formJornada: '',
                liquiMAuno: '',
                liquiMAdos: '',
                liquiMAtres: '',
                liquiMAcuatro: '',
                liquiMAcinco: '',
                liquiMAseis: '',
            },
            formCedula: '',
            formAntecedentes: '',
            formContrato: '',
            formFiniquito: '',
            formRenuncia: '',
            
            formLiquiuno: '',
            formLiquidos: '',
            formLiquitres: '',
            formLiquicuatro: '',
            formLiquicinco: '',
            formLiquiseis: '',

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

            liquiuno: {
                name: '',
                link: ''
            },
            liquidos: {
                name: '',
                link: ''
            },
            liquitres: {
                name: '',
                link: ''
            },
            liquicuatro: {
                name: '',
                link: ''
            },
            liquicinco: {
                name: '',
                link: ''
            },
            liquiseis: {
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
        if(this.state.datosUsuario.imagen){
            if(this.state.datosUsuario.imagen.length > 0){
                this.setState({
                    fotoPerfil: direccionImagen+this.state.datosUsuario.imagen[0].url
                })
            }else{
                this.setState({
                    fotoPerfil: imagen
                })
            }
        }else{
            this.setState({
                fotoPerfil: imagen
            })
        }
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
                        formSueldo: res.data.sueldo,
                        formJornada: res.data.jornada,
                        liquiMAuno: res.data.liquiMAuno,
                        liquiMAdos: res.data.liquiMAdos,
                        liquiMAtres: res.data.liquiMAtres,
                        liquiMAcuatro: res.data.liquiMAcuatro,
                        liquiMAcinco: res.data.liquiMAcinco,
                        liquiMAseis: res.data.liquiMAseis,
                    }
                });
                res.data.archivos.forEach(archivo => {
                    console.log(archivo);
                    componente.setState({
                        [archivo.input]: {
                            name: [archivo.input],
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
                    <h2 className="celeste"><Link to={`/perfil/ficha-personal`}> <Bcelesterev /> </Link><span>Mi Perfil</span> / <strong>Ficha</strong></h2>
                    <div className="fichaPerfil">
                        <div className="seccion encabezado">
                            <div className="fotoperfil">
                                <div className="foto-container">
                                    {this.state.fotoPerfil &&
                                        <img className="imgPerfil" src={this.state.fotoPerfil} />
                                    }
                                </div>
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
                                    ? <span><input className="input-generico" type="number" name="formHijos" value={this.state.form.formHijos} onChange={this.onChangeInput} /></span>
                                    : <span>{this.state.form.formHijos}</span>
                                }
                            </div>
                            <div>
                                <span>Carga Familiar</span>
                                {this.state.showModificar
                                    ? <span className="formRadio" name="formCarga" onChange={this.onChangeInput}>
                                        {this.state.form.formCarga === "1"
                                            ? <Fragment>
                                                <input type="radio" value="1" checked name="formCarga" /> Si
                                                <input type="radio" value="0" name="formCarga" /> no
                                            </Fragment>
                                            : <Fragment>
                                                <input type="radio" value="1" name="formCarga" /> Si
                                                <input type="radio" value="0" checked name="formCarga" /> no
                                            </Fragment>
                                        }
                                    </span>
                                    : <span>
                                        {this.state.form.formCarga === "1" && 'Si'}
                                        {this.state.form.formCarga === "0" && 'No'}
                                    </span>
                                }
                            </div>
                            <div>
                                <span>Cedula de identidad</span>
                                {this.state.showModificar
                                    ? <span><input type="file" onChange={this.onChangeFileInput} className="input-generico" name="formCedula" /></span>
                                    : <Fragment>
                                        {this.state.cedula.name
                                            ? <span className="spanlink" onClick={() => openInNewTab(this.state.cedula.link)}>{this.state.cedula.name}</span>
                                            : <span >No se ha ingresado aún</span>
                                        }
                                    </Fragment>
                                }
                            </div>
                            <div>
                                <span>Certificado de antecedentes</span>
                                {this.state.showModificar
                                    ? <span><input type="file" onChange={this.onChangeFileInput} className="input-generico" name="formAntecedentes" /></span>
                                    : <Fragment>
                                        {this.state.antecedentes.name
                                            ? <span className="spanlink" onClick={() => openInNewTab(this.state.antecedentes.link)}>{this.state.antecedentes.name}</span>
                                            : <span>No se ha ingresado aún</span>
                                        }

                                    </Fragment>
                                }
                            </div>
                            <h3>Condiciones del contrato</h3>
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
                                <span>Tipo de jornada</span>
                                {this.state.showModificar
                                    ? <span>
                                        <select name="formJornada" onChange={this.onChangeInput} value={this.state.form.formJornada} className="input-generico" >
                                            <option value="">Seleccione un tipo de contrato</option>
                                            <option value="1">Full Time</option>
                                            <option value="2">Part Time</option>
                                        </select>
                                    </span>
                                    :
                                    <span>
                                        {this.state.form.formJornada === 1 && 'Full Time'}
                                        {this.state.form.formJornada === 2 && 'Part Time'}
                                    </span>
                                }
                            </div>
                            <div>
                                <span>Sueldo base mensual</span>
                                {this.state.showModificar
                                    ? <span><input className="input-generico" type="number" name="formSueldo" onChange={this.onChangeInput} value={this.state.form.formSueldo} /></span>
                                    : <span>{this.state.form.formSueldo }</span>
                                }
                            </div>
                            <div>
                                <span>Fecha de inicio</span>
                                {this.state.showModificar
                                    ? <span><input className="input-generico" type="date" name="formFechainic" onChange={this.onChangeInput} value={moment(this.state.form.formFechainic).utc().format("YYYY-MM-DD")} /></span>
                                    : <span>{this.state.form.formFechainic ? moment(this.state.form.formFechainic).utc().format("DD-MM-YYYY") : "No establecida"}</span>
                                }
                            </div>
                            <div>
                                <span>Fecha de termino</span>
                                {this.state.showModificar
                                    ? <span className="formCheckbox">

                                        {parseInt(this.state.form.formTipoContrato) === 2
                                            ? <input className="input-generico" type="date" disabled name="formFechaterm" />
                                            : <input className="input-generico" type="date" name="formFechaterm" value={moment(this.state.form.formFechaterm).utc().format("YYYY-MM-DD")} onChange={this.onChangeInput} />
                                        }
                                    </span>
                                    : <span>{this.state.form.formFechaterm ? moment(this.state.form.formFechaterm).utc().format("DD-MM-YYYY") : "No establecida"}</span>
                                }
                            </div>
                            <h3>Liquidaciones de Sueldo (Ultimas 6)</h3>
                            <div>
                                {this.state.showModificar
                                    ? <Fragment>
                                        <span><input className="input-generico" name="liquiMAuno" value={this.state.form.liquiMAuno} onChange={this.onChangeInput} placeholder="Especifica mes y año" /></span>
                                        <span><input type="file" onChange={this.onChangeFileInput} name="formLiquiuno" className="input-generico" /></span>
                                    </Fragment>
                                    : <Fragment>
                                        <span>{this.state.form.liquiMAuno}</span>
                                        {this.state.liquiuno.name
                                            ? <span className="spanlink" onClick={() => openInNewTab(this.state.liquiuno.link)}>{this.state.liquiuno.name}</span>
                                            : <span>No se ha ingresado aún</span>
                                        }
                                    </Fragment>
                                }
                            </div>
                            <div>
                                {this.state.showModificar
                                    ? <Fragment>
                                        <span><input className="input-generico" name="liquiMAdos" value={this.state.form.liquiMAdos} onChange={this.onChangeInput} placeholder="Especifica mes y año" /></span>
                                        <span><input type="file" onChange={this.onChangeFileInput} name="formLiquidos" className="input-generico" /></span>
                                    </Fragment>
                                    : <Fragment>
                                        <span>{this.state.form.liquiMAdos}</span>
                                        {this.state.liquidos.name
                                            ? <span className="spanlink" onClick={() => openInNewTab(this.state.liquidos.link)}>{this.state.liquidos.name}</span>
                                            : <span>No se ha ingresado aún</span>
                                        }
                                    </Fragment>
                                }
                            </div>
                            <div>
                                {this.state.showModificar
                                    ? <Fragment>
                                        <span><input className="input-generico" name="liquiMAtres" value={this.state.form.liquiMAtres} onChange={this.onChangeInput} placeholder="Especifica mes y año" /></span>
                                        <span><input type="file" onChange={this.onChangeFileInput} name="formLiquitres" className="input-generico" /></span>
                                    </Fragment>
                                    : <Fragment>
                                        <span>{this.state.form.liquiMAtres}</span>
                                        {this.state.liquitres.name
                                            ? <span className="spanlink" onClick={() => openInNewTab(this.state.liquitres.link)}>{this.state.liquitres.name}</span>
                                            : <span>No se ha ingresado aún</span>
                                        }
                                    </Fragment>
                                }
                            </div>
                            <div>
                                {this.state.showModificar
                                    ? <Fragment>
                                        <span><input className="input-generico" name="liquiMAcuatro" value={this.state.form.liquiMAcuatro} onChange={this.onChangeInput} placeholder="Especifica mes y año" /></span>
                                        <span><input type="file" onChange={this.onChangeFileInput} name="formLiquicuatro" className="input-generico" /></span>
                                    </Fragment>
                                    : <Fragment>
                                        <span>{this.state.form.liquiMAcuatro}</span>
                                        {this.state.liquicuatro.name
                                            ? <span className="spanlink" onClick={() => openInNewTab(this.state.liquicuatro.link)}>{this.state.liquicuatro.name}</span>
                                            : <span>No se ha ingresado aún</span>
                                        }
                                    </Fragment>
                                }
                            </div>
                            <div>
                                {this.state.showModificar
                                    ? <Fragment>
                                        <span><input className="input-generico" name="liquiMAcinco" value={this.state.form.liquiMAcinco} onChange={this.onChangeInput} placeholder="Especifica mes y año" /></span>
                                        <span><input type="file" onChange={this.onChangeFileInput} name="formLiquicinco" className="input-generico" /></span>
                                    </Fragment>
                                    : <Fragment>
                                        <span>{this.state.form.liquiMAcinco}</span>
                                        {this.state.liquicinco.name
                                            ? <span className="spanlink" onClick={() => openInNewTab(this.state.liquicinco.link)}>{this.state.liquicinco.name}</span>
                                            : <span>No se ha ingresado aún</span>
                                        }
                                    </Fragment>
                                }
                            </div>
                            <div>
                                {this.state.showModificar
                                    ? <Fragment>
                                        <span><input className="input-generico" name="liquiMAseis" value={this.state.form.liquiMAseis} onChange={this.onChangeInput} placeholder="Especifica mes y año" /></span>
                                        <span><input type="file" onChange={this.onChangeFileInput} name="formLiquiseis" className="input-generico" /></span>
                                    </Fragment>
                                    : <Fragment>
                                        <span>{this.state.form.liquiMAseis}</span>
                                        {this.state.liquiseis.name
                                            ? <span className="spanlink" onClick={() => openInNewTab(this.state.liquiseis.link)}>{this.state.liquiseis.name}</span>
                                            : <span>No se ha ingresado aún</span>
                                        }
                                    </Fragment>
                                }
                            </div>
                            <h3>Desvinculación</h3>
                            <div>
                                <span>Finiquito</span>
                                {this.state.showModificar
                                    ? <span><input type="file" onChange={this.onChangeFileInput} className="input-generico" name="formFiniquito" /></span>
                                    : <Fragment>
                                        {this.state.finiquito.name
                                            ? <span className="spanlink" onClick={() => openInNewTab(this.state.finiquito.link)}>{this.state.finiquito.name}</span>
                                            : <span>No se ha ingresado aún</span>
                                        }
                                    </Fragment>
                                }
                            </div>
                            <div>
                                <span>Carta Aviso/Renuncia</span>
                                {this.state.showModificar
                                    ? <span><input type="file" onChange={this.onChangeFileInput} className="input-generico" name="formRenuncia" /></span>
                                    : <Fragment>
                                        {this.state.renuncia.name
                                            ? <span className="spanlink" onClick={() => openInNewTab(this.state.renuncia.link)}>{this.state.renuncia.name}</span>
                                            : <span>No se ha ingresado aún</span>
                                        }
                                    </Fragment>
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

