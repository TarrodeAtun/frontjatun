// importaciones de bibliotecas 
import React, { Component, ReactDOM } from "react";
import { autenticacion } from '../../servicios/autenticacion';
import { Link } from 'react-router-dom';
import Axios from '../../helpers/axiosconf';
import { authHeader } from '../../helpers/auth-header';
import { handleResponse } from '../../helpers/manejador';
import moment from 'moment';
import { toast } from 'react-toastify';

// importaciones de estilos 
import '../../styles/fichaTrabajador.css';


// importaciones de iconos 
import fichaper from "../../assets/iconos/fichaper.svg";
import turnos from "../../assets/iconos/turnos.svg";
import { ReactComponent as Basurero } from "../../assets/iconos/basurero.svg";
import { ReactComponent as Plus } from "../../assets/iconos/plusNaranjo.svg";
import { ReactComponent as Filtro } from "../../assets/iconos/filtro.svg";
import { ReactComponent as Bcelesterev } from "../../assets/iconos/bcelesterev.svg";
import { ReactComponent as Flechaam } from "../../assets/iconos/flechaam.svg";
import { historial } from "../../helpers/historial";

export default class GestionResiduos extends Component {
    constructor(props) {
        super(props);
        this.myRef = React.createRef();
        this.state = {
            currentUser: autenticacion.currentUserValue,
            datosUsuarios: "",
            users: null,
            horas: ''
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
        var rut = autenticacion.currentUserValue.data.usuariobd.rut;
        var perfil = autenticacion.currentUserValue.data.usuariobd.perfil;
        console.log(autenticacion.currentUserValue.data.usuariobd);
        console.log(fecha);
        const res = Axios.post('/api/users/worker/turnos/', { fecha:  moment(fecha).format('YYYY-MM-DD'), rut: rut, perfil: perfil }, { headers: authHeader() }) //se envia peticion axios con el token sesion guardado en local storage como cabecera
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
    obtenerTurnos = (e) => {
        var componente = this;
        var fecha = e.target.value;
        var rut = autenticacion.currentUserValue.data.usuariobd.rut;
        var perfil = autenticacion.currentUserValue.data.usuariobd.perfil;
        console.log(autenticacion.currentUserValue.data.usuariobd);
        console.log(fecha);
        const res = Axios.post('/api/users/worker/turnos/', { fecha:  moment(fecha).format('YYYY-MM-DD'), rut: rut, perfil: perfil}, { headers: authHeader() }) //se envia peticion axios con el token sesion guardado en local storage como cabecera
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
        console.log("recalculansdo");
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
                // console.log(empuje);
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
    pushDetalle = (e) => {
        var id = e.currentTarget.dataset.id;
        historial.push(`/personas/turnos/detalle/${id}`);
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
        var items = [];
        var lunes = [];
        var martes = [];
        var miercoles = [];
        var jueves = [];
        var viernes = [];
        var sabado = [];
        var domingo = [];
        if (this.state.horas.length !== 0) {
            lunes = this.state.horas.map((hora, index) => {
                var fech = new Date(hora.fecha);
                // console.log(hora);
                if (fech.getDay() === 0) {
                    console.log(fech.getDay());
                    return (<div className="prueba" data-id={hora._id} onClick={this.pushDetalle} style={componente.calculaPosicion(hora)}>
                        <span>{hora.datosServicio[0].nombre}</span>
                        <span> {hora.datosSectores[0].nombre}</span>
                        <span> {hora.inicio} - {hora.termino} </span>
                    </div>)
                }
            });
            martes = this.state.horas.map((hora, index) => {
                var fech = new Date(hora.fecha);
                console.log(hora.datosServicio[0].nombre);
                if (fech.getDay() === 1) {
                    return (<div className="prueba" data-id={hora._id} onClick={this.pushDetalle} style={componente.calculaPosicion(hora)}>
                        <span>{hora.datosServicio[0].nombre}</span>
                        <span> {hora.datosSectores[0].nombre}</span>
                        <span> {hora.inicio} - {hora.termino} </span>
                    </div>)
                }
            });
            miercoles = this.state.horas.map((hora, index) => {
                var fech = new Date(hora.fecha);
                console.log(hora);
                if (fech.getDay() === 2) {
                    return (<div className="prueba" data-id={hora._id} onClick={this.pushDetalle} style={componente.calculaPosicion(hora)}>
                        <span>{hora.datosServicio[0].nombre}</span>
                        <span> {hora.datosSectores[0].nombre}</span>
                        <span> {hora.inicio} - {hora.termino} </span>
                    </div>)
                }
            });
            jueves = this.state.horas.map((hora, index) => {
                var fech = new Date(hora.fecha);
                if (fech.getDay() === 3) {
                    console.log("asd");
                    return (<div className="prueba" data-id={hora._id} onClick={this.pushDetalle} style={componente.calculaPosicion(hora)}>
                        <span>{hora.datosServicio[0].nombre}</span>
                        <span> {hora.datosSectores[0].nombre}</span>
                        <span> {hora.inicio} - {hora.termino} </span>
                    </div>)
                }
            });

            viernes = this.state.horas.map((hora, index) => {
                var fech = new Date(hora.fecha);
                if (fech.getDay() === 4) {
                    return (<div className="prueba" data-id={hora._id} onClick={this.pushDetalle} style={componente.calculaPosicion(hora)}>
                        <span>{hora.datosServicio[0].nombre}</span>
                        <span> {hora.datosSectores[0].nombre}</span>
                        <span> {hora.inicio} - {hora.termino} </span>
                    </div>)
                }
            });
            sabado = this.state.horas.map((hora, index) => {
                var fech = new Date(hora.fecha);
                if (fech.getDay() === 5) {
                    return (<div className="prueba" data-id={hora._id} onClick={this.pushDetalle} style={componente.calculaPosicion(hora)}>
                        <span>{hora.datosServicio[0].nombre}</span>
                        <span> {hora.datosSectores[0].nombre}</span>
                        <span> {hora.inicio} - {hora.termino} </span>
                    </div>)
                }
            });
            domingo = this.state.horas.map((hora, index) => {
                var fech = new Date(hora.fecha);
                console.log(hora);
                if (fech.getDay() === 6) {
                    return (<div className="prueba" data-id={hora._id} onClick={this.pushDetalle} style={componente.calculaPosicion(hora)}>
                        <span>{hora.datosServicio[0].nombre}</span>
                        <span> {hora.datosSectores[0].nombre}</span>
                        <span> {hora.inicio} - {hora.termino} </span>
                    </div>)
                }
            });

        }

        return (
            <div className="principal gestion-residuos menu-lista-dashboard" >
                <div>
                    <h2 className="celeste"><Link to="/perfil"> <Bcelesterev /></Link> Mi Perfil / <strong>Mis Turnos</strong></h2>
                    <div className="fichaPerfil">
                        <div className="flex between">
                            <div className="seccion seccionparalela">
                                <h3><Link to="/perfil/turnos/historial"><span>Historial de turnos</span><button><Flechaam /></button></Link></h3>
                            </div>
                            <div className="seccion seccionparalela">
                                <h3><Link to="/perfil/turnos/mis-solicitudes"><span>Solicitudes de reemplazo</span><button><Flechaam /></button></Link></h3>
                            </div>
                        </div>
                        <div className="seccion calendario">
                            <div className="encabezado flex">
                                <input className="fechaProgra input-generico" onChange={this.obtenerTurnos} type="date"></input>
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
                    </div>
                </div>
            </div>
        );
    }
}