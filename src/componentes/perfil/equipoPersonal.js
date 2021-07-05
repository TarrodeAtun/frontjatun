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
export default class EquipoTrabajador extends Component {
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
    async componentDidMount() {
        var componente = this;
        console.log(this.state.currentUser.data.usuariobd.rut);
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
        await Axios.get('/api/users/worker/ficha/equipo/' + autenticacion.currentUserValue.data.usuariobd.rut, { headers: authHeader() }) //se envia peticion axios con el token sesion guardado en local storage como cabecera
            .then(function (res) {   //si la peticion es satisfactoria entonces
                componente.setState({
                    form: {
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

    render() {
        return (
            <div className="principal" id="component-perfil">
                <div>
                    <h2 className="celeste"><Link to={`/perfil/ficha-personal`}> <Bcelesterev /> </Link> <strong>Ficha Personal</strong></h2>
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
                            <h3 className="celeste">Tallas Equipo</h3>
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

