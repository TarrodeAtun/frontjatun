import Axios from 'axios';
import React, { Component } from 'react'

//manejadores
import { authHeader } from '../../helpers/auth-header';
import { handleResponse } from '../../helpers/manejador';

import '../../styles/crearUsuario.css'


export default class CrearUsuario extends Component {

    state = {
        show: false,
        nombre: '',
        apellido: '',
        edad: ''
    }
    onChangeInput = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    onSubmit = async e => {
        e.preventDefault();
        const res = await Axios.post('http://localhost:4000/api/users', {
            headers: authHeader(),
            nombre: this.state.nombre,
            apellido: this.state.apellido,
            edad: this.state.edad
        });
        console.log(res);
        this.props.obtenerUsuarios();
    }

    

    render() {
        return (
            <div id="component-crearUsuario">
                <h2>
                    Crear nuevo usuario
                </h2>
                <form onSubmit={this.onSubmit}>
                    <div>
                        <label>nombre</label>
                        <input type="text"
                            onChange={this.onChangeInput}
                            value={this.state.nombre}
                            name="nombre" />
                    </div>
                    <div>
                        <label>apellido</label>
                        <input type="text"
                            onChange={this.onChangeInput}
                            value={this.state.apellido}
                            name="apellido" />
                    </div>
                    <div>
                        <label>edad</label>
                        <input type="text"
                            onChange={this.onChangeInput}
                            value={this.state.edad}
                            name="edad" />
                    </div>
                    <div>
                        <button type="submit">Subir</button>
                    </div>
                </form>
            </div>
        )
    }
}

