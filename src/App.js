import React from 'react';
import { Router, Route } from "react-router-dom";

//hojas de estilo generales
import './styles/generales.css';

//Funciones
import { historial } from './helpers/historial';
import { autenticacion } from './servicios/autenticacion';
import { RutaPrivada } from './componentes/rutaPriv';

//Componentes principales (paneles de inicio de componentes)
import BarraSuperior from './componentes/includes/barrasuperior';
import Inicio from './componentes/inicio';
import Selectperfil from './componentes/login/selectperfil';
import Login from './componentes/login/login';

//Bienestar
import Bienestar from './componentes/bienestar/bienestar';
import Encuestas from './componentes/encuestas/encuestas';
import Soporte from './componentes/soporte/soporte';

//Gestion Residuos
import GestionResiduos from './componentes/gestion_residuos/gestion';
import ControlRetiro from './componentes/gestion_residuos/controlretiro';
import OrdenesRetiro from './componentes/gestion_residuos/ordenesretiro';
import CrearOrdenRetiro from './componentes/gestion_residuos/crearordenretiro';

import PlanManejo from './componentes/gestion_residuos/planManejo';

//Gestion usuarios
import GestionUsuarios from './componentes/gestion_usuarios/gestion';
import ListarUsuarios from './componentes/gestion_usuarios/listarTrabajadores';
import CrearUsuario from './componentes/usuarios/crearUsuario';
import PerfilTrabajador from './componentes/gestion_usuarios/perfil';
import FichaTrabajador from './componentes/gestion_usuarios/fichaTrabajador';
import EquipoTrabajador from './componentes/gestion_usuarios/equipoTrabajador';
import ContractualTrabajador from './componentes/gestion_usuarios/contractualTrabajador';
import PrevisionTrabajador from './componentes/gestion_usuarios/previsionTrabajador';


import TurnosTrabajador from './componentes/gestion_usuarios/turnos';

//perfil personal
import Perfil from './componentes/perfil/perfil';
import TurnosPersonal from './componentes/perfil/turnos';
import FichaPersonal from './componentes/perfil/fichaTrabajador';
import EquipoPersonal from './componentes/perfil/equipoPersonal';
import ContractualPersonal from './componentes/perfil/contractualPersonal';


import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


//404
import NotFound from './componentes/notfound';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: null,
      mostrarMenu: false,
    };
  }
  referencia = React.createRef();

  mostrarNavegador = (e) => {
    this.setState({ mostrarMenu: true });
  }
  cerrarSesion = (e) => {
    autenticacion.cerrarSesion();
    this.setState({ mostrarMenu: false });
    historial.push('/login');
  }

  async componentDidMount() {
    /* aqui debe ir funcion que compruebe validez del token*/
    await autenticacion.currentUser.subscribe(x => this.setState({ currentUser: x }));
    if (this.state.currentUser !== null) {
      if (this.state.currentUser.data.perfilSesion !== null) {
        this.mostrarNavegador();
      }
    }
  }

  render() {
    const { currentUser } = this.state;
    console.log(currentUser);

    return (

      <Router history={historial}>
        <div className="contenedor" id="appContainer">
          {currentUser //Verifica si existe el usuario
            ? <div className="fila-contenedor">
              <BarraSuperior cerrarSesion={this.cerrarSesion} menuOculto={this.state.mostrarMenu} />
              <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
              />
              <div id="principal">
                <RutaPrivada exact path="/" component={Inicio} />


                {/* trabajadores */}
                <RutaPrivada path="/personas/gestion" component={GestionUsuarios} />
                <RutaPrivada path="/personas/listar-trabajadores" component={ListarUsuarios} />
                <RutaPrivada path="/personas/crear-trabajador" component={CrearUsuario} />
                <RutaPrivada path="/personas/perfil/:id" component={PerfilTrabajador} />
                <RutaPrivada exact path="/personas/ficha-trabajador/:id" component={FichaTrabajador} />
                <RutaPrivada exact path="/personas/ficha-trabajador/equipo/:id" component={EquipoTrabajador} />
                <RutaPrivada path="/personas/ficha-trabajador/contractual/:id" component={ContractualTrabajador} />
                <RutaPrivada path="/personas/ficha-trabajador/prevision/:id" component={PrevisionTrabajador} />


                <RutaPrivada path="/personas/turnos/:id" component={TurnosTrabajador} />


                {/*Perfil */}
                <RutaPrivada exact path="/perfil" component={Perfil} />
                <RutaPrivada exact path="/selecciona-perfil" component={Selectperfil} funcion={this.mostrarNavegador} />
                <RutaPrivada exact path="/perfil/ficha-personal/" component={FichaPersonal} />
                <RutaPrivada exact path="/perfil/turnos" component={TurnosPersonal} />
                <RutaPrivada exact path="/perfil/ficha-personal/equipo" component={EquipoPersonal} />
                <RutaPrivada exact path="/perfil/ficha-personal/contractual" component={ContractualPersonal} />


                {/*Residuos*/}
                <RutaPrivada  exact path="/residuos/gestion" component={GestionResiduos} />
                <RutaPrivada exact path="/residuos/control-retiro" component={ControlRetiro} />
                <RutaPrivada exact path="/residuos/control-retiro/orden-retiro" component={OrdenesRetiro} />
                <RutaPrivada exact path="/residuos/control-retiro/orden-retiro/nueva-orden" component={CrearOrdenRetiro} />

                <RutaPrivada exact path="/residuos/plan-manejo" component={PlanManejo} />

                {/*Bienestar*/}
                <RutaPrivada path="/bienestar" component={Bienestar} />

                {/*Encuestas*/}
                <RutaPrivada path="/encuestas" component={Encuestas} />

                {/*Soporte*/}
                <RutaPrivada path="/soporte" component={Soporte} />

                {/* asistencias  */}
                <RutaPrivada path="/turnos/listar-asistencias" component={ListarUsuarios} />

                <Route component={NotFound} />
              </div>
            </div>
            : <div className="fila-contenedor">
              <div id="principal">
                <RutaPrivada exact path="/" component={Inicio} />
                <Route component={NotFound} />
                <Route path="/login" component={Login} />
              </div>
            </div>
          }
        </div>
      </Router>
    );
  }
}
export default App;