import React from 'react';
import { Route, Redirect } from 'react-router-dom';

import { autenticacion } from '../servicios/autenticacion';

export const RutaPrivada = ({ component: Component, dato, funcion, ...rest }) => (
    <Route {...rest} render={props => {
        const currentUser = autenticacion.currentUserValue;
        if (!currentUser) {
            console.log("asdqui");
            // si no esta logeado se redirecciona a login
            return <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
        }
        if (props.location.pathname !== "/selecciona-perfil") { //consulta si la ubicacion actual no es el seleccionador de perfil
            console.log("mncvmb");
            var usuario = JSON.parse(localStorage.getItem('usuarioActual'));
            if (usuario.data.perfilSesion === null) {
                return <Redirect to={{ pathname: '/selecciona-perfil', state: { from: props.location } }} />
            }
        }{
            dato = false;
        }
        // si esta logueado se renderiza el componente pedido
        return <Component {...props} impDatos={dato} impFuncion={funcion}/>
    }} />
)