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
const direccionImagen = funciones.obtenerRutaUsuarios();
export default class PrevisionTrabajador extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentUser: autenticacion.currentUserValue,
            datosUsuario: "",
            form: {
                afp: '',
                apv: '',
                valorApv: '',
                montoApv: '',
                tipoSalud: '',
                prevision: '',
                pactada: '',
                valorSalud: '',
                montoSalud: ''
            },
            isapres: '',
            afps: '',
            fonasas: '',
            labelTipoSalud: '',
            labelSalud: '',
            labelAfp: '',
            showModificar: false,
            idUsuario: ''
        };
    }
    async componentDidMount() {
        var componente = this;
        var { id } = this.props.match.params;
        this.setState({ idUsuario: id });
        await componente.setState({ datosUsuario: this.state.currentUser.data.usuariobd });
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
        await Axios.get('/api/generales/isapres/', { headers: authHeader() }) //se envia peticion axios con el token sesion guardado en local storage como cabecera
            .then(function (res) {   //si la peticion es satisfactoria entonces
                console.log(res.data.data);
                componente.setState({ isapres: res.data.data });  //almacenamos el listado de usuarios en el estado usuarios (array)
            })
            .catch(function (err) { //en el caso de que se ocurra un error, axios lo atrapa y procesa
                handleResponse(err.response);  //invocamos al manejador para ver el tipo de error y ejecutar la accion pertinente
                return;
            });
        await Axios.get('/api/generales/afp/', { headers: authHeader() }) //se envia peticion axios con el token sesion guardado en local storage como cabecera
            .then(function (res) {   //si la peticion es satisfactoria entonces
                console.log(res.data.data);
                componente.setState({ afps: res.data.data });  //almacenamos el listado de usuarios en el estado usuarios (array)
            })
            .catch(function (err) { //en el caso de que se ocurra un error, axios lo atrapa y procesa
                handleResponse(err.response);  //invocamos al manejador para ver el tipo de error y ejecutar la accion pertinente
                return;
            });
        await Axios.get('/api/generales/fonasas/', { headers: authHeader() }) //se envia peticion axios con el token sesion guardado en local storage como cabecera
            .then(function (res) {   //si la peticion es satisfactoria entonces
                console.log(res.data.data);
                componente.setState({ fonasas: res.data.data });  //almacenamos el listado de usuarios en el estado usuarios (array)
            })
            .catch(function (err) { //en el caso de que se ocurra un error, axios lo atrapa y procesa
                handleResponse(err.response);  //invocamos al manejador para ver el tipo de error y ejecutar la accion pertinente
                return;
            });
        await Axios.get('/api/users/worker/ficha/previsional/' + autenticacion.currentUserValue.data.usuariobd.rut, { headers: authHeader() }) //se envia peticion axios con el token sesion guardado en local storage como cabecera
            .then(async function (res) {   //si la peticion es satisfactoria entonces
                await componente.setState({
                    form: {
                        afp: res.data.afp,
                        apv: res.data.apv,
                        valorApv: res.data.valorApv,
                        montoApv: res.data.montoApv,
                        tipoSalud: res.data.tipoSalud,
                        prevision: res.data.prevision,
                        pactada: res.data.pactada,
                        valorSalud: res.data.valorSalud,
                        montoSalud: res.data.montoSalud
                    }
                });
                if (res.data) {
                    var indiceAfp = await res.data.afp - 1;
                    var indiceSalud = await res.data.prevision - 1;
                    if (res.data.tipoSalud === 1) {
                        await componente.setState({
                            labelTipoSalud: "Isapre",
                            labelSalud: componente.state.isapres[indiceSalud].Nombre
                        });
                    }
                    if (res.data.tipoSalud === 2) {
                        await componente.setState({
                            labelTipoSalud: "Fonasa",
                            labelSalud: componente.state.fonasas[indiceSalud].nombre
                        });
                    }
                    await componente.setState({
                        labelAfp: componente.state.afps[indiceAfp].nombre
                    });
                }
            })
            .catch(function (err) { //en el caso de que se ocurra un error, axios lo atrapa y procesa
                // handleResponse(err.response);  //invocamos al manejador para ver el tipo de error y ejecutar la accion pertinente
                return;
            });

    }

    retorno = (e) => {
        historial.push('/personas/gestion');
    }

    render() {

        return (
            <div className="principal" id="component-perfil">
                <div>
                    <h2 className="celeste"><Link to={`/perfil/ficha-personal/`}> <Bcelesterev /> </Link><span>Ficha</span> / <strong>Previsión Social</strong></h2>
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
                            <h3>Previsión Social</h3>
                            <div>
                                <span>AFP</span>
                                <span>{this.state.labelAfp}</span>
                            </div>
                            <div className="sub-seccion">
                                <div>
                                    <span>APV</span>
                                    <span className="radiocontainer">
                                        {this.state.form.apv === "1" || this.state.form.apv === 1
                                            ? <span><input type="radio" checked disabled className="input-generico" name="apv" value="1" onChange={this.onChangeInput} required /><label>Si</label></span>
                                            : <span><input type="radio" disabled className="input-generico" name="apv" value="1" onChange={this.onChangeInput} required /><label>Si</label></span>
                                        }
                                        {this.state.form.apv === "2" || this.state.form.apv === 2
                                            ? <span><input type="radio" checked disabled className="input-generico" name="apv" value="2" onChange={this.onChangeInput} required /><label>No</label></span>
                                            : <span><input type="radio" disabled className="input-generico" name="apv" value="2" onChange={this.onChangeInput} required /><label>No</label></span>
                                        }
                                    </span>
                                </div>
                                <div>
                                    <span>Valor</span>
                                    <span className="radiocontainer">
                                        {this.state.form.valorApv === "1" || this.state.form.valorApv === 1
                                            ? <span><input type="radio" checked disabled className="input-generico" name="valorApv" value="1" onChange={this.onChangeInput} required /><label>$</label></span>
                                            : <span><input type="radio" disabled className="input-generico" name="valorApv" value="1" onChange={this.onChangeInput} required /><label>$</label></span>
                                        }
                                        {this.state.form.valorApv === "2" || this.state.form.valorApv === 2
                                            ? <span><input type="radio" checked disabled className="input-generico" name="valorApv" value="2" onChange={this.onChangeInput} required /><label>UF</label></span>
                                            : <span><input type="radio" disabled className="input-generico" name="valorApv" value="2" onChange={this.onChangeInput} required /><label>UF</label></span>
                                        }
                                        {this.state.form.valorApv === "3" || this.state.form.valorApv === 3
                                            ? <span><input type="radio" disabled checked className="input-generico" name="valorApv" value="3" onChange={this.onChangeInput} required /><label>Otro</label></span>
                                            : <span><input type="radio" disabled className="input-generico" name="valorApv" value="3" onChange={this.onChangeInput} required /><label>Otro</label></span>
                                        }
                                    </span>
                                </div>
                                <div>
                                    <span>Monto</span>
                                    <span>{this.state.form.montoApv}</span>
                                </div>
                            </div>
                            <div className="sub-seccion">
                                <div>
                                    <span>Sistema Salud</span>
                                    <span>{this.state.labelTipoSalud}</span>
                                </div>
                                <div>
                                    <span></span>
                                    <span>{this.state.labelSalud}</span>
                                </div>
                            </div>
                            <div className="sub-seccion">
                                <div>
                                    <span>Cotización Pactada</span>
                                    <span className="radiocontainer">
                                        {this.state.form.pactada === "1" || this.state.form.pactada === 1
                                            ? <span><input type="radio" checked disabled className="input-generico" name="pactada" value="1" onChange={this.onChangeInput} required /><label>Si</label></span>
                                            : <span><input type="radio" disabled className="input-generico" name="pactada" value="1" onChange={this.onChangeInput} required /><label>Si</label></span>
                                        }
                                        {this.state.form.pactada === "2" || this.state.form.pactada === 2
                                            ? <span><input type="radio" checked disabled className="input-generico" name="pactada" value="2" onChange={this.onChangeInput} required /><label>No</label></span>
                                            : <span><input type="radio" disabled className="input-generico" name="pactada" value="2" onChange={this.onChangeInput} required /><label>No</label></span>
                                        }
                                    </span>
                                </div>
                                <div>
                                    <span>Valor</span>
                                    <span className="radiocontainer">
                                        {this.state.form.valorSalud === "1" || this.state.form.valorSalud === 1
                                            ? <span><input type="radio" checked disabled className="input-generico" name="valorSalud" value="1" onChange={this.onChangeInput} required /><label>$</label></span>
                                            : <span><input type="radio" disabled className="input-generico" name="valorSalud" value="1" onChange={this.onChangeInput} required /><label>$</label></span>
                                        }
                                        {this.state.form.valorSalud === "2" || this.state.form.valorSalud === 2
                                            ? <span><input type="radio" checked disabled className="input-generico" name="valorSalud" value="2" onChange={this.onChangeInput} required /><label>UF</label></span>
                                            : <span><input type="radio" disabled className="input-generico" name="valorSalud" value="2" onChange={this.onChangeInput} required /><label>UF</label></span>
                                        }
                                        {this.state.form.valorSalud === "3" || this.state.form.valorSalud === 3
                                            ? <span><input type="radio" disabled checked className="input-generico" name="valorSalud" value="3" onChange={this.onChangeInput} required /><label>Otro</label></span>
                                            : <span><input type="radio" disabled className="input-generico" name="valorSalud" value="3" onChange={this.onChangeInput} required /><label>Otro</label></span>
                                        }
                                    </span>
                                </div>
                                <div>
                                    <span>Monto</span>
                                    <span>{this.state.form.montoSalud}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        );
    }
}

