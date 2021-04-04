import React, { Component } from 'react'
import { autenticacion } from '../../servicios/autenticacion';
import { historial } from '../../helpers/historial';
import Axios from '../../helpers/axiosconf';

import { ToastContainer, toast } from 'react-toastify';

// import { validate, clean, format } from 'rut.js';
import logo from "../../assets/logo.svg";

import '../../styles/login.css';

const toastoptions = {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
}

export default class recuperarPass extends Component {
    state = {
        pass: '',
        passRep: '',
        token: '',
        incorrecto:'',
        mensaje:'',
        idUsuario:''
    }
    constructor(props) {
        super(props);
        //si ya esta logueado lo redirecciona al inicio
        if (autenticacion.currentUserValue) {
            this.props.history.push('/');
        }
    }

    async componentDidMount() {
        const { token } = this.props.match.params;
        await this.setState({ token: token });
        await Axios.post('/api/login/recuperarPass/compruebatoken', { token: token })
            .then(res => {
                console.log(res);
                this.setState({idUsuario:res.data.id});
                toast.success(res.data.mensaje, toastoptions);
            })
            .catch(err => {
                toast.error(err.response.data.mensaje, toastoptions);
                historial.push('/login');
            });
    }

    onSubmit = async e => {
        const { token } = this.props.match.params;
        e.preventDefault();
        console.log(this.state.idUsuario);
        if(this.state.pass !== "" && this.state.passRep !== ""){
            if (this.state.pass === this.state.passRep ) {
                await Axios.post('/api/login/recuperarPass', { token: token, pass: this.state.pass, passRep: this.state.passRep, id: this.state.idUsuario })
                    .then(res => {
                        toast.success(res.data.mensaje, toastoptions);
                        historial.push('/login');
                    })
                    .catch(err => {
                        console.log(err);
                    });
            }else{
                this.setState({
                    incorrecto: 'incorrecto',
                    mensaje:'Los campos no coinciden'
                });
                this.resetMensaje();
            }
        }else{
            this.setState({
                incorrecto: 'incorrecto',
                mensaje:'Debes llenar todos los campos'
            });
            this.resetMensaje();
        }
    };
    onChangeInput = (e) => {
        console.log("asd");
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    resetMensaje = (e) => {
        const comp = this;
        setTimeout(function () {
            comp.setState({ mensaje: '', incorrecto: '' });
        }, 2000)
    }
    render() {
        return (
            <div className="principal" id="component-login">
                <div className="barraSupLogin">
                    <div className="logo"><img src={logo} /></div>
                </div>
                <div className="divFormularios">
                    <form onSubmit={this.onSubmit} id="formlogin" className={`${this.state.errorForm}`}>
                        <div>
                            <h2>
                                Reestablece tu contraseña
                                    </h2>
                        </div>
                        <div id="mensaje">
                            <label className={this.state.incorrecto}>{this.state.mensaje}</label>
                        </div>
                        <div>
                            <input type="password"
                                value={this.state.rut}
                                onChange={this.onChangeInput}
                                name="pass"
                                placeholder="Nueva contraseña" className={this.state.incorrecto}/>
                        </div>
                        <div>
                            <input type="password"
                                onChange={this.onChangeInput}
                                value={this.state.password}
                                name="passRep"
                                placeholder="Repite nueva contraseña" className={this.state.incorrecto}/>
                        </div>
                        <div>
                            <button type="submit" onSubmit={this.onSubmit}>Aceptar</button>
                        </div>
                    </form>
                </div>
                <div>
                    <h3>Copyright ©2020 Jatún Newén</h3>
                </div>
            </div>
        )
    }
}
