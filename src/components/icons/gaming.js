import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";

const GamingPage = () => {
  const [userChoice, setUserChoice] = useState(null);
  const [computerChoice, setComputerChoice] = useState(null);
  const [result, setResult] = useState(null);
  const navigate = useNavigate();
  const choices = ['rock', 'paper', 'scissors'];

  const generateComputerChoice = () => {
    const randomIndex = Math.floor(Math.random() * choices.length);
    return choices[randomIndex];
  };

  const determineWinner = (user, computer) => {
    if (user === computer) return 'It\'s a tie!';
    if ((user === 'rock' && computer === 'scissors') ||
        (user === 'paper' && computer === 'rock') ||
        (user === 'scissors' && computer === 'paper')) {
      return 'You win!';
    } else {
      return 'Computer wins!';
    }
  };

  const handleUserChoice = (choice) => {
    const computerChoice = generateComputerChoice();
    const winner = determineWinner(choice, computerChoice);

    setUserChoice(choice);
    setComputerChoice(computerChoice);
    setResult(winner);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
    <h3>Stone Paper Scissors</h3>

      {/* Display user's choice */}
      {userChoice && <p>Your choice: {userChoice}</p>}

      {/* Display computer's choice */}
      {computerChoice && <p>Computer's choice: {computerChoice}</p>}

      {/* Display result */}
      {result && <p>{result}</p>}

      {/* Display game options */}
      <div className="values">
        
        <button className="buttonClass" onClick={() => handleUserChoice('paper')}>Paper</button>
        
      </div>
      <div className="values1">
        <button className="buttonClass1" onClick={() => handleUserChoice('rock')}>Rock</button>
       
        <button className="buttonClass1" onClick={() => handleUserChoice('scissors')}>Scissors</button>
      </div>
      <div className="values">
      {/* Button to navigate back to the home page */}
      <button onClick={() => navigate('/')}>Home</button>
      </div>
    </div>
    
  );
};

export default GamingPage;