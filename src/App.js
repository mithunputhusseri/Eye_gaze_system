// Copyright 2023 MediaPipe & Malgorzata Pick
import React, { Fragment } from 'react';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import WebcamImg from "./components/webcamImg/WebcamImg";
import CommunicationPage from "./components/icons/communication"; // 
import BrowserPage from "./components/icons/browser"; // 
import GamingPage from "./components/icons/gaming"; // 

const App = () => {
  return (
    <Fragment>
      <div className="main" >
    <Router basename="/React-PD-Meter-App">
      <Routes> {/* Use Routes instead of Switch */}
        <Route path="/" element={<WebcamImg />} />
        <Route path="/communication" element={<CommunicationPage />} />
        <Route path="/gaming" element={<GamingPage />} />
        <Route path="/browser" element={<BrowserPage />} />
        {/* Add more routes as needed */}
      </Routes>
    
    </Router>
    </div>
    </Fragment>
  );
};


export default App;