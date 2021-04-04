// import React, { useState } from 'react';

export function toogleModalCore(e, res = null) {
    var modal = '';
        if (e !== null) {
            var objetivo = e.currentTarget.dataset.objetivo;
            modal = "show" + objetivo;
        } else {
            modal = "show" + res;
        }
        if (this.state[modal]) {
            this.setState({ [modal]: false });
        } else {
            this.setState({ [modal]: true });
        }
}
export function validarEmail(email) {
    let emailRegex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

    //Se muestra un texto a modo de ejemplo, luego va a ser un icono
    if (emailRegex.test(email)) {
      return true;
    } else {
     return false;
    }
}