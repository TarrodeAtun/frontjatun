import Axios from '../../helpers/axiosconf';
import { funciones } from '../../servicios/funciones';
import React, { Component } from 'react';
import { toast } from 'react-toastify';


const toastoptions = {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
}

export default class RecuperarPass extends Component {

    constructor(props) {
        super(props);
    }

    state = {
        email: '',
        enviado: false,
        incorrecto: '',
        mensaje: ''
    }
    onChangeInput = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }
    onSubmit = async e => {
        e.preventDefault();
        let email = this.state.email;
        let componente = this;
        if (email !== '') {
            let res = funciones.validarEmail(email);
                console.log(res);
                if (res) {
                    console.log("dsa");
                    await Axios.post('/api/mailer/recuperarPass', { email })
                        .then(res => {
                            if (res.data.estado === "success") {
                                console.log("asd");
                                componente.setState({ enviado: true });
                            } else {
                                toast.warning(res.data.mensaje, toastoptions);
                            }

                        })
                        .catch(err => {
                            console.log(err);
                        });
                } else {
                    toast.warning("El formato de correo no es válido", toastoptions);
                    this.setState({ incorrecto: 'incorrecto', email: '' });
                    this.resetMensaje();
                }
           
        } else {
            this.setState({ incorrecto: 'incorrecto' });
            this.resetMensaje();
        }
    };
    resetMensaje = (e) => {
        const comp = this;
        setTimeout(function () {
            comp.setState({ mensaje: '', incorrecto: '' });
        }, 2000)
    }
    intentar = (e) => {
        const comp = this;
        comp.setState({ enviado: false });
    }

    render() {
        return (
            <div className="loginsubmodal">
                {this.state.enviado
                    ? <div>
                        <h4>¡Mensaje enviado!</h4>
                        <div>
                            <p>Hemos enviado un mensaje a ejemplo@email.com para que puedas elegir tu nueva contraseña.</p>
                        </div>
                        <div><p>¿No has recibido el correo? <a onClick={this.intentar}>Inténtalo de nuevo</a></p></div>
                    </div>
                    :
                    <div>
                        <div>
                            <p>Este modulo le ayudará a recuperar la información de acceso al sistema, para esto debe ingresar el correo electrónico asociado a su cuenta de usuario. Si no posee uno, contáctese con Soporte Técnico</p>
                        </div>
                        <div>
                            <input className={this.state.incorrecto} onChange={this.onChangeInput} placeholder="Ingrese su email" name="email" />
                        </div>
                        <div>
                            <button onClick={this.onSubmit}>Enviar</button>
                        </div>
                    </div>
                }
            </div>
        )
    }

}