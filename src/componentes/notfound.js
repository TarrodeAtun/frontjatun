import React from 'react'
import { Link } from 'react-router-dom';
import { autenticacion } from '../servicios/autenticacion';
import { historial } from '../helpers/historial';

const currentUser = autenticacion.currentUserValue;
if (!currentUser) {
historial.push('/login');
}

const NotFound = () => (
    <div>
      <h1>404 - Not Found!</h1>
      <Link to="/">
        Go Home
      </Link>
    </div>
  );

export default NotFound;