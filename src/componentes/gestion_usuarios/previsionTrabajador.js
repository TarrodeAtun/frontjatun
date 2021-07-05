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

// importaciones de iconos 
import imagen from "../../assets/persona.svg";
import edit from "../../assets/iconos/edit.svg";
import { ReactComponent as Bamarillorev } from "../../assets/iconos/bamarillorev.svg";

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
        await Axios.get('/api/users/worker/' + id, { headers: authHeader() }) //se envia peticion axios con el token sesion guardado en local storage como cabecera
            .then(function (res) {   //si la peticion es satisfactoria entonces
                componente.setState({ datosUsuario: res.data });
            })
            .catch(function (err) { //en el caso de que se ocurra un error, axios lo atrapa y procesa
                return;
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
        await Axios.get('/api/users/worker/ficha/previsional/' + this.state.datosUsuario.rut, { headers: authHeader() }) //se envia peticion axios con el token sesion guardado en local storage como cabecera
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

    onChangeInput = (e) => {
        if (e.target.name === "apv") {
            this.setState({
                form: {
                    ...this.state.form, valorApv: ""
                },
                form: {
                    ...this.state.form, montoApv: ""
                }
            })
        }
        if (e.target.name === "pactada") {
            this.setState({
                form: {
                    ...this.state.form, valorSalud: ""
                },
                form: {
                    ...this.state.form, montoSalud: ""
                }
            })
        }
        this.setState({
            form: {
                ...this.state.form, [e.target.name]: e.target.value
            }
        })
    }
    onChangeSelectTipo = (e) => {
        console.log(e.target[e.target.selectedIndex].getAttribute('data-nombre'));
        this.setState({
            form: {
                ...this.state.form, [e.target.name]: e.target.value
            },
            labelTipoSalud: e.target[e.target.selectedIndex].getAttribute('data-nombre')
        })
    }
    onChangeSelectSalud = (e) => {
        console.log(e.target[e.target.selectedIndex].getAttribute('data-nombre'));
        this.setState({
            form: {
                ...this.state.form, [e.target.name]: e.target.value
            },
            labelSalud: e.target[e.target.selectedIndex].getAttribute('data-nombre')
        })
    }
    onChangeSelectAfp = (e) => {
        console.log(e.target[e.target.selectedIndex].getAttribute('data-nombre'));
        this.setState({
            form: {
                ...this.state.form, [e.target.name]: e.target.value
            },
            labelAfp: e.target[e.target.selectedIndex].getAttribute('data-nombre')
        })
    }
    editar = async event => {
        var objetivo = event.currentTarget.dataset.objetivo;
        objetivo = "show" + objetivo;
        if (this.state[objetivo]) {
            this.setState({ [objetivo]: false });
        } else {
            this.setState({ [objetivo]: true });
        }
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
            const res = await Axios.post('/api/users/worker/ficha/previsional/', {
                rut: this.state.datosUsuario.rut,
                afp: this.state.form.afp,
                apv: this.state.form.apv,
                valorApv: this.state.form.valorApv,
                montoApv: this.state.form.montoApv,
                tipoSalud: this.state.form.tipoSalud,
                prevision: this.state.form.prevision,
                pactada: this.state.form.pactada,
                valorSalud: this.state.form.valorSalud,
                montoSalud: this.state.form.montoSalud,
            }, { headers: authHeader() })
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
                    toast.error("Ha habido un error al enviar los datos", toastoptions);
                });
        } else {
            toast.warning("Debes llenar todos los campos", toastoptions);
        }
    }
    render() {

        let salud;
        console.log(this.state.form.tipoSalud);
        console.log(this.state.form.apv);
        if (this.state.form.tipoSalud === "1" || this.state.form.tipoSalud === 1) {
            console.log("asd");
            salud = this.state.isapres.map((isapre, index) =>
                <option value={isapre.key} data-list="isapre" checked={this.state.form.prevision === isapre.key ? true : false} data-nombre={isapre.Nombre}>{isapre.Nombre}</option>
            )
        } else if (this.state.form.tipoSalud === "2" || this.state.form.tipoSalud === 2) {
            salud = this.state.fonasas.map((fonasa, index) =>
                <option value={fonasa.key} data-list="fonasa" data-nombre={fonasa.nombre} >{fonasa.nombre}</option>
            )
        }
        let afps;
        if (this.state.afps) {
            afps = this.state.afps.map((afp, index) =>
                <option value={afp.key} data-nombre={afp.nombre} >{afp.nombre}</option>
            )
        }

        return (
            <div className="principal" id="component-perfil">
                <div>
                    <h2 className="amarillo"><Link to={`/personas/ficha-trabajador/${this.state.idUsuario}`}> <Bamarillorev /> </Link><span>Ficha</span> / <strong>Previsión Social</strong></h2>
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
                            <a className="edit-button" onClick={this.editar} data-objetivo="Modificar"><img src={edit} /></a>
                            <h3>Previsión Social</h3>
                            <div>
                                <span>AFP</span>
                                {this.state.showModificar
                                    ? <span>
                                        <select className="input-generico" value={this.state.form.afp} name="afp" onChange={this.onChangeSelectAfp}>
                                            <option value="">Seleccione una AFP</option>
                                            {afps}
                                        </select>
                                    </span>
                                    : <span>{this.state.labelAfp}</span>
                                }
                            </div>
                            <div className="sub-seccion">
                                <div>
                                    <span>APV</span>
                                    {this.state.showModificar
                                        ? <span className="radiocontainer">
                                            {this.state.form.apv === "1" || this.state.form.apv === 1
                                                ? <span><input type="radio" checked className="input-generico" name="apv" value="1" onChange={this.onChangeInput} required /><label>Si</label></span>
                                                : <span><input type="radio" className="input-generico" name="apv" value="1" onChange={this.onChangeInput} required /><label>Si</label></span>
                                            }
                                            {this.state.form.apv === "2" || this.state.form.apv === 2
                                                ? <span><input type="radio" checked className="input-generico" name="apv" value="2" onChange={this.onChangeInput} required /><label>No</label></span>
                                                : <span><input type="radio" className="input-generico" name="apv" value="2" onChange={this.onChangeInput} required /><label>No</label></span>
                                            }
                                        </span>
                                        : <span className="radiocontainer">
                                            {this.state.form.apv === "1" || this.state.form.apv === 1
                                                ? <span><input type="radio" checked disabled className="input-generico" name="apv" value="1" onChange={this.onChangeInput} required /><label>Si</label></span>
                                                : <span><input type="radio" disabled className="input-generico" name="apv" value="1" onChange={this.onChangeInput} required /><label>Si</label></span>
                                            }
                                            {this.state.form.apv === "2" || this.state.form.apv === 2
                                                ? <span><input type="radio" checked disabled className="input-generico" name="apv" value="2" onChange={this.onChangeInput} required /><label>No</label></span>
                                                : <span><input type="radio" disabled className="input-generico" name="apv" value="2" onChange={this.onChangeInput} required /><label>No</label></span>
                                            }
                                        </span>
                                    }
                                </div>
                                {parseInt(this.state.form.apv) === 1 &&
                                    <Fragment>
                                        <div>
                                            <span>Valor</span>
                                            {this.state.showModificar
                                                ? <span className="radiocontainer">
                                                    {this.state.form.valorApv === "1" || this.state.form.valorApv === 1
                                                        ? <span><input type="radio" checked className="input-generico" name="valorApv" value="1" onChange={this.onChangeInput} required /><label>$</label></span>
                                                        : <span><input type="radio" className="input-generico" name="valorApv" value="1" onChange={this.onChangeInput} required /><label>$</label></span>
                                                    }
                                                    {this.state.form.valorApv === "2" || this.state.form.valorApv === 2
                                                        ? <span><input type="radio" checked className="input-generico" name="valorApv" value="2" onChange={this.onChangeInput} required /><label>UF</label></span>
                                                        : <span><input type="radio" className="input-generico" name="valorApv" value="2" onChange={this.onChangeInput} required /><label>UF</label></span>
                                                    }
                                                    {this.state.form.valorApv === "3" || this.state.form.valorApv === 3
                                                        ? <span><input type="radio" checked className="input-generico" name="valorApv" value="3" onChange={this.onChangeInput} required /><label>Otro</label></span>
                                                        : <span><input type="radio" className="input-generico" name="valorApv" value="3" onChange={this.onChangeInput} required /><label>Otro</label></span>
                                                    }
                                                </span>
                                                : <span className="radiocontainer">
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
                                            }
                                        </div>
                                        <div>
                                            <span>Monto</span>
                                            {this.state.showModificar
                                                ? <span><input className="input-generico" type="number" name="montoApv" value={this.state.form.montoApv} onChange={this.onChangeInput} required /></span>
                                                : <span>{this.state.form.montoApv}</span>
                                            }
                                        </div>
                                    </Fragment>
                                }
                            </div>
                            <div className="sub-seccion">
                                <div>
                                    <span>Sistema Salud</span>
                                    {this.state.showModificar
                                        ? <span>
                                            <select className="input-generico" value={this.state.form.tipoSalud} onChange={this.onChangeSelectTipo} name="tipoSalud">
                                                <option value="">Seleccione un sistema</option>
                                                <option data-nombre="Isapre" value="1">Isapre</option>
                                                <option data-nombre="Fonasa" value="2">Fonasa</option>
                                            </select>
                                        </span>
                                        : <span>{this.state.labelTipoSalud}</span>
                                    }
                                </div>
                                <div>
                                    <span></span>
                                    {this.state.showModificar
                                        ? <span>
                                            <select className="input-generico" name="prevision" value={this.state.form.prevision} onChange={this.onChangeSelectSalud}>
                                                <option value="">Elija una opción</option>
                                                {salud}
                                            </select>
                                        </span>
                                        : <span>{this.state.labelSalud}</span>
                                    }
                                </div>
                            </div>
                            <div className="sub-seccion">
                                <div>
                                    <span>Cotización Pactada</span>
                                    {this.state.showModificar
                                        ? <span className="radiocontainer">
                                            {this.state.form.pactada === "1" || this.state.form.pactada === 1
                                                ? <span><input type="radio" checked className="input-generico" name="pactada" value="1" onChange={this.onChangeInput} required /><label>Si</label></span>
                                                : <span><input type="radio" className="input-generico" name="pactada" value="1" onChange={this.onChangeInput} required /><label>Si</label></span>
                                            }
                                            {this.state.form.pactada === "2" || this.state.form.pactada === 2
                                                ? <span><input type="radio" checked className="input-generico" name="pactada" value="2" onChange={this.onChangeInput} required /><label>No</label></span>
                                                : <span><input type="radio" className="input-generico" name="pactada" value="2" onChange={this.onChangeInput} required /><label>No</label></span>
                                            }
                                        </span>
                                        : <span className="radiocontainer">
                                            {this.state.form.pactada === "1" || this.state.form.pactada === 1
                                                ? <span><input type="radio" checked disabled className="input-generico" name="pactada" value="1" onChange={this.onChangeInput} required /><label>Si</label></span>
                                                : <span><input type="radio" disabled className="input-generico" name="pactada" value="1" onChange={this.onChangeInput} required /><label>Si</label></span>
                                            }
                                            {this.state.form.pactada === "2" || this.state.form.pactada === 2
                                                ? <span><input type="radio" checked disabled className="input-generico" name="pactada" value="2" onChange={this.onChangeInput} required /><label>No</label></span>
                                                : <span><input type="radio" disabled className="input-generico" name="pactada" value="2" onChange={this.onChangeInput} required /><label>No</label></span>
                                            }
                                        </span>
                                    }
                                </div>
                                {parseInt(this.state.form.pactada) === 1 &&
                                    <Fragment>
                                        <div>
                                            <span>Valor</span>
                                            {this.state.showModificar
                                                ? <span className="radiocontainer">
                                                    {this.state.form.valorSalud === "1" || this.state.form.valorSalud === 1
                                                        ? <span><input type="radio" checked className="input-generico" name="valorSalud" value="1" onChange={this.onChangeInput} required /><label>$</label></span>
                                                        : <span><input type="radio" className="input-generico" name="valorSalud" value="1" onChange={this.onChangeInput} required /><label>$</label></span>
                                                    }
                                                    {this.state.form.valorSalud === "2" || this.state.form.valorSalud === 2
                                                        ? <span><input type="radio" checked className="input-generico" name="valorSalud" value="2" onChange={this.onChangeInput} required /><label>UF</label></span>
                                                        : <span><input type="radio" className="input-generico" name="valorSalud" value="2" onChange={this.onChangeInput} required /><label>UF</label></span>
                                                    }
                                                    {this.state.form.valorSalud === "3" || this.state.form.valorSalud === 3
                                                        ? <span><input type="radio" checked className="input-generico" name="valorSalud" value="3" onChange={this.onChangeInput} required /><label>Otro</label></span>
                                                        : <span><input type="radio" className="input-generico" name="valorSalud" value="3" onChange={this.onChangeInput} required /><label>Otro</label></span>
                                                    }
                                                </span>
                                                : <span className="radiocontainer">
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
                                            }
                                        </div>
                                        <div>
                                            <span>Monto</span>
                                            {this.state.showModificar
                                                ? <span><input className="input-generico" type="number" name="montoSalud" value={this.state.form.montoSalud} onChange={this.onChangeInput} required /></span>
                                                : <span>{this.state.form.montoSalud}</span>
                                            }
                                        </div>
                                    </Fragment>
                                }
                                {this.state.showModificar &&
                                    <div className="form-group buttons">
                                        <button className="boton-generico btazul" onClick={this.enviaDatos}>Guardar</button>
                                        <button className="boton-generico btgris" type="button" onClick={this.retorno}>Cancelar</button>
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        );
    }
}

