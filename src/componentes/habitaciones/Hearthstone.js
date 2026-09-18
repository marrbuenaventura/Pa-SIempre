import React, { useState, useEffect } from 'react';
import './Hearthstone.css';

// Estructura de cartas reales
const cartasBase = [
    {
        idNombre: 'ragnaros',
        nombre: 'Ragnaros el Señor del Fuego',
        costo: 8,
        ataque: 8,
        vida: 8,
        texto: "No puede atacar. Al final de tu turno, inflige 8 de daño a un enemigo aleatorio.",
        imagen: './assets/hearthstone/ragnaros.jpg'
    },
    {
        idNombre: 'leeroy',
        nombre: 'Leeroy Jenkins',
        costo: 5,
        ataque: 6,
        vida: 2,
        texto: "Carga. Invoca dos Crías de Whelp 1/1 para tu oponente.",
        imagen: './assets/hearthstone/leeroy.jpg'
    },
    {
        idNombre: 'yogg',
        nombre: 'Yogg-Saron, Dios de las Mentes',
        costo: 10,
        ataque: 7,
        vida: 5,
        texto: "Grito de batalla: Lanza un hechizo aleatorio por cada hechizo que jugaste este partido.",
        imagen: './assets/hearthstone/yogg2.jpg'
    },
    {
        idNombre: 'murloc',
        nombre: 'Murloc Tinyfin',
        costo: 0,
        ataque: 1,
        vida: 1,
        texto: "¡El murloc más tierno y juguetón de la taberna!",
        imagen: './assets/hearthstone/murloc.jpg'
    },
    {
        idNombre: 'ysera',
        nombre: 'Ysera',
        costo: 9,
        ataque: 4,
        vida: 12,
        texto: "Al final de tu turno, añade un Sueño de Dragón aleatorio a tu mano.",
        imagen: './assets/hearthstone/ysera.jpg'
    },
    {
        idNombre: 'sylvanas',
        nombre: 'Sylvanas Windrunner',
        costo: 6,
        ataque: 5,
        vida: 5,
        texto: "Grito de muerte: Roba un minion enemigo aleatorio.",
        imagen: './assets/hearthstone/sylvanas.jpg'
    },
    {
        idNombre: 'drboom',
        nombre: 'Dr. Boom',
        costo: 7,
        ataque: 7,
        vida: 7,
        texto: "Grito de batalla: Invoca dos Robo-Bums 1/1 con \"Muere: inflige 2 de daño aleatorio\".",
        imagen: './assets/hearthstone/drboom.jpg'
    },
    {
        idNombre: 'cairne',
        nombre: 'Cairne Bloodhoof',
        costo: 6,
        ataque: 4,
        vida: 5,
        texto: "Grito de muerte: Invoca a Baine Bloodhoof (4/5).",
        imagen: './assets/hearthstone/cairne.jpg'
    },
    {
        idNombre: 'antonidas',
        nombre: 'Archmage Antonidas',
        costo: 7,
        ataque: 5,
        vida: 7,
        texto: "Cada vez que lanzas un hechizo, añades una Bola de Fuego a tu mano.",
        imagen: './assets/hearthstone/antonidas.jpg'
    }
];

function crearMazoMezclado() {
    const cartas = [...cartasBase, ...cartasBase].map((carta, index) => ({
        ...carta,
        id: index, 
        encontrada: false,
    }));

    // Mezclar con el algoritmo Fisher-Yates
    for (let i = cartas.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [cartas[i], cartas[j]] = [cartas[j], cartas[i]];
    }
    return cartas;
}

