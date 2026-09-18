import { useState } from 'react';
import './Final.css';

const creditos = [
    { rol: 'Un juego creado por', nombre: 'Mar <3' },
    { rol: 'Para', nombre: 'Vos' },
    { rol: 'Por', nombre: 'Tu cumplañitos' },
    { rol: 'Espero que te guste', nombre: 'con todo mi amor' },
    { rol: '', nombre: 'Para Siempre' },
];

function Final({ onFinalizar }) {
    const [fase, setFase] = useState('video'); // 'video' | 'mensaje' | 'creditos' | 'desvaneciendo'

    const terminoElVideo = () => setFase('mensaje');

    const irACreditos = () => setFase('creditos');

    const continuar = () => {
        setFase('desvaneciendo');
        setTimeout(() => {
            onFinalizar();
        }, 1500);
    };

    return (
        <div className={`final-wrapper ${fase === 'desvaneciendo' ? 'desvanecer' : ''}`}>
            {(fase === 'video' || fase === 'mensaje') && (
                <video
                src={`${process.env.PUBLIC_URL}/assets/final.mp4`}
                    autoPlay
                    onEnded={terminoElVideo}
                    className="final-video"
                />
            )}

            {fase === 'mensaje' && (
                <div className="final-mensaje-overlay" onClick={irACreditos}>
                    <p className="final-mensaje-texto">
                        Feliz cumpleaños, mi amor. Gracias por ser vos.
                    </p>
                    <p className="final-click">click para continuar...</p>
                </div>
            )}

            {fase === 'creditos' && (
                <div className="final-creditos-overlay" onClick={continuar}>
                    <div className="final-creditos-lista">
                        {creditos.map((credito, i) => (
                            <div key={i} className="credito-linea" style={{ animationDelay: `${i * 0.6}s` }}>
                                {credito.rol && <p className="credito-rol">{credito.rol}</p>}
                                <p className="credito-nombre">{credito.nombre}</p>
                            </div>
                        ))}
                    </div>
                    <p className="final-click">click para volver al menú...</p>
                </div>
            )}
        </div>
    );
}

export default Final;