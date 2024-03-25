import React, { useState, useRef } from "react";
import Keyboard from "react-simple-keyboard";
import { useNavigate } from "react-router-dom";
import "react-simple-keyboard/build/css/index.css";

const Communication = () => {
  const [input, setInput] = useState("");
  const keyboardRef = useRef(null);
  const navigate = useNavigate();

  // Function to handle keyboard input change
  const handleInputChange = (newInput) => {
    setInput(newInput);
  };

  // Function to handle keyboard key press
  const handleKeyPress = (button) => {
    // Handle key press as needed
  };

  // Function to handle text-to-speech conversion
  const speakText = () => {
    if (input.trim() !== "") {
      // Check if input is not empty
      if ("speechSynthesis" in window) {
        const speechSynthesis = window.speechSynthesis;
        const utterance = new SpeechSynthesisUtterance(input);
        speechSynthesis.speak(utterance);
        setInput(""); // Clear input after speaking
      } else {
        alert("Text-to-speech is not supported in this browser.");
      }
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {/* Your Communication page content goes here */}
      <h1>Communication Page</h1>

      {/* Display the current input */}
      <p>Text: {input}</p>

      {/* Render the Keyboard component */}
      <Keyboard
        onChange={handleInputChange}
        onKeyPress={handleKeyPress}
        input={input}
        ref={keyboardRef}
      />
      <div className="values">
        {/* Button to speak text */}
      <button onClick={speakText}>Speak</button>

      {/* Button to navigate back to the home page */}
      <button onClick={() => navigate('/')}>Home</button>
      </div>
      
    </div>
  );
};

export default Communication;
