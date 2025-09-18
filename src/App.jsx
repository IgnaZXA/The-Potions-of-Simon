import { useState, useEffect, useRef } from 'react';
import useSound from 'use-sound';
import yp from '/src/assets/images/Potions/Yellow_Potion.webp';
import bp from '/src/assets/images/Potions/Blue_Potion.webp';
import rp from '/src/assets/images/Potions/Red_Potion.webp';
import gp from '/src/assets/images/Potions/Green_Potion.webp';
import st2 from '/src/assets/images/Crazy_Simon_Table.jpg';
import ti1 from '/src/assets/images/Title_Image.jpg';
import go from '/src/assets/images/Game_Over.jpg';

import simon from './assets/sounds/sprite.mp3';

import './App.css';

function App() {

  const blueRef = useRef(null);
  const yellowRef = useRef(null);
  const greenRef = useRef(null);
  const redRef = useRef(null);

  const [play] = useSound(simon, {
    sprite: {
      one: [0, 500],
      two: [1000, 500],
      three: [2000, 500],
      four: [3000, 500],
      error: [4000, 1000]
    }
  })

  const colors =
    [
      {
        color: '#FAF303',
        ref: yellowRef,
        sound: 'one',
        imageDir: yp,
        position: { top: 55, left: 25 }
      },
      {
        color: '#300AFA',
        ref: blueRef,
        sound: 'two',
        imageDir: bp,
        position: { top: 70, left: 40 }

      },
      {
        color: '#FA0E03',
        ref: redRef,
        sound: 'three',
        imageDir: rp,
        position: { top: 65, left: 10 }

      },
      {
        color: '#0AFA03',
        ref: greenRef,
        sound: 'four',
        imageDir: gp,
        position: { top: 72, left: 70 }

      },
    ];

  const minNumber = 0;
  const maxNumber = 3;
  const speedGame = 600;


  const [sequence, setSequence] = useState([]);
  const [bestTry, setBestTry] = useState([]);
  const [currentGame, setCurrentGame] = useState([]);
  const [isAllowedToPlay, setIsAllowedToPlay] = useState(false);
  const [speed, setSpeed] = useState(speedGame);
  const [turn, setTurn] = useState(0);
  const [pulses, setPulses] = useState(0);
  const [success, setSuccess] = useState(0);
  const [isGameOn, setIsGameOn] = useState(false);
  const [isGameLost, setIsGameLost] = useState(false); // Nuevo state que cuando se detecte un fallo se pondrá a true para mostrar una ventana de Game Over durante 5 segundos ()


  const initGame = () => {
    randomNumber();
    setIsGameOn(true);
  }

  const randomNumber = () => {
    setIsAllowedToPlay(false);
    const randomNumber = Math.floor(Math.random() * (maxNumber - minNumber + 1) + minNumber);
    setSequence([...sequence, randomNumber]);
    const newSequence = [...sequence, randomNumber];
    setTurn(turn + 1);
  }


  const handleClick = (index) => {

    if (isAllowedToPlay) {
      play({ id: colors[index].sound });
      colors[index].ref.current.style.filter = 'brightness(1)';
      // colors[index].ref.current.style.opacity = (1);
      // colors[index].ref.current.style.scale = (0.9);
      scalePotion(colors[index].ref, 0.9);

      setTimeout(() => {
        // colors[index].ref.current.style.opacity = (0.75);
        colors[index].ref.current.style.filter = 'brightness(1.75)';
        colors[index].ref.current.style.scale = (1);
        setCurrentGame([...currentGame, index]);
        setPulses(pulses + 1);
      }, speed / 2);
    }
  }

  useEffect(() => {
    if (!isGameOn) {
      setSequence([]);
      setCurrentGame([]);
      setIsAllowedToPlay(false);
      setSpeed(speedGame);
      setSuccess(0);
      setPulses(0);
      setTurn(0);
    }
  }, [isGameOn]);

  // useEffect sin segundo parámetro se ejecuta en cuanto se cargue el componente.
  useEffect(() => {
    if (pulses > 0) {
      if (Number(sequence[pulses - 1]) === Number(currentGame[pulses - 1])) { // Si el número
        setSuccess(success + 1);
      } else {
        const index = sequence[pulses - 1];
        colors[index].ref.current.style.filter = 'brightness(1)';
        play({ id: 'error' });
        setTimeout(() => {
          colors[index].ref.current.style.filter = 'brightness(1.75)';
          setIsGameLost(true);
        }, speed * 2);
        setIsAllowedToPlay(false);
      }
    }
  }, [pulses]);



  // Cuando se detecte que se ha perdido la partida aparecerá un
  useEffect(() => {
    if (isGameLost) {
      setTimeout(() => {
        setIsGameOn(false);
        setIsGameLost(false);
      }, 5000);
    }
  }, [isGameLost]);


  useEffect(() => {
    if (success === sequence.length && success > 0) {
      setSpeed(speed - sequence.length * 2);
      setTimeout(() => {
        setSuccess(0);
        setPulses(0);
        setCurrentGame([]);
        randomNumber();
      }, 500);
    }
  }, [success]);


  // EXPLICACIÓN :  Cuando NO ESTÉ PERMITIDO JUGAR
  useEffect(() => {
    if (!isAllowedToPlay) {
      sequence.map((item, index) => {
        setTimeout(() => {
          play({ id: colors[item].sound });
          colors[item].ref.current.style.filter = 'brightness(1)';
          setTimeout(() => {
            colors[item].ref.current.style.filter = 'brightness(1.75)';
          }, speed / 2);
        }, (speed * index) + 50);
      });
    }
    setIsAllowedToPlay(true);
  }, [sequence]);


  if (!isGameLost) {
    if (isGameOn) {
      return (
        <div style={{
          backgroundImage: `url(${st2})`,
          width: '100vw',
          height: '100vh',
          // backgroundRepeat: 'no-repeat',
          backgroundSize: '100% 100%',
          position: 'absolute'
        }}>
          <div className='header'>
            <h1>Turn {turn}</h1>
          </div>

          <div className='container'>
            {colors.map((item, index) => {
              return (
                <div
                  key={index}
                  ref={item.ref}
                  className={`pad pad-${index}`}
                  style={{
                    backgroundImage: `url(${item.imageDir})`,
                    backgroundSize: '100% 100%',
                    position: 'absolute',
                    width: '7vw',
                    height: '25vh',
                    top: `${item.position.top}vh`,
                    left: `${item.position.left}vw`,
                    filter: 'brightness(1.75)',
                  }}
                  onClick={() => handleClick(index)}
                >
                </div>
              );
            })}
          </div>
        </div>
      );
    } else {
      return (
        <div style={{
          backgroundImage: `url(${ti1})`,
          backgroundSize: '100vw 100vh',
          // backgroundRepeat: 'no-repeat',
          height: '100vh',
          width: '100vw',
          position: 'absolute'
        }}>

          <div style={{
            position: 'absolute',
            width: '100vw',
            height: '100vh',
            color: 'rgba(0, 0, 0, 1)'
          }}></div>

          <div className='header' style={{
            placeContent: 'center',
            position: 'absolute',
            textAlign: 'center',
            left: '50vw',
            transform: 'translate(-50%)',

          }}>
            <h1 style={{
              margin: '1vw',
              fontSize: '3vw',
              color: '#333',
            }}>
              <span className='titleWord'>THE </span>
              <span className='titleWord'>POTIONS </span>
              <span className='titleWord'>OF </span>
              <span className='titleWord'>MADNESS</span>
            </h1>

            <div className='descContainer'>
              <p className='descText'> Will the acolytes be able to survive Simon's <strong style={{ color: 'rgba(255, 0, 0, 1)' }}><i>madness</i></strong>? </p>
            </div>
          </div>

          <button onClick={initGame} style={addStyles([BUTTON_START_STYLES])}>ENTER TO SUFFER</button>

        </div>
      );
    }
  } else {
    return (
      <div style={{
        backgroundImage: `url(${go})`,
        backgroundSize: '100vw 100vh',
        backgroundRepeat: 'no-repeat',
        height: '100vh',
        width: '100vw',
        position: 'absolute'
      }}>
        <div className='gameOverText' style={{
          color: 'rgba(255, 255, 255, 1)',
          fontFamily: 'Kaotika',
          fontSize: '7vw',
          textAlign: 'center',
          position: 'absolute',
          top: '50vh',
          left: '50vw',
          transform: 'translate(-50%, -50%)',
          border: '.2vh solid rgb(132, 134, 13)',
          backgroundColor: 'rgba(0, 0, 0, .6)'
        }}>THERE IS NO ESCAPE</div>
      </div>
    );
  }

}

export default App;

const BUTTON_START_STYLES = {
  position: 'relative',
  top: '75vh',
  width: '15vw',
  height: '10vh',
  backgroundColor: 'rgba(0, 0, 0, 0.6)',
  border: '1px solid rgba(132, 134, 13, 1)',
  fontFamily: 'Kaotika',
  fontSize: '1.5vw',
  color: 'rgba(255, 255, 255, 1)',
  boxShadow: ' .1vh .1vh .5vh .5vh rgba(132, 134, 13, 1)',
  borderRadius: '.2vh'
};

const BUTTON_TRY_STYLES = {
  position: 'absolute',
  top: '85vh',
  left: '10vw',
  width: '10vw',
  height: '10vh',
  backgroundColor: 'rgba(0, 0, 0, 0.6)',
  border: '1px solid rgba(132, 134, 13, 1)',
  fontFamily: 'Kaotika',
  fontSize: '1.5vw',
  color: 'rgba(255, 255, 255, 1)',
  boxShadow: ' 1px 1px 5px 5px rgba(132, 134, 13, 1)',
  borderRadius: '2px'
};


function addStyles(styles) {
  let allStyles = {}
  styles.map((style) => {
    allStyles = { allStyles, ...style };
  });

  return allStyles;
}



function scalePotion(refObj, scaleTo) {
  let id = null;
  clearInterval(id);
  refObj.current.style.scale = 1;


  const scaleFunc = () => {

    if (Math.floor(refObj.current.style.scale * 100) === Math.floor(scaleTo * 100)) {
      clearInterval(id);
    } else {
      if (refObj.current.style.scale > scaleTo) {
        refObj.current.style.scale = (refObj.current.style.scale - 0.01);
      } else {
        refObj.current.style.scale = refObj.current.style.scale + 0.01;
      }
    }
  }
  id = setInterval(scaleFunc, 5);
}