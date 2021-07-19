import React from 'react'
import { Link } from 'react-router-dom';
import { autenticacion } from '../servicios/autenticacion';
import { historial } from '../helpers/historial';

const currentUser = autenticacion.currentUserValue;
if (!currentUser) {
  if (window.location.pathname.indexOf("recuperarPass") > -1) {

  } else {
    historial.push('/login');
  }
}

const NotFound = () => (
  <div>
    <h1>404 - Not Found!</h1>
    {currentUser
      ? <Link to="/">
        Go Home
      </Link>
      : <Link to="/login">
        Go Login
      </Link>
    }

  </div>
);

export default NotFound;