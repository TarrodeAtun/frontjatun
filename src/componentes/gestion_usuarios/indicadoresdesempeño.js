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
import { Pie, Doughnut, defaults } from 'react-chartjs-2';

// importaciones de iconos 
import imagen from "../../assets/persona.svg";
import edit from "../../assets/iconos/edit.svg";
import { ReactComponent as Bamarillorev } from "../../assets/iconos/bamarillorev.svg";

import '../../styles/perfil.css';
import { async } from "rxjs";

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
// var originalDoughnutDraw = Chart.controllers.doughnut.prototype.draw;
// Chart.helpers.extend(Chart.controllers.doughnut.prototype, {
//   draw: function () {
//     originalDoughnutDraw.apply(this, arguments);
//     var chart = this.chart;
//     var width = chart.chart.width,
//       height = chart.chart.height,
//       ctx = chart.chart.ctx;
//     var fontSize = (height / 114).toFixed(2);
//     ctx.font = fontSize + "em sans-serif";
//     ctx.fillStyle = "#6D7278";
//     ctx.textBaseline = "middle";
//     var text = chart.config.data.text,
//       textX = Math.round((width - ctx.measureText(text).width) / 2),
//       textY = height / 2;
//     ctx.fillText(text, textX, textY);
//   }
// });

const options1 = {
    responsive: true,
    legend: {
        display: false,
        position: "bottom",
        labels: {
            fontSize: 18,
            fontColor: "#6D7278",
            fontFamily: "kanit light"
        }
    },
    tooltip: {
        callbacks: {
            label: function (tooltipItem, data) {
                const value = data['datasets'][0]['data'];
                return '$' + (value == -1 ? 0 : value);
            }
        }
    }
};

export default class EquipoTrabajador extends Component {
    constructor(props) {
        super(props);
        this.chart1 = React.createRef();
        this.chart2 = React.createRef();
        this.state = {
            currentUser: autenticacion.currentUserValue,
            datosUsuario: "",
            datos: '',
            showOptions: true,
            idUsuario: '',
            fecha: ''
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
        await this.obtenerRegistrosDesempeno();

    }
    obtenerRegistrosDesempeno = async () => {
        var componente = this;
        await Axios.post('/api/users/worker/desempeno/', { rut: this.state.datosUsuario.rut, fecha: this.state.fecha }, { headers: authHeader() }) //se envia peticion axios con el token sesion guardado en local storage como cabecera
            .then(function (res) {   //si la peticion es satisfactoria entonces
                console.log(res.data.data[0]);
                componente.setState({ datos: res.data.data[0] });
            })
            .catch(function (err) { //en el caso de que se ocurra un error, axios lo atrapa y procesa
                return;
            });
    }
    onChangeInput = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }
    filtrar = () => {
        this.obtenerRegistrosDesempeno();
    }

    render() {
        let chartData1 = [this.state.datos.numAsistenciasAnterior, this.state.datos.numTotalTurnosAnterior - this.state.datos.numAsistenciasAnterior]
        let showData1 = chartData1[0] + "%";
        var data1 = {

            datasets: [{
                data: chartData1,
                backgroundColor: [
                    'rgba(103, 185, 99, 1)',
                    'rgba(237, 237, 237, 1)',
                ],
                borderColor: [
                    'rgba(103, 185, 99, 1)',
                    'rgba(237, 237, 237, 1)',
                ],
            }]
            , text: showData1
        }

        let chartData2 = [this.state.datos.numAsistencias, this.state.datos.numTotalTurnos - this.state.datos.numAsistencias];
        let showData2 = chartData2[0] + "%";
        var data2 = {
            datasets: [{
                data: chartData2,
                backgroundColor: [
                    'rgba(103, 185, 99, 1)',
                    'rgba(237, 237, 237, 1)',
                ],
                borderColor: [
                    'rgba(103, 185, 99, 1)',
                    'rgba(237, 237, 237, 1)',
                ],
                borderWidth: 1,
            }],
            text: showData2
        }

        return (
            <div className="principal" id="component-perfil">
                <div>
                    <h2 className="amarillo"><Link to={`/perfil/ficha-personal`}> <Bamarillorev /> </Link> Ficha / <strong>Indicadores de Desempeño</strong></h2>
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
                                <h3 className="w100"><span>{this.state.datosUsuario.nombre} {this.state.datosUsuario.apellido}</span><span>{this.state.datosUsuario.rut}-{this.state.datosUsuario.dv}</span></h3>
                            </div>
                        </div>
                        <div className="seccion">
                            <div className="filtros block">
                                <div className="sup">
                                    <button>Filtros</button>
                                </div>
                                <div>
                                    <form>
                                        <div className="justify-center">
                                            <input type="date" name="fecha" onChange={this.onChangeInput} className="input-generico" placeholder="Nombre o Rut" />
                                            <button className="boton-generico btazul" onClick={this.filtrar} type="button">Filtrar</button>
                                            <button className="boton-generico btblanco" type="button">Limpiar</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>

                        <div className="seccion flex">
                            <h3 className="amarillo w100">N° asistencia / Turnos planificados</h3>
                            <div className="indicadores">
                                <div>
                                    <Doughnut ref={this.chart1} data={data1} width={200}
                                        height={200}
                                        options={options1} />
                                </div>
                                <div>
                                    <ul>
                                        <li>Mes anterior</li>
                                        <li>Mes año</li>
                                        <li>N° asistencias: {this.state.datos.numAsistenciasAnterior}</li>
                                        <li>Turnos planificados: {this.state.datos.numTotalTurnosAnterior}</li>
                                    </ul>
                                </div>
                            </div>
                            <div className="indicadores">
                                <div>
                                    <Doughnut ref={this.chart2} data={data2} width={200}
                                        height={200}
                                        options={options1} />
                                </div>
                                <div>
                                    <ul>
                                        <li>Mes en curso</li>
                                        <li>Mes año</li>
                                        <li>N° asistencias: {this.state.datos.numAsistencias}</li>
                                        <li>Turnos planificados: {this.state.datos.numTotalTurnos}</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="seccion indicadores-desempeño">
                            <h3 className="amarillo">Mes - Año</h3>
                            <div>
                                <span>N° inasistencias</span>
                                <span>{this.state.datos.numInasistencias}</span>
                            </div>
                            <div>
                                <span>N° atrasos</span>
                                <span>{this.state.datos.numAtrasos}</span>
                            </div>
                            <div>
                                <span>N° de faltas de equipamiento</span>
                                <span></span>
                            </div>
                            <div>
                                <span>- Chaleco reflectante</span>
                                <span>{this.state.datos.numFaltasChaleco}</span>
                            </div>
                            <div>
                                <span>- Zapato de seguridad</span>
                                <span>{this.state.datos.numFaltasZapatos}</span>
                            </div>
                            <div>
                                <span>- Gorro</span>
                                <span>{this.state.datos.numFaltasGorro}</span>
                            </div>
                            <div>
                                <span>- Casco</span>
                                <span>{this.state.datos.numFaltasCasco}</span>
                            </div>
                            <div>
                                <span>- Proteccion auditiva</span>
                                <span>{this.state.datos.numFaltasAudio}</span>
                            </div>
                            {/* <div>
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
                            </div> */}
                        </div>
                    </div>
                </div>
            </div >
        );
    }
}

