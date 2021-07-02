import React from 'react'
import Humans from '../assets/3Humans.png'
import './Inicio.css'
const Inicio = () => {
    return (
        <div className='container mt-3 bg-primary bg-gradient inicio'>
           <img className='imagen' src={Humans} alt="Dibujo de una persona sentada por crear notas" />
           <h1 className='titleInit pt-2 pb-2'>"Crea tus propias notas <br />
                de una manera rápida y sencilla..."
            </h1>
        </div>
    )
}

export default Inicio
