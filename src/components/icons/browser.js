import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

const Browser = () => {
  const [input, setInput] = useState("");
  const navigate = useNavigate();

  // Define arrays of alphabet keys for the first and second blocks
  const firstBlockKeys = "ABCDEFGHIJKLM".split("");
  const secondBlockKeys = "NOPQRSTUVWXYZ".split("");

  // Function to handle keyboard input change
  const handleInputChange = (newInput) => {
    setInput(newInput);
  };

  const handleButtonClick = (key) => {
    setInput((prevInput) => prevInput + key);
  };

  // Function to handle keyboard key press
  const handleKeyPress = (button) => {
    // Handle key press as needed
    if (button === "{enter}") {
      // Trigger search when Enter key is pressed
      searchOnGoogle(input);
    }
  };

  // Function to perform a search on Google
  const searchOnGoogle = (query) => {
    if (query.trim() !== "") {
      const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
      window.open(searchUrl, "_blank"); // Open search results in a new tab
    }
  };

  // Function to handle backspace button click
  const handleBackspaceClick = () => {
    setInput((prevInput) => prevInput.slice(0, -1));
  };

  // Function to handle clear button click
  const handleClearClick = () => {
    setInput("");
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {/* Your Communication page content goes here */}
      <h1>Browsing Page</h1>

      {/* Display the current input */}
      <p>Text: {input}</p>

      <div style={{ display: 'flex', justifyContent: 'space-around', margin: '50px' }}>
        {/* First rectangular block (A to M) */}
        <div style={{ border: '1px solid black', padding: '10px' }}>
          <button style={{ margin: '5px' }} onClick={handleClearClick}>Clear</button>
          {firstBlockKeys.map((key, index) => (
            <button key={index} style={{ margin: '5px' }} onClick={() => handleButtonClick(key)}>
              {key}
            </button>
          ))}
        </div>
        {/* Second rectangular block (N to Z) */}
        <div style={{ border: '1px solid black', padding: '10px' }}>
          <button style={{ margin: '5px' }} onClick={handleBackspaceClick}>Backspace</button>
          {secondBlockKeys.map((key, index) => (
            <button key={index} style={{ margin: '5px' }} onClick={() => handleButtonClick(key)}>
              {key}
            </button>
          ))}
        </div>
      </div>

      <div className="values">
        {/* Search button */}
        <button onClick={() => searchOnGoogle(input)}>Search</button>

        {/* Button to navigate back to the home page */}
        <button onClick={() => navigate('/')}>Home</button>
      </div>

    </div>
  );
};

export default Browser;
