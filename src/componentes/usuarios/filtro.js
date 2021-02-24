import React, { Component } from 'react'



export default class filtro extends Component {


    async componentDidMount() {
    //console.log(this.props);
    }

    render() {
        return (
            <div>
                <button onClick={this.props.toogleModal} data-objetivo="crearusuario">Crear Usuario</button>
            </div>
        )
    }
}
