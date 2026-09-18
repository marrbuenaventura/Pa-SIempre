import React, { useState, useEffect, useRef } from 'react';
import './CuartoGamer.css';

/**
 * Componente CuartoGamer
 * @param {Function} alGanar - Callback que se ejecuta cuando el jugador gana la pieza (vuelve al mapa con +1 pieza)
 * @param {Function} onVolver - Callback para volver al mapa sin ganar nada
 */
export default function CuartoGamer({ alGanar, onVolver, personajeEl }) {
    const fotosVideollamadas = [
        `${process.env.PUBLIC_URL}/videollamadas/foto1.jpeg`,
        `${process.env.PUBLIC_URL}/videollamadas/foto2.jpeg`,
        `${process.env.PUBLIC_URL}/videollamadas/foto3.jpeg`,
        `${process.env.PUBLIC_URL}/videollamadas/foto4.jpeg`,
        `${process.env.PUBLIC_URL}/videollamadas/foto5.jpeg`,
        `${process.env.PUBLIC_URL}/videollamadas/foto6.jpeg`,
        `${process.env.PUBLIC_URL}/videollamadas/foto7.jpeg`,
    ];
    const [fotoActualIndex, setFotoActualIndex] = useState(-1);
    const [mostrarFoto, setMostrarFoto] = useState(false);
    const [fase, setFase] = useState('explorando');
    const [aciertos, setAciertos] = useState(0);
    const [intentos, setIntentos] = useState(0);
    const [mensajeHotspot, setMensajeHotspot] = useState('');
    const [feedbackHit, setFeedbackHit] = useState('');
    const [hachas, setHachas] = useState([]);
    const [catcherLane, setCatcherLane] = useState('izquierda');

    const gameLoopRef = useRef(null);
    const spawnIntervalRef = useRef(null);
    const catcherLaneRef = useRef('izquierda'); // para leer el valor actual dentro del loop
    const totalHachasMax = 12;
    const aciertosRequeridos = 8;
    const zonaCaptura = 85; // % de altura donde se evalúa si atajaste

    const verSiguienteFoto = () => {
        setFotoActualIndex((prev) => (prev + 1) % fotosVideollamadas.length);
        setMostrarFoto(true);
    };

    useEffect(() => {
        catcherLaneRef.current = catcherLane;
    }, [catcherLane]);

    // Control con flechas del teclado
    useEffect(() => {
        const handleKey = (e) => {
            if (fase !== 'jugando') return;
            if (e.key === 'ArrowLeft') setCatcherLane('izquierda');
            if (e.key === 'ArrowRight') setCatcherLane('derecha');
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [fase]);

    useEffect(() => {
        return () => {
            clearInterval(spawnIntervalRef.current);
            cancelAnimationFrame(gameLoopRef.current);
        };
    }, []);

    const empezarMiniJuego = () => {
        setFase('jugando');
        setAciertos(0);
        setIntentos(0);
        setHachas([]);
        setFeedbackHit('');
        setCatcherLane('izquierda');
        catcherLaneRef.current = 'izquierda';
        iniciarGameLoop();
        iniciarSpawn();
    };

    const iniciarSpawn = () => {
        let spawnCount = 0;
        const spawnAxe = () => {
            if (spawnCount >= totalHachasMax) {
                clearInterval(spawnIntervalRef.current);
                return;
            }
            const nuevaHacha = {
                id: Date.now() + Math.random(),
                top: 0,
                lane: Math.random() > 0.5 ? 'izquierda' : 'derecha',
                active: true
            };
            setHachas(prev => [...prev, nuevaHacha]);
            spawnCount++;
        };
        spawnAxe();
        spawnIntervalRef.current = setInterval(spawnAxe, 1400);
    };

    const iniciarGameLoop = () => {
        const updatePositions = () => {
            setHachas(prevHachas => {
                let flagEndGame = false;

                const updated = prevHachas.map(hacha => {
                    if (!hacha.active) return hacha;

                    const velocidad = 1.6;
                    const nuevoTop = hacha.top + velocidad;

                    // Al llegar a la zona de captura, se evalúa una sola vez
                    if (nuevoTop >= zonaCaptura) {
                        hacha.active = false;

                        if (catcherLaneRef.current === hacha.lane) {
                            triggerFeedback('¡ATAJADA!');
                            setAciertos(prev => {
                                const nuevo = prev + 1;
                                if (nuevo >= aciertosRequeridos) {
                                    setTimeout(() => {
                                        clearInterval(spawnIntervalRef.current);
                                        cancelAnimationFrame(gameLoopRef.current);
                                        setFase('ganado');
                                    }, 300);
                                }
                                return nuevo;
                            });
                        } else {
                            triggerFeedback('uy casi');
                        }

                        setIntentos(prev => {
                            const nuevoIntentos = prev + 1;
                            if (nuevoIntentos >= totalHachasMax) {
                                flagEndGame = true;
                            }
                            return nuevoIntentos;
                        });
                    }

                    return { ...hacha, top: nuevoTop };
                });

                if (flagEndGame) {
                    setTimeout(() => finalJuegoCheck(), 400);
                }

                return updated;
            });

            gameLoopRef.current = requestAnimationFrame(updatePositions);
        };

        gameLoopRef.current = requestAnimationFrame(updatePositions);
    };

    const finalJuegoCheck = () => {
        clearInterval(spawnIntervalRef.current);
        cancelAnimationFrame(gameLoopRef.current);
        setAciertos(current => {
            setFase(current >= aciertosRequeridos ? 'ganado' : 'perdido');
            return current;
        });
    };

    const triggerFeedback = (texto) => {
        setFeedbackHit(texto);
        setTimeout(() => setFeedbackHit(prev => prev === texto ? '' : prev), 800);
    };

    const explorarHotspot = (tipo) => {
        const dialogos = {
            poster: "Un poster de Draven firmado en dorado. 'Tu personaje favorito! Ganaste? No. Te divertiste? Tampoco, pero bue...'",
            cajon: "Abrís el cajón del escritorio gamer y encontrás... los ultimos filtros y un poco de tabaco con olor a vainilla de cuando fumabas. Que epocas.",
            videollamada: "Parece que estaban haciendo una videollamada y se trabo la imagen...",
            monitor: "Mirá! El monitor tiene un fragmento dorado brillante atrapado dentro de League of Legends. Hace click aca para liberarlo."
        };
        setMensajeHotspot(dialogos[tipo]);
    };

    return (
        <div className="gamer-room-wrapper custom-cursor">

            {personajeEl && (
                <img src={personajeEl} alt="Mi amorcito" className="personaje-habitacion" />
            )}


            {/* ================= FASE EXPLORANDO ================= */}
            {fase === 'explorando' && (
                <div className="gamer-fase-explorar">

                    {/* Título */}
                    <div className="gamer-titulo-zona">
                        <h2>Cuarto Gamer</h2>
                        <p>Explora el cuarto o hacé click en la pantalla para empezar</p>
                    </div>

                    {/* Hotspots de exploración interactivos colocados sobre el fondo */}
                    <div className="gamer-escena">
                        {/* Poster en la pared */}
                        <button className="hotspot poster" onClick={() => explorarHotspot('poster')} title="Mirar poster">
                        </button>

                        {/* Cajón del escritorio */}
                        <button className="hotspot cajon" onClick={() => explorarHotspot('cajon')} title="Abrir cajón">
                        </button>

                        <button
                            className="hotspot monitor-fotos"
                            onClick={verSiguienteFoto}
                            title="Ver una videollamada"
                        >
                        </button>

                        {/* Monitor (Dispara el minijuego) */}
                        <button className="hotspot monitor pulsando" onClick={() => explorarHotspot('monitor')} title="Revisar monitor">
                        </button>
                    </div>

                    {mostrarFoto && (
                        <div className="foto-overlay" onClick={() => setMostrarFoto(false)}>
                            <div className="foto-marco" onClick={(e) => e.stopPropagation()}>
                                <img
                                    src={fotosVideollamadas[fotoActualIndex]}
                                    alt="Recuerdo de videollamada"
                                    className="foto-recuerdo"
                                    onClick={() => explorarHotspot('videollamada')}
                                />
                                <button className="btn-cerrar-foto" onClick={() => setMostrarFoto(false)}>
                                    ✕
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Caja de diálogo inferior */}
                    <div className="gamer-dialogo">
                        <p className="dialogo-texto">
                            {mensajeHotspot || "Tocá algún objeto del cuarto gamer para ver qué es..."}
                        </p>
                        {mensajeHotspot.includes("monitor") && (
                            <button className="btn-empezar-juego" onClick={empezarMiniJuego}>
                                Empezar MiniJuego!
                            </button>
                        )}
                    </div>

                    <button className="btn-volver-mapa" onClick={onVolver}>
                        ← Volver al mapa
                    </button>
                </div>
            )}

            {/* ================= FASE JUGANDO ================= */}
            {fase === 'jugando' && (
                <div className="gamer-fase-juego">
                    <div className="gamer-interfaz-lol">
                        <div className="lol-marcador">
                            <span className="marcador-titulo">ATRAPA LAS HACHAS</span>
                            <span className="marcador-puntos">Atrapadas: {aciertos} / {aciertosRequeridos}</span>
                            <span className="marcador-intentos">Restantes: {totalHachasMax - intentos}</span>
                        </div>
                        {feedbackHit && (
                            <div className={`lol-feedback ${feedbackHit.includes('ATAJADA') ? 'exito' : 'fallo'}`}>
                                {feedbackHit}
                            </div>
                        )}
                    </div>

                    <div className="lol-pistas-contenedor">
                        <div className="lol-pista izquierda"><div className="linea-carril"></div></div>
                        <div className="lol-pista derecha"><div className="linea-carril"></div></div>

                        <div className="lol-hit-zone">
                            <div className="hit-zone-linea"></div>
                            <span className="hit-zone-texto">ZONA DE ATAJE</span>
                        </div>

                        {hachas.map(hacha => {
                            if (!hacha.active) return null;
                            return (
                                <div
                                    key={hacha.id}
                                    className={`draven-hacha ${hacha.lane}`}
                                    style={{ top: `${hacha.top}%` }}
                                >
                                    🪓
                                </div>
                            );
                        })}

                        <div className={`lol-catcher ${catcherLane}`}>🛡️</div>
                    </div>

                    <div className="lol-controles">
                        <button
                            className="btn-catcher"
                            onClick={() => setCatcherLane('izquierda')}
                        >
                            ⬅️ Carril izquierdo
                        </button>
                        <button
                            className="btn-catcher"
                            onClick={() => setCatcherLane('derecha')}
                        >
                            Carril derecho ➡️
                        </button>
                    </div>

                    <div className="lol-instrucciones">
                        <p>Movete entre los dos carriles (con las flechas ⬅️➡️ del teclado o los botones) y parate en el que va a caer el hacha antes de que llegue abajo.</p>
                    </div>
                </div>
            )}

            {/* ================= FASE GANADO ================= */}
            {fase === 'ganado' && (
                <div className="gamer-fase-ganado">
                    <div className="carta-pergamino-ganado">
                        <h2>Ganaste!</h2>
                        <div className="billy-recompensa-logo">🗝️</div>
                        <p className="mensaje-victoria">
                            Hiciste un juego impresionante! El monitor brilló intensamente y expulsó...
                            <strong>Una parte de la llave!</strong>.
                        </p>

                        <button className="btn-reclamar-pieza" onClick={alGanar}>
                            Tomar fragmento
                        </button>
                    </div>
                </div>
            )}

            {/* ================= FASE PERDIDO ================= */}
            {fase === 'perdido' && (
                <div className="gamer-fase-perdido">
                    <div className="carta-pergamino-perdido">
                        <h2>Derrota...</h2>
                        <p>No pudiste atrapar las hachas necesarias! no pasa nada, ahi te esperan para que lo vuelvas a intentar.</p>

                        <div className="perdido-botones">
                            <button className="btn-reintentar" onClick={empezarMiniJuego}>
                                Reintentar
                            </button>
                            <button className="btn-volver-mapa" onClick={onVolver}>
                                Volver al mapa
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}