import React from 'react';
import { Router, Route, Switch } from "react-router-dom";

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
import RecuperarPass from './componentes/login/recuperarPass';

//Gestion Residuos
import GestionResiduos from './componentes/gestion_residuos/gestion';
import ControlRetiro from './componentes/gestion_residuos/controlretiro';
import OrdenesRetiro from './componentes/gestion_residuos/ordenesretiro';
import CrearOrdenRetiro from './componentes/gestion_residuos/crearordenretiro';
import ModificarOrdenRetiro from './componentes/gestion_residuos/modificarordenretiro';
import VerOrdenRetiro from './componentes/gestion_residuos/verordenretiro';
import ProgramacionRetiro from './componentes/gestion_residuos/programacionRetiro';
import CrearRetiro from './componentes/gestion_residuos/crearretiro';
import FrecuenciaRetiro from './componentes/gestion_residuos/frecuenciaRetiro';
import VerRetiro from './componentes/gestion_residuos/verretiro';
import ControlLogistico from './componentes/gestion_residuos/controlLogistico';
import CrearRuta from './componentes/gestion_residuos/crearruta';
import VerRuta from './componentes/gestion_residuos/verruta';

import PlanManejo from './componentes/gestion_residuos/planManejo';
import PlanManejoCliente from './componentes/gestion_residuos/planmanejocliente';
import CrearPlanManejo from './componentes/gestion_residuos/crearplanmanejo';
import VerPlanManejo from './componentes/gestion_residuos/verplanmanejo';


import Trazabilidad from './componentes/gestion_residuos/trazabilidad';
import VerTrazabilidad from './componentes/gestion_residuos/vertrazabilidad';

import Emergencias from './componentes/gestion_residuos/emergencias';
import EmergenciasResiduos from './componentes/gestion_residuos/emergenciasResiduos';
import EmergenciasResiduosCrear from './componentes/gestion_residuos/crearEmergenciaResiduos';
import EmergenciasResiduosVer from './componentes/gestion_residuos/crearEmergenciaResiduos';
import EmergenciasVehiculos from './componentes/gestion_residuos/emergenciasVehiculos';
import EmergenciasVehiculosCrear from './componentes/gestion_residuos/crearEmergenciaVehiculos';

//Gestion usuarios
import GestionUsuarios from './componentes/gestion_usuarios/gestion';
import ListarUsuarios from './componentes/gestion_usuarios/listarTrabajadores';
import CrearUsuario from './componentes/usuarios/crearUsuario';
import PerfilTrabajador from './componentes/gestion_usuarios/perfil';
import FichaTrabajador from './componentes/gestion_usuarios/fichaTrabajador';
import EquipoTrabajador from './componentes/gestion_usuarios/equipoTrabajador';
import ContractualTrabajador from './componentes/gestion_usuarios/contractualTrabajador';
import PrevisionTrabajador from './componentes/gestion_usuarios/previsionTrabajador';
import HojaDeVida from './componentes/gestion_usuarios/hojadevida';
import RegistrosGraficos from './componentes/gestion_usuarios/registrosgraficos';
import IndicadoresTrabajador from './componentes/gestion_usuarios/indicadoresdesempeño';

import CrearCapacitacion from './componentes/gestion_usuarios/hojadevida/crearCapacitacion';
import ModificarCapacitacion from './componentes/gestion_usuarios/hojadevida/modificarCapacitacion';
import CrearAmonestacion from './componentes/gestion_usuarios/hojadevida/crearAmonestacion';
import ModificarAmonestacion from './componentes/gestion_usuarios/hojadevida/modificarAmonestacion';
import Asistencias from './componentes/gestion_usuarios/asistencias';
import ControlAsistencia from './componentes/gestion_usuarios/asistencias/control';
import ControlAsistenciaTurno from './componentes/gestion_usuarios/asistencias/controlTurno';
import AsistenciasTrabajador from './componentes/gestion_usuarios/asistencias/control';
import Turnos from './componentes/gestion_usuarios/turnos';
import TurnosTrabajador from './componentes/gestion_usuarios/turnosTrabajador';
import TurnosHistorialTrabajador from './componentes/gestion_usuarios/historialTurnos';
import CrearTurno from './componentes/gestion_usuarios/crearturnos';
import DetalleTurno from './componentes/gestion_usuarios/detalleturno';
import DetalleAsistencia from './componentes/gestion_usuarios/asistencias/detalleasistencia';
import EvaluarTurno from './componentes/gestion_usuarios/asistencias/evaluarturno';

//Bienestar
import Bienestar from './componentes/bienestar/bienestar';
import Encuestas from './componentes/bienestar/encuestas';
import MisEncuestas from './componentes/bienestar/encuestas/misEncuestas';
import NuevaEncuesta from './componentes/bienestar/encuestas/nuevaEncuesta';
import EditarEncuesta from './componentes/bienestar/encuestas/editarEncuesta';
import ContestarEncuesta from './componentes/bienestar/encuestas/contestarEncuesta';
import ResultadosEncuestas from './componentes/bienestar/encuestas/resultadosEncuestas';
import VerResultados from './componentes/bienestar/encuestas/verResultados';
import Soporte from './componentes/bienestar/soporte';
import VerMensajeSoporte from './componentes/bienestar/soporte/verMensaje';



