import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import './App.css';

// Constants for game settings
const GRID_SIZE = 5; // Updated grid size to 5
const GAME_DURATION = 90000; // Updated game duration to 90 seconds
const MAX_MOVES = 25; // Updated maximum moves allowed for each player

const App = () => {
  const { register, handleSubmit } = useForm();
  const [players, setPlayers] = useState([
    { id: 1, name: '', position: { x: 0, y: 0 }, food: 3, water: 3, wood: 3, icon: '', moveCount: 0 },
    { id: 2, name: '', position: { x: 4, y: 4 }, food: 3, water: 3, wood: 3, icon: '', moveCount: 0 },
  ]);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [resources, setResources] = useState({
    water: { amount: 3, position: getRandomPosition() },
    food: { amount: 3, position: getRandomPosition() },
    wood: { amount: 3, position: getRandomPosition() },
  });
  const [gameOver, setGameOver] = useState(false);
  const [timer, setTimer] = useState(GAME_DURATION);
  const [loser, setLoser] = useState(null); // Track the loser
  const [winner, setWinner] = useState(null); // Track the winner
  const [isCapturing, setIsCapturing] = useState(false); // Track if capturing
  const [playerIndexToCapture, setPlayerIndexToCapture] = useState(null); // Track which player's image to capture
  const [showInstructions, setShowInstructions] = useState(false); // Control visibility of instructions
  const videoRef = useRef(null); // Reference for the video element
  const canvasRef = useRef(null); // Reference for the canvas element

  // Function to generate random positions for resources that do not overlap with players
  function getRandomPosition() {
    let position;
    let overlap;
    do {
      position = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // Check for overlap with players
      overlap = players.some(player => player.position.x === position.x && player.position.y === position.y);
    } while (overlap);
    return position;
  }

  // Start capturing the webcam
  const startCapture = async (index) => {
    setPlayerIndexToCapture(index);
    setIsCapturing(true);

    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
      videoRef.current.play();
    }
  };

  // Capture image from the webcam
  const captureImage = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (videoRef.current) {
      context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const imageDataUrl = canvas.toDataURL('image/png');
      setPlayers((prevPlayers) => {
        const newPlayers = [...prevPlayers];
        newPlayers[playerIndexToCapture].icon = imageDataUrl;
        return newPlayers;
      });
      stopCapture();
    }
  };

  // Stop capturing
  const stopCapture = () => {
    setIsCapturing(false);
    setPlayerIndexToCapture(null);
    if (videoRef.current) {
      const stream = videoRef.current.srcObject;
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      videoRef.current.srcObject = null;
    }
  };

  // Keyboard movement controls
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (gameOver) return;

      const newPlayers = [...players];
      const player = newPlayers[currentPlayerIndex];

      // Arrow key movements
      switch (e.key) {
        case 'ArrowUp':
          if (player.position.y > 0) player.position.y -= 1;
          break;
        case 'ArrowDown':
          if (player.position.y < GRID_SIZE - 1) player.position.y += 1;
          break;
        case 'ArrowRight':
          if (player.position.x < GRID_SIZE - 1) player.position.x += 1;
          break;
        case 'ArrowLeft':
          if (player.position.x > 0) player.position.x -= 1;
          break;
        default:
          break;
      }

      // Check for resource collection
      const resourceHere = Object.keys(resources).find(
        (r) =>
          resources[r].position.x === player.position.x &&
          resources[r].position.y === player.position.y
      );

      // Collect resources based on the condition
      if (resourceHere && resources[resourceHere].amount > 0) {
        if (resourceHere === 'wood' && player.wood < 5) {
          player.wood += 1; // Collect wood
          // Only allow to collect food and water after reaching 5 wood
          if (player.wood === 5) {
            alert(`${player.name} has collected 5 woods! Now you can collect food and water.`);
          }
        } else if ((resourceHere === 'food' || resourceHere === 'water') && player.wood === 5) {
          player[resourceHere] += 1; // Collect food or water
        } else {
          alert(`You must collect 5 woods before collecting ${resourceHere}.`);
          return; // Exit if conditions are not met
        }

        // Reset resource position without exhausting it
        setResources((prevResources) => ({
          ...prevResources,
          [resourceHere]: {
            ...prevResources[resourceHere],
            position: getRandomPosition(),
          },
        }));
      }

      // Increment move count
      player.moveCount += 1;

      // Check for game over conditions
      if (player.food >= 5 && player.water >= 5 && player.wood >= 5) {
        setWinner(player.name);
        setGameOver(true);
        return; // End the game
      }

      // Check for losing condition
      if (player.moveCount >= MAX_MOVES) {
        setLoser(player.name);
        setGameOver(true);
        return; // End the game
      }

      // Switch to next player
      setCurrentPlayerIndex((currentPlayerIndex + 1) % players.length);
      setPlayers(newPlayers);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [players, resources, currentPlayerIndex, gameOver]);

  // Timer effect to end the game after 1 minute and 30 seconds
  useEffect(() => {
    if (timer <= 0) {
      setGameOver(true);
      const player1Score = players[0].food + players[0].water + players[0].wood;
      const player2Score = players[1].food + players[1].water + players[1].wood;
      const winner = player1Score > player2Score ? players[0].name : players[1].name;
      setWinner(winner); // Set winner state
      return;
    }

    const intervalId = setInterval(() => {
      setTimer((prevTimer) => prevTimer - 1000);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timer, players]);

  // Handle form submission for player names and icons
  const onSubmit = (data) => {
    setPlayers((prevPlayers) => {
      const newPlayers = [...prevPlayers];
      newPlayers[0].name = data.player1;
      newPlayers[1].name = data.player2;
      return newPlayers;
    });
    setShowInstructions(true); // Show instructions after starting the game
  };

  // Function to close instructions
  const closeInstructions = () => {
    setShowInstructions(false);
  };

  // Player name and icon input form with animations
  return (
    <div className="App">
      <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
        STRANDED - BATTLE OF SURVIVAL
      </motion.h1>
      {!players[0].name || !players[1].name ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            <label>
              Player 1 Name:
              <input {...register('player1')} required />
            </label>
            <br />
            <button type="button" onClick={() => startCapture(0)}>
              Capture Player 1 Image
            </button>
            <br />
            <label>
              Player 2 Name:
              <input {...register('player2')} required />
            </label>
            <br />
            <button type="button" onClick={() => startCapture(1)}>
              Capture Player 2 Image
            </button>
            <br />
            <button type="submit">Start Game</button>
          </form>
          {isCapturing && (
            <div>
              <video ref={videoRef} width="320" height="240" autoPlay></video>
              <button onClick={captureImage}>Capture</button>
              <button onClick={stopCapture}>Stop</button>
              <canvas ref={canvasRef} width="320" height="240" style={{ display: 'none' }} />
            </div>
          )}
        </motion.div>
      ) : (
        <div>
          <h2>Game On!</h2>
          <h3>Current Player: {players[currentPlayerIndex].name}</h3>
          <p>Remaining Time: {Math.floor(timer / 1000)} seconds</p>
          <div className="grid">
            {Array.from({ length: GRID_SIZE }, (_, rowIndex) => (
              <div key={rowIndex} className="grid-row">
                {Array.from({ length: GRID_SIZE }, (_, colIndex) => {
                  const playerHere = players.find((p) => p.position.x === rowIndex && p.position.y === colIndex);
                  return (
                    <div key={colIndex} className={`grid-cell ${playerHere ? 'player' : ''}`}>
                      {playerHere ? (
                        <img src={playerHere.icon} alt={`Player ${playerHere.id}`} style={{ width: '50px', height: '50px' }} />
                      ) : null}
                      {resources.food.position.x === rowIndex && resources.food.position.y === colIndex && (
                        <div className="resource">🍏</div>
                      )}
                      {resources.water.position.x === rowIndex && resources.water.position.y === colIndex && (
                        <div className="resource">💧</div>
                      )}
                      {resources.wood.position.x === rowIndex && resources.wood.position.y === colIndex && (
                        <div className="resource">🪵</div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
          {showInstructions && (
            <div className="instructions">
              <h2>Game Instructions</h2>
              <p>
                Each player has a maximum of {MAX_MOVES} moves to collect resources.
                Collect wood first to unlock food and water collection.
                The first player to collect 5 of each resource wins the game.
                Good luck!
              </p>
              <button onClick={closeInstructions}>Close Instructions</button>
            </div>
          )}
          {/* Display the winner when the game is over */}
          {gameOver && winner && (
            <div className="winner">
              <h2>Game Over!</h2>
              <h3>{winner} is the Winner!</h3>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default App;
