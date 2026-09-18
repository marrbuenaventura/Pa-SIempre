import './Bienvenida.css';
import { useState } from 'react';

const dialogos = [
    "Hola amor!! antes que nada, felices 25 añitos.",
    "bueno, vos sabias que yo estaba preparando algo de este estilo...",
    "espero que no tengas muchas expectativas al respecto, acordate que lo hice yo solita jaja",
    "pero bueno, aca tenes un mini juego creado especialmente para vos",
    "no me inspire de ningun otro lado que no sea mi cabeza, sos la unica persona que va a tener uno igual a este",
    "espero que te guste, amor. Ahora si, empecemos. Te amoo"
];

function Bienvenida({ personajeElla, onEmpezar }) {

    const [indice, setIndice] = useState(0);

    const avanzar = () => {
        const esUltimo = indice === dialogos.length -1;
        if(esUltimo){
            onEmpezar();
        }else{
            setIndice((prev)=> prev +1);
        }
    };

    return (
        <div className="bienvenida">

            <div className='dialogo-contenedor'>
                <img src={personajeElla} alt="yo" className="personaje-dialogo" />

                <div className='globo-dialogo' onClick={avanzar}>
                    <p className='globo-texto'>{dialogos[indice]}</p>
                    <p className='continuar'>
                        {indice === dialogos.length -1 ? 'Empezar':'Click para continaur'}
                    </p>
                </div>
            </div>
        </div>
    );
}


export default Bienvenida;