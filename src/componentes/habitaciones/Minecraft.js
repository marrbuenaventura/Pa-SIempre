import React, { useState, useRef, useEffect } from 'react';
import './Minecraft.css';

const totalOleadas = 4;
const vidasIniciales = 3;
const mobsMax = 12; // Total de mobs que aparecerán en la partida

// Mobs con sus respectivos emojis y nombres
const mobTypes = [
    { tipo: 'zombie', emoji: '🧟' },
    { tipo: 'creeper', emoji: '💥' },
    { tipo: 'spider', emoji: '🕷️' },
    { tipo: 'skeleton', emoji: '💀' }
];

export default function Minecraft({ alGanar, onVolver, personajeEl }) {
    const [fase, setFase] = useState('explorando'); // 'explorando' | 'jugando' | 'ganado' | 'perdido'
    const [hotspotActivo, setHotspotActivo] = useState(null);
    const [mensajeHotspot, setMensajeHotspot] = useState('');

    const [mobs, setMobs] = useState([]); // [{ id, borde, progreso, offset, emoji, active }]
    const [vidas, setVidas] = useState(vidasIniciales);
    const [oleada, setOleada] = useState(1);
    const [mobsEliminados, setMobsEliminados] = useState(0);
    const [mobsProcesados, setMobsProcesados] = useState(0); // en vez de (o sumado a) mobsEliminados

    const gameLoopRef = useRef(null);
    const spawnIntervalRef = useRef(null);

    // Limpieza al desmontar el componente
    useEffect(() => {
        return () => {
            clearInterval(spawnIntervalRef.current);
            cancelAnimationFrame(gameLoopRef.current);
        };
    }, []);

    const explorarHotspot = (tipo) => {
        const dialogos = {
            cofre: "Un cofre de madera de Minecraft. Abrís la tapa y ves carbón, adoquines... y cartas de amor apiladas cuidadosamente. Tus posesiones más preciadas.",
            crafteo: "La mítica mesa de crafteo. Todos sabemos que fue lo primero que hiciste cuando tuviste 3 diamantes y 2 palos...",
            billy: "Ahí está Billy, la legendaria hacha de diamante clavada en un tronco de madera de roble. Se escuchan ruidos extraños de monstruos acercandose! Tenes que defenderla.",
        };
        setMensajeHotspot(dialogos[tipo]);
        setHotspotActivo(tipo);
    };

    const empezarMiniJuego = () => {
        setFase('jugando');
        setVidas(vidasIniciales);
        setOleada(1);
        setMobsEliminados(0);
        setMobs([]);
        setMensajeHotspot('');
        iniciarSpawn();
        iniciarGameLoop();
    };

    // Spawneo de Mobs en bordes aleatorios con trayectorias desviadas
    const iniciarSpawn = () => {
        let spawnCount = 0;
        const spawnMob = () => {
            if (spawnCount >= mobsMax) {
                clearInterval(spawnIntervalRef.current);
                return;
            }

            const bordes = ['arriba', 'abajo', 'izquierda', 'derecha'];
            const borde = bordes[Math.floor(Math.random() * bordes.length)];
            const mobRandom = mobTypes[Math.floor(Math.random() * mobTypes.length)];

            const nuevoMob = {
                id: Date.now() + Math.random(),
                borde,
                emoji: mobRandom.emoji,
                tipo: mobRandom.tipo,
                progreso: 0, // 0% al borde de la pantalla, 100% en el centro
                offset: (Math.random() * 26) - 13, // Desviación para que no vayan todos en fila india recta (-13% a +13%)
                active: true,
            };

            setMobs((prev) => [...prev, nuevoMob]);
            spawnCount++;
        };

        // Lanzar el primero
        spawnMob();
        // Spawneo continuo cada 1.8 segundos
        spawnIntervalRef.current = setInterval(spawnMob, 1800);
    };

    // Game Loop para mover a los mobs hacia el centro
    const iniciarGameLoop = () => {
        const tick = () => {
            setMobs((prev) => {
                let flagGameOver = false;
    
                const actualizados = prev.map((mob) => {
                    if (!mob.active) return mob;
    
                    const velocidad = 0.5 + (oleada * 0.15);
                    const nuevoProgreso = mob.progreso + velocidad;
    
                    if (nuevoProgreso >= 100) {
                        mob.active = false;
    
                        setVidas((v) => {
                            const nuevasVidas = v - 1;
                            if (nuevasVidas <= 0) {
                                flagGameOver = true;
                            }
                            return nuevasVidas;
                        });
    
                        setMobsProcesados((prevProcesados) => {
                            const nuevo = prevProcesados + 1;
                            if (nuevo >= mobsMax && !flagGameOver) {
                                setTimeout(() => {
                                    clearInterval(spawnIntervalRef.current);
                                    cancelAnimationFrame(gameLoopRef.current);
                                    setVidas((v2) => {
                                        setFase(v2 > 0 ? 'ganado' : 'perdido');
                                        return v2;
                                    });
                                }, 300);
                            }
                            return nuevo;
                        });
    
                        return { ...mob, progreso: nuevoProgreso, active: false };
                    }
    
                    return { ...mob, progreso: nuevoProgreso };
                });
    
                if (flagGameOver) {
                    setTimeout(() => {
                        clearInterval(spawnIntervalRef.current);
                        cancelAnimationFrame(gameLoopRef.current);
                        setFase('perdido');
                    }, 100);
                }
    
                return actualizados;
            });
    
            gameLoopRef.current = requestAnimationFrame(tick);
        };
    
        gameLoopRef.current = requestAnimationFrame(tick);
    };

const clickearMob = (mobId) => {
    setMobs((prev) => prev.map((m) => (m.id === mobId ? { ...m, active: false } : m)));
    setMobsEliminados((prev) => prev + 1); // solo para mostrar en el marcador, ya no decide el final

    setMobsProcesados((prev) => {
        const nuevo = prev + 1;
        const nuevaOleada = Math.min(totalOleadas, Math.floor(nuevo / 3) + 1);
        setOleada(nuevaOleada);

        if (nuevo >= mobsMax) {
            setTimeout(() => {
                clearInterval(spawnIntervalRef.current);
                cancelAnimationFrame(gameLoopRef.current);
                setVidas((v) => {
                    setFase(v > 0 ? 'ganado' : 'perdido');
                    return v;
                });
            }, 400);
        }
        return nuevo;
    });
};

// Convertir borde + progreso + offset a coordenadas X e Y relativas en la pantalla
const getMobStyle = (mob) => {
    let top = '50%';
    let left = '50%';

    // El centro está en top:50%, left:50%
    if (mob.borde === 'arriba') {
        top = `${mob.progreso / 2}%`; // De 0% a 50%
        left = `${50 + mob.offset}%`;
    } else if (mob.borde === 'abajo') {
        top = `${100 - mob.progreso / 2}%`; // De 100% a 50%
        left = `${50 + mob.offset}%`;
    } else if (mob.borde === 'izquierda') {
        left = `${mob.progreso / 2}%`; // De 0% a 50%
        top = `${50 + mob.offset}%`;
    } else if (mob.borde === 'derecha') {
        left = `${100 - mob.progreso / 2}%`; // De 100% a 50%
        top = `${50 + mob.offset}%`;
    }

    return {
        top,
        left,
        transform: 'translate(-50%, -50%)',
    };
};

return (
    <div className="mc-wrapper custom-cursor">
        {personajeEl && (
            <img src={personajeEl} alt="Tu novio" className="personaje-habitacion" />
        )}

        {/* ================= FASE EXPLORANDO ================= */}
        {fase === 'explorando' && (
            <div className="mc-fase-explorar">
                <div className="mc-titulo-zona">
                    <h2>Campo de Minecraft</h2>
                    <p>Inspecciona el campamento de noche</p>
                </div>

                <div className="mc-escena">
                    {/* Cofre */}
                    <button className="hotspot cofre" onClick={() => explorarHotspot('cofre')} title="Abrir cofre">
                        
                    </button>
                    {/* Mesa de Crafteo */}
                    <button className="hotspot crafteo" onClick={() => explorarHotspot('crafteo')} title="Ver mesa de crafteo">
                        
                    </button>
                    {/* Billy clavada en el tronco */}
                    <button className="hotspot billy pulsando" onClick={() => explorarHotspot('billy')} title="Revisar hacha">
                        
                    </button>
                </div>

                <div className="mc-dialogo">
                    <p className="dialogo-texto">
                        {mensajeHotspot || "Tocá algún elemento en el claro del bosque para inspeccionar..."}
                    </p>
                    {hotspotActivo === 'billy' && (
                        <button className="btn-empezar-juego" onClick={empezarMiniJuego}>
                            Defende a tu hacha!
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
            <div className="mc-fase-juego">
                <div className="mc-interfaz">
                    <span className="marcador-titulo-mc">OLEADA {oleada} / {totalOleadas}</span>
                    <div className="mc-corazones">
                        {[...Array(vidasIniciales)].map((_, i) => (
                            <span key={i} className={`corazon-vida ${i >= vidas ? 'vacio' : ''}`}>
                                ❤️
                            </span>
                        ))}
                    </div>
                    <span className="marcador-restantes-mc">Mobs eliminados: {mobsEliminados} / {mobsMax}</span>
                </div>

                {/* El campo de batalla estilo plano 2D de Minecraft */}
                <div className="mc-campo-batalla">

                    {/* Billy en el centro */}
                    <div className="mc-billy-centro">
                        <span className="mc-billy-sprite">🪓</span>
                        <div className="mc-plataforma-madera"></div>
                    </div>

                    {/* Mobs moviéndose */}
                    {mobs.map((mob) => {
                        if (!mob.active) return null;
                        return (
                            <button
                                key={mob.id}
                                className={`mc-mob ${mob.tipo}`}
                                style={getMobStyle(mob)}
                                onClick={() => clickearMob(mob.id)}
                            >
                                <span className="mob-sprite">{mob.emoji}</span>
                                <div className="mob-barra-vida"></div>
                            </button>
                        );
                    })}
                </div>

                <div className="mc-instrucciones">
                    <p>Hace click en los monstruos para eliminarlos antes de que lleguen a la plataforma en el centro!</p>
                </div>
            </div>
        )}

        {/* ================= FASE GANADO ================= */}
        {fase === 'ganado' && (
            <div className="mc-fase-ganado">
                <div className="carta-pergamino-ganado">
                    <h2>Defendiste la base!</h2>
                    <div className="billy-recompensa-logo">🗝️</div>
                    <p className="mensaje-victoria">
                        Pudiste sobrevivir a las oleadas de mounstros con exito, el fragmento de la llave es tuyo.
                    </p>
                    <button className="btn-reclamar-pieza" onClick={() => alGanar('minecraft')}>
                        Tomar fragmento
                    </button>
                </div>
            </div>
        )}

        {/* ================= FASE PERDIDO ================= */}
        {fase === 'perdido' && (
            <div className="mc-fase-perdido">
                <div className="carta-pergamino-perdido">
                    <h2>Derrotado en combate</h2>
                    <p>Los mounstros alcanzaron la base, ya nada sera como antes. Te quedaste sin vidas.</p>
                    <div className="perdido-botones">
                        <button className="btn-reintentar" onClick={empezarMiniJuego}>
                            Reintentar Defensa
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