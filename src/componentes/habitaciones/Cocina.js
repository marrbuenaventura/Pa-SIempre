import React, { useState, useRef, useEffect } from 'react';
import './Cocina.css';

const items = [
    { id: 'monster', nombre: 'Monster MangoLoco', imagen: `${process.env.PUBLIC_URL}/assets/cocina/monster.svg`, color: 'celeste' },
    { id: 'coca', nombre: 'Manaos', imagen: `${process.env.PUBLIC_URL}/assets/cocina/coca.svg`, color: 'rojo' },
    { id: 'fideos', nombre: 'Fideos con salsa', imagen: `${process.env.PUBLIC_URL}/assets/cocina/fideos.svg`, color: 'amarillo' },
    { id: 'milanesa', nombre: 'Milanesa con puré', imagen: `${process.env.PUBLIC_URL}/assets/cocina/milanesa.svg`, color: 'marron' },
    { id: 'chocotorta', nombre: 'Chocotorta', imagen: `${process.env.PUBLIC_URL}/assets/cocina/chocotorta.svg`, color: 'chocolate' },
    { id: 'hamburguesa', nombre: 'Hamburguesa', imagen: `${process.env.PUBLIC_URL}/assets/cocina/hamburguesa.svg`, color: 'marron' }
];

const rondaMax = 6; // Llega a secuencias de 5 ítems para ganar