//perfil personal
import Perfil from './componentes/perfil/perfil';
import TurnosPersonal from './componentes/perfil/turnos';
import TurnosHistorialPersonal from './componentes/perfil/historialTurnos';
import FichaPersonal from './componentes/perfil/fichaTrabajador';
import EquipoPersonal from './componentes/perfil/equipoPersonal';
import ContractualPersonal from './componentes/perfil/contractualPersonal';
import HojaDeVidaPersonal from './componentes/perfil/hojadevida';
import PrevisionPersonal from './componentes/perfil/previsionTrabajador';
import RegistrosGraficosPersonal from './componentes/perfil/registrosgraficos';
import IndicadoresPersonal from './componentes/perfil/indicadoresdesempeño';


import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'react-confirm-alert/src/react-confirm-alert.css';


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
                <Switch>
                  <RutaPrivada exact path="/" component={Inicio} />


                  {/* trabajadores */}
                  <RutaPrivada path="/personas/gestion" component={GestionUsuarios} />
                  <RutaPrivada path="/personas/listar-trabajadores" component={ListarUsuarios} />
                  <RutaPrivada path="/personas/crear-trabajador" component={CrearUsuario} />
                  <RutaPrivada path="/personas/perfil/:id" component={PerfilTrabajador} />
                  <RutaPrivada exact path="/personas/ficha-trabajador/:id" component={FichaTrabajador} />

                  <RutaPrivada exact path="/personas/ficha-trabajador/" component={FichaTrabajador} />

                  <RutaPrivada exact path="/personas/ficha-trabajador/equipo/:id" component={EquipoTrabajador} />
                  <RutaPrivada exact path="/personas/ficha-trabajador/contractual/:id" component={ContractualTrabajador} />
                  <RutaPrivada exact path="/personas/ficha-trabajador/prevision/:id" component={PrevisionTrabajador} />
                  <RutaPrivada exact path="/personas/ficha-trabajador/hoja-de-vida/:id" component={HojaDeVida} />
                  <RutaPrivada exact path="/personas/ficha-trabajador/hoja-de-vida/crear-capacitacion/:id" component={CrearCapacitacion} />
                  <RutaPrivada exact path="/personas/ficha-trabajador/hoja-de-vida/modificar-capacitacion/:id" component={ModificarCapacitacion} />
                  <RutaPrivada exact path="/personas/ficha-trabajador/hoja-de-vida/crear-amonestacion/:id" component={CrearAmonestacion} />
                  <RutaPrivada exact path="/personas/ficha-trabajador/hoja-de-vida/modificar-amonestacion/:id" component={ModificarAmonestacion} />
                  <RutaPrivada exact path="/personas/ficha-trabajador/asistencias/:id" component={AsistenciasTrabajador} />
                  <RutaPrivada exact path="/personas/ficha-trabajador/registros-graficos/:id" component={RegistrosGraficos} />
                  <RutaPrivada exact path="/personas/ficha-trabajador/indicadores-desempeño/:id" component={IndicadoresTrabajador} />

                  <RutaPrivada exact path="/personas/asistencias/" component={Asistencias} />
                  <RutaPrivada exact path="/personas/asistencias/control-asistencia" component={ControlAsistencia} />
                  <RutaPrivada exact path="/personas/asistencias/control-asistencia/turno/:id" component={ControlAsistenciaTurno} />
                  <RutaPrivada exact path="/personas/asistencias/control-asistencia/turno/evaluar/:id" component={EvaluarTurno} />
                  <RutaPrivada exact path="/personas/asistencias/control-asistencia/turno/detalle/:id" component={DetalleAsistencia} />

                  <RutaPrivada exact path="/personas/turnos/detalle/:id" component={DetalleTurno} />
                  <RutaPrivada exact path="/personas/turnos/" component={Turnos} />
                  <RutaPrivada exact path="/personas/turnos/trabajador/:id" component={TurnosTrabajador} />
                  <RutaPrivada exact path="/personas/turnos/trabajador/historial/:id" component={TurnosHistorialTrabajador} />
                  <RutaPrivada exact path="/personas/turnos/crear-turno" component={CrearTurno} />


                  {/*Perfil */}
                  <RutaPrivada exact path="/perfil" component={Perfil} />
                  <RutaPrivada exact path="/selecciona-perfil" component={Selectperfil} funcion={this.mostrarNavegador} />
                  <RutaPrivada exact path="/perfil/ficha-personal/" component={FichaPersonal} />
                  <RutaPrivada exact path="/perfil/turnos" component={TurnosPersonal} />
                  <RutaPrivada exact path="/perfil/turnos/historial" component={TurnosHistorialPersonal} />
                  <RutaPrivada exact path="/perfil/ficha-personal/equipo" component={EquipoPersonal} />
                  <RutaPrivada exact path="/perfil/ficha-personal/contractual" component={ContractualPersonal} />
                  <RutaPrivada exact path="/perfil/ficha-personal/prevision" component={PrevisionPersonal} />
                  <RutaPrivada exact path="/perfil/ficha-personal/hoja-de-vida" component={HojaDeVidaPersonal} />
                  <RutaPrivada exact path="/perfil/ficha-personal/registros-graficos" component={RegistrosGraficosPersonal} />
                  <RutaPrivada exact path="/perfil/ficha-personal/indicadores-desempeño" component={IndicadoresPersonal} />



                  {/*Residuos*/}
                  <RutaPrivada exact path="/residuos/gestion" component={GestionResiduos} />
                  <RutaPrivada exact path="/residuos/control-retiro" component={ControlRetiro} />
                  <RutaPrivada exact path="/residuos/control-retiro/orden-retiro" component={OrdenesRetiro} />
                  <RutaPrivada exact path="/residuos/control-retiro/orden-retiro/nueva-orden" component={CrearOrdenRetiro} />
                  <RutaPrivada exact path="/residuos/control-retiro/orden-retiro/modificar-orden/:id" component={ModificarOrdenRetiro} />
                  <RutaPrivada exact path="/residuos/control-retiro/orden-retiro/ver-orden/:id" component={VerOrdenRetiro} />
                  <RutaPrivada exact path="/residuos/control-retiro/programacion-retiro" component={ProgramacionRetiro} />
                  <RutaPrivada exact path="/residuos/control-retiro/crear-retiro" component={CrearRetiro} />
                  <RutaPrivada exact path="/residuos/control-retiro/ver-retiro/:id" component={VerRetiro} />
                  <RutaPrivada exact path="/residuos/control-logistico" component={ControlLogistico} />
                  <RutaPrivada exact path="/residuos/control-logistico/crear-ruta" component={CrearRuta} />
                  <RutaPrivada exact path="/residuos/control-logistico/ver-ruta/:id" component={VerRuta} />
                  <RutaPrivada exact path="/residuos/plan-manejo" component={PlanManejo} />
                  <RutaPrivada exact path="/residuos/plan-manejo-cliente/:id" component={PlanManejoCliente} />
                  <RutaPrivada exact path="/residuos/plan-manejo/crear/:id" component={CrearPlanManejo} />
                  <RutaPrivada exact path="/residuos/plan-manejo/ver/:id" component={VerPlanManejo} />

                  <RutaPrivada exact path="/residuos/trazabilidad/" component={Trazabilidad} />
                  <RutaPrivada exact path="/residuos/trazabilidad/ver/:id" component={VerTrazabilidad} />

                  <RutaPrivada exact path="/residuos/emergencias/" component={Emergencias} />
                  <RutaPrivada exact path="/residuos/emergencias/residuos/" component={EmergenciasResiduos} />
                  <RutaPrivada exact path="/residuos/emergencias/residuos/crear" component={EmergenciasResiduosCrear} />
                  <RutaPrivada exact path="/residuos/emergencias/residuos/ver/:id" component={EmergenciasResiduosVer} />
                  <RutaPrivada exact path="/residuos/emergencias/vehiculos/" component={EmergenciasVehiculos} />
                  <RutaPrivada exact path="/residuos/emergencias/vehiculos/crear" component={EmergenciasVehiculosCrear} />

                  {/*Bienestar*/}
                  <RutaPrivada exact path="/bienestar" component={Bienestar} />
                  <RutaPrivada exact path="/bienestar/encuestas" component={Encuestas} />
                  <RutaPrivada exact path="/bienestar/encuestas/mis-encuestas" component={MisEncuestas} />
                  <RutaPrivada exact path="/bienestar/encuestas/nueva-encuesta" component={NuevaEncuesta} />
                  <RutaPrivada exact path="/bienestar/encuestas/editar-encuesta/:id" component={EditarEncuesta} />
                  <RutaPrivada exact path="/bienestar/encuestas/contestar-encuesta/:id" component={ContestarEncuesta} />
                  <RutaPrivada exact path="/bienestar/encuestas/ver-resultados/:id" component={VerResultados} />
                  <RutaPrivada exact path="/bienestar/encuestas/resultados" component={ResultadosEncuestas} />
                  <RutaPrivada exact path="/bienestar/soporte" component={Soporte} />
                  <RutaPrivada exact path="/bienestar/soporte/ver-mensaje/:id" component={VerMensajeSoporte} />



                  <Route component={NotFound} />
                </Switch>
              </div>
            </div>
            : <div className="fila-contenedor">
              <div id="principal">
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
                <Switch>
                  <RutaPrivada exact path="/" component={Inicio} />
                  <Route path="/login" component={Login} />
                  <Route exact path="/recuperarPass/:token" component={RecuperarPass} />
                  <Route component={NotFound} />
                </Switch>
              </div>
            </div>
          }
        </div>
      </Router>
    );
  }
}
export default App;