import Axios from 'axios';
import React, { Component } from 'react';

export default class CambiarEmergencia extends Component {
    render() {
        return (
            <div className="modalbasicos">
                <div>
                    <h2>Editar Contacto de Emergencia</h2>
                    <form>
                        <div className="form-group">
                            <label>Nombre Apellidos</label>
                            <input  className="input-generico" placeholder="ejemplo@email.com" />
                        </div>
                        <div className="form-group">
                            <label>Parentesco</label>
                            <input  className="input-generico" placeholder="ejemplo@email.com"/>
                        </div>
                        <div className="form-group">
                            <label>Teléfono fijo</label>
                            <input  className="input-generico" placeholder="ejemplo@email.com"/>
                        </div>
                        <div className="form-group">
                            <label>Teléfono móvil</label>
                            <input  className="input-generico" placeholder="ejemplo@email.com"/>
                        </div>
                        <div className="form-group">
                            <label>direccion</label>
                            <input  className="input-generico" placeholder="ejemplo@email.com"/>
                        </div>
                        <div className="form-group">
                            <label>Comuna</label>
                            <input  className="input-generico" placeholder="ejemplo@email.com"/>
                        </div>
                        <div className="form-group">
                            <label>Ciudad</label>
                            <input  className="input-generico" placeholder="ejemplo@email.com"/>
                        </div>

                        <div className="form-group buttons">
                            <button className="boton-generico btazul">Guardar</button>
                            <button className="boton-generico btgris" onClick={this.props.funcion} type="button">Cancelar</button>
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}