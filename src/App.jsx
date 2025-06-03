import { useState, useEffect, useRef } from 'react'
import './App.css'
import Button from './components/Button'
import Card from './components/Card'
import S1 from './assets/S1.jpg'
import S2 from './assets/S2.jpg'
import S3 from './assets/S3.jpg'
import S4 from './assets/S4.jpg'
import S5 from './assets/S5.jpg'
import S6 from './assets/S6.jpg'
import C2 from './assets/C2.jpg'
import HalloweenTheme from './assets/John Carpenter - HALLOWEEN Theme.mp3'

const EMOJIS = [S1, S2, S3, S4, S5, S6]; // 6 pairs for 12 cards
// const EMOJIS = ['../assets/S1.jpg', '../assets/S2.jpg', '../assets/S3.jpg', '../assets/S4.jpg', '../assets/S5.jpg', '../assets/S6.jpg'];

function shuffle(array) {
  const arr = array.slice()
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const temp = arr[i]
    arr[i] = arr[j]
    arr[j] = temp
  }
  return arr
}

function createShuffledDeck() {
  const cards = [...EMOJIS, ...EMOJIS].map((emoji, i) => ({
    id: i + '-' + emoji,
    emoji,
  }))
  return shuffle(cards)
}

function formatTime(seconds) {
  const min = Math.floor(seconds / 60).toString().padStart(2, '0')
  const sec = (seconds % 60).toString().padStart(2, '0')
  return `${min}:${sec}`
}

function App() {
  const [deck, setDeck] = useState(createShuffledDeck())
  const [flippedCards, setFlippedCards] = useState([])
  const [matchedPairs, setMatchedPairs] = useState([])
  const [moves, setMoves] = useState(0)
  const [timer, setTimer] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [gameWon, setGameWon] = useState(false)
  const [isMuted, setIsMuted] = useState(false);
  const [is15sMode, setIs15sMode] = useState(false);
  const [timeUp, setTimeUp] = useState(false);
  const audioRef = useRef(null);

  // Timer effect
  useEffect(() => {
    let interval
    if (isPlaying && !gameWon && !(is15sMode && timeUp)) {
      interval = setInterval(() => {
        setTimer(prev => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isPlaying, gameWon, is15sMode, timeUp])

  // Effet pour le mode 15s
  useEffect(() => {
    if (is15sMode && isPlaying && timer >= 15 && !gameWon) {
      setTimeUp(true);
      setIsPlaying(false);
    }
  }, [timer, is15sMode, isPlaying, gameWon])

  // Check for matches
  useEffect(() => {
    if (flippedCards.length === 2) {
      setMoves(prev => prev + 1)
      const [first, second] = flippedCards
      const firstCard = deck.find(card => card.id === first)
      const secondCard = deck.find(card => card.id === second)

      if (firstCard.emoji === secondCard.emoji) {
        setMatchedPairs(prev => [...prev, first, second])
        setFlippedCards([])
      } else {
        setTimeout(() => {
          setFlippedCards([])
        }, 1000)
      }
    }
  }, [flippedCards, deck])

  // Check for win
  useEffect(() => {
    if (matchedPairs.length === deck.length && deck.length > 0) {
      setGameWon(true)
      setIsPlaying(false)
    }
  }, [matchedPairs, deck])

  const handleCardClick = (id) => {
    if (flippedCards.length === 2 || matchedPairs.includes(id) || flippedCards.includes(id) || timeUp) return

    if (!isPlaying) {
      setIsPlaying(true)
      if (audioRef.current && audioRef.current.paused) {
        audioRef.current.play().catch(() => {});
      }
    }

    setFlippedCards(prev => [...prev, id])
  }

  const handleReset = () => {
    setDeck(createShuffledDeck())
    setFlippedCards([])
    setMatchedPairs([])
    setMoves(0)
    setTimer(0)
    setIsPlaying(false)
    setGameWon(false)
    setTimeUp(false)
  }

  const handle15sMode = () => {
    setIs15sMode(m => !m);
    setTimeUp(false);
    setTimer(0);
    setIsPlaying(false);
    setGameWon(false);
    setFlippedCards([]);
    setMatchedPairs([]);
    setMoves(0);
    setDeck(createShuffledDeck());
  }
  useEffect(() => {
    const createBloodParticle = () => {
      const particle = document.createElement('div');
      particle.style.position = 'fixed';
      particle.style.top = '-10%';
      particle.style.left = `${Math.random() * 100}vw`;
      particle.style.width = `${Math.random() * 5 + 2}px`;
      particle.style.height = `${Math.random() * 20 + 10}px`;
      particle.style.backgroundColor = 'red';
      particle.style.opacity = '0.8';
      particle.style.zIndex = '9999';
      particle.style.borderRadius = '50%';
      particle.style.animation = 'fall 5s linear';
      document.body.appendChild(particle);

      setTimeout(() => {
        document.body.removeChild(particle);
      }, 5000);
    };

    const interval = setInterval(createBloodParticle, 100);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.5;
      audioRef.current.play().catch(() => {});
    }
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
    }
  }, [isMuted]);

  const handleAudioButton = () => {
    setIsMuted(m => !m);
    if (audioRef.current && audioRef.current.paused) {
      audioRef.current.play().catch(() => {});
    }
  }

  return (
    <div className="memory-game-container">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.5rem', marginTop: '2rem', marginBottom: '1.5rem', position: 'absolute', top: 0, left: 0, width: '100%' }}>
        <h1 style={{ margin: 0 }}>Cauchemars cachés </h1>
        <img src={C2} alt="C2" style={{ height: '4rem', borderRadius: '10px', boxShadow: '0 0 10px #ff0000' }} />
      </div>
      <div style={{ height: '7rem' }}></div>
      <div className="game-stats">
        <div>Time: {formatTime(timer)}{is15sMode && ' / 00:15'}</div>
        <div>Moves: {moves}</div>
        <div>Points: {Math.floor(matchedPairs.length / 2)}</div>
      </div>
      <Button onClick={handleReset}>New Game</Button>
      <Button onClick={handle15sMode} style={{marginLeft: '1rem', background: is15sMode ? '#ff0000' : undefined}}>
        {is15sMode ? 'Désactiver le mode 15s' : 'Mode 15 secondes'}
      </Button>
      <div className="cards-grid">
        {deck.map(card => (
          <Card
            key={card.id}
            isFlipped={flippedCards.includes(card.id) || matchedPairs.includes(card.id)}
            onClick={() => handleCardClick(card.id)}
          >
            {typeof card.emoji === 'string' && !card.emoji.endsWith('.jpg') ? (
              card.emoji
            ) : (
              <img src={card.emoji} alt="card" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            )}
          </Card>
        ))}
      </div>
      {gameWon && (
        <div className="victory-message">
          🎉 Congratulations! 🎉<br />
          You won in {moves} moves and {formatTime(timer)}!
        </div>
      )}
      {timeUp && is15sMode && !gameWon && (
        <div className="victory-message" style={{background: '#ff0000cc', color: 'white'}}>
          ⏰ Temps écoulé !<br />
          Essayez encore en moins de 15 secondes !
        </div>
      )}
      <button onClick={handleAudioButton} style={{position: 'absolute', top: 20, right: 20, zIndex: 10000}}>
        {isMuted ? '🔇' : '🔊'}
      </button>
      <audio ref={audioRef} src={HalloweenTheme} loop style={{ display: 'none' }} />
    </div>
  )
}

export default App


