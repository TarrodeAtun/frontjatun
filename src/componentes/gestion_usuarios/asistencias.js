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

export default class Asistencias extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentUser: autenticacion.currentUserValue,
            datosUsuario: "",
            form: {
                formZapato: '',
                formPantalon: '',
                formPolera: '',
                formPoleron: '',
            },
            showModificar: false,
            showOptions: true,
            idUsuario: ''
        };
    }
    async componentWillMount() {

    }
    async componentDidMount() {
        var componente = this;
        
        var { id } = this.props.match.params;
        this.setState({idUsuario:id});
        await Axios.get('/api/users/worker/' + id, { headers: authHeader() }) //se envia peticion axios con el token sesion guardado en local storage como cabecera
            .then(function (res) {   //si la peticion es satisfactoria entonces
                componente.setState({ datosUsuario: res.data });
            })
            .catch(function (err) { //en el caso de que se ocurra un error, axios lo atrapa y procesa
               return;
            });
        await Axios.get('/api/users/worker/ficha/equipo/' + this.state.datosUsuario.rut, { headers: authHeader() }) //se envia peticion axios con el token sesion guardado en local storage como cabecera
            .then(function (res) {   //si la peticion es satisfactoria entonces
                componente.setState({ 
                    form:{
                        formZapato: res.data.zapato,
                        formPantalon: res.data.pantalon,
                        formPolera: res.data.polera,
                        formPoleron: res.data.poleron
                    }
                });
            })
            .catch(function (err) { //en el caso de que se ocurra un error, axios lo atrapa y procesa
                // handleResponse(err.response);  //invocamos al manejador para ver el tipo de error y ejecutar la accion pertinente
                return;
            });
    }
    onChangeInput = (e) => {
        console.log(e.target.value);
        this.setState({
            form: {
                ...this.state.form, [e.target.name]: e.target.value
            }
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
            const res = await Axios.post('/api/users/worker/ficha/equipo/', {
                rut: this.state.datosUsuario.rut,
                zapato: this.state.form.formZapato,
                pantalon: this.state.form.formPantalon,
                polera: this.state.form.formPolera,
                poleron: this.state.form.formPoleron,
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
        return (
            <div className="principal" id="component-perfil">
                <div>
                    <h2 className="amarillo"><Link to={`/personas/ficha-trabajador/${this.state.idUsuario}`}> <Bamarillorev /> </Link><span>Trabajadores</span> / <strong>Ficha</strong></h2>
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
                            <a className="edit-button" onClick={this.editar} data-objetivo="Modificar"><img src={edit} /></a>
                            <h3>Tallas Equipo</h3>
                            <div>
                                <span>Zapato</span>
                                {this.state.showModificar
                                    ? <span><input className="input-generico" name="formZapato" onChange={this.onChangeInput} value={this.state.form.formZapato} /></span>
                                    : <span>{this.state.form.formZapato}</span>
                                }
                            </div>
                            <div>
                                <span>Pantalon</span>
                                {this.state.showModificar
                                    ? <span><input className="input-generico" name="formPantalon" value={this.state.form.formPantalon} onChange={this.onChangeInput} required /></span>
                                    : <span>{this.state.form.formPantalon}</span>
                                }
                            </div>
                            <div>
                                <span>Polera</span>
                                {this.state.showModificar
                                    ? <span><input className="input-generico" name="formPolera" value={this.state.form.formPolera} onChange={this.onChangeInput} required /></span>
                                    : <span>{this.state.form.formPolera}</span>
                                }
                            </div>
                            <div>
                                <span>Poleron</span>
                                {this.state.showModificar
                                    ? <span><input className="input-generico" name="formPoleron" value={this.state.form.formPoleron} onChange={this.onChangeInput} required /></span>
                                    : <span>{this.state.form.formPoleron}</span>
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

