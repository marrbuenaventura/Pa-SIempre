import React, { useState, useEffect } from 'react';
import Bienvenida from './componentes/Bienvenida';
import Mapa from './componentes/Mapa';
import './App.css';
import CuartoGamer from './componentes/habitaciones/CuartoGamer';
import MesaDnD from './componentes/habitaciones/MesaDnD';
import Hearthstone from './componentes/habitaciones/Hearthstone';
import PantallaCarga from './componentes/PantallaCarga';
import PantallaTitulo from './componentes/PantallaTitulo';
import SeleccionPersonaje from './componentes/SeleccionPersonaje';
import Cocina from './componentes/habitaciones/Cocina';
import Minecraft from './componentes/habitaciones/Minecraft';
import Final from './componentes/habitaciones/Final';


const HABITACIONES = ['gamer', 'dnd', 'hearthstone', 'cocina', 'minecraft'];

function App() {
  const [pantalla, setPantalla] = useState('carga');
  // Array de IDs de habitaciones que ya se ganaron (ej: ['gamer', 'cocina'])
  const [piezasEncontradas, setPiezasEncontradas] = useState([]);
  const [personajeElegido, setPersonajeElegido] = useState(null);

  useEffect(() => {
    if (window.electronAPI) {
      const factor = HABITACIONES.includes(pantalla) ? 0.85 : 1.3;
      window.electronAPI.setZoom(factor);
    }
  }, [pantalla]);

  const elegirPersonaje = (imagen) => {
    setPersonajeElegido(imagen);
    setPantalla('titulo'); // vuelve a la pantalla título ya con el personaje puesto
  };
  // Función para ir a la habitación seleccionada
  const irAHabitacion = (habitacionId) => {
    setPantalla(habitacionId); // Cambias la pantalla a 'gamer', 'dnd', etc.
  };

  // Función que llamarías dentro de cada juego cuando ganen
  const ganarPieza = (habitacionId) => {
    if (!piezasEncontradas.includes(habitacionId)) {
      setPiezasEncontradas([...piezasEncontradas, habitacionId]);
    }
    setPantalla('mapa'); // Regresa al mapa
  };

  const volverAlMapa = () => setPantalla('mapa');

  return (
    <div className="App">
      {pantalla === 'carga' && (
        <PantallaCarga onFinalizar={() => setPantalla('titulo')} />
      )}

      {pantalla === 'titulo' && (
        <PantallaTitulo
          personajeElegido={personajeElegido}
          onElegirPersonaje={() => setPantalla('seleccionPersonaje')}
          onContinuar={() => setPantalla('bienvenida')}
        />
      )}

      {pantalla === 'seleccionPersonaje' && (
        <SeleccionPersonaje
          onElegir={elegirPersonaje}
          onVolver={() => setPantalla('titulo')}
        />
      )}


      {pantalla === 'bienvenida' && (
        <Bienvenida
          personajeElla={`${process.env.PUBLIC_URL}/assets/personajes/Yo.png`}
          onEmpezar={() => setPantalla('mapa')}
        />
      )}

      {pantalla === 'mapa' && (
        <Mapa
          piezas={piezasEncontradas}
          onSeleccionarHabitacion={irAHabitacion}
          personajeElla={`${process.env.PUBLIC_URL}/assets/personajes/Yo.png`}
          personajeEl={personajeElegido}
        />
      )}

      {pantalla === 'gamer' && (
        <CuartoGamer alGanar={() => ganarPieza('gamer')} onVolver={volverAlMapa} personajeEl={personajeElegido} />
      )}

      {pantalla === 'dnd' && (
        <MesaDnD alGanar={() => ganarPieza('dnd')} onVolver={volverAlMapa} personajeEl={personajeElegido} />
      )}

      {pantalla === 'hearthstone' && (
        <Hearthstone alGanar={() => ganarPieza('hearthstone')} onVolver={volverAlMapa} personajeEl={personajeElegido} />
      )}

      {pantalla === 'cocina' && (
        <Cocina alGanar={() => ganarPieza('cocina')} onVolver={volverAlMapa} personajeEl={personajeElegido} />
      )}

      {pantalla === 'minecraft' && (
        <Minecraft alGanar={() => ganarPieza('minecraft')} onVolver={volverAlMapa} />
      )}

      {pantalla === 'final' && (
        <Final onFinalizar={() => setPantalla('titulo')} />
      )}

    </div>
  );
}

export default App;