export default function Hearthstone({ alGanar, onVolver, personajeEl }) {
    const [fase, setFase] = useState('explorando'); // 'explorando' | 'jugando' | 'ganado'
    const [mensajeHotspot, setMensajeHotspot] = useState('');
    const [cartas, setCartas] = useState([]);
    const [seleccionadas, setSeleccionadas] = useState([]); // ids de las 2 cartas volteadas ahora
    const [bloqueado, setBloqueado] = useState(false); // evita clicks mientras se muestra el mismatch

    const empezarMiniJuego = () => {
        setCartas(crearMazoMezclado());
        setSeleccionadas([]);
        setFase('jugando');
        setMensajeHotspot('');
    };

    const voltearCarta = (id) => {
        if (bloqueado) return;
        if (seleccionadas.includes(id)) return;
        if (cartas.find((c) => c.id === id).encontrada) return;
        if (seleccionadas.length === 2) return;

        const nuevasSeleccionadas = [...seleccionadas, id];
        setSeleccionadas(nuevasSeleccionadas);

        if (nuevasSeleccionadas.length === 2) {
            setBloqueado(true);
            const [idA, idB] = nuevasSeleccionadas;
            const cartaA = cartas.find((c) => c.id === idA);
            const cartaB = cartas.find((c) => c.id === idB);

            // El match se evalúa comparando el idNombre en lugar de un emoji crudo
            if (cartaA.idNombre === cartaB.idNombre) {
                setTimeout(() => {
                    setCartas((prev) =>
                        prev.map((c) =>
                            c.id === idA || c.id === idB ? { ...c, encontrada: true } : c
                        )
                    );
                    setSeleccionadas([]);
                    setBloqueado(false);
                }, 500);
            } else {
                setTimeout(() => {
                    setSeleccionadas([]);
                    setBloqueado(false);
                }, 1100); // Un poco más de tiempo para apreciar las cartas en pantalla
            }
        }
    };

    // Chequear victoria: todas las cartas encontradas
    useEffect(() => {
        if (cartas.length > 0 && cartas.every((c) => c.encontrada)) {
            setTimeout(() => setFase('ganado'), 800);
        }
    }, [cartas]);

    // Explorar Hotspots
    const explorarHotspot = (tipo) => {
        const dialogos = {
            mazo: "Un mazo de Hearthstone. Te sentis familiarizado con el juego aunque te parece raro que no este adentro de una pantalla",
            mate: "Un mate caliente con un poco de cafe y azucar...",
            carta: "Vez que una carta magica brilla con un fragmento dorado en el interior, hace click para intentar liberarlo!"
        };
        setMensajeHotspot(dialogos[tipo]);
    };

    return (
        <div className="hs-room-wrapper custom-cursor">

            {personajeEl && (
                <img src={personajeEl} alt="Mi amorcito" className="personaje-habitacion" />
            )}

            {/* ================= FASE EXPLORANDO ================= */}
            {fase === 'explorando' && (
                <div className="hs-fase-explorar">
                    <div className="hs-titulo-zona">
                        <h2>Rincón Hearthstone</h2>
                        <p>Explorá los elementos del escritorio para encontrar la carta misteriosa</p>
                    </div>

                    <div className="hs-escena">
                        {/* Mazo de cartas */}
                        <button className="hotspot-hs mazo" onClick={() => explorarHotspot('mazo')} title="Mirar mazo">
                        </button>

                        {/* Mate */}
                        <button className="hotspot-hs mate" onClick={() => explorarHotspot('mate')} title="Tomar un mate">
                        </button>

                        {/* Carta especial brillante (Comenzar minijuego) */}
                        <button className="hotspot-hs carta pulsando" onClick={() => explorarHotspot('carta')} title="Examinar carta especial">
                        </button>
                    </div>

                    <div className="hs-dialogo">
                        <p className="dialogo-texto">
                            {mensajeHotspot || "Tocá algún objeto del escritorio de Hearthstone para inspeccionarlo..."}
                        </p>
                        {mensajeHotspot.includes("carta") && (
                            <button className="btn-empezar-hs" onClick={empezarMiniJuego}>
                                Vamos a jugar a una prueba de memoria!
                            </button>
                        )}
                    </div>

                    <button className="btn-volver-mapa" onClick={onVolver}>
                        ← Volver al mapa
                    </button>
                </div>
            )}

            {/* ================= FASE JUGANDO (MEMOTEST) ================= */}
            {fase === 'jugando' && (
                <div className="hs-fase-juego">
                    <div className="hs-marcador">
                        <span className="hs-marcador-titulo">PRUEBA DE MEMORIA</span>
                        <span className="hs-marcador-desc">Encontra las parejas para poder llevarte el pedazo de la llave</span>
                    </div>

                    <div className="hearthstone-tablero">
                        {cartas.map((carta) => {
                            const visible = seleccionadas.includes(carta.id) || carta.encontrada;
                            return (
                                <button
                                    key={carta.id}
                                    className={`carta-memoria ${visible ? 'volteada' : ''} ${carta.encontrada ? 'encontrada' : ''}`}
                                    onClick={() => voltearCarta(carta.id)}
                                    disabled={bloqueado || carta.encontrada}
                                >
                                    <div className="carta-interior">
                                        {/* Reverso de la carta (boca abajo) */}
                                        <div className="carta-reverso">
                                            <div className="reverso-diseño">
                                                <span className="reverso-simbolo">🌀</span>
                                            </div>
                                        </div>

                                        {/* Frente de la carta (Carta real de Hearthstone maquetada con CSS) */}
                                        <div className="carta-frente hs-carta-maqueta">

                                            {/* Burbuja de Maná (Costo) */}
                                            <div className="hs-mana-bubble">{carta.costo}</div>

                                            {/* Ilustración de la carta (Emoji central como fallback) */}
                                            <div className="hs-carta-ilustracion">
                                                
                                                <div
                                                    className="hs-ilustracion-img"
                                                    style={{ backgroundImage: `url(${carta.imagen})` }}
                                                />
                                            </div>

                                            {/* Cinta con el Nombre */}
                                            <div className="hs-carta-nombre-cinta">
                                                <span>{carta.nombre}</span>
                                            </div>

                                            {/* Cuadro de texto de la habilidad */}
                                            <div className="hs-carta-descripcion">
                                                <p>{carta.texto}</p>
                                            </div>

                                            {/* Burbuja de Ataque (Amarilla) */}
                                            <div className="hs-stat-bubble ataque">{carta.ataque}</div>

                                            {/* Burbuja de Vida (Roja) */}
                                            <div className="hs-stat-bubble vida">{carta.vida}</div>

                                            {/* Bordes Dorados de Leyenda */}
                                            <div className="frente-marco-legendario"></div>
                                        </div>

                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    <div className="hs-instrucciones">
                        <p>Vas a tener que memorizar las cartas que aparezcan para poder unir las iguales, es un memotest </p>
                        <p>(busque cartas existentes pero si alguna no concuerda no me lo tengas en cuenta jajaj) </p>
                    </div>
                </div>
            )}

            {/* ================= FASE GANADO ================= */}
            {fase === 'ganado' && (
                <div className="hs-fase-ganado">
                    <div className="hs-pergamino-resultado victoria">
                        <h2>Ganastee!</h2>
                        <div className="billy-recompensa-logo">🗝️</div>
                        <p className="mensaje-victoria">
                            Pudiste emparejar todas las cartas iguales! 
                            la carta magica que contenia el fragmento de la llave se desvanece y este aparece sobre el escritorio, 
                            tomalo y segui a la sigueinte prueba...
                        </p>

                        <button className="btn-reclamar-pieza-hs" onClick={() => alGanar('hearthstone')}>
                            Tomar fragmento
                        </button>
                    </div>
                </div>
            )}

        </div>
    );
}