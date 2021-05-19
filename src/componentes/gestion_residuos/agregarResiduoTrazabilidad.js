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
        subcategoria: '',
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
        var codigo = this.props.props.codigo;
        var categoria = this.props.props.categoria;
        var componente = this;
        const res = Axios.post('/api/generales/subcategoriasler/', { codigo, categoria }, { headers: authHeader() }) //se envia peticion axios con el token sesion guardado en local storage como cabecera
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

    onChangeCategoria = async (e) => {
        console.log(e.target[e.target.selectedIndex].dataset.label);
        await this.setState({
            [e.target.name]: e.target.value,
            categoriaLabel: e.target[e.target.selectedIndex].dataset.label
        });
    }


    enviarDatos = async (e) => {
        console.log(this.state);
        var eleccion = { subcategoria: this.state.subcategoria, label: this.state.categoriaLabel }
        await this.props.props.agregarResiduo(eleccion);
        this.props.closeModal();
    }
    render() {

        let subcategorias;
        if (this.state.subcategorias) {
            subcategorias = this.state.subcategorias.map((subcategoria, index) =>
                <option value={subcategoria.key} data-label={subcategoria.nombre} >{subcategoria.nombre}</option>
            )
        }

        return (
            <div className="submodal">
                <div className="seccion mod">
                    <div>
                        <span className="w100 txc">Agregar Residuo traz</span>
                    </div>
                    <div >
                        <span className="w100">
                            <select className="input-generico" name="subcategoria" onChange={this.onChangeCategoria}>
                                <option value="">Codigo...</option>
                                {subcategorias}
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