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

export default class ModificarCapacitacion extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentUser: autenticacion.currentUserValue,
            datosUsuario: "",
            form: {
                curso: '',
                responsable: '',
                duracion: '',
                fecha: '',
                tematica: '',
                descripcion: '',
            },
            formCertificado: '',
            modCertificado:false,
            certificado: {
                name: '',
                link: ''
            },
            idCapacitacion: '',
            idCapacitacion: ''
        };
    }

    async componentDidMount() {
        var componente = this;
        var { id } = this.props.match.params;
        this.setState({idCapacitacion:id});
        await Axios.get('/api/users/worker/ficha/hojavida/obtenerCapacitacion/' + id, { headers: authHeader() }) //se envia peticion axios con el token sesion guardado en local storage como cabecera
            .then(function (res) {   //si la peticion es satisfactoria entonces
                console.log(res.data);
                componente.setState({
                    form: {
                        curso: res.data.data.curso,
                        responsable: res.data.data.responsable,
                        duracion: res.data.data.duracion,
                        fecha: res.data.data.fecha,
                        tematica: res.data.data.tematica,
                        descripcion: res.data.data.descripcion,
                    },
                    datosUsuario: res.data.dataUser,
                    idUsuario:res.data.dataUser._id
                });
                componente.setState({
                    certificado: {
                        name: res.data.data.certificado[0].input,
                        link: res.data.data.certificado[0].url
                    }
                })

            })
            .catch(function (err) { //en el caso de que se ocurra un error, axios lo atrapa y procesa
                // handleResponse(err.response);  //invocamos al manejador para ver el tipo de error y ejecutar la accion pertinente
                return;
            });
        console.log(this.state.datosUsuario);
    }
    onChangeInput = (e) => {
        console.log(e.target.value);
        this.setState({
            form: {
                ...this.state.form, [e.target.name]: e.target.value
            }
        })
    }
    onChangeFileInput = (e) => {
        console.log(e.target.files[0]);
        this.setState({
            [e.target.name]: e.target.files[0]
        })
    }
    retorno = (e) => {
        historial.push('/personas/gestion');
    }
    changeModCert = (e) => {
        this.setState({modCertificado:true})
    }

    enviaDatos = async e => {
        e.preventDefault();
        confirmAlert({
            customUI: ({ onClose }) => {
                return (
                    <div className='custom-confirm '>
                        <p>¿Quieres actualizar esta capacitación?</p>
                        <button className="boton-generico btazulalt" onClick={onClose}>Cancelar</button>
                        <button className="boton-generico btazul"
                            onClick={async () => {
                                var formData = new FormData();
                                formData.append('certificado', this.state.formCertificado)
                                var campoVacio = false;
                                console.log(this.state.form);
                                await Object.entries(this.state.form).map((t, k) => {
                                    if (t[1] === "" || t[1] === null) {
                                        campoVacio = true;
                                    }
                                });
                                if (!campoVacio) {

                                    formData.append("id", this.state.idCapacitacion);
                                    formData.append("curso", this.state.form.curso);
                                    formData.append("responsable", this.state.form.responsable);
                                    formData.append("duracion", this.state.form.duracion);
                                    formData.append("fecha", this.state.form.fecha);
                                    formData.append("tematica", this.state.form.tematica);
                                    formData.append("descripcion", this.state.form.descripcion);
                                    const res = await Axios.post('/api/users/worker/ficha/hojavida/modificarCapacitacion', formData, { headers: authHeader() })
                                        .then(respuesta => {
                                            if (respuesta.data.estado === "success") {
                                                toast.success(respuesta.data.mensaje, toastoptions);
                                                onClose();
                                                // historial.push(`/personas/ficha-trabajador/hoja-de-vida/` + this.state.idUsuario)
                                            } else if (respuesta.data.estado === "warning") {
                                                toast.warning(respuesta.data.mensaje, toastoptions);
                                                onClose();
                                            }
                                        })
                                        .catch(function (err) { //en el caso de que se ocurra un error, axios lo atrapa y procesa
                                            handleResponse(err.response);  //invocamos al manejador para ver el tipo de error y ejecutar la accion pertinente
                                            onClose();
                                            toast.error("Ha habido un error al enviar los datos", toastoptions);
                                        });
                                } else {
                                    toast.warning("Debes llenar todos los campos", toastoptions);
                                }

                            }}
                        >
                            Aceptar
                    </button>
                    </div>
                );
            }
        });



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
                            <h3>Capacitacion</h3>
                            <div>
                                <span>Nombre curso</span>
                                <span><input className="input-generico" placeholder="Nombre de la capacitación" name="curso" value={this.state.form.curso} onChange={this.onChangeInput} /></span>
                            </div>
                            <div>
                                <span>Responsable</span>
                                <span><input className="input-generico" placeholder="Nombre persona o institución" name="responsable" value={this.state.form.responsable} onChange={this.onChangeInput} /></span>
                            </div>
                            <div>
                                <span>Duración en Hrs</span>
                                <span><input className="input-generico" name="duracion" value={this.state.form.duracion} onChange={this.onChangeInput} /></span>
                            </div>
                            <div>
                                <span>Fecha</span>
                                <span><input type="date" className="input-generico" name="fecha" value={this.state.form.fecha} onChange={this.onChangeInput} /></span>
                            </div>
                            <div>
                                <span>Temática</span>
                                <span><input className="input-generico" name="tematica" value={this.state.form.tematica} onChange={this.onChangeInput} /></span>
                            </div>
                            <div>
                                <span>Descripción</span>
                                <span><input className="input-generico" name="descripcion" value={this.state.form.descripcion} onChange={this.onChangeInput} /></span>
                            </div>
                            <div>
                                <span>Certificado</span>
                                {this.state.modCertificado
                                ? <span><input className="input-generico" type="file" name="formCertificado" onChange={this.onChangeFileInput} /></span>
                                : <span>{this.state.certificado.name} <button onClick={this.changeModCert}>X</button></span>

                                }

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

