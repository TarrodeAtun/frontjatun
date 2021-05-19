// importaciones de bibliotecas 
import React, { Component, Fragment } from "react";
import { autenticacion } from '../../servicios/autenticacion';
import { Link } from 'react-router-dom';
import Axios from '../../helpers/axiosconf';
import { authHeader } from '../../helpers/auth-header';
import { handleResponse } from '../../helpers/manejador';
import moment from 'moment';

// importaciones de estilos 
import '../../styles/fichaTrabajador.css';

import { ReactComponent as Edit } from "../../assets/iconos/edit.svg";
import { ReactComponent as Ojo } from "../../assets/iconos/ojo.svg";
import { ReactComponent as Basurero } from "../../assets/iconos/basurero.svg";
import { ReactComponent as Bverderev } from "../../assets/iconos/bverderev.svg";
import { ReactComponent as Flechaver } from "../../assets/iconos/flechaver.svg";




import { toast } from "react-toastify";

const toastoptions = {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
}

export default class ResultadosEncuestas extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentUser: autenticacion.currentUserValue,
            datosUsuarios: "",
            showAgregarMensaje: '',
            consultas: [],
            nombreCliente: '',
            rut: '',
            planes: '',
            idCliente: '',
        };
    }



    async componentDidMount() {
        var componente = this;
        var { id } = this.props.match.params;
        this.setState({ idCliente: id });
        const res = Axios.get('/api/generales/cliente/datos/' + id, { headers: authHeader() }) //se envia peticion axios con el token sesion guardado en local storage como cabecera
            .then(function (res) {   //si la peticion es satisfactoria entonces
                console.log(res.data)
                componente.setState({
                    nombreCliente: res.data.data.nombre,
                    rut: res.data.data.rut,
                });  //almacenamos el listado de usuarios en el estado usuarios (array)
                Axios.get('/api/gestion-residuos/plan-manejo/obtener-planes/' + res.data.data.rut, { headers: authHeader() }) //se envia peticion axios con el token sesion guardado en local storage como cabecera
                    .then(function (resp) {   //si la peticion es satisfactoria entonces
                        console.log(resp.data.data);
                        componente.setState({
                            planes: resp.data.data
                        });  //almacenamos el listado de usuarios en el estado usuarios (array)


                    })
                    .catch(function (err) { //en el caso de que se ocurra un error, axios lo atrapa y procesa
                        handleResponse(err.response);  //invocamos al manejador para ver el tipo de error y ejecutar la accion pertinente
                        return;
                    });

            })
            .catch(function (err) { //en el caso de que se ocurra un error, axios lo atrapa y procesa
                handleResponse(err.response);  //invocamos al manejador para ver el tipo de error y ejecutar la accion pertinente
                return;
            });
    }


    render() {
        let planes;
        if (this.state.planes && this.state.planes.length !== 0) {
            planes = this.state.planes.map((plan, index) =>
                <tr className="elemento">
                    <td>{plan.nombre}</td>
                    {plan.estado === 0
                        ? <td className="verde">Activo</td>
                        : <td className="amarillo">Finalizado</td>
                    }
                    <td className="acciones">
                        <span><Link to={`/residuos/plan-manejo`}><Ojo /></Link></span>
                        <span><Link to={`/residuos/plan-manejo/ver/${plan._id}`}><Edit /></Link></span>
                        <span><Link ><Basurero /></Link></span>
                    </td>
                </tr>
            )
        } else {
            planes = <tr className="elemento" >
                <td colSpan="3">
                    Este cliente no tiene planes aun
                </td>
            </tr>
        }

        return (
            <Fragment>
                <div className="principal menu-lista-dashboard">
                    <div>
                        <h2 className="verde"><Link to="/residuos/plan-manejo"> <Bverderev /></Link> Plan Manejo de Residuos /  <strong>{this.state.nombreCliente}</strong></h2>
                    </div>
                    <div>
                        <div className="prehead">
                            <h3 className="tituloencuesta verde">{this.state.nombreCliente}</h3>
                            <button className="ml"> Excel</button>
                        </div>
                        <table className="listado-simple tabla">
                            <tbody>
                                <tr className="elemento">
                                    <td>Razon Social</td>
                                    <td></td>
                                </tr>
                                <tr className="elemento">
                                    <td>Rut</td>
                                    <td>{this.state.rut}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="principal menu-lista-dashboard">
                    <div>
                        <div className="prehead">
                            <h3 className="tituloencuesta verde">Planes</h3>
                            <button className="ml"><Link to={`/residuos/plan-manejo/crear/${this.state.idCliente}`}>+ Nuevo Plan</Link></button>
                        </div>
                        <table className="listado-simple tabla">
                            <tbody>
                                {planes}
                            </tbody>
                        </table>
                    </div>
                </div>
            </Fragment>

        );
    }
}