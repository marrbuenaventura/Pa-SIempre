import React, { useState, useEffect, useRef } from 'react';
import './MesaDnD.css';

const escenasHistoria = [
    {
        titulo: "La Puerta del Templo",
        texto: "Te parás frente a una antigua puerta de roble tallada con la silueta de un cuervo extendiendo sus alas. Está firmemente sellada. Cómo intentás abrirla?",
        opciones: [
            "Intentás forzar el picaporte con fuerza bruta",
            "Buscás un mecanismo secreto en las tallas de madera"
        ],
        resultados: {
            pifia: "¡PIFIA! Intentás pasar, pero tu fuerza rebota, te resbalás con una cáscara de banana virtual y te caés de espaldas. La puerta sigue cerrada y te duele la retaguardia. Tenés que arrastrarte por un conducto de ventilación polvoriento y lleno de telarañas...",
            parcial: "¡ÉXITO PARCIAL! Hacés palanca pero la cerradura no cede. En el esfuerzo te tropezás y caés sobre un mueble podrido. Al romperse el mueble, descubrís una llave vieja de repuesto debajo del polvo. Entrás por pura casualidad!",
            exito: "¡ÉXITO! Golpeás en el punto de tensión exacto! La puerta se abre con un crujido majestuoso y entrás triunfante al templo.",
            critico: "¡ÉXITO CRÍTICO! Hacés una pose heroica, apoyás un solo dedo en la puerta y esta cede con un giro perfecto. Das una vuelta en el aire y caés de pie como un campeón absoluto. La sala vibra ante tu genialidad y aparece gente de la nada solo para aplaudirte!"
        }
    },
    {
        titulo: "El Pasillo del Cuervo",
        texto: "Al cruzar la puerta, entrás a un pasillo largo y oscuro. Un graznido resuena en las paredes y un cuervo enorme empieza a sobrevolarte, activando un mecanismo de trampas (serán flechas o algún hechizo para evitar que pases?). Cómo avanzás?",
        opciones: [
            "Corrés en zigzag cubriéndote la cabeza con los brazos",
            "Intentás seguir el vuelo del cuervo para esquivar las trampas"
        ],
        resultados: {
            pifia: "¡PIFIA! Corrés como loco pero te enredás con tus propios cordones, te caés de cara al suelo y una pluma filosa te pega justo en la frente con un sonido de 'plop'. Tenés que gatear el resto del pasillo arrastrándote con la cara sucia.",
            parcial: "¡ÉXITO PARCIAL! Seguís al cuervo pero te distraés y pisás una placa sin querer que te hace tropezar y rodar. Mientras rodás por el piso como un tronco, esquivás todas las trampas por pura suerte y terminás al otro lado bastante mareado.",
            exito: "¡ÉXITO! Esquivás las trampas con pasos ágiles y elegantes, siguiendo el vuelo del cuervo hasta el final del pasillo sin un rasguño.",
            critico: "¡ÉXITO CRÍTICO! Corrés de frente. Cuando saltan las trampas, las esquivás haciendo piruetas aéreas, das un salto mortal triple hacia adelante y caés posando para una foto. El cuervo aplaude con las alas de fondo!"
        }
    },
    {
        titulo: "La Cámara del Bardo",
        texto: "Llegás al altar principal del templo. Ahí te espera un bardo espectral tocando una melodía hipnótica, custodiando el fragmento sobre un pedestal de piedra rodeado por una barrera mágica de runas. Qué hacés para conseguirlo?",
        opciones: [
            "Intentás seguirle el ritmo cantando o tocando junto a él",
            "Golpeás la barrera mágica con todas tus fuerzas"
        ],
        resultados: {
            pifia: "¡PIFIA! Golpeás la barrera, pero la magia rebota violentamente. Te resbalás con el musgo del suelo, caés de espaldas en un charco de agua fría y el choque eléctrico te deja los pelos de punta. La barrera se apaga por sobrecarga, pero quedás empapado y temblando.",
            parcial: "¡ÉXITO PARCIAL! Desafinás feo en una nota clave, pero el bardo se ríe tan fuerte que se le cae el laúd sobre un cofre viejo que se rompe y revela un extintor de incendios medieval. Apagás la barrera a golpes secos y graciosos.",
            exito: "¡ÉXITO! Acompañás la melodía en el momento justo. La barrera se desvanece suavemente con un destello de luz cian mientras el bardo asiente con respeto.",
            critico: "¡ÉXITO CRÍTICO! Canalizás tu energía de campeón. Con un solo acorde perfecto, la barrera explota en fuegos artificiales de corazones. Das una voltereta en el aire, atrapás el fragmento al vuelo y posás como un dios del rol, mientras el bardo te dedica una canción improvisada."
        }
    }
];

