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


export default class SoporteLogin extends Component {


    constructor(props) {
        super(props);
    }

    state = {
        form: {
            nombre: '',
            apellido: '',
            rut: '',
            telefono: '',
            mensaje: ''
        }

    }

    onChangeInput = (e) => {
        console.log(e.target.value);
        this.setState({
            form: {
                ...this.state.form, [e.target.name]: e.target.value
            }
        })
    }
    onChangeRut = async e => {
        funciones.formatearRut(e.target.value, 1).then(res => {
            this.setState({
                form: {
                    ...this.state.form, rut: res
                }
            })
        });
    }
    onSubmit = async e => {
        e.preventDefault();
        var campoVacio = false;
        await Object.entries(this.state.form).map((t, k) => {
            if (t[1] === "" || t[1] === null) {
                campoVacio = true;
            }
        });
        if (!campoVacio) {
            await Axios.post('/api/mailer/soporte', {
                nombre: this.state.form.nombre,
                apellido: this.state.form.apellido,
                rut: this.state.form.rut,
                telefono: this.state.form.telefono,
                mensaje: this.state.form.mensaje,
            })
                .then(res => {
                   toast.success("Mensaje enviado satisfactoriamente", toastoptions);
                })
                .catch(err => {
                    console.log(err);
                });

        } else {
            toast.warning("Debe llenar todos los campos", toastoptions);
        }
    };
    resetMensaje = (e) => {
        const comp = this;
        setTimeout(function () {
            comp.setState({ mensaje: '', incorrecto: '' });
        }, 2000)
    }

    render() {
        return (
            <div className="loginsubmodal">
                <div>
                    <h3>Comunicarse con Soporte Técnico</h3>
                    <p> Comunicarse con Soporte Técnico Si tienes un problema escríbenos a personas@jatunnewen.cl o rellena este formulario</p>
                </div>
                <div>
                    <form>
                        <div> <input name="nombre" onChange={this.onChangeInput} value={this.state.form.nombre} placeholder="Nombre" /> </div>
                        <div> <input name="apellido" onChange={this.onChangeInput} value={this.state.form.apellido} placeholder="Apellidos" /> </div>
                        <div> <input name="rut" onChange={this.onChangeRut} value={this.state.form.rut} placeholder="RUN" /> </div>
                        <div> <input name="telefono" onChange={this.onChangeInput} value={this.state.form.telefono} placeholder="Teléfono" /> </div>
                        <div> <textarea name="mensaje" onChange={this.onChangeInput} value={this.state.form.mensaje} placeholder="Escribe tu mensaje..." rows="5"></textarea> </div>
                        <div><button onClick={this.onSubmit}>Enviar mensaje</button></div>
                    </form>
                </div>
            </div>
        )
    }
}