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

//Gestion usuarios
import GestionUsuarios from './componentes/gestion_usuarios/gestion';
import ListarUsuarios from './componentes/gestion_usuarios/listarTrabajadores';
import PerfilTrabajador from './componentes/gestion_usuarios/perfil';
import Turnos from './componentes/gestion_usuarios/turnos';
import CrearUsuario from './componentes/usuarios/crearUsuario';
import ListaUsuarios from './componentes/usuarios/listarUsuarios';


//perfil
import Perfil from './componentes/perfil/perfil';
import FichaTrabajador from './componentes/perfil/fichaTrabajador';

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
              <div id="principal">
                <RutaPrivada exact path="/" component={Inicio} />
                

                {/* trabajadores */}
                <RutaPrivada path="/personas/gestion" component={GestionUsuarios} />
                <RutaPrivada path="/personas/listar-trabajadores" component={ListarUsuarios} />
                <RutaPrivada path="/personas/listar-usuarios" component={ListaUsuarios} />
                <RutaPrivada path="/personas/crear-trabajador" component={CrearUsuario} />
                <RutaPrivada path="/personas/perfil/:id" component={PerfilTrabajador} />


                {/*Perfil */}
                <RutaPrivada exact path="/perfil" component={Perfil} />
                <RutaPrivada exact path="/selecciona-perfil" component={Selectperfil} funcion={this.mostrarNavegador} />
                <RutaPrivada path="/perfil/ficha-personal" component={FichaTrabajador} />
                <RutaPrivada path="/perfil/turnos" component={Turnos} />


                {/*Residuos*/}
                <RutaPrivada path="/residuos/gestion" component={GestionResiduos} />

                {/*Bienestar*/}
                <RutaPrivada path="/bienestar" component={Bienestar} />

                {/*Encuestas*/}
                <RutaPrivada path="/encuestas" component={Encuestas} />

                {/*Soporte*/}
                <RutaPrivada path="/soporte" component={Soporte} />

                {/* asistencias  */}
                <RutaPrivada path="/turnos/listar-asistencias" component={ListaUsuarios} />

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