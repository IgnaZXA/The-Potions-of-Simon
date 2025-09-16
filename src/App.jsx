import { useState, useEffect, useRef } from 'react';
import useSound from 'use-sound';
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
        imageDir: './src/assets/images/Potions/Yellow_Potion.png',
        position: {top: 55, left: 25}
      },
      {
        color: '#300AFA',
        ref: blueRef,
        sound: 'two',
        imageDir: './src/assets/images/Potions/Blue_Potion.png',
        position: {top: 70, left: 40}

      },
      {
        color: '#FA0E03',
        ref: redRef,
        sound: 'three',
        imageDir: './src/assets/images/Potions/Red_Potion.png',
        position: {top: 65, left: 10}

      },
      {
        color: '#0AFA03',
        ref: greenRef,
        sound: 'four',
        imageDir: './src/assets/images/Potions/Green_Potion.png',
        position: {top: 72, left: 70}

      },
    ];

  const minNumber = 0;
  const maxNumber = 3;
  const speedGame = 400;


  const [sequence, setSequence] = useState([]);
  const [currentGame, setCurrentGame] = useState([]);
  const [isAllowedToPlay, setIsAllowedToPlay] = useState(false);
  const [speed, setSpeed] = useState(speedGame);
  const [turn, setTurn] = useState(0);
  const [pulses, setPulses] = useState(0);
  const [success, setSuccess] = useState(0);
  const [isGameOn, setIsGameOn] = useState(false);


  const initGame = () => {
    randomNumber();
    setIsGameOn(true);
  }

  const randomNumber = () => {
    setIsAllowedToPlay(false);
    const randomNumber = Math.floor(Math.random() * (maxNumber - minNumber + 1) + minNumber);
    setSequence([...sequence, randomNumber]);
    setTurn(turn + 1);
  }


  const handleClick = (index) => {
    if (isAllowedToPlay) {
      play({ id: colors[index].sound })
      colors[index].ref.current.style.opacity = (1);
      colors[index].ref.current.style.scale = (0.9);
      setTimeout(() => {
        colors[index].ref.current.style.opacity = (0.75);
        colors[index].ref.current.style.scale = (1);
        setCurrentGame([...currentGame, index]);
        setPulses(pulses + 1);
      }, speed / 2);
    } 
  }

  useEffect(() => {
    if (pulses > 0) {
      if (Number(sequence[pulses - 1]) === Number(currentGame[pulses - 1])) {
        setSuccess(success + 1);
      } else {
        const index = sequence[pulses - 1];
        if (index) colors[index].ref.current.style.opacity = (1);
        play({ id: 'error' })
        setTimeout(() => {
          if (index) colors[index].ref.current.style.opacity = (0.75);
          setIsGameOn(false);
        }, speed * 2);
        setIsAllowedToPlay(false);
      }
    }
  }, [pulses]);

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

  useEffect(() => {
    if (!isAllowedToPlay) {
      sequence.map((item, index) => {
        setTimeout(() => {
          play({ id: colors[item].sound });
          colors[item].ref.current.style.opacity = (1);
          setTimeout(() => {
            colors[item].ref.current.style.opacity = (0.75);
          }, speed / 2)
        }, speed * index);
      });
    }
    setIsAllowedToPlay(true);
  }, [sequence]);

  return (
    <>
      {
        isGameOn ?
          <div style={{
            backgroundImage: 'url(./src/assets/images/Crazy_Simon_Table_2.jpg)',
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
                      position:'absolute',
                      width: '5vw', 
                      height:'25vh',
                      top: `${item.position.top}vh`,
                      left: `${item.position.left}vw`,
                      opacity: '0.75'
                    }}
                    onClick={() => handleClick(index)}
                  >
                    

                  </div>
                );
              })}
            </div>
          </div>
          :
          <div style={{
            background: 'url(./src/assets/images/Title_Image_1.png)',
            backgroundSize: '100vw 100vh',
            backgroundRepeat: 'no-repeat',
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
              position: 'relative',
              top: '20px',
              color: 'rgb(202, 76, 4)',
              textAlign: 'center',
              fontSize: '2vw'
              }}>
              <h1>SUPER SIMON</h1>
            </div>

            <button onClick={initGame} style={BUTTON_START_STYLES}>START</button>
          </div>
      }
    </>
  );
}

export default App;

const BUTTON_START_STYLES = {
  position: 'relative',
  top: '55vh',
  width: '15vw',
  height: '10vh',
  backgroundColor: 'rgba(0, 0, 0, 0.6)',
  border: '1px solid rgba(132, 134, 13, 1)',
  fontFamily: 'Kaotika',
  fontSize: '3vh',
  color: 'rgba(255, 255, 255, 1)'
};

