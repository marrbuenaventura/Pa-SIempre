import { useState } from 'react';
import './PantallaCarga.css';

function PantallaCarga({ onFinalizar }) {
    const [desvaneciendo, setDesvaneciendo] = useState(false);

    const terminoElVideo = () => {
        setDesvaneciendo(true);
        setTimeout(() => {
            onFinalizar();
        }, 1000); // tiene que coincidir con la duración del fade en el CSS
    };

    return (
        <div className={`pantalla-carga ${desvaneciendo ? 'desvanecer' : ''}`}>
            <video
                src={`${process.env.PUBLIC_URL}/assets/intro.mp4`}
                autoPlay
                onEnded={terminoElVideo}
                className="video-intro"
            />
        </div>
    );
}

export default PantallaCarga;