export default function MesaDnD({ alGanar, onVolver, personajeEl }) {
    const [fase, setFase] = useState('explorando'); // 'explorando' | 'jugando' | 'resultado_escena' | 'ganado' | 'perdido'
    const [escenaActual, setEscenaActual] = useState(0);
    const [exitos, setExitos] = useState(0);
    const [tirando, setTirando] = useState(false);
    const [resultadoDado, setResultadoDado] = useState(null); // { numero, rango }
    const [opcionSeleccionada, setOpcionSeleccionada] = useState(null);
    const [mensajeHotspot, setMensajeHotspot] = useState('');
    const [numeroAnimado, setNumeroAnimado] = useState(20);

    const rollIntervalRef = useRef(null);

    // Limpieza de intervalos al desmontar
    useEffect(() => {
        return () => clearInterval(rollIntervalRef.current);
    }, []);

    const empezarMiniJuego = () => {
        setFase('jugando');
        setEscenaActual(0);
        setExitos(0);
        setResultadoDado(null);
        setOpcionSeleccionada(null);
        setMensajeHotspot('');
    };

    // LÓGICA DE LA TIRADA DEL DADO D20
    const lanzarDado = (opcionIndex) => {
        setOpcionSeleccionada(opcionIndex);
        setTirando(true);
        setResultadoDado(null);

        // Animación de números rápidos en el dado
        let contador = 0;
        rollIntervalRef.current = setInterval(() => {
            setNumeroAnimado(Math.floor(Math.random() * 20) + 1);
            contador++;
            if (contador > 15) {
                clearInterval(rollIntervalRef.current);
            }
        }, 70);

        setTimeout(() => {
            const numeroFinal = Math.floor(Math.random() * 20) + 1;
            setNumeroAnimado(numeroFinal);

            // Evaluación del rango según reglas del usuario
            let rango = 'pifia';
            let esExito = false;

            if (numeroFinal >= 1 && numeroFinal <= 5) {
                rango = 'pifia';
                esExito = false;
            } else if (numeroFinal >= 6 && numeroFinal <= 10) {
                rango = 'parcial';
                esExito = false; // El éxito parcial con costo no cuenta como "éxito limpio" para el contador global
            } else if (numeroFinal >= 11 && numeroFinal <= 15) {
                rango = 'exito';
                esExito = true;
            } else {
                rango = 'critico';
                esExito = true;
            }

            setResultadoDado({ numero: numeroFinal, rango, esExito });
            setTirando(false);

            if (esExito) {
                setExitos(prev => prev + 1);
            }

            setFase('resultado_escena');
        }, 1300); // Duración de la animación del giro
    };

    // AVANZAR HISTORIA
    const avanzarEscena = () => {
        const esUltima = escenaActual === escenasHistoria.length - 1;
        if (esUltima) {
            // Necesita al menos 2 éxitos (tiradas >= 11) de 3 para ganar
            if (exitos >= 2) {
                setFase('ganado');
            } else {
                setFase('perdido');
            }
        } else {
            setEscenaActual(prev => prev + 1);
            setResultadoDado(null);
            setOpcionSeleccionada(null);
            setFase('jugando');
        }
    };

    // EXPLORACIÓN DE HOTSPOTS
    const explorarHotspot = (tipo) => {
        const dialogos = {
            hoja: "La hoja de personaje de D&D. Clase: 'Bardo del Amor'. Subclase: 'Romántico incorregible'. +6 en carisma? de quien podra ser.",
            libros: "Un estante lleno de manuales: 'Guía del Dungeon Master', 'Bob, el draconido mas importante de todos los tiempos.'. No tenes ni idea quien es bob, pero seguis buscando.",
            mapa: "El mapa de la campaña. Los jugadores se lo toman súper en serio, estudian cada rincón como si fuera sagrado. Lo que no saben es que Leo, el DM, lo hizo con IA en cinco minutos.",
            dado: "El dado D20 gigante de la suerte. Brillando en su interior, podes ver un fragmento de la llave atrapado. Hace click para intentar liberarlo."
        };
        setMensajeHotspot(dialogos[tipo]);
    };

    return (
        <div className="dnd-room-wrapper custom-cursor">

            {personajeEl && (
                <img src={personajeEl} alt="Mi amorcito" className="personaje-habitacion" />
            )}

            {/* ================= FASE EXPLORANDO ================= */}
            {fase === 'explorando' && (
                <div className="dnd-fase-explorar">

                    <div className="dnd-titulo-zona">
                        <h2>Mesa de D&D</h2>
                        <p>Inspecciona la mesa de juego para empezar la campaña</p>
                    </div>

                    <div className="dnd-escena">
                        {/* Hoja de personaje */}
                        <button className="hotspot-dnd hoja" onClick={() => explorarHotspot('hoja')} title="Mirar hoja de personaje">
                        </button>

                        {/* Libros */}
                        <button className="hotspot-dnd libros" onClick={() => explorarHotspot('libros')} title="Ver manuales">
                        </button>

                        {/* Vela */}
                        <button className="hotspot-dnd vela" onClick={() => explorarHotspot('mapa')} title="Acercarse a la vela">
                        </button>

                        {/* Dado D20 (Comenzar juego) */}
                        <button className="hotspot-dnd dado pulsando" onClick={() => explorarHotspot('dado')} title="Examinar dado">
                        </button>
                    </div>

                    <div className="dnd-dialogo">
                        <p className="dialogo-texto">
                            {mensajeHotspot || "Tocá los objetos sobre la mesa de rol para explorarlos..."}
                        </p>
                        {mensajeHotspot.includes("dado") && (
                            <button className="btn-empezar-dnd" onClick={empezarMiniJuego}>
                                ¡Comenzar Campaña!
                            </button>
                        )}
                    </div>

                    <button className="btn-volver-mapa" onClick={onVolver}>
                        ← Volver al mapa
                    </button>
                </div>
            )}

            {/* ================= FASE JUGANDO (ELEGIR DECISIÓN) ================= */}
            {fase === 'jugando' && (
                <div className="dnd-fase-juego">

                    <div className="dnd-progreso">
                        <span>Escena {escenaActual + 1} de 3</span>
                        <span className="exito-contador">Éxitos limpios: {exitos} / 2 requeridos</span>
                    </div>

                    <div className="dnd-tarjeta-historia">
                        <h3>{escenasHistoria[escenaActual].titulo}</h3>
                        <p className="dnd-texto-narrativa">{escenasHistoria[escenaActual].texto}</p>

                        {opcionSeleccionada === null && (
                            <div className="dnd-opciones">
                                {escenasHistoria[escenaActual].opciones.map((opcion, index) => (
                                    <button
                                        key={index}
                                        className="dnd-btn-opcion"
                                        onClick={() => lanzarDado(index)}
                                    >
                                        {opcion}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* El Dado D20 interactivo */}
                    <div className="dnd-dado-area">
                        <div className={`dnd-d20-container ${tirando ? 'girando' : ''}`}>
                            <svg className="d20-svg" viewBox="0 0 100 100">
                                <polygon points="50,5 90,28 90,72 50,95 10,72 10,28" fill="#1b8a5a" stroke="#d4af37" strokeWidth="3" />
                                <polygon points="50,5 50,38 10,28" fill="none" stroke="#d4af37" strokeWidth="2" />
                                <polygon points="50,5 50,38 90,28" fill="none" stroke="#d4af37" strokeWidth="2" />
                                <polygon points="10,28 50,38 30,72" fill="none" stroke="#d4af37" strokeWidth="2" />
                                <polygon points="90,28 50,38 70,72" fill="none" stroke="#d4af37" strokeWidth="2" />
                                <polygon points="50,38 30,72 70,72" fill="none" stroke="#d4af37" strokeWidth="2" />
                                <polygon points="30,72 50,95 10,72" fill="none" stroke="#d4af37" strokeWidth="2" />
                                <polygon points="70,72 50,95 90,72" fill="none" stroke="#d4af37" strokeWidth="2" />
                                <polygon points="30,72 70,72 50,95" fill="none" stroke="#d4af37" strokeWidth="2" />
                                <text x="50" y="58" fontSize="24" fontWeight="bold" fill="#fffffe" textAnchor="middle" fontFamily="'Press Start 2P', monospace">
                                    {numeroAnimado}
                                </text>
                            </svg>
                        </div>
                        {tirando && <p className="dnd-estado-roll">¡Lanzando D20 de salvación...!</p>}
                    </div>

                </div>
            )}

            {/* ================= FASE RESULTADO ESCENA ================= */}
            {fase === 'resultado_escena' && resultadoDado && (
                <div className="dnd-fase-juego">

                    <div className="dnd-tarjeta-historia">
                        <h3>Resultado de la Acción</h3>

                        {/* Mostrar el número del dado */}
                        <div className="dnd-dado-resultado-ficha">
                            <span className={`dnd-dado-badge ${resultadoDado.rango}`}>
                                Tirada: {resultadoDado.numero}
                            </span>
                            <span className="dnd-rango-desc">
                                {resultadoDado.rango === 'pifia' && "Pifia!"}
                                {resultadoDado.rango === 'parcial' && "bueno, te la dejo pasar (exito costoso)"}
                                {resultadoDado.rango === 'exito' && "Exito"}
                                {resultadoDado.rango === 'critico' && "Exito Critico, una locura"}
                            </span>
                        </div>

                        {/* Narración personalizada */}
                        <p className="dnd-texto-resultado">
                            {escenasHistoria[escenaActual].resultados[resultadoDado.rango]}
                        </p>

                        <button className="dnd-btn-continuar" onClick={avanzarEscena}>
                            {escenaActual === escenasHistoria.length - 1 ? "Ver Destino Final" : "Continuar Aventura"}
                        </button>
                    </div>

                    {/* El dado quieto con el número definitivo */}
                    <div className="dnd-dado-area">
                        <div className="dnd-d20-container quiet">
                            <svg className="d20-svg" viewBox="0 0 100 100">
                                <polygon points="50,5 90,28 90,72 50,95 10,72 10,28" fill="#1b8a5a" stroke="#d4af37" strokeWidth="3" />
                                <polygon points="50,5 50,38 10,28" fill="none" stroke="#d4af37" strokeWidth="2" />
                                <polygon points="50,5 50,38 90,28" fill="none" stroke="#d4af37" strokeWidth="2" />
                                <polygon points="10,28 50,38 30,72" fill="none" stroke="#d4af37" strokeWidth="2" />
                                <polygon points="90,28 50,38 70,72" fill="none" stroke="#d4af37" strokeWidth="2" />
                                <polygon points="50,38 30,72 70,72" fill="none" stroke="#d4af37" strokeWidth="2" />
                                <polygon points="30,72 50,95 10,72" fill="none" stroke="#d4af37" strokeWidth="2" />
                                <polygon points="70,72 50,95 90,72" fill="none" stroke="#d4af37" strokeWidth="2" />
                                <polygon points="30,72 70,72 50,95" fill="none" stroke="#d4af37" strokeWidth="2" />
                                <text x="50" y="58" fontSize="24" fontWeight="bold" fill="#fffffe" textAnchor="middle" fontFamily="'Press Start 2P', monospace">
                                    {resultadoDado.numero}
                                </text>
                            </svg>
                        </div>
                    </div>

                </div>
            )}

            {/* ================= FASE GANADO ================= */}
            {fase === 'ganado' && (
                <div className="dnd-fase-ganado">
                    <div className="dnd-pergamino-resultado victoria">
                        <h2>Campaña Completada!</h2>
                        <div className="billy-recompensa-logo">🗝️</div>
                        <p className="mensaje-victoria">
                            Tu dado de la suerte se abre y dentro de el ves un pedazo de la llave que te falta!
                            Lo tomas con ganas de jugar un rato mas en la campaña...
                        </p>

                        <button className="btn-reclamar-pieza-dnd" onClick={() => alGanar('dnd')}>
                            Tomar fragmento
                        </button>
                    </div>
                </div>
            )}

            {/* ================= FASE PERDIDO ================= */}
            {fase === 'perdido' && (
                <div className="dnd-fase-perdido">
                    <div className="dnd-pergamino-resultado derrota">
                        <h2> pufff casi</h2>
                        <p>La suerte no estuvo de tu lado y el bardo del amor cayó en demasiadas trampas. La barrera sigue intacta.</p>

                        <div className="perdido-botones-dnd">
                            <button className="btn-reintentar-dnd" onClick={empezarMiniJuego}>
                                Reiniciar Campaña
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