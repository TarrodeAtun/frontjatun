import React from 'react';
import { Route, Redirect } from 'react-router-dom';

import { autenticacion } from '../servicios/autenticacion';

export const RutaPrivada = ({ component: Component, dato, funcion, ...rest }) => (
    <Route {...rest} render={props => {
        const currentUser = autenticacion.currentUserValue;
        if (!currentUser) {
            return <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
        }
        // si esta logueado se renderiza el componente pedido
        return <Component {...props} impDatos={dato} impFuncion={funcion}/>
    }} />
)