export default function Cocina({ alGanar, onVolver, personajeEl }) {
    const [fase, setFase] = useState('explorando'); // 'explorando' | 'jugando' | 'ganado' | 'perdido'
    const [hotspotActivo, setHotspotActivo] = useState(null);
    const [mensajeHotspot, setMensajeHotspot] = useState('');

    const [secuencia, setSecuencia] = useState([]);
    const [inputJugador, setInputJugador] = useState([]);
    const [mostrandoSecuencia, setMostrandoSecuencia] = useState(false);
    const [itemIluminado, setItemIluminado] = useState(null);
    const [ronda, setRonda] = useState(0);

    const timeoutsRef = useRef([]);

    // Limpieza al desmontar para evitar fugas de memoria o timings fantasmas
    useEffect(() => {
        return () => limpiarTimeouts();
    }, []);

    const explorarHotspot = (tipo) => {
        const dialogos = {
            olla: "Te acercas a la olla esperando que tenga fideos como usualmente tiene, pero parece que lo que se esta cocinando es polenta! Si no fuera porque tenes una mision, probablemente te quedaria a comer un poco...",
            alacena: "En el mueble hay aproximadamente 8 paquetes de fideos, a quien le gustaran tanto los fideos?",
            heladera: "Revisas la heladera, dos monster mango loco, una botella de casi 3 litros de Manaos y en el fondo... el fragmento de la llave!",
        };
        setMensajeHotspot(dialogos[tipo]);
        setHotspotActivo(tipo);
    };

    const limpiarTimeouts = () => {
        timeoutsRef.current.forEach((t) => clearTimeout(t));
        timeoutsRef.current = [];
    };

    const empezarMiniJuego = () => {
        setFase('jugando');
        setRonda(1);
        const primeraSecuencia = [items[Math.floor(Math.random() * items.length)].id];
        setSecuencia(primeraSecuencia);
        setInputJugador([]);
        reproducirSecuencia(primeraSecuencia);
    };

    const reproducirSecuencia = (seq) => {
        limpiarTimeouts();
        setMostrandoSecuencia(true);
        setInputJugador([]);

        seq.forEach((itemId, i) => {
            const t1 = setTimeout(() => setItemIluminado(itemId), i * 800);
            const t2 = setTimeout(() => setItemIluminado(null), i * 800 + 500);
            timeoutsRef.current.push(t1, t2);
        });

        const tFinal = setTimeout(() => {
            setMostrandoSecuencia(false);
        }, seq.length * 800);
        timeoutsRef.current.push(tFinal);
    };

    const clickearItem = (itemId) => {
        if (mostrandoSecuencia || fase !== 'jugando') return;

        const nuevoInput = [...inputJugador, itemId];
        const posicion = nuevoInput.length - 1;

        // Coincide con la secuencia hasta ahora?
        if (itemId !== secuencia[posicion]) {
            setFase('perdido');
            return;
        }

        setInputJugador(nuevoInput);

        // Completo la ronda actual?
        if (nuevoInput.length === secuencia.length) {
            setMostrandoSecuencia(true);

            if (ronda >= rondaMax) {
                setTimeout(() => setFase('ganado'), 400);
                return;
            }
            // Siguiente ronda: agrega un ítem aleatorio más a la secuencia
            const siguienteItem = items[Math.floor(Math.random() * items.length)].id;
            const nuevaSecuencia = [...secuencia, siguienteItem];
            setTimeout(() => {
                setRonda((prev) => prev + 1);
                setSecuencia(nuevaSecuencia);
                reproducirSecuencia(nuevaSecuencia);
            }, 700);
        }
    };

    return (
        <div className="cocina-wrapper custom-cursor">
            {personajeEl && (
                <img src={personajeEl} alt="mi amorcito" className="personaje-habitacion" />
            )}

            {/* ================= FASE EXPLORANDO ================= */}
            {fase === 'explorando' && (
                <div className="cocina-fase-explorar">
                    <div className="cocina-titulo-zona">
                        <h2>Cocina</h2>
                        <p>Explora la cocina para encontrar el desafio</p>
                    </div>

                    <div className="cocina-escena">
                        <button className="hotspot olla" onClick={() => explorarHotspot('olla')} title="Ver la olla">
                        </button>
                        <button className="hotspot alacena" onClick={() => explorarHotspot('alacena')} title="Abrir alacena">
                        </button>
                        <button className="hotspot heladera pulsando" onClick={() => explorarHotspot('heladera')} title="Abrir heladera">
                        </button>
                    </div>

                    <div className="cocina-dialogo">
                        <p className="dialogo-texto">
                            {mensajeHotspot || "Tocá algún objeto de la cocina para ver qué es..."}
                        </p>
                        {hotspotActivo === 'heladera' && (
                            <button className="btn-empezar-juego" onClick={empezarMiniJuego}>
                                A ver si podes recordar el orden...
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
                <div className="cocina-fase-juego">
                    <div className="cocina-interfaz">
                        <span className="marcador-titulo">RONDA {ronda} / {rondaMax}</span>
                        <span className="marcador-estado">
                            {mostrandoSecuencia ? 'Mirá bien...' : 'Tu turno'}
                        </span>
                    </div>

                    <div className="grid-items">
                        {items.map((item) => (
                            <button
                                key={item.id}
                                className={`item-boton ${item.color} ${itemIluminado === item.id ? 'iluminado' : ''}`}
                                onClick={() => clickearItem(item.id)}
                                disabled={mostrandoSecuencia}
                            >
                                <img src={item.imagen} alt={item.nombre} className="item-imagen" />
                                <span className="item-nombre">{item.nombre}</span>
                            </button>
                        ))}
                    </div>

                    <p className="cocina-instrucciones">
                        Memorizá el orden y repetilo clickeando los mismos alimentos.
                    </p>
                </div>
            )}

            {/* ================= FASE GANADO ================= */}
            {fase === 'ganado' && (
                <div className="cocina-fase-ganado">
                    <div className="carta-pergamino-ganado">
                        <h2>Ganaste!</h2>
                        <div className="billy-recompensa-logo">🗝️</div>
                        <p className="mensaje-victoria">
                            Pudiste recordar el orden de todos los alimentos, reclamas la llave aunque con un poco de hambre...
                        </p>
                        <button className="btn-reclamar-pieza" onClick={() => alGanar('cocina')}>
                            Tomar fragmento
                        </button>
                    </div>
                </div>
            )}

            {/* ================= FASE PERDIDO ================= */}
            {fase === 'perdido' && (
                <div className="cocina-fase-perdido">
                    <div className="carta-pergamino-perdido">
                        <h2>Upss, asi no era!</h2>
                        <p>Te trabaste en la ronda {ronda}. Intenta de nuevo!</p>
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