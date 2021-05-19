import Axios from '../../helpers/axiosconf';
import { funciones } from '../../servicios/funciones';
import React, { Component } from 'react';
import { authHeader } from '../../helpers/auth-header';
import { handleResponse } from '../../helpers/manejador';
import { toast } from 'react-toastify';


const toastoptions = {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
}

export default class AgregarResiduoPlan extends Component {

    constructor(props) {
        super(props);
    }

    state = {
        codigos: '',
        categorias: '',
        codigo: '',
        categoria: '',
        subcategorias: '',
        categoriaLabel: ''
    }
    obtenerCentros = async () => { //genera una peticion get por axios a la api de usuarios
        var componente = this;
        const res = Axios.get('/api/generales/categoriasler/', { headers: authHeader() }) //se envia peticion axios con el token sesion guardado en local storage como cabecera
            .then(function (res) {   //si la peticion es satisfactoria entonces
                console.log(res.data.data)
                componente.setState({ centros: res.data.data });  //almacenamos el listado de usuarios en el estado usuarios (array)
            })
            .catch(function (err) { //en el caso de que se ocurra un error, axios lo atrapa y procesa
                handleResponse(err.response);  //invocamos al manejador para ver el tipo de error y ejecutar la accion pertinente
                return;
            });
    }

    componentDidMount = () => {
        var componente = this;
        const res = Axios.get('/api/generales/codigosler/', { headers: authHeader() }) //se envia peticion axios con el token sesion guardado en local storage como cabecera
            .then(function (res) {   //si la peticion es satisfactoria entonces
                console.log(res);
                componente.setState({ codigos: res.data.data });  //almacenamos el listado de usuarios en el estado usuarios (array)
            })
            .catch(function (err) { //en el caso de que se ocurra un error, axios lo atrapa y procesa
                handleResponse(err.response);  //invocamos al manejador para ver el tipo de error y ejecutar la accion pertinente
                return;
            });
    }

    obtenerCategoriasLer = async () => { //genera una peticion get por axios a la api de usuarios
        var componente = this;
        console.log(this.state.codigo);
        const res = Axios.post('/api/generales/categoriasler/', { codigo: this.state.codigo }, { headers: authHeader() }) //se envia peticion axios con el token sesion guardado en local storage como cabecera
            .then(function (res) {   //si la peticion es satisfactoria entonces
                var categorias;
                if (res.data.data) {
                    categorias = res.data.data.map((categoria, index) =>
                        <option value={categoria.key} data-label={categoria.categoria}>{categoria.categoria}</option>
                    )
                }
                componente.setState({ categorias: categorias });
            })
            .catch(function (err) { //en el caso de que se ocurra un error, axios lo atrapa y procesa
                handleResponse(err.response);  //invocamos al manejador para ver el tipo de error y ejecutar la accion pertinente
                return;
            });
    }
    obtenersubCategoriasLer = async () => {
        var componente = this;
        const res = Axios.post('/api/generales/subcategoriasler/', { codigo: this.state.codigo, categoria: this.state.categoria }, { headers: authHeader() }) //se envia peticion axios con el token sesion guardado en local storage como cabecera
            .then(async function (res) {   //si la peticion es satisfactoria entonces
                console.log(res.data.data);
                componente.setState({ subcategorias: res.data.data });

            })
            .catch(function (err) { //en el caso de que se ocurra un error, axios lo atrapa y procesa
                console.log(err);
                handleResponse(err.response);  //invocamos al manejador para ver el tipo de error y ejecutar la accion pertinente
                return;
            });
    }

    onChangeCodigo = async (e) => {
        await this.setState({
            [e.target.name]: e.target.value
        })
        if (e.target.value !== "") {
            this.obtenerCategoriasLer();
        }
    }

    onChangeCategoria = async (e) => {
        console.log(e.target[e.target.selectedIndex].dataset.label);
        await this.setState({
            [e.target.name]: e.target.value,
            categoriaLabel: e.target[e.target.selectedIndex].dataset.label
        });
        this.obtenersubCategoriasLer();
    }

    enviarDatos = async (e) => {
        console.log(this.state);
        var eleccion = { codigo: this.state.codigo, categoria: this.state.categoria, label: this.state.categoriaLabel, subcategorias: this.state.subcategorias }
        await this.props.props.agregarResiduo(eleccion);
        this.props.closeModal();
    }
    render() {

        let codigos;
        if (this.state.codigos) {
            codigos = this.state.codigos.map((codigo, index) =>
                <option value={codigo.codigo} >{codigo.codigo} - {codigo.residuo}</option>
            )
        }

        return (
            <div className="submodal">
                <div className="seccion mod">
                    <div>
                        <span className="w100 txc">Agregar Residuo asd</span>
                    </div>
                    <div >
                        <span className="w100">
                            <select className="input-generico" name="codigo" onChange={this.onChangeCodigo}>
                                <option>Codigo...</option>
                                {codigos}
                            </select>
                        </span>
                    </div>
                    <div>
                        <span className="w100">
                            <select className="input-generico" name="categoria" onChange={this.onChangeCategoria}>
                                <option>Categoria...</option>
                                {this.state.categorias}
                            </select>
                        </span>
                    </div>
                    <div className="form-group buttons">
                        <button className="boton-generico btazulalt" onClick={this.props.closeModal} type="submit">Cancelar</button>
                        <button className="boton-generico btazul" onClick={this.enviarDatos} type="button">Aceptar</button>
                    </div>
                </div>
            </div>
        )
    }

}