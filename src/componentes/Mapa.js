import React, { useState, useEffect } from 'react';
import './Mapa.css';

// Habitaciones con sus coordenadas en la nueva ilustración 
const habitacionesBase = [
    { id: 'minecraft', nombre: 'Minecraft', icono: '', estilo: { top: '45%', left: '8%', width: '18%', height: '35%' } },
    { id: 'gamer', nombre: 'Cuarto Gamer', icono: '', estilo: { top: '15%', left: '32%', width: '16%', height: '22%' } },
    { id: 'dnd', nombre: 'Mesa de D&D', icono: '', estilo: { top: '40%', left: '42%', width: '14%', height: '18%' } },
    { id: 'hearthstone', nombre: 'Hearthstone', icono: '', estilo: { top: '70%', left: '50%', width: '12%', height: '16%' } },
    { id: 'cocina', nombre: 'Cocina', icono: '', estilo: { top: '35%', left: '72%', width: '20%', height: '28%' } },
    { id: 'final', nombre: 'Final', icono: '', estilo: { top: '22%', left: '56%', width: '12%', height: '18%' } },
];

export default function Mapa({ piezas = [], onSeleccionarHabitacion, personajeElla, personajeEl }) {
    const [mostrarNotificacion, setMostrarNotificacion] = useState(true);

    // Ocultar notificación flotante a los 3 segundos
    useEffect(() => {
        const timer = setTimeout(() => {
            setMostrarNotificacion(false);
        }, 3000);
        return () => clearTimeout(timer);
    }, []);

    // Se desbloquea el final al reunir las 5 piezas
    const finalDesbloqueado = piezas.length === 5;

    const handleRoomClick = (hab) => {
        if (hab.id === 'final' && !finalDesbloqueado) {
            return; // Bloqueado
        }
        if (onSeleccionarHabitacion) {
            onSeleccionarHabitacion(hab.id);
        }
    };

    return (
        <div className="mapa-contenedor custom-cursor">
            {/* Letrero flotante */}
            {mostrarNotificacion && (
                <p className="mapa-notificacion">¿A dónde vamos, amor?</p>
            )}

            {/* Personajes flotando a los costados del plano */}
            <img src={personajeElla} alt="yo" className="personaje-mapa izquierda" />
            {personajeEl && (
                <img src={personajeEl} alt="Mi amorcito" className="personaje-mapa derecha" />
            )}

            {/* Plano de la Cabaña (Ilustración con Hotspots Absolutos) */}
            <div className="cabaña-plano-ilustrado">
                {habitacionesBase.map((hab) => {
                    const esFinal = hab.id === 'final';
                    const completada = piezas.includes(hab.id);
                    const bloqueada = esFinal && !finalDesbloqueado;

                    let claseEstado = '';
                    if (completada) claseEstado = 'completada';
                    if (bloqueada) claseEstado = 'bloqueada';

                    return (
                        <button
                            key={hab.id}
                            className={`habitacion-hotspot ${hab.id} ${claseEstado}`}
                            style={hab.estilo}
                            onClick={() => handleRoomClick(hab)}
                            title={esFinal && bloqueada ? "Final Bloqueado" : hab.nombre}
                        >
                            {/* Globo informativo (tooltip) al hacer hover */}
                            <span className="tooltip-mapa">
                                <span style={{ marginRight: '6px' }}>{hab.icono}</span>
                                {hab.nombre}
                                <span className="estado-sub">
                                    {esFinal ? (bloqueada ? ' 🔒' : ' ¡Listo!') : (completada ? ' (Ganado)' : ' (Pendiente)')}
                                </span>
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* HUD de Inventario estilo Hotbar de Minecraft */}
            <div className="hud-inventario">
                {[0, 1, 2, 3, 4].map((index) => {
                    const tienePieza = index < piezas.length;
                    return (
                        <div
                            key={index}
                            className={`hud-slot ${tienePieza ? 'lleno' : ''}`}
                        >
                            {tienePieza && (
                                <span className="pieza-billy">
                                    🗝️
                                </span>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}