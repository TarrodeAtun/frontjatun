import React, { Component } from 'react'
import Navegador from './navegador';
import { Link } from 'react-router-dom';

import logo from "../../assets/logo.svg";

import { ReactComponent as Home } from "../../assets/iconos/home.svg";
import { ReactComponent as Logomenu } from "../../assets/menu.svg";

export default class barrasuperior extends Component {

    constructor(props) {
        super(props);
        this.state = {
            abierto: "",
        };
    }



    render() {
        return (
            <div id="barraSuperior">
                <div className="prebarra barraSupLogin">
                    <div className="logo">
                        <img src={logo} alt="logo" />
                    </div>
                    {this.props.menuOculto
                        ? <div id="botonmenu" show={this.props.menuOculto}>
                            <Link to="/"><Home /></Link>
                            <button id="menubutton" className={`${this.state.abierto}`} onClick={this.toogleMenu}>
                                <Logomenu />
                        </button>
                        </div>
                        : <div></div>
                    }
                </div>
                <Navegador cerrarSesion={this.props.cerrarSesion} abierto={`${this.state.abierto}`} toogleMenu={this.toogleMenu} />
            </div>
        )
    }
    toogleMenu = () => {
        if (this.state.abierto === "") { this.setState({ abierto: 'abierto' }) }
        else { this.setState({ abierto: '' }) }
    }

}
