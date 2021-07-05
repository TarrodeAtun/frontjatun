import Axios from '../../helpers/axiosconf';
import { funciones } from '../../servicios/funciones';
import React, { Component } from 'react';
import { toast } from 'react-toastify';
import moment from 'moment';


const toastoptions = {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
}

export default class FrecuenciaRetiro extends Component {

    constructor(props) {
        super(props);
    }

    state = {
        repetir: '',
        intervalo: '',
        dias: [
            { valor: 1, label: "lunes", mini: "L", isChecked: false },
            { valor: 2, label: "martes", mini: "M", isChecked: false },
            { valor: 3, label: "miercoles", mini: "X", isChecked: false },
            { valor: 4, label: "jueves", mini: "J", isChecked: false },
            { valor: 5, label: "viernes", mini: "V", isChecked: false },
            { valor: 6, label: "sabado", mini: "S", isChecked: false },
            { valor: 0, label: "domingo", mini: "D", isChecked: false }
        ],
        termino: '',
        fechaTermino: '',
        repeticionesTermino: ''
    }
    onChangeInput = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
        if (e.target.name === "intervalo" && e.target.value === "1") {
            this.setState({
                dias: [
                    { valor: 1, label: "lunes", mini: "L", isChecked: false },
                    { valor: 2, label: "martes", mini: "M", isChecked: false },
                    { valor: 3, label: "miercoles", mini: "X", isChecked: false },
                    { valor: 4, label: "jueves", mini: "J", isChecked: false },
                    { valor: 5, label: "viernes", mini: "V", isChecked: false },
                    { valor: 6, label: "sabado", mini: "S", isChecked: false },
                    { valor: 0, label: "domingo", mini: "D", isChecked: false }
                ]
            })
        }
        if (e.target.name === "termino" && e.target.value === "1") {
            console.log("rep");
            this.setState({
                repeticionesTermino: ''
            });
        }
        if (e.target.name === "termino" && e.target.value === "2") {
            console.log("fech");
            this.setState({
                fechaTermino: ''
            });
        }
    }
    onChangeCheckbox = (e) => {
        let dias = this.state.dias
        dias.forEach(dia => {
            if (dia.valor === parseInt(e.target.value))
                dia.isChecked = e.target.checked
        })
        this.setState({ dias: dias });
        console.log(this.state.dias);
    }
    enviarDatos = async (e) => {
        var otrafecha = new Date(this.props.props.fecha.replace(/-/g, '\/'));
        var horaInicio = this.props.props.inicio;
        var horaTermino = this.props.props.termino;
        var labelFrecuencia;
        console.log("enviando");
        if (this.state.intervalo === "1") {
            if (this.state.termino === "1") {
                var fechaTermino = new Date(this.state.fechaTermino.replace(/-/g, '\/'));
                // console.log(fechaTermino);
                var registro = {};
                var arrayasd = [];
                for (otrafecha; otrafecha <= fechaTermino; otrafecha.setDate(otrafecha.getDate() + 1)) {
                    //aqui va la generacion de fechas
                    console.log(otrafecha);
                    registro = {
                        fecha: new Date(otrafecha.getFullYear(), otrafecha.getMonth(), otrafecha.getDate()),
                        horaInicio: horaInicio,
                        horaTermino: horaTermino
                    }
                    arrayasd.push(registro);

                }
                let fechaa = new Date(this.props.props.fecha.replace(/-/g, '\/'));
                labelFrecuencia = "Se repite cada dia desde el " + moment(fechaa).utc().format("DD/MM/YYYY") + " hasta el " + moment(fechaTermino).utc().format("DD/MM/YYYY");
                await this.props.props.frecuenciaPersonalizada(arrayasd, labelFrecuencia);
            }
            if (this.state.termino === "2") {
                console.log("repeticiones");
                var repeticiones = this.state.repeticionesTermino;
                var fechaClon = new Date(this.props.props.fecha.replace(/-/g, '\/'));
                fechaClon.setDate(fechaClon.getDate() + parseInt(repeticiones));
                console.log(fechaClon);
                var registro = {};
                var arrayasd = [];
                for (otrafecha; otrafecha <= fechaClon; otrafecha.setDate(otrafecha.getDate() + 1)) {
                    //aqui va la generacion de fechas
                    registro = {
                        fecha: new Date(otrafecha.getFullYear(), otrafecha.getMonth() + 1, otrafecha.getDate()),
                        horaInicio: horaInicio,
                        horaTermino: horaTermino
                    }
                    arrayasd.push(registro);
                }
                let fechaa = new Date(this.props.props.fecha.replace(/-/g, '\/'));
                labelFrecuencia = "Se repite cada dia desde el " + moment(fechaa).utc().format("DD/MM/YYYY") + " hasta el " + moment(fechaClon).utc().format("DD/MM/YYYY");
                this.props.props.frecuenciaPersonalizada(arrayasd, labelFrecuencia);
            }
        }
        if (this.state.intervalo === "2") {
            if (this.state.termino === "1") {
                var fechaTermino = new Date(this.state.fechaTermino.replace(/-/g, '\/'));
                var registro = {};
                var arrayasd = [];
                var dias = '';
                for (otrafecha; otrafecha <= fechaTermino; otrafecha.setDate(otrafecha.getDate() + 1)) {
                    for (var dia of this.state.dias) {
                        if (dia.isChecked) {
                            if (dia.valor === otrafecha.getDay()) {
                                console.log(otrafecha.getMonth());
                                //aqui va la generacion de fechas
                                registro = {
                                    fecha: new Date(otrafecha.getFullYear(), otrafecha.getMonth(), otrafecha.getDate()),
                                    horaInicio: horaInicio,
                                    horaTermino: horaTermino
                                }
                                arrayasd.push(registro);
                            }
                        }
                    }
                }
                for (var dia of this.state.dias) {
                    if (dia.isChecked) {
                        dias = dias+" "+dia.label;
                    }
                }

                let fechaa = new Date(this.props.props.fecha.replace(/-/g, '\/'));
                labelFrecuencia = "Se repite los " + dias + " desde el " + moment(fechaa).utc().format("DD/MM/YYYY") + " hasta el " + moment(fechaTermino).utc().format("DD/MM/YYYY");
                this.props.props.frecuenciaPersonalizada(arrayasd, labelFrecuencia);


            }
            if (this.state.termino === "2") {
                var repeticiones = this.state.repeticionesTermino;
                var fechaClon = new Date(this.props.props.fecha.replace(/-/g, '\/'));
                var sumadias = parseInt(repeticiones) * 7;
                var fechaTermino = new Date(fechaClon.getFullYear(), fechaClon.getMonth(), fechaClon.getDate() + sumadias);
                var registro = {};
                var arrayasd = [];
                var dias = '';
                for (otrafecha; otrafecha <= fechaTermino; otrafecha.setDate(otrafecha.getDate() + 1)) {
                    for (var dia of this.state.dias) {
                        if (dia.isChecked) {
                            if (dia.valor === otrafecha.getDay()) {
                                //aqui va la generacion de fechas
                                registro = {
                                    fecha: new Date(otrafecha.getFullYear(), otrafecha.getMonth(), otrafecha.getDate()),
                                    horaInicio: horaInicio,
                                    horaTermino: horaTermino
                                }
                                
                                arrayasd.push(registro);
                            }
                        }
                    }
                }
                for (var dia of this.state.dias) {
                    if (dia.isChecked) {
                        dias = dias+" "+dia.label;
                    }
                }
                let fechaa = new Date(this.props.props.fecha.replace(/-/g, '\/'));
                labelFrecuencia = "Se repite los " + dias + " desde el " + moment(fechaa).utc().format("DD/MM/YYYY") + " hasta el " + moment(fechaTermino).utc().format("DD/MM/YYYY");
                console.log(arrayasd);
                this.props.props.frecuenciaPersonalizada(arrayasd, labelFrecuencia);
                
            }
        }
        this.props.closeModal();
    }
    render() {
        return (
            <div className="submodal">
                <div className="seccion mod">
                    <div >
                        <span className="w100">Periodicidad personalizada</span>
                    </div>
                    <div className="repetir">
                        <span>Repetir cada</span>
                        <span>
                            <select name="intervalo" onChange={this.onChangeInput}>
                                <option>Seleccione...</option>
                                <option value="1">Día</option>
                                <option value="2">Semana</option>
                            </select>
                        </span>
                    </div>
                    {this.state.intervalo !== "1" &&
                        <div >
                            <span>Se repite el</span>
                        </div>
                    }
                    {this.state.intervalo !== "1" &&
                        <div className="dias">
                            {this.state.dias.map((dia) => {
                                console.log(dia);
                                return (<span><input type="checkbox" name="dias" id={dia.label} checked={dia.isChecked} onChange={this.onChangeCheckbox} value={dia.valor} /><label for={dia.label}>{dia.mini}</label></span>)
                            })}
                        </div>
                    }
                    <div >
                        <span>Termina</span>
                    </div>
                    <div>
                        <span><input type="radio" name="termino" value="1" onChange={this.onChangeInput} /><label>El</label></span>
                        <span><input type="date" name="fechaTermino" value={this.state.fechaTermino} onChange={this.onChangeInput}></input></span>
                    </div>
                    <div>
                        <span><input type="radio" name="termino" value="2" onChange={this.onChangeInput} /><label>despues de </label></span>
                        <span><input type="number" name="repeticionesTermino" value={this.state.repeticionesTermino} onChange={this.onChangeInput}></input> repeticiones</span>
                    </div>
                    <div className="form-group buttons">
                        <button className="boton-generico btazul" onClick={this.props.closeModal} type="submit">Cancelar</button>
                        <button className="boton-generico btazul" onClick={this.enviarDatos} type="button">Aceptar</button>
                    </div>
                </div>
            </div>
        )
    }

}