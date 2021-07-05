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


// importaciones de iconos 
import { ReactComponent as Bverderev } from "../../assets/iconos/bverderev.svg";
// importaciones de iconos 

import { ReactComponent as Basurero } from "../../assets/iconos/basurero.svg";
import { ReactComponent as Ojo } from "../../assets/iconos/ojo.svg";
import { ReactComponent as Edit } from "../../assets/iconos/edit.svg";
import { ReactComponent as Plus } from "../../assets/iconos/X.svg";

export default class OrdenesRetiro extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentUser: autenticacion.currentUserValue,
            datosUsuarios: "",
            users: null,
            ordenes: ''
        };
    }
    pad = (num, size) => {
        var s = "00000000" + num;
        s = s.substr(s.length - size);
        var f = s.substr(0, 4);
        var l = s.substr(4, 7);

        return f + " " + l;
    }
    componentDidMount = (e) => {
        var componente = this;
        const res = Axios.get('/api/gestion-residuos/ordenes-retiro/', { headers: authHeader() }) //se envia peticion axios con el token sesion guardado en local storage como cabecera
            .then(function (res) {   //si la peticion es satisfactoria entonces
                console.log(res.data.data);
                componente.setState({ ordenes: res.data.data });  //almacenamos el listado de usuarios en el estado usuarios (array)
            })
            .catch(function (err) { //en el caso de que se ocurra un error, axios lo atrapa y procesa
                handleResponse(err.response);  //invocamos al manejador para ver el tipo de error y ejecutar la accion pertinente
                return;
            });
    }
    render() {

        let items;
        if (this.state.ordenes) {
            console.log(this.state.ordenes);
            items = this.state.ordenes.map((orden, index) =>
                <tr className="">
                    <td>
                        {this.pad(orden.idor, 8)}
                    </td>
                    <td>{orden.datosCentro[0].nombre}</td>
                    <td>{moment(orden.retiro).utc().format('DD-MM-YYYY')}</td>

                    {orden.estado === 0 &&
                        <td className="amarillo">
                            <div>
                                Pendiente
                            </div>
                        </td>
                    }
                    {orden.estado === 1 &&
                        <td className="verde">  <div>
                            Asignado
                      </div></td>

                    }
                    {orden.estado === 2 &&
                        <td className="azul"> <div>
                            Ruta Asignada
                      </div></td>

                    }
                     {orden.estado === 3 &&
                        <td className="azul"> <div>
                            Trazabilidad 1ra Clas
                      </div></td>

                    }
                     {orden.estado === 4 &&
                        <td className="azul"> <div>
                            Trazabilidad 2da Clas
                      </div></td>

                    }
                     {orden.estado === 5 &&
                        <td className="azul"> <div>
                            Finalizado
                      </div></td>

                    }
                    {orden.estado === 6 &&
                        <td className=""> <div>
                            Anulado
                     </div></td>

                    }


                    <td>{orden.tarjeta}</td>

                    <td className="acciones">
                    <span><Link to={`/residuos/control-retiro/orden-retiro/ver-orden/${orden._id}`}><Ojo /></Link></span>
                        {orden.estado === 0 &&
                            <Fragment>
                                
                                <span><Link to={`/residuos/control-retiro/orden-retiro/modificar-orden/${orden._id}`}><Edit /></Link></span>
                            </Fragment>
                        }

                        <span><Link ><Basurero /></Link></span>
                        {/* <span><button type="button"><Descarga /></button></span> */}
                    </td>
                </tr>
            )
        }



        return (
            <div className="principal gestion-personas" id="component-listar-trabajadores">
                <div>
                    <h2 className="verde"><Link to="/residuos/control-retiro"> <Bverderev /></Link> <span className="verde">Control de Retiro / </span> <strong>OR</strong></h2>
                </div>
                <div className="filtros">
                    <div className="sup">
                        <button>Filtros</button>
                        <Link to="/residuos/control-retiro/orden-retiro/nueva-orden"><Plus /> Nueva OR</Link>
                    </div>
                    <div>
                        <form>
                            <div className="form-group justify-center filtros-or">
                                <input className="input-generico" placeholder="Nº Tarjeta cliente asignado…" />
                                <input type="date" className="input-generico" placeholder="" />
                                <select className="input-generico">
                                    <option>Centro de costos</option>
                                </select>
                                <select className="input-generico">
                                    <option>Estado</option>
                                </select>
                            </div>
                            <div className="form-group buttons">
                                <button className="boton-generico btazul" type="button">Filtrar</button>
                                <button className="boton-generico btblanco" type="button">Limpiar</button>
                            </div>
                        </form>
                    </div>
                </div>
                <div className="listado">
                    <table className="tableor">
                        <thead>
                            <th>N° OR</th>
                            <th>Centro Costos</th>
                            <th>Fecha Retiro</th>
                            <th>Estado</th>
                            <th>N° Tarjeta</th>
                            <th>Acciones</th>
                        </thead>
                        <tbody>
                            {items}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}