import React, { Component } from 'react'
import { autenticacion } from '../../servicios/autenticacion';
import { funciones } from '../../servicios/funciones';
import { historial } from '../../helpers/historial';

// import { validate, clean, format } from 'rut.js';
import logo from "../../assets/logo.svg";

import Modal from '../includes/modal';
import { toogleModalCore } from '../includes/funciones';

import Recuperar from './recuperar';
import Soporte from './soporte';

// import NumberFormat from 'react-number-format';
import { useRut } from 'react-rut';

import '../../styles/login.css';



export default class login extends Component {
    state = {
        rut: '',
        email: '',
        password: '',
        perfil: '',
        rutpass: '',
        posicion: '',
        mensaje: '',
        errorForm: '',
        showrecuperarPass: false,
        showSoporte: false,
    }
    constructor(props) {
        super(props);
        //si ya esta logueado lo redirecciona al inicio
        if (autenticacion.currentUserValue) {
            this.props.history.push('/');
        }
    }

    async componentDidMount() {
        var usuario = JSON.parse(localStorage.getItem('usuarioActual'));
    }

    toogleModal = toogleModalCore; //copiamos la funcion modal a una funcion local

    manejadorModals = (e, res) => { //creamos una funcion que reciba parametros para pasarlo al toogle modal (esta funcion la pasaremos al cuerpo del modal como propiedad para ejecutarse por autoreferencia)
        this.toogleModal(e, res);
    }

    onSubmit = async e => {
        e.preventDefault();
        var respuesta = await autenticacion.login(this.state.rut, this.state.password);
        if (respuesta) {
            console.log(respuesta);
            await this.setState({ mensaje: respuesta, errorForm: 'incorrecto', password: '', });
            this.resetMensaje();
        } else {
            historial.push('/perfil/ficha-personal');
        }
    };
    onChangeInput = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }
    onChangeRut = async e => {
        funciones.formatearRut(e.target.value, 1).then(res => {this.setState({ rut: res })});
    }
    resetMensaje = (e) => {
        const comp = this;
        setTimeout(function () {
            comp.setState({ mensaje: '', errorForm: '' });
        }, 2000)
    }


    reverso = (e) => {
        e.preventDefault();
        if (this.state.posicion === '') { this.setState({ posicion: 'reverso' }) }
        else { this.setState({ posicion: '' }) }
    }
    render() {

        return (
            <div className="principal" id="component-login">
                <div className="barraSupLogin">
                    <div className="logo"><img src={logo} /></div>
                </div>
                <div className={`divFormularios ${this.state.posicion}`}>
                    <form onSubmit={this.onSubmit} id="formlogin" className={`${this.state.errorForm}`}>
                        <div>
                            <h2>
                                ¡Bienvenido!
                                    </h2>
                        </div>
                        <div id="mensaje">
                            <label >{this.state.mensaje}</label>
                        </div>
                        <div>
                            <input type="text"
                                value={this.state.rut}
                                onChange={this.onChangeRut}
                                name="rut"
                                placeholder="RUN" maxLength="12"/>
                        </div>
                        <div>
                            <input type="password"
                                onChange={this.onChangeInput}
                                value={this.state.password}
                                name="password"
                                placeholder="Contraseña" />
                        </div>
                        <div>
                            <button type="submit">Iniciar sesión</button>
                        </div>
                        <div id="recordar">
                            <div><label><input type="checkbox" />Recordar mis datos</label></div>
                            <div><a onClick={this.manejadorModals} data-objetivo="recuperarPass">¿Olvidó su contraseña?</a></div>
                        </div>
                    </form>
                    <div id="soporte">
                        <a onClick={this.manejadorModals} data-objetivo="Soporte">Comunicarse con Soporte Técnico</a>
                    </div>
                </div>
                <div>
                    <h3>Copyright ©2020 Jatún Newén</h3>
                </div>
                <div id="modales">
                    <Modal
                        name="recuperarPass"  //nombre del estado que controla el modal
                        show={this.state.showrecuperarPass} //indicamos la propiedad show con el estado que controlara al modal
                        contenido={<Recuperar />} //entregamos el componente que se renderizara en el modal 
                        toogleModal={this.manejadorModals} //traspasamos la funcion que permitira abrir y cerrar el modal
                    />
                    <Modal
                        name="Soporte"  //nombre del estado que controla el modal
                        show={this.state.showSoporte} //indicamos la propiedad show con el estado que controlara al modal
                        contenido={<Soporte />} //entregamos el componente que se renderizara en el modal 
                        toogleModal={this.manejadorModals} //traspasamos la funcion que permitira abrir y cerrar el modal
                    />
                </div>
            </div>
        )
    }
}
