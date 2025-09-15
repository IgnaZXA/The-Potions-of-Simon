import { useRef, useState, useEffect } from 'react';
import useSound from 'use-sound';
import simon from './assets/sounds/sprite.mp3';
import './App.css';

export default function App() {



  const blueRef = useRef(null);
  const yellowRef = useRef(null);
  const redRef = useRef(null);
  const greenRef = useRef(null);

  const [play] = useSound(simon, {
    sprite: {
      one: [0, 500],
      two: [1000, 500],
      three: [2000, 500],
      four: [3000, 500],
      error: [4000, 1000]
    }
  });

  const colors = [
    {
      color: '#FAF303',
      ref: yellowRef,
      sound: 'one'
    },
    {
      color: '#300AFA',
      ref: blueRef,
      sound: 'two'
    },
    {
      color: '#FA0E03',
      ref: redRef,
      sound: 'three'
    },
    {
      color: '#0AFA03',
      ref: greenRef,
      sound: 'four'
    },
  ];


  const minNumber = 0;
  const maxNumber = 3;
  const speedGame = 400;


  const [sequence, setSequence] = useState([]);                   //  sequence        almacenará la secuencia que va generando el juego.
  const [currentGame, setCurrentGame] = useState([]);             //  currentGame     la secuencia que va ejecutando el jugador.
  const [isAllowedToPlay, setIsAllowedToPlay] = useState(false);  //  isAllowedToPlay un booleano para permitir pulsar tecla o no.
  const [speed, setSpeed] = useState(speedGame);                  //  speed           almacenará los cambios de velocidad del juego, ahora se gestiona de forma progresiva.
  const [turn, setTurn] = useState(0);                            //  turn            almacenará el número de turno que se está ejecutando.
  const [pulses, setPulses] = useState(0);                        //  pulses          almacenará el número de pulsaciones.
  const [success, setSuccess] = useState(0);                      //  success         almacenará el número de aciertos.
  const [isGameOn, setIsGameOn] = useState(false);                //  isGameOn        si el juego debe iniciarse.

  function initGame() {
    return null;
  }

  return (
    <>
      {
        isGameOn ?

          <>
            <div className='header'>
              <h1>Turn {turn}</h1>
            </div>

            <div className='container'>
              {/* Genera los botones  y se les incorpora el event Handler onClick*/}
              {colors.map((item, index) => {
                return (
                  <div
                    key={index}
                    ref={item.ref}
                    className={`pad pad-${index}`}
                    style={{ backgroundColor: `${item.color}`, opacity: .6 }}
                    onClick={() => handleClick(index)}
                  ></div>
                );
              })}
            </div>
          </>

          :

          <>
            <div className='header' style={SUPER_SIMON_TITLE_STYLES}>
              <h1>SUPER SIMON</h1>
            </div>
            <button onClick={initGame}>START GAME</button>
          </>

      }
    </>
  );


}



const SUPER_SIMON_TITLE_STYLES = {
  backgroundColor: 'rgb(111,11,1)'
};