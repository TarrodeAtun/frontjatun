import Axios from 'axios';
import React, { Component } from 'react';

export default class RecuperarPass extends Component {
    render() {
        return (
            <div className="loginsubmodal">
                <div>
                    <p>Este modulo le ayudara a recuperar la informacion de acceso al sistema, para esto debe ingresar el correo electronico asociado a su cuenta de usuario. Si no posee uno, contáctese con Soporte Técnico</p>
                </div>
                <div>
                    <input placeholder="Ingrese su email" />
                </div>
                <div>
                    <button>Enviar</button>
                </div>
            </div>
        )
    }
}