import Axios from 'axios';
import React, { Component } from 'react';

import { autenticacion } from '../../servicios/autenticacion';
import { authHeader } from '../../helpers/auth-header';
import { handleResponse } from '../../helpers/manejador';

export default class CambiarBasicos extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentUser: autenticacion.currentUserValue,
            datosUsuarios: '',
            id :'',
            email: '',
            telefono: '',
        };
    }
    onChangeInput = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }
    onSubmit = async e => {
        e.preventDefault();
        const res = await Axios.put('http://localhost:4000/api/users/worker/basic', {
            id: this.state.currentUser.data.usuariobd._id,
            email: this.state.email,
            telefono: this.state.telefono
        },{ headers: authHeader()})
          .then(usuario => {
             localStorage.setItem('usuarioActual', JSON.stringify(usuario));
             this.props.funcion();
            })
            .catch(function (err) { //en el caso de que se ocurra un error, axios lo atrapa y procesa
                handleResponse(err.response);  //invocamos al manejador para ver el tipo de error y ejecutar la accion pertinente
            });
    }
    async componentDidMount() {
        console.log(this.state.currentUser);
        await this.setState({ email: this.state.currentUser.data.usuariobd.email,  telefono: this.state.currentUser.data.usuariobd.telefono});
    }
    render() {
        return (
            <div className="modalbasicos">
                <div>
                    <h2>Editar Datos Básicos</h2>
                    <form onSubmit={this.onSubmit}>
                        <div className="form-group">
                            <label>Email</label>
                            <input className="input-generico"
                                value={this.state.email}
                                placeholder="ejemplo@email.com"
                                onChange={this.onChangeInput}
                                name="email"
                            />
                        </div>
                        <div className="form-group">
                            <label>Teléfono</label>
                            <input className="input-generico"
                                value={this.state.telefono}
                                placeholder="+56 9 1234 5678"
                                onChange={this.onChangeInput}
                                name="telefono"
                            />
                        </div>
                        <div className="form-group buttons">
                            <button className="boton-generico btazul" type="submit">Guardar</button>
                            <button className="boton-generico btgris" onClick={this.props.closeModal} type="button">Cancelar</button>
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}