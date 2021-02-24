import React, { Component } from "react";
import { autenticacion } from '../../servicios/autenticacion';

export default class Soporte extends Component {

    constructor(props) {
        super(props);

        this.state = {
            currentUser: autenticacion.currentUserValue,
            datosUsuarios:"",
            users: null
        };
    }

    componentDidMount() {
        this.setState({datosUsuarios: this.state.currentUser.data.usuariobd});
    }

    render() {
        return (
            <div>
               Soporte
            </div>
        );
    }
}