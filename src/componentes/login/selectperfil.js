import React, { Component } from "react";
import { autenticacion } from '../../servicios/autenticacion';
import { historial } from '../../helpers/historial';

import imagen from "../../assets/persona.svg";
import { ReactComponent as Boton } from "../../assets/iconos/bcelesteop.svg";

import '../../styles/selectPerfil.css';

export default class selectperfil extends Component {

    constructor(props) {
        super(props);

        this.state = {
            currentUser: autenticacion.currentUserValue,
            datosUsuarios: "",
            users: null
        };
    }

    async componentDidMount() {
    }
    seleccionarPerfil = async (e) => {
        var perfil = e.currentTarget.dataset.tipo;
        var usuario = JSON.parse(localStorage.getItem('usuarioActual'));
        usuario.data.perfilSesion = await perfil;
        console.log(usuario);
        await localStorage.setItem('usuarioActual', JSON.stringify(usuario));
        await autenticacion.actualizar();
        this.props.impFuncion();
        historial.push('/');
    }



    render() {
        return (
            <div className="principal" id="component-selectperfil">
                <div>
                    <h2>Ingresar Como:</h2>
                    <div className="opciones">
                        <div>
                            <img src={imagen} />
                            <h2><strong>Perfil</strong> Administrador</h2>
                            <button data-tipo="1" onClick={this.seleccionarPerfil}><Boton /></button>
                        </div>
                        <div>
                            <img src={imagen} />
                            <h2><strong>Perfil</strong>Líder de Cuadrilla</h2>
                            <button data-tipo="2" onClick={this.seleccionarPerfil}><Boton /></button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
