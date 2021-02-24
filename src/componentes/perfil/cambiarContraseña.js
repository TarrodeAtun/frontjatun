import Axios from 'axios';
import React, { Component } from 'react';

import { autenticacion } from '../../servicios/autenticacion';
import { authHeader } from '../../helpers/auth-header';
import { handleResponse } from '../../helpers/manejador';

export default class CambiarPass extends Component {

    constructor(props) {
        super(props);

        this.state = {
            currentUser: autenticacion.currentUserValue,
            pass: '',
            rePass: ''
        };
    }

    onChangeInput = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }
    onSubmit = async e => {
        e.preventDefault();
        if (this.state.pass === this.state.rePass) {
            const res = await Axios.put('http://localhost:4000/api/users/worker/pass', {
                id: this.state.currentUser.data.usuariobd._id,
                pass: this.state.pass,
                rePass: this.state.rePass
            }, { headers: authHeader() })
                .then(function () {
                    console.log("funciono");
                }).catch(function (err) { //en el caso de que se ocurra un error, axios lo atrapa y procesa
                    handleResponse(err.response);  //invocamos al manejador para ver el tipo de error y ejecutar la accion pertinente
                });
        } else {
            console.log("no");
        }
    }

    render() {
        
        return (
            <div className="modalcontrasena">
                <div>
                    <h2>Cambiar contraseña</h2>
                    <form onSubmit={this.onSubmit}>
                        <div className="form-group">
                            <input className="input-generico"
                                value={this.state.pass}
                                placeholder="Nueva contraseña"
                                onChange={this.onChangeInput}
                                name="pass"
                            />
                        </div>
                        <div className="form-group">

                            <input className="input-generico"
                                value={this.state.rePass}
                                placeholder="Confirmar nueva contraseña"
                                onChange={this.onChangeInput}
                                name="rePass"
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