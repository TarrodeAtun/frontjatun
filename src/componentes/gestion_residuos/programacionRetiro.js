// importaciones de bibliotecas 
import React, { Component, ReactDOM } from "react";
import { autenticacion } from '../../servicios/autenticacion';
import { Link } from 'react-router-dom';
import Axios from '../../helpers/axiosconf';
import { authHeader } from '../../helpers/auth-header';
import { handleResponse } from '../../helpers/manejador';
import moment from 'moment';
import { confirmAlert } from 'react-confirm-alert';
import { toast } from 'react-toastify';

// importaciones de estilos 
import '../../styles/fichaTrabajador.css';


// importaciones de iconos 
import fichaper from "../../assets/iconos/fichaper.svg";
import turnos from "../../assets/iconos/turnos.svg";
import { ReactComponent as Basurero } from "../../assets/iconos/basurero.svg";
import { ReactComponent as Ojo } from "../../assets/iconos/ojo.svg";
import { ReactComponent as Bverderev } from "../../assets/iconos/bverderev.svg";
import { ReactComponent as Flechaver } from "../../assets/iconos/flechaver.svg";
import { historial } from "../../helpers/historial";

const toastoptions = {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
}

export default class GestionResiduos extends Component {
    constructor(props) {
        super(props);
        this.myRef = React.createRef();
        this.state = {
            currentUser: autenticacion.currentUserValue,
            datosUsuarios: "",
            users: null,
            horas: [],
            estado: '',
            fecha: ''
        };
    }
    pad = (num, size) => {
        var s = "00000000" + num;
        s = s.substr(s.length - size);
        var f = s.substr(0, 4);
        var l = s.substr(4, 7);

        return f + " " + l;
    }
    componentDidMount = () => {
        var componente = this;
        var fecha = new Date();
        console.log(fecha);
        const res = Axios.post('/api/gestion-residuos/retiros/', { fecha: fecha, estado: this.state.estado }, { headers: authHeader() }) //se envia peticion axios con el token sesion guardado en local storage como cabecera
            .then(function (res) {   //si la peticion es satisfactoria entonces
                console.log(res.data.data);
                componente.setState({ horas: res.data.data });  //almacenamos el listado de usuarios en el estado usuarios (array)
            })
            .catch(function (err) { //en el caso de que se ocurra un error, axios lo atrapa y procesa
                handleResponse(err.response);  //invocamos al manejador para ver el tipo de error y ejecutar la accion pertinente
                return;
            });
        var node = this.myRef.current;
        this.recalculaEspacios(node);
    }
    obtenerRetiros = (e) => {
        var componente = this;
        const res = Axios.post('/api/gestion-residuos/retiros/', { fecha: this.state.fecha, estado: this.state.estado }, { headers: authHeader() }) //se envia peticion axios con el token sesion guardado en local storage como cabecera
            .then(function (res) {   //si la peticion es satisfactoria entonces
                console.log(res.data.data);
                componente.setState({ horas: res.data.data });  //almacenamos el listado de usuarios en el estado usuarios (array)
            })
            .catch(function (err) { //en el caso de que se ocurra un error, axios lo atrapa y procesa
                handleResponse(err.response);  //invocamos al manejador para ver el tipo de error y ejecutar la accion pertinente
                return;
            });
        var node = this.myRef.current;
        this.recalculaEspacios(node);
    }

    recalculaEspacios = async (nodo) => {
        var columnas;
        var subespacio;
        nodo.classList.add("asd");
        console.log("recalculando");
        columnas = nodo.children;
        for await (var espacio of columnas) {
            //por cada columna
            subespacio = await espacio;
            var referentes = await [];
            for await (var elemento of subespacio.children) {
                referentes.push(elemento.style.top);
            }
            var repetidos = await {};
            var empuje = await [];
            var anchos = await [];
            await referentes.forEach(function (numero) {
                repetidos[numero] = (repetidos[numero] || 0) + 1;
                empuje[numero] = 0;
                anchos[numero] = 0;
                console.log(empuje);
            });
            for await (var elemento of subespacio.children) {
                var factor = repetidos[elemento.style.top];
                empuje[elemento.style.top] = await empuje[elemento.style.top] + anchos[elemento.style.top];
                anchos[elemento.style.top] = 129 / factor;
                elemento.style.left = empuje[elemento.style.top] + "px";
                elemento.style.width = anchos[elemento.style.top] + "px";
            }
        }
    }

    onChangeInput = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }
    onChangeFecha = async (e) => {
        console.log(e.target.value);
        await this.setState({
            fecha: e.target.value
        })
        this.obtenerRetiros();
    }

    anularRetiro = async (e) => {
        let id = e.currentTarget.dataset.id;
        let retiro = e.currentTarget.dataset.retiro;
        console.log(id, retiro);
        var componente = this;
        confirmAlert({
            customUI: ({ onClose }) => {
                return (
                    <div className='custom-confirm '>
                        <p>¿Estas seguro de eliminar esta asignacion?, los datos de OR se mantendrán y se establecerá en pendiente</p>
                        <button className="boton-generico btazulalt" onClick={onClose}>Cancelar</button>
                        <button className="boton-generico btazul"
                            onClick={() => {
                                const res = Axios.post('/api/gestion-residuos/retiros/anular',
                                    { or: id, retiro: retiro },
                                    { headers: authHeader() }) //se envia peticion axios con el token sesion guardado en local storage como cabecera
                                    .then(function (res) {
                                        toast.success(res.data.mensaje, toastoptions);
                                        componente.obtenerRetiros();
                                    })
                                    .catch(function (err) { //en el caso de que se ocurra un error, axios lo atrapa y procesa
                                        console.log(err);
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




    filtrar = async () => {
        this.obtenerRetiros();
    }

    limpiar = async () => {
        this.setState({
            tarjeta: '',
            fecha: '',
            centro: '',
            estado: ''
        })
    }

    pushDetalle = (e) => {
        var id = e.currentTarget.dataset.id;
        historial.push(`/residuos/control-retiro/ver-retiro/${id}`);
    }
    calculaPosicion = (e, index) => {
        var inicio = e.inicio.replace(":", '');
        inicio = parseInt(inicio) / 100;
        var termino = e.termino.replace(":", '');
        termino = parseInt(termino) / 100;
        var posinic = inicio * 2 * 17.5;
        var posfin = termino * 2 * 17.5;
        var height = posfin - posinic;
        var node = this.myRef.current;
        this.recalculaEspacios(node);
        return { top: posinic, height: height, zIndex: index };
    }
    render() {
        var componente = this;
        var items;
        var lunes = [];
        var martes = [];
        var miercoles = [];
        var jueves = [];
        var viernes = [];
        var sabado = [];
        var domingo = [];
        console.log("asdzxc");
        if (this.state.horas.length !== 0) {
            console.log("adz");
            this.state.horas.map((hora, index) => {
                var fech = new Date(hora.fecha);
                console.log(fech.getDay());
            });

            lunes = this.state.horas.map((hora, index) => {
                var fech = new Date(hora.fecha);
                if (fech.getDay() === 0) {
                    console.log(fech.getDay());
                    return (<div className="prueba" data-id={hora._id} onClick={this.pushDetalle} style={componente.calculaPosicion(hora)}>
                        <span> {hora.datosCentro[0].nombre} </span>
                        <span> OR  {this.pad(hora.or, 8)} </span>
                        <span> {hora.inicio} - {hora.termino} </span>
                    </div>)
                }
            });
            martes = this.state.horas.map((hora, index) => {
                var fech = new Date(hora.fecha);
                if (fech.getDay() === 1) {
                    return (<div className="prueba" data-id={hora._id} onClick={this.pushDetalle} style={componente.calculaPosicion(hora)}>
                        <span> {hora.datosCentro[0].nombre} </span>
                        <span> OR  {this.pad(hora.or, 8)} </span>
                        <span> {hora.inicio} - {hora.termino} </span>
                    </div>)
                }
            });
            miercoles = this.state.horas.map((hora, index) => {
                var fech = new Date(hora.fecha);
                if (fech.getDay() === 2) {
                    return (<div className="prueba" data-id={hora._id} onClick={this.pushDetalle} style={componente.calculaPosicion(hora)}>
                        <span> {hora.datosCentro[0].nombre} </span>
                        <span> OR  {this.pad(hora.or, 8)} </span>
                        <span> {hora.inicio} - {hora.termino} </span>
                    </div>)
                }
            });
            jueves = this.state.horas.map((hora, index) => {
                var fech = new Date(hora.fecha);
                if (fech.getDay() === 3) {
                    console.log("asd");
                    return (<div className="prueba" data-id={hora._id} onClick={this.pushDetalle} style={componente.calculaPosicion(hora)}>
                        <span> {hora.datosCentro[0].nombre} </span>
                        <span> OR  {this.pad(hora.or, 8)} </span>
                        <span> {hora.inicio} - {hora.termino} </span>
                    </div>)
                }
            });

            viernes = this.state.horas.map((hora, index) => {
                var fech = new Date(hora.fecha);
                if (fech.getDay() === 4) {
                    return (<div className="prueba" data-id={hora._id} onClick={this.pushDetalle} style={componente.calculaPosicion(hora, index)}>
                        <span> {hora.datosCentro[0].nombre} </span>
                        <span> OR  {this.pad(hora.or, 8)} </span>
                        <span> {hora.inicio} - {hora.termino} </span>
                    </div>)
                }
            });
            sabado = this.state.horas.map((hora, index) => {
                var fech = new Date(hora.fecha);
                if (fech.getDay() === 5) {
                    return (<div className="prueba" data-id={hora._id} onClick={this.pushDetalle} style={componente.calculaPosicion(hora, index)}>
                        <span> {hora.datosCentro[0].nombre} </span>
                        <span> OR  {this.pad(hora.or, 8)} </span>
                        <span> {hora.inicio} - {hora.termino} </span>
                    </div>)
                }
            });
            domingo = this.state.horas.map((hora, index) => {
                var fech = new Date(hora.fecha);
                if (fech.getDay() === 6) {
                    return (<div className="prueba" data-id={hora._id} onClick={this.pushDetalle} style={componente.calculaPosicion(hora)}>
                        <span> {hora.datosCentro[0].nombre} </span>
                        <span> OR  {this.pad(hora.or, 8)} </span>
                        <span> {hora.inicio} - {hora.termino} </span>
                    </div>)
                }
            });
            console.log(this.state.horas);
            if (this.state.horas.length > 0) {
                items = this.state.horas.map((hora, index) => (
                    <tr className="elemento ">
                        <td>{hora.datosCliente[0].nombre}</td>
                        <td>{hora.datosCentro[0].nombre}</td>
                        <td className="columna">
                            <span>{moment(hora.fecha).format('DD-MM-YYYY')}</span>
                            {/* <span><strong>Personalizado</strong></span>
                        <span>desde 03/03/2021</span>
                        <span>hasta 31/03/2021</span> */}
                        </td>
                        <td>{hora.inicio} - {hora.termino}</td>
                        <td>{this.pad(hora.or, 8)}</td>
                        <td className="asignado">
                            {hora.datosOR.estado === 0 &&
                                <td className="amarillo">
                                    <div>
                                        Pendiente
                                    </div>
                                </td>
                            }
                            {hora.datosOR.estado === 1 &&
                                <td className="verde">  <div>
                                    Asignado
                                </div></td>

                            }
                            {hora.datosOR.estado === 2 &&
                                <td className="azul"> <div>
                                    Ruta Asignada
                                </div></td>

                            }
                            {hora.datosOR.estado === 3 &&
                                <td className="azul"> <div>
                                    Trazabilidad 1ra Clas
                                </div></td>

                            }
                            {hora.datosOR.estado === 4 &&
                                <td className="azul"> <div>
                                    Trazabilidad 2da Clas
                                </div></td>

                            }
                            {hora.datosOR.estado === 5 &&
                                <td className="azul"> <div>
                                    Finalizado
                                </div></td>

                            }
                            {hora.datosOR.estado === 6 &&
                                <td className=""> <div>
                                    Anulado
                                </div></td>

                            }
                        </td>
                        <td className="acciones">
                            <span><Link to={`/residuos/control-retiro/ver-retiro/${hora._id}`}><Ojo /></Link></span>
                            {hora.datosOR.estado < 3 &&
                                <span><Link onClick={this.anularRetiro} data-id={hora.or} data-retiro={hora._id}><Basurero /></Link></span>
                            }
                        </td>
                    </tr>
                ))
            } else {
                console.log("ad");
                items = <tr>
                    <td colSpan="7">
                        No se encontraron retiros programados
                    </td>
                </tr>
            }


        } else {
            console.log("ad");
            items = <tr className="elemento">
                <td colSpan="7" >
                    No se encontraron retiros programados
                </td>
            </tr>
        }




        return (
            <div className="principal gestion-residuos menu-lista-dashboard" >
                <div>
                    <h2 className="verde"><Link to="/residuos/control-retiro"> <Bverderev /></Link><span className="verde"> Control de Retiro</span> / <strong>Programación de Retiro</strong></h2>
                    <div className="fichaPerfil">
                        <div className="seccion calendario">
                            <div className="encabezado flex">
                                <h3 className="verde inline-block">Calendario retiros programados</h3>
                                <input className="fechaProgra" onChange={this.onChangeFecha} type="date"></input>
                            </div>
                            <div className="grilla">
                                <table className="fondo encabezado" >
                                    <thead>
                                        <th>HRS</th>
                                        <th>Lun</th>
                                        <th>Mar</th>
                                        <th>Mie</th>
                                        <th>Jue</th>
                                        <th>Vie</th>
                                        <th>Sab</th>
                                        <th>Dom</th>
                                    </thead>
                                    <tbody>
                                        <colgroup><col /></colgroup>
                                        <tr>
                                            <td colSpan="8" className="grid-container">
                                                <table className="fondo filas">
                                                    <tbody>
                                                        <tr><td><span></span></td><td colSpan="7"></td></tr>
                                                        <tr><td><span>01:00</span></td><td colSpan="7"></td></tr>
                                                        <tr><td><span>02:00</span></td><td colSpan="7"></td></tr>
                                                        <tr><td><span>03:00</span></td><td colSpan="7"></td></tr>
                                                        <tr><td><span>04:00</span></td><td colSpan="7"></td></tr>
                                                        <tr><td><span>05:00</span></td><td colSpan="7"></td></tr>
                                                        <tr><td><span>06:00</span></td><td colSpan="7"></td></tr>
                                                        <tr><td><span>07:00</span></td><td colSpan="7"></td></tr>
                                                        <tr><td><span>08:00</span></td><td colSpan="7"></td></tr>
                                                        <tr><td><span>09:00</span></td><td colSpan="7"></td></tr>
                                                        <tr><td><span>10:00</span></td><td colSpan="7"></td></tr>
                                                        <tr><td><span>11:00</span></td><td colSpan="7"></td></tr>
                                                        <tr><td><span>12:00</span></td><td colSpan="7"></td></tr>
                                                        <tr><td><span>13:00</span></td><td colSpan="7"></td></tr>
                                                        <tr><td><span>14:00</span></td><td colSpan="7"></td></tr>
                                                        <tr><td><span>15:00</span></td><td colSpan="7"></td></tr>
                                                        <tr><td><span>16:00</span></td><td colSpan="7"></td></tr>
                                                        <tr><td><span>17:00</span></td><td colSpan="7"></td></tr>
                                                        <tr><td><span>18:00</span></td><td colSpan="7"></td></tr>
                                                        <tr><td><span>19:00</span></td><td colSpan="7"></td></tr>
                                                        <tr><td><span>20:00</span></td><td colSpan="7"></td></tr>
                                                        <tr><td><span>21:00</span></td><td colSpan="7"></td></tr>
                                                        <tr><td><span>22:00</span></td><td colSpan="7"></td></tr>
                                                        <tr><td><span>23:00</span></td><td colSpan="7"></td></tr>
                                                    </tbody>
                                                </table>
                                                <table className="fondo columnas" border="1">
                                                    <tbody>
                                                        <tr ref={this.myRef}>
                                                            <td></td>
                                                            <td>{lunes}</td>
                                                            <td>{martes}</td>
                                                            <td>{miercoles}</td>
                                                            <td>{jueves}</td>
                                                            <td>{viernes}</td>
                                                            <td>{sabado}</td>
                                                            <td>{domingo}</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>

                            </div>
                        </div>
                        <div className="seccion">
                            <div className="filtros">
                                <div className="sup">
                                    <button>Filtros</button>
                                    <Link to="/residuos/control-retiro/crear-retiro">Nuevo Retiro</Link>
                                </div>
                                <div>
                                    <form>
                                        <div className="form-group justify-center">
                                            <select className="input-generico" value={this.state.estado} name="estado" onChange={this.onChangeInput}>
                                                <option>Todos los estados</option>
                                                <option value="0">Pendiente</option>
                                                <option value="1">Asignado</option>
                                                <option value="2">Ruta Asignada</option>
                                                <option value="3">Trazabilidad 1ra Clas</option>
                                                <option value="4">Trazabilidad 2da Clas</option>
                                                <option value="5">Finalizado</option>
                                                <option value="6">Anulado</option>
                                            </select>
                                            <div className="buttons-space">
                                                <button className="boton-generico btazul" onClick={this.filtrar} type="button">Filtrar</button>
                                                <button className="boton-generico btblanco" onClick={this.limpiar} type="button">Limpiar</button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                        <div className="listado-simple tabla full">
                            <table>
                                <thead>
                                    <th>Cliente</th>
                                    <th>Centro Costos</th>
                                    <th>Fecha retiro</th>
                                    <th>Jornada</th>
                                    <th>Referencia</th>
                                    <th>Estado</th>
                                    <th>Acciones</th>
                                </thead>
                                <tbody className="retiros">
                                    {items}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}