import React, { Component, useState, Fragment } from 'react';
import QrReader from 'react-qr-reader';

export default class LectorQR extends Component {
    constructor(props) {
        super(props)
        this.state = {
            delay: 500,
            result: 'No result',
        }
        this.handleScan = this.handleScan.bind(this)
    }
    componentDidMount(){
       console.log("asd"); 
    }
    handleScan(data) {
        console.log(data);
        if(data !== null){
            this.props.props.capturaQR(data);
            this.props.closeModal();
        }
    }
    handleError(err) {
        console.error(err)
    }
    render() {
        const previewStyle = {
            height: 240,
            width: 320,
        }
        return (
            <div>
                <QrReader
                    delay={1000}
                    style={previewStyle}
                    onError={this.handleError}
                    onScan={this.handleScan}
                />
                <p>{this.state.result}</p>
            </div>
        )
    }
}