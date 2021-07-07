// importaciones de bibliotecas 
import React, { Component, Fragment } from "react";
import { autenticacion } from '../../servicios/autenticacion';
import { Link } from 'react-router-dom';
import Axios from '../../helpers/axiosconf';
import { authHeader } from '../../helpers/auth-header';
import { handleResponse } from '../../helpers/manejador';
import { confirmAlert } from 'react-confirm-alert';
import { funciones } from '../../servicios/funciones';
import { toast } from 'react-toastify';

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

const toastoptions = {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
}

export default class OrdenesRetiro extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentUser: autenticacion.currentUserValue,
            datosUsuarios: "",
            users: null,
            ordenes: [],
            centrosCostos: '',

            pagina: 1,
            paginas: '',


            tarjeta: '',
            fecha: '',
            centro: '',
            estado: ''

        };
    }
    pad = (num, size) => {
        var s = "00000000" + num;
        s = s.substr(s.length - size);
        var f = s.substr(0, 4);
        var l = s.substr(4, 7);

        return f + " " + l;
    }
    paginacion = funciones.paginacion;

    paginar = async (e) => {
        console.log(e.currentTarget.dataset.pag);
        await this.setState({ pagina: e.currentTarget.dataset.pag })
        this.obtenerOrdenes();
    }

    componentDidMount = async (e) => {
        this.obtenerOrdenes();
        this.setState({ centrosCostos: await funciones.obtenerCentrosCostos() });
    }
    filtrar = async () => {
        this.obtenerOrdenes();
    }
    obtenerOrdenes = async () => {
        var componente = this;
        const res = Axios.post('/api/gestion-residuos/ordenes-retiro/', {
            tarjeta: this.state.tarjeta,
            fecha: this.state.fecha,
            centro: this.state.centro,
            estado: this.state.estado,
            pagina: this.state.pagina
        }, { headers: authHeader() }) //se envia peticion axios con el token sesion guardado en local storage como cabecera
            .then(function (res) {   //si la peticion es satisfactoria entonces
                console.log(res.data);
                componente.setState({ ordenes: res.data.data, paginas: res.data.paginas });  //almacenamos el listado de usuarios en el estado usuarios (array)
            })
            .catch(function (err) { //en el caso de que se ocurra un error, axios lo atrapa y procesa
                handleResponse(err.response);  //invocamos al manejador para ver el tipo de error y ejecutar la accion pertinente
                return;
            });

    }

    limpiar = async () => {
        this.setState({
            tarjeta: '',
            fecha: '',
            centro: '',
            estado: ''
        })
    }

    anularOrden = async (e) => {
        let id = e.currentTarget.dataset.id;
        var componente = this;
        confirmAlert({
            customUI: ({ onClose }) => {
                return (
                    <div className='custom-confirm '>
                        <p>¿Estas seguro de eliminar esta orden?, no podrás recuperarla</p>
                        <button className="boton-generico btazulalt" onClick={onClose}>Cancelar</button>
                        <button className="boton-generico btazul"
                            onClick={() => {
                                const res = Axios.post('/api/gestion-residuos/ordenes-retiro/anular',
                                    { id: id, },
                                    { headers: authHeader() }) //se envia peticion axios con el token sesion guardado en local storage como cabecera
                                    .then(function (res) {
                                        toast.success(res.data.mensaje, toastoptions);
                                        componente.obtenerOrdenes();
                                    })
                                    .catch(function (err) { //en el caso de que se ocurra un error, axios lo atrapa y procesa
                                        handleResponse(err.response);  //invocamos al manejador para ver el tipo de error y ejecutar la accion pertinente
                                        return;
                                    });
                                onClose();
                            }} >
                            Aceptar
                        </button>
                    </div>
                );
            }
        });

    }

    onChangeInput = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }


    render() {

        let items;
        if (this.state.ordenes.length > 0) {
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
                        {orden.estado < 3 &&
                            <span><Link onClick={this.anularOrden} data-id={orden._id}><Basurero /></Link></span>
                        }
                        {/* <span><button type="button"><Descarga /></button></span> */}
                    </td>
                </tr>
            )
        } else {
            items = <tr><td colSpan="6">No se han encontrado ordenes</td></tr>
        }

        let centrosCostos;
        if (this.state.centrosCostos) {
            centrosCostos = this.state.centrosCostos.map(centro => {
                return (<option value={centro.key} >{centro.nombre}</option>)
            });
        }

        let paginacion = funciones.paginacion(this.state.paginas, this.state.pagina, this.paginar);

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
                                <input className="input-generico" value={this.state.tarjeta} name="tarjeta" onChange={this.onChangeInput} placeholder="Nº Tarjeta cliente asignado…" />
                                <input type="date" name="fecha" value={this.state.fecha} onChange={this.onChangeInput} className="input-generico" placeholder="" />
                                <select className="input-generico" value={this.state.centro} name="centro" onChange={this.onChangeInput}>
                                    <option value="">Centro de costos</option>
                                    {centrosCostos}
                                </select>
                                <select className="input-generico" value={this.state.estado} name="estado" onChange={this.onChangeInput}>
                                    <option value="">Estado</option>
                                    <option value="0">Pendiente</option>
                                    <option value="1">Asignado</option>
                                    <option value="2">Ruta Asignada</option>
                                    <option value="3">Trazabilidad 1ra Clas</option>
                                    <option value="4">Trazabilidad 2da Clas</option>
                                    <option value="5">Finalizado</option>
                                    <option value="6">Anulado</option>
                                </select>
                            </div>
                            <div className="form-group buttons">
                                <button className="boton-generico btazul" onClick={this.filtrar} type="button">Filtrar</button>
                                <button className="boton-generico btblanco" onClick={this.limpiar} type="button">Limpiar</button>
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
                <div>
                    <ul className="paginador">
                        {paginacion}
                    </ul>
                </div>
            </div>
        );
    }
}