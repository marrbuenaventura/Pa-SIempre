// src/components/PantallaTitulo.jsx
import "./PantallaTitulo.css";

function PantallaTitulo({ personajeElegido, onElegirPersonaje, onContinuar }) {
    return (
        <div className="pantalla-titulo">
            <p className="aviso-inicio">HACE CLICK EN EL TE AMO PARA COMENZAR :)</p>

            <div className="estrella e1"></div>
            <div className="estrella e2"></div>
            <div className="estrella e3"></div>
            <div className="estrella e4"></div>

            <h1 className="titulo-para-siempre">PARA<br />SIEMPRE</h1>

            <button className="avatar-elegir" onClick={onElegirPersonaje}>
                {personajeElegido
                    ? <img src={personajeElegido} alt="Tu personaje" />
                    : <span className="avatar-silueta">?</span>
                }
                <p className="texto-elegir">
                    {personajeElegido ? 'Cambiar personaje' : 'ANTES DE EMPEZAR, ELEGI TU PERSONAJE!'}
                </p>
            </button>

            <button className="btn-te-amo" onClick={onContinuar}>TE AMO &lt;3</button>

            <p className="firma-autor">BY: MAR</p>
        </div>
    );
}

export default PantallaTitulo;