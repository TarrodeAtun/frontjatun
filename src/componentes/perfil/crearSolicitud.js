//importaciones de bibliotecas
import React, { Component } from "react";
import { autenticacion } from '../../servicios/autenticacion';
import { Link } from 'react-router-dom';
import Axios from '../../helpers/axiosconf';
import { authHeader } from '../../helpers/auth-header';
import { handleResponse } from '../../helpers/manejador';
import { funciones } from '../../servicios/funciones';
import moment from 'moment';
// import DatePicker from "react-multi-date-picker";
import { Calendar } from "react-multi-date-picker";
import { toast } from 'react-toastify';

import '../../styles/listarTrabajadores.css';


// importaciones de iconos 
import { ReactComponent as Bcelesterev } from "../../assets/iconos/bcelesterev.svg";
import { ReactComponent as Basurero } from "../../assets/iconos/basurero.svg";
import { ReactComponent as Ojo } from "../../assets/iconos/ojo.svg";
import { ReactComponent as Descarga } from "../../assets/iconos/descarga.svg";
import { ReactComponent as Flechaam } from "../../assets/iconos/flechaam.svg";
import { ReactComponent as Plus } from "../../assets/iconos/X.svg";


//importamos manejadores de modal
import Modal from '../includes/modal';
import { toogleModalCore } from '../includes/funciones';
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

export default class ListarTrabajadores extends Component {


    constructor(props) {
        super(props);
        this.myRef = React.createRef();
        this.state = {
            currentUser: autenticacion.currentUserValue,
            datosUsuario: "",
            registros: [],
            pagina: 1,
            paginas: '',
            fechas: '',
            trabajadores: '',
            turnosReemplazo: []

        };
    }

    toogleModal = toogleModalCore; //copiamos la funcion modal a una funcion local
    paginacion = funciones.paginacion;
    manejadorModals = (e, res) => { //creamos una funcion que reciba parametros para pasarlo al toogle modal (esta funcion la pasaremos al cuerpo del modal como propiedad para ejecutarse por autoreferencia)
        this.toogleModal(e, res);
    }
    numPaginasTurnos = async () => {
        var componente = this;
        var rut = autenticacion.currentUserValue.data.usuariobd.rut;
        const res = Axios.post('/api/users/worker/turnos/paginas', { rut: rut }, { headers: authHeader() }) //se envia peticion axios con el token sesion guardado en local storage como cabecera
            .then(function (res) {   //si la peticion es satisfactoria entonces
                componente.setState({ paginas: res.data.paginas });
            })
            .catch(function (err) { //en el caso de que se ocurra un error, axios lo atrapa y procesa
                handleResponse(err.response);  //invocamos al manejador para ver el tipo de error y ejecutar la accion pertinente
                return;
            });
    }
    listadoTurnos = async () => { // hay que llamar los dias en los que el trabajador tiene un turno asignado dentro del mes (onMonthChange function, ver biblioteca de plugin)
        var componente = this;
        var rut = autenticacion.currentUserValue.data.usuariobd.rut;
        const res = Axios.post('/api/users/worker/turnos/mes', { rut: rut, notReemplazo: rut }, { headers: authHeader() }) //se envia peticion axios con el token sesion guardado en local storage como cabecera
            .then(function (res) {   //si la peticion es satisfactoria entonces
                console.log(res.data.data);

                componente.setState({ registros: res.data.data });  //almacenamos el listado de usuarios en el estado usuarios (array)
            })
            .catch(function (err) { //en el caso de que se ocurra un error, axios lo atrapa y procesa
                handleResponse(err.response);  //invocamos al manejador para ver el tipo de error y ejecutar la accion pertinente
                return;
            });
    }
    listadoTrabajadores = async () => { // hay que llamar los dias en los que el trabajador tiene un turno asignado dentro del mes (onMonthChange function, ver biblioteca de plugin)
        var componente = this;
        var rut = autenticacion.currentUserValue.data.usuariobd.rut;
        const res = Axios.post('/api/users/worker/trabajadoresPost', { rut: rut }, { headers: authHeader() }) //se envia peticion axios con el token sesion guardado en local storage como cabecera
            .then(function (res) {   //si la peticion es satisfactoria entonces
                // console.log(res.data.data);
                componente.setState({ trabajadores: res.data.data });  //almacenamos el listado de usuarios en el estado usuarios (array)
            })
            .catch(function (err) { //en el caso de que se ocurra un error, axios lo atrapa y procesa
                handleResponse(err.response);  //invocamos al manejador para ver el tipo de error y ejecutar la accion pertinente
                return;
            });
    }
    enviaDatos = async () => {
        var node = this.myRef.current;
        let filas = node.children;
        let turnos = [];
        if (filas.length > 0) {
            for await (var fila of filas) {
                console.log(fila.children[0].children[0].checked);
                if(fila.children[0].children[0].checked){
                    turnos.push({ rut: fila.children[3].children[0].value, turno: fila.children[3].children[0].dataset.turno })
                }
            }
            const res = await Axios.post('/api/users/worker/turnos/crear-reemplazo-perfil/', {
                rutUsuario: autenticacion.currentUserValue.data.usuariobd.rut,
                turnos: turnos
            }, { headers: authHeader() })
                .then(respuesta => {
                    if (respuesta.data.estado === "success") {
                        toast.success(respuesta.data.mensaje, toastoptions);
                    } else if (respuesta.data.estado === "warning") {
                        toast.warning(respuesta.data.mensaje, toastoptions);
                    }
                })
                .catch(function (err) { //en el caso de que se ocurra un error, axios lo atrapa y procesa
                    handleResponse(err.response);  //invocamos al manejador para ver el tipo de error y ejecutar la accion pertinente
                    // toast.error("Ha habido un error al enviar los datos", toastoptions);
                });
        } else {
            console.log("no hay");
        }
    }
    paginar = async (e) => {
        await this.setState({ pagina: e.currentTarget.dataset.pag })
        this.listadoTurnos();
    }
    cambiarFecha = (valores) => {
        this.setState({ fechas: valores });
    }
    async componentDidMount() {
        this.listadoTurnos();
        this.listadoTrabajadores();
    }

