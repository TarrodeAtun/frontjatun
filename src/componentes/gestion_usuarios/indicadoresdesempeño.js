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
                    <h2 className="amarillo"><Link to={`/perfil/ficha-personal`}> <Bamarillorev /> </Link> <strong>Ficha Personal</strong></h2>
                    <div className="fichaPerfil">
                        <div className="seccion">
                            <div className="filtros block">
                                <div className="sup">
                                    <button>Filtros</button>
                                </div>
                                <div>
                                    <form>
                                        <div className="justify-center">
                                            <input type="date" className="input-generico" placeholder="Nombre o Rut" />
                                            <button className="boton-generico btazul" type="button">Filtrar</button>
                                            <button className="boton-generico btblanco" type="button">Limpiar</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>

                        <div className="seccion flex">
                            <h3 className="amarillo">N° asistencia / Turnos planificados</h3>
                            <div className="indicadores">
                                <div>

                                </div>
                                <div>
                                    <ul>
                                        <li>Mes Anterior</li>
                                        <li>Mes año</li>
                                        <li>N° asistencias</li>
                                        <li>Turnos planificados</li>
                                    </ul>
                                </div>
                            </div>
                            <div className="indicadores">
                                <div>

                                </div>
                                <div>
                                    <ul>
                                        <li>Mes Anterior</li>
                                        <li>Mes año</li>
                                        <li>N° asistencias</li>
                                        <li>Turnos planificados</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="seccion indicadores-desempeño">
                            <h3 className="amarillo">Mes - Año</h3>
                            <div>
                                <span>N° inasistencias</span>
                                <span></span>
                            </div>
                            <div>
                                <span>N° atrasos</span>
                                <span></span>
                            </div>
                            <div>
                                <span>N° de faltas de equipamiento</span>
                                <span></span>
                            </div>
                            <div>
                                <span>- Chaleco reflectante</span>
                                <span></span>
                            </div>
                            <div>
                                <span>- Zapato de seguridad</span>
                                <span></span>
                            </div>
                            <div>
                                <span>- Gorro</span>
                                <span></span>
                            </div>
                            <div>
                                <span>- Casco</span>
                                <span></span>
                            </div>
                            <div>
                                <span>- Proteccion auditiva</span>
                                <span></span>
                            </div>
                            <div>
                                <span>N° de faltas implementos</span>
                                <span></span>
                            </div>
                            <div>
                                <span>- Bolsas plásticas</span>
                                <span></span>
                            </div>
                            <div>
                                <span>- Guantes</span>
                                <span></span>
                            </div>
                            <div>
                                <span>- Basurero</span>
                                <span></span>
                            </div>
                            <div>
                                <span>- Escobillón</span>
                                <span></span>
                            </div>
                            <div>
                                <span>- Pala</span>
                                <span></span>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        );
    }
}

