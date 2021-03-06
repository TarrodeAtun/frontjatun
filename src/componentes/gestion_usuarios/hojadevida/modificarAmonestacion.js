//importaciones de bibliotecas
import React, { Component } from "react";
import { autenticacion } from '../../../servicios/autenticacion';
import { Link } from 'react-router-dom';
import Axios from '../../../helpers/axiosconf';
import { authHeader } from '../../../helpers/auth-header';
import { handleResponse } from '../../../helpers/manejador';
import { historial } from '../../../helpers/historial';
import { funciones } from '../../../servicios/funciones';
import { toast } from 'react-toastify';
import { confirmAlert } from 'react-confirm-alert';
import moment from 'moment';

// importaciones de iconos 
import imagen from "../../../assets/persona.svg";
import edit from "../../../assets/iconos/edit.svg";
import { ReactComponent as Bamarillorev } from "../../../assets/iconos/bamarillorev.svg";

import '../../../styles/perfil.css';

const toastoptions = {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
}

export default class CrearAmonestacion extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentUser: autenticacion.currentUserValue,
            datosUsuario: "",
            form: {
                tipo: '',
                responsable: '',
                fecha: '',
                descripcion: '',
            },
            idAmonestacion: '',
            idUsuario: ''
        };
    }
    async componentDidMount() {
        var componente = this;
        var { id } = this.props.match.params;
        this.setState({idAmonestacion:id});
        await Axios.get('/api/users/worker/ficha/hojavida/obtenerAmonestacion/' + id, { headers: authHeader() }) //se envia peticion axios con el token sesion guardado en local storage como cabecera
            .then(function (res) {   //si la peticion es satisfactoria entonces
                console.log(res.data);
                componente.setState({
                    form: {
                        tipo: res.data.data.tipo,
                        responsable: res.data.data.responsable,
                        fecha: res.data.data.fecha,
                        descripcion: res.data.data.descripcion,
                    },
                    datosUsuario: res.data.dataUser,
                    idUsuario:res.data.dataUser._id
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
    retorno = (e) => {
        historial.push(`/personas/ficha-trabajador/hoja-de-vida/${this.state.idUsuario}`);
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
            confirmAlert({
                customUI: ({ onClose }) => {
                    return (
                        <div className='custom-confirm'>
                            <p>¿Esta seguro de modificar esta amonestacion?</p>
                            <button className="boton-generico btazulalt" onClick={onClose}>Cancelar</button>
                            <button className="boton-generico btazul"
                                onClick={async () => {
                                    const res = await Axios.post('/api/users/worker/ficha/hojavida/modificarAmonestacion', {
                                        id: this.state.idAmonestacion,
                                        tipo: this.state.form.tipo,
                                        responsable: this.state.form.responsable,
                                        fecha: this.state.form.fecha,
                                        descripcion: this.state.form.descripcion,
                                    }, { headers: authHeader() })
                                        .then(respuesta => {
                                            if (respuesta.data.estado === "success") {
                                                toast.success(respuesta.data.mensaje, toastoptions);
                                                onClose();
                                                this.retorno();
                                            } else if (respuesta.data.estado === "warning") {
                                                toast.warning(respuesta.data.mensaje, toastoptions);
                                            }
                                        })
                                        .catch(function (err) { //en el caso de que se ocurra un error, axios lo atrapa y procesa
                                            handleResponse(err.response);  //invocamos al manejador para ver el tipo de error y ejecutar la accion pertinente
                                            toast.error("Ha habido un error al enviar los datos", toastoptions);
                                        });


                                }}
                            >
                                Guardar
                    </button>
                        </div>
                    );
                }
            });
        } else {
            toast.warning("Debes llenar todos los campos", toastoptions);
        }

    }

    render() {
        return (
            <div className="principal" id="component-perfil">
                <div>
                    <h2 className="amarillo"><Link to={`/personas/ficha-trabajador/hoja-de-vida/${this.state.idUsuario}`}> <Bamarillorev /> </Link><span>Trabajadores</span> / <strong>Ficha</strong></h2>
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
                            <h3>Amonestacion</h3>
                            <div>
                                <span>Tipo</span>
                                <span>
                                    <select className="input-generico" placeholder="Nombre de la capacitación" name="tipo" value={this.state.form.tipo} onChange={this.onChangeInput} >
                                        <option value="1">Tipo 1</option>
                                        <option value="2">Tipo 2</option>
                                        <option value="3">Tipo 3</option>
                                    </select>
                                </span>
                            </div>
                            <div>
                                <span>Responsable</span>
                                <span><input className="input-generico" placeholder="Nombre persona o institución" name="responsable" value={this.state.form.responsable} onChange={this.onChangeInput} /></span>
                            </div>
                            <div>
                                <span>Fecha</span>
                                <span><input type="date" className="input-generico" name="fecha" value={this.state.form.fecha} onChange={this.onChangeInput} /></span>
                            </div>
                            <div>
                                <span>Descripción</span>
                                <span><input className="input-generico" name="descripcion" value={this.state.form.descripcion} onChange={this.onChangeInput} /></span>
                            </div>
                            <div className="form-group buttons">
                                <button className="boton-generico btazulalt" onClick={this.retorno}>Cancelar</button>
                                <button className="boton-generico btazul" type="button" onClick={this.enviaDatos}>Guardar</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        );
    }
}

