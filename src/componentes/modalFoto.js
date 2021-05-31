import React, { Component } from 'react';
export default class ModalFoto extends Component {
    constructor(props) {
        super(props)
        this.state = {
            delay: 500,
            result: 'No result',
            intervalo: '',
            direccion : 'http://localhost:4000/media'
        }
    }
    render() {
        return (
            <div>
                <img src={`${this.state.direccion}/${this.props.props.img}`} />
            </div>
        )
    }
}