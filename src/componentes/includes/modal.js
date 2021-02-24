import React from "react";
import ModalBody from '../includes/modalbody';

export default class Modal extends React.Component {
    render() {
        if (!this.props.show) {
            return null;
        }
        return <div className="modal" >
            <ModalBody contenido={this.props.contenido} toogleModal={this.props.toogleModal} props={this.props} />
        </div>;
    }
}