import React, { Component } from 'react'
import PropTypes from 'prop-types';

export default class ModalBody extends Component {

    constructor(props) {
        super(props);
        this.wrapper = React.createRef();
    }
    state = {
        show: false,
        nombre: '',
        apellido: '',
        edad: '',
        estado: ''
    }
    onChangeInput = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }
    async componentDidMount() {
        document.addEventListener('click', this.ClickExterior, true);
        await this.setState({ estado: "abriendo" });
        setTimeout(
            () => this.setState({ estado: "abierto" }),
            100
        );
    }
    componentWillUnmount() {
        console.log("cvb")
        document.removeEventListener('click', this.ClickExterior, true);
    }
    ClickExterior = async event => {
        console.log(event);
        if (event.clientX === 0 && event.clientY === 0) {
            console.log("no entro");
        } else {
            const domNode = this.wrapper.current;
            console.log(domNode);
            if (!domNode || !domNode.contains(event.target)) {
                this.cerrarModalContenido();
            }
        }

    }
    cerrarModalContenido = async event => {
        console.log("cer");
        await this.setState({ estado: "abriendo" });
        setTimeout(
            () => this.props.toogleModal(null, this.props.props.name),
            300
        );
    }
    render() {
        console.log(this.props.props);
        const clonHijo = React.Children.map(this.props.contenido, child => { //clonamos el contenido hijo para entregarle nuevos atributos
            if (React.isValidElement(child)) {
                return React.cloneElement(child, { closeModal: this.cerrarModalContenido, funcion: this.props.props.funcion, props: this.props.props });
            }
            return child;
        });


        return (
            <div className={`modal-body ${this.state.estado}`} ref={this.wrapper}>
                {clonHijo}
            </div>
        )
    }
}
