import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { autenticacion } from '../../servicios/autenticacion'; 
// import { historial } from '../../helpers/historial';

import { ReactComponent as Logomenu } from "../../assets/menu.svg";

export default class navegador extends Component {

    constructor(props) {
        super(props);
        this.wrapper = React.createRef();
        this.state = {
            currentUser: autenticacion.currentUserValue,
            datosUsuarios: "",
        };
    }



    ClickExterior = async event => {
        const domNode = this.wrapper.current;
        if (!domNode || !domNode.contains(event.target)) {
            if(this.props.abierto === "abierto"){
                await this.props.toogleMenu() ;
            }
            
        }
    }

    async componentDidMount() {
        this.setState({ datosUsuarios: this.state.currentUser.data.usuariobd });
        document.addEventListener('click', this.ClickExterior, true);

    }

    render() {
        return (
            <div id="sidebar" className={`${this.props.abierto}`}  ref={this.wrapper}>
                <nav>
                    <ul>
                        <li><label className="bold">¡Hola! {this.state.datosUsuarios.nombre} {this.state.datosUsuarios.apellido}</label></li>
                        <hr></hr>
                        <li ><Link to="/">Dashboard / Inicio</Link></li>
                        <li><Link to="/perfil">Mi perfil</Link></li>
                        <li><Link to="/personas/gestion">Gestión de Usuarios</Link></li>
                        <li><Link to="/residuos/gestion">Gestión de Residuos</Link></li>
                        <hr></hr>
                        <li><label className="bold">Bienestar</label></li>
                        <li><Link to="/bienestar/encuestas">Encuestas</Link></li>
                        <li><Link to="/bienestar/soporte">Mensajes / soporte Técnico</Link></li>
                        <hr></hr>
                        <li><Link to="/selecciona-perfil">Cambiar Perfil</Link></li>
                        <hr></hr>
                        <li><button onClick={() => this.props.cerrarSesion()}>Cerrar Sesión</button></li>
                        {/* <li><Link to="/usuarios/listar-usuarios">Listar usuarios</Link></li>
                        <li><Link to="/usuarios/crear-usuario">Otro menu</Link></li>
                        <li><Link to="/usuarios/crear-usuario">Otro menu</Link></li>
                        <li><Link to="/usuarios/crear-usuario">Otro menu</Link></li>
                        <li><button onClick={() => this.props.cerrarSesion()}>Salir</button></li> */}
                    </ul>
                </nav>
            </div>
        )
    }
}