    comparer = (otherArray) => {
        return function (current) {
            return otherArray.filter(function (other) {
                return other.rut == current.rut
            }).length == 0;
        }
    }

    render() {
        console.log(this.state.turnosReemplazo);
        let componente = this;
        let registros;
        if (this.state.registros.length > 0) {

        } else {
            <tr><td colSpan="3">No hay turnos registrados para esta fecha</td></tr>
        }

        let dias = []; // los dias donde el wn tiene turno
        if (this.state.registros.length > 0) {
            dias = this.state.registros.map((registro, index) => {
                let fecha = registro.fecha;
                fecha = new Date(fecha);
                return fecha.getDate() + 1;
            });
        }

        let fechas = []; //las fechas que el wn seleccionó
        if (this.state.fechas.length > 0) {
            fechas = this.state.fechas.map((fecha, index) => {
                return moment(new Date(fecha.year, fecha.month.index, fecha.day, 0, 0, 0)).format('YYYY-MM-DD[T00:00:00.000Z]');
            });
        }

        let filas = []; // las filas de abajo
        // filas = fechas.map((fecha, index) => {  //por cada fecha seleccionada en el calendario realiza
        //     let sel;
        //     componente.state.registros.find(function (elem, ind) {  //busca en los turnos donde se incluye el trabajador
        //         if (elem.fecha === fecha) {  //si la fecha del turno es igual a la del calendario
        //             var onlyInA = componente.state.trabajadores.filter(componente.comparer(elem.trabajadores));
        //             var onlyInB = elem.trabajadores.filter(componente.comparer(componente.state.trabajadores));
        //             var result = onlyInA.concat(onlyInB);
        //             sel = <tr key={ind} data-key={ind} data-turno={elem._id}>
        //                 <td>{moment(elem.fecha).utc().format("DD-MM-YYYY")}</td>
        //                 <td>{elem.datosServicio[0].nombre}</td>
        //                 <td>
        //                     <select onChange={e => componente.selectReempazo(index, e)} data-turno={elem._id}>
        //                         {
        //                             result.map((trabajadorDisp) => {
        //                                 return (<option data-rut={trabajadorDisp.rut} value={trabajadorDisp.rut}  >{trabajadorDisp.nombre} {trabajadorDisp.apellido}</option>)
        //                             })
        //                         }
        //                     </select>
        //                 </td>
        //             </tr>
        //             console.log(ind);
        //         } else {

        //         }
        //     })
        //     return (sel)
        // });
        filas = componente.state.registros.map((elem, index) => {  //por cada fecha seleccionada en el calendario realiza
            let sel;
            fechas.find(function (fecha, ind) {  //busca en los turnos donde se incluye el trabajador
                if (elem.fecha === fecha) {  //si la fecha del turno es igual a la del calendario
                    var onlyInA = componente.state.trabajadores.filter(componente.comparer(elem.trabajadores));
                    var onlyInB = elem.trabajadores.filter(componente.comparer(componente.state.trabajadores));
                    var result = onlyInA.concat(onlyInB);
                    sel = <tr key={index} data-key={index} data-turno={elem._id}>
                        <td><input type="checkbox" /></td>
                        <td>{moment(elem.fecha).utc().format("DD-MM-YYYY")}<br></br>{elem.inicio} - {elem.termino}</td>
                        <td>{elem.datosServicio[0].nombre}</td>
                        <td>
                            <select data-turno={elem._id}>
                                {
                                    result.map((trabajadorDisp) => {
                                        return (<option data-rut={trabajadorDisp.rut} value={trabajadorDisp.rut}  >{trabajadorDisp.nombre} {trabajadorDisp.apellido}</option>)
                                    })
                                }
                            </select>
                        </td>
                    </tr>
                    console.log(ind);
                } else {
                    filas.splice(index,1);
                    sel = null;
                }
            })
            return (sel)
        });
        filas = filas.sort((a, b) => (a.key > b.key) ? 1 : -1);
        // let paginacion = funciones.paginacion(this.state.paginas, this.state.pagina, this.paginar);

        return (
            <div className="principal" id="component-listar-trabajadores">
                <div>
                    <h2 className="celeste"><Link to="/perfil/turnos"> <Bcelesterev /> </Link> Mis turnos <strong>/ Solicitudes de reemplazo</strong></h2>
                </div>
                <div className="listado listado-simple">
                    <div className="encabezado">
                        <h3 className="amarillo inline-block">Solicitar reemplazo calendario</h3>
                    </div>
                    <div className="calendario-reemplazo">
                        <Calendar
                            multiple
                            value={this.state.fechas}
                            onChange={this.cambiarFecha}
                            minDate={moment().toDate()}
                            weekStartDayIndex={1}
                            mapDays={({ date }) => {
                                let color;
                                let props = {}
                                if (!dias.includes(date.day)) props.className = "green";
                                if (!dias.includes(date.day)) props.disabled = true
                                return props
                            }}
                        />
                    </div>
                    <div className="encabezado">
                        <h3 className="amarillo inline-block">Fechas / Jornadas seleccionadas</h3>
                    </div>
                    <table>
                        <thead>
                            <th></th>
                            <th>Fecha / Jornada</th>
                            <th>Servicio / Sector</th>
                            <th>Reemplazo</th>
                        </thead>
                        <tbody ref={this.myRef}>
                            {filas}
                        </tbody>
                    </table>
                    <div className="form-group buttons">
                        <button className="boton-generico btazulalt" data-objetivo="FrecuenciaRetiro" onClick={this.volver} >Cancelar</button>
                        <button className="boton-generico btazul" onClick={this.enviaDatos} type="button" >Guardar</button>
                    </div>
                </div>
            </div>

        )
    }
}

