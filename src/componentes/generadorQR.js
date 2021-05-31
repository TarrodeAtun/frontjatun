import React, { Component } from 'react';
import ReactDOM from "react-dom";
import QRCode from "react-qr-code";
import Axios from '../helpers/axiosconf';
import { authHeader } from '../helpers/auth-header';
import { handleResponse } from '../helpers/manejador';

export default class LectorQR extends Component {
    constructor(props) {
        super(props)
        this.state = {
            delay: 500,
            result: 'No result',
            intervalo: ''
        }
    }
    componentDidMount() {
        console.log(this.props.props.datos);
        var intervalo = setInterval(this.consultaLecturaEfectiva, 2000);
        this.setState({ intervalo: intervalo });
    }
    componentWillUnmount() {
        // use intervalId from the state to clear the interval
        clearInterval(this.state.intervalo);
    }
    consultaLecturaEfectiva = async () => {
        var componente = this;
        let rut = this.props.props.datos.rut;
        const res = Axios.get('/api/users/worker/turnos/turnoVigente/' + rut, { headers: authHeader() }) //se envia peticion axios con el token sesion guardado en local storage como cabecera
            .then(function (res) {   //si la peticion es satisfactoria entonces
                console.log(res);
                if (res.data.ok && res.data.data.length === 0) {
                    componente.props.closeModal();
                    // let datos = { id: res.data.data[0]._id, rut: rut }
                    // componente.setState({ datosQR: datos })
                    // componente.setState({ showGeneradorQR: true });
                }

                // componente.setState({ turnos: res.data.data[0], trabajadores: res.data.data[0].trabajadores });  //almacenamos el listado de usuarios en el estado usuarios (array)
            })
            .catch(function (err) { //en el caso de que se ocurra un error, axios lo atrapa y procesa
                console.log(err);
                handleResponse(err.response);  //invocamos al manejador para ver el tipo de error y ejecutar la accion pertinente
                return;
            });
    }


    render() {
        return (
            <div className="QRbox">
                <h2 className="amarillo">QR Asistencia</h2>
                <QRCode
                    size="234"
                    value={JSON.stringify(this.props.props.datos)}
                />
                <h3>Valida tu asistencia con tu líder de cuadrilla</h3>
            </div>
        )
    }
}