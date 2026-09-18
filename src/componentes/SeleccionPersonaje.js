import "./SeleccionPersonaje.css";
import { useState } from 'react';

const outfits = [
    { id: 'campera', nombre: 'Campera de cuero', imagen: `${process.env.PUBLIC_URL}/assets/personajes/el-campera.png` },
    { id: 'buzo-verde', nombre: 'Buzo verde', imagen: `${process.env.PUBLIC_URL}/assets/personajes/el-buzo-verde.png` },
    { id: 'buzo-violeta', nombre: 'Buzo violeta', imagen: `${process.env.PUBLIC_URL}/assets/personajes/el-buzo-violeta.png` },
    { id: 'gorro', nombre: 'Con gorro', imagen: `${process.env.PUBLIC_URL}/assets/personajes/el-gorro.png` },
];

function SeleccionPersonaje({ onElegir, onVolver }) {
    const [indiceActual, setIndiceActual] = useState(0);

    const pasarAnterior = () => {
        setIndiceActual((prev) => (prev - 1 + outfits.length) % outfits.length);
    };

    const pasarSiguiente = () => {
        setIndiceActual((prev) => (prev + 1) % outfits.length);
    };

    const outfitActual = outfits[indiceActual];

    return (
        <div className="seleccion-personaje">
            <h2>Elegí tu outfit</h2>

            <div className="carrusel-outfit">
                <button className="pasar-personaje" onClick={pasarAnterior}>
                    &lt;
                </button>

                <button
                    className="opcion-outfit"
                    onClick={() => onElegir(outfitActual.imagen)}
                >
                    <img src={outfitActual.imagen} alt={outfitActual.nombre} />
                    <p>{outfitActual.nombre}</p>
                </button>

                <button className="pasar-personaje" onClick={pasarSiguiente}>
                    &gt;
                </button>
            </div>

            <button className="btn-volver-mapa" onClick={onVolver}>
                ← Volver
            </button>
        </div>
    );
}

export default SeleccionPersonaje;