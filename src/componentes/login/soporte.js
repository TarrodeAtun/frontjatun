import Axios from 'axios';
import React, { Component } from 'react';

export default class SoporteLogin extends Component {
    render() {
        return (
            <div className="loginsubmodal">
                <div>
                    <h3>Comunicarse con Soporte Técnico</h3>
                    <p> Comunicarse con Soporte Técnico Si tienes un problema escríbenos a personas@jatunnewen.cl o rellena este formulario</p>
                </div>
                <div>
                    <form>
                        <div> <input placeholder="Nombre" /> </div>
                        <div> <input placeholder="Apellidos" /> </div>
                        <div> <input placeholder="RUN" /> </div>
                        <div> <input placeholder="Teléfono" /> </div>
                        <div> <textarea placeholder="Escribe tu mensaje..." rows="5"></textarea> </div>
                        <div><button>Enviar mensaje</button></div>
                    </form>
                </div>
            </div>
        )
    }
}