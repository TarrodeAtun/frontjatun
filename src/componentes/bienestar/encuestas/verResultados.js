// importaciones de bibliotecas 
import React, { Component } from "react";
import { autenticacion } from '../../../servicios/autenticacion';
import { Link } from 'react-router-dom';
import Axios from '../../../helpers/axiosconf';
import { authHeader } from '../../../helpers/auth-header';
import { handleResponse } from '../../../helpers/manejador';

import { Pie, defaults } from 'react-chartjs-2';

// importaciones de estilos 
import '../../../styles/fichaTrabajador.css';

// importaciones de iconos 
import { ReactComponent as Bamarillorev } from "../../../assets/iconos/bamarillorev.svg";


export default class VerResultados extends Component {
    constructor(props) {
        super(props);
        this.chartReference = React.createRef();
        this.state = {
            currentUser: autenticacion.currentUserValue,
            datosUsuarios: "",
            nombreEncuesta: '',
            preguntas: [],
            preguntasoptions: [],
            respuestas: []
        };
    }

    async componentDidMount() {
        await this.cargarEncuesta();
    }

    cargarEncuesta = async () => { //genera una peticion get por axios a la api de usuarios
        var { id } = this.props.match.params;
        var componente = this;
        const res = Axios.get('/api/bienestar/encuestas/ver-resultado/' + id, { headers: authHeader() }) //se envia peticion axios con el token sesion guardado en local storage como cabecera
            .then(function (res) {   //si la peticion es satisfactoria entonces
                let datos = res.data.data;
                componente.setState({
                    nombreEncuesta: datos.nombre,
                    preguntas: datos.preguntas,
                    preguntasoptions: datos.opciones,
                    respuestas: datos.respuestas
                });
            })
            .catch(function (err) { //en el caso de que se ocurra un error, axios lo atrapa y procesa
                handleResponse(err.response);  //invocamos al manejador para ver el tipo de error y ejecutar la accion pertinente
                return;
            }).then(function () {
                console.log("ads")
            });

    }
    render() {
        const compo = this;
        let items;
        if (this.state.preguntas.length !== 0) {
            items = this.state.preguntas.map((pregunta, index) => {
                var labels = [];
                var respuestas = this.state.respuestas[index];
                console.log(respuestas);
                this.state.preguntasoptions[index].map((label) => {
                    labels.push(label.value);
                });
                var data = {
                    labels: labels,
                    datasets: [{
                        data: respuestas,
                        backgroundColor: [
                            'rgba(255, 99, 132, 1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 206, 86, 1)',
                            'rgba(75, 192, 192, 1)',
                            'rgba(153, 102, 255, 1)',
                            'rgba(255, 159, 64, 1)'
                        ],
                        borderColor: [
                            'rgba(255, 99, 132, 1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 206, 86, 1)',
                            'rgba(75, 192, 192, 1)',
                            'rgba(153, 102, 255, 1)',
                            'rgba(255, 159, 64, 1)'
                        ],
                    }]
                }
                return (
                    <div key={index} data-key={index} className="elemento">
                        <div className="enunciado">
                            <p>{index + 1}. {pregunta}</p>
                        </div>
                        <div className="grafico">
                            <Pie ref={this.chartReference} data={data} width={600}
                                height={200}
                                options={{ maintainAspectRatio: false }} />
                        </div>
                    </div>
                )

            });
        }
    

    return(
            <div className = "principal menu-lista-dashboard listaPreguntas" >
                <div>
                    <h2 className="naranjo"><Link to="/bienestar/encuestas/resultados"> <Bamarillorev /></Link> Mis Encuestas / <strong>Responder Encuesta</strong></h2>
                </div>
                <div className="listado-simple">
                    <div className="encabezado">
                        <h3 className="tituloencuesta naranjo amarillo">{this.state.nombreEncuesta}</h3>
                    </div>
                    <div ref={this.myref} className="elementos">
                        {items}
                    </div>
                </div>
            </div>
        );
    }
}