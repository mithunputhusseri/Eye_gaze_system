// Copyright 2023 MediaPipe & Malgorzata Pick
import React, { Fragment, useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import { useNavigate } from 'react-router-dom';
import {
  FaceMesh,
  // FACEMESH_TESSELATION,
  FACEMESH_RIGHT_IRIS,
  FACEMESH_LEFT_IRIS,
  FACEMESH_LEFT_EYE,
  FACEMESH_RIGHT_EYE

  // FACEMESH_FACE_OVAL,
} from "@mediapipe/face_mesh";
import { Camera } from "@mediapipe/camera_utils";
import { drawConnectors } from "@mediapipe/drawing_utils";
import Info from "../../components/info/Info";
// import InfoIcon from "../../components/infoIcon/InfoIcon";

const WebcamImg = () => {
  // Global settings
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const navigate =useNavigate();
  const [imgSrc, setImgSrc] = useState(null);
  const [PDValue, setPDValue] = useState("");
  const [PDResult, setPDResult] = useState("");
 // const [averageValue, setAverageValue] = useState(0);
  const [numbersList, setNumbersList] = useState([]);
  const deviceWidth =
    window.innerWidth ||
    document.documentElement.clientWidth ||
    document.body.clientWidth;
    const [positionIndicator, setPositionIndicator] = useState('');
    const [gazingRightTimer, setGazingRightTimer] = useState(null);
  const [gazingCenterTimer, setGazingCenterTimer] = useState(null);
  let width = 84.0;
  let height = 88.0;

  if (deviceWidth < 670 && deviceWidth >= 510) {
    width = 480.0;
    height = 360.0;
  }
  if (deviceWidth < 510 && deviceWidth >= 390) {
    width = 360.0;
    height = 360.0;
  }
  if (deviceWidth < 390) {
    width = 240.0;
    height = 240.0;
  }

  const videoConstraints = {
    width: width,
    height: height,
    facingMode: "user",
  };

  // Function to calculate distance between two points / pupils
  const getDistance = (p1, p2) => {
    return Math.sqrt(
      Math.pow(p1.x - p2.x, 2) +
        Math.pow(p1.y - p2.y, 2) +
        Math.pow(p1.z - p2.z, 2)
    );
  };

  // Loading webcam and setting Face Mesh API when image source changes
  useEffect(() => {
    // Function to run canvas with video and Face Mesh when ready
    const onResults = (results) => {
      // Setting canvas - references and context
      const canvasElement = canvasRef.current;
      canvasElement.width = width;
      canvasElement.height = height;
      const canvasCtx = canvasElement.getContext("2d");
      canvasCtx.save();
      canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
      canvasCtx.drawImage(
        results.image,
        0,
        0,
        canvasElement.width,
        canvasElement.height
      );

      // Loading Face Mesh landmarks for iris and getting coordinates for pupils
      if (results.multiFaceLandmarks && results.multiFaceLandmarks[0]) {
        let pupils = {
          left: {
            x:
              (results.multiFaceLandmarks[0][FACEMESH_LEFT_IRIS[0][0]].x +
                results.multiFaceLandmarks[0][FACEMESH_LEFT_IRIS[2][0]].x) /
              2.0,
            y:
              (results.multiFaceLandmarks[0][FACEMESH_LEFT_IRIS[0][0]].y +
                results.multiFaceLandmarks[0][FACEMESH_LEFT_IRIS[2][0]].y) /
              2.0,
            z:
              (results.multiFaceLandmarks[0][FACEMESH_LEFT_IRIS[0][0]].z +
                results.multiFaceLandmarks[0][FACEMESH_LEFT_IRIS[2][0]].z) /
              2.0,
            width: getDistance(
              results.multiFaceLandmarks[0][FACEMESH_LEFT_IRIS[0][0]],
              results.multiFaceLandmarks[0][FACEMESH_LEFT_IRIS[2][0]]
            ),
          },
          right: {
            x:
              (results.multiFaceLandmarks[0][FACEMESH_RIGHT_IRIS[0][0]].x +
                results.multiFaceLandmarks[0][FACEMESH_RIGHT_IRIS[2][0]].x) /
              2.0,
            y:
              (results.multiFaceLandmarks[0][FACEMESH_RIGHT_IRIS[0][0]].y +
                results.multiFaceLandmarks[0][FACEMESH_RIGHT_IRIS[2][0]].y) /
              2.0,
            z:
              (results.multiFaceLandmarks[0][FACEMESH_RIGHT_IRIS[0][0]].z +
                results.multiFaceLandmarks[0][FACEMESH_RIGHT_IRIS[2][0]].z) /
              2.0,
            width: getDistance(
              results.multiFaceLandmarks[0][FACEMESH_RIGHT_IRIS[0][0]],
              results.multiFaceLandmarks[0][FACEMESH_RIGHT_IRIS[2][0]]
            ),
          },
        };
        
       

        // Setting variables for calculation disance between pupils
        let distance = getDistance(pupils.left, pupils.right);
        let irisWidthInMM = 12.0;
        let pupilWidth = Math.min(pupils.left.width, pupils.right.width);
        let pd = (irisWidthInMM / pupilWidth) * distance;


       

        // Setting real-time pupillary distance
        setPDValue(pd.toFixed(0));

        // Drawing Face Mesh results of pupils on canvas
        canvasCtx.fillStyle = "#22b9ad";
        // Left
        
        canvasCtx.fillRect(
          pupils.left.x * width - 0.3,
          pupils.left.y * height - 0.3,
          0.6,
          0.6
        );
        
        // Right
        
        canvasCtx.fillRect(
          pupils.right.x * width - 0.3,
          pupils.right.y * height - 0.3,
          0.6,
          0.6
        );
        //inner left eye
        canvasCtx.fillRect(
          results.multiFaceLandmarks[0][FACEMESH_LEFT_EYE[0][0]].x * width - 0.3,
          results.multiFaceLandmarks[0][FACEMESH_LEFT_EYE[0][0]].y * height -0.3,
          0.6,
          0.6
        );
          //inner right eye
        canvasCtx.fillRect(
          results.multiFaceLandmarks[0][FACEMESH_RIGHT_EYE[0][0]].x * width - 0.3,
          results.multiFaceLandmarks[0][FACEMESH_RIGHT_EYE[0][0]].y * height -0.3,
          0.6,
          0.6
        );

          //outer left eye
        canvasCtx.fillRect(
          results.multiFaceLandmarks[0][FACEMESH_LEFT_EYE[7][0]].x * width - 0.3,
          results.multiFaceLandmarks[0][FACEMESH_LEFT_EYE[7][0]].y * height -0.3,
          0.6,
          0.6
        );
        
          //outer right eye
        canvasCtx.fillRect(
          results.multiFaceLandmarks[0][FACEMESH_RIGHT_EYE[7][0]].x * width - 0.3,
          results.multiFaceLandmarks[0][FACEMESH_RIGHT_EYE[7][0]].y * height -0.3,
          0.6,
          0.6
        );
        
        //right lower eyelid
        canvasCtx.fillRect(
          results.multiFaceLandmarks[0][FACEMESH_RIGHT_EYE[4][0]].x * width - 0.3,
          results.multiFaceLandmarks[0][FACEMESH_RIGHT_EYE[4][0]].y * height -0.3,
          0.6,
          0.6
        );
         //right upper eyelid
         canvasCtx.fillRect(
          results.multiFaceLandmarks[0][FACEMESH_RIGHT_EYE[12][0]].x * width - 0.3,
          results.multiFaceLandmarks[0][FACEMESH_RIGHT_EYE[12][0]].y * height -0.3,
          0.6,
          0.6
        );
         
        //LEFT lower eyelid
        canvasCtx.fillRect(
          results.multiFaceLandmarks[0][FACEMESH_LEFT_EYE[4][0]].x * width - 0.3,
          results.multiFaceLandmarks[0][FACEMESH_LEFT_EYE[4][0]].y * height -0.3,
          0.6,
          0.6
        );
         //left upper eyelid
         canvasCtx.fillRect(
          results.multiFaceLandmarks[0][FACEMESH_LEFT_EYE[12][0]].x * width - 0.3,
          results.multiFaceLandmarks[0][FACEMESH_LEFT_EYE[12][0]].y * height -0.3,
          0.6,
          0.6
        );



        // Calculate distance between inner corner and pupil for the left eye
        let innerCornerDistanceLeft = 10*getDistance(
          results.multiFaceLandmarks[0][FACEMESH_LEFT_EYE[0][0]],
          pupils.left
          //results.multiFaceLandmarks[0][FACEMESH_LEFT_IRIS[0][0]]
                );
        
                // Calculate distance between outer corner and pupil for the left eye
                let outerCornerDistanceLeft = 10*getDistance(
                results.multiFaceLandmarks[0][FACEMESH_LEFT_EYE[7][0]],
                pupils.left
                //results.multiFaceLandmarks[0][FACEMESH_LEFT_IRIS[0][0]]
                );
                // Calculate distance between pupil center and upper eyelid for the left eye
                let upperEyelidDistanceLeft = getDistance(
                results.multiFaceLandmarks[0][FACEMESH_LEFT_EYE[4][0]], // Upper eyelid point
                 pupils.left // Pupil center point
                );

        
        
                // Display distances between inner and outer corners and pupils for the left eye
                console.log('Inner Corner to Pupil Distance - Left Eye:', innerCornerDistanceLeft.toFixed(4));
                console.log('Outer Corner to Pupil Distance - Left Eye:', outerCornerDistanceLeft.toFixed(4));
                
                // Set a tolerance level for the equality check
                const tolerance = 0.04242; // Modify the tolerance level as needed
                
                // Check if the distances are approximately equal within the tolerance
                let positionIndicator = '';
                if (Math.abs(outerCornerDistanceLeft - innerCornerDistanceLeft) < tolerance) {
                  positionIndicator = 'Center';
                  // Start the timer when looking at the center
                  if (!gazingCenterTimer) {
                    const timer = setTimeout(() => {
                      // Open the browser page after 5 seconds
                      navigate('/browser');
                    }, 5000);
                    setGazingCenterTimer(timer);
                  }
                } else {
                  // Reset the timer when not looking at the center
                  if (gazingCenterTimer) {
                    clearTimeout(gazingCenterTimer);
                    setGazingCenterTimer(null);
                  }
                  // Handle other positions...
                }
       // Update the state variable
    setPositionIndicator(positionIndicator);

        // Inside the useEffect hook after the calculation of pupillary distance
              //  document.getElementById('innerCornerLeftEye').textContent = `Distance: ${innerCornerDistanceLeft.toFixed(2)}`;
               // document.getElementById('outerCornerLeftEye').textContent = `Distance: ${outerCornerDistanceLeft.toFixed(2)}`;
              //  document.getElementById('centerIndicator').textContent = `Indicator: ${centerIndicator}`;
              document.getElementById('positionIndicator').textContent = `Indicator: ${positionIndicator}`; 
            
                // Inside the useEffect hook after the calculation of pupillary distance
                  // Inside the useEffect hook after the calculation of pupillary distance
                document.getElementById('innerCornerLeftEye').textContent = `Distance: ${innerCornerDistanceLeft.toFixed(4)}`;
                document.getElementById('outerCornerLeftEye').textContent = `Distance: ${outerCornerDistanceLeft.toFixed(4)}`;
        
                

        // Drawing Face Mesh landmarks of iris on canvas (and face oval and tessellation if you want)
        for (const landmarks of results.multiFaceLandmarks) {
          // drawConnectors(canvasCtx, landmarks, FACEMESH_TESSELATION, {
          //   color: "#C0C0C070",
          //   lineWidth: 1,
          // });
          drawConnectors(canvasCtx, landmarks, FACEMESH_RIGHT_IRIS, {
            color: "#ffffff00",
            lineWidth: 0.5,
          });
          drawConnectors(canvasCtx, landmarks, FACEMESH_LEFT_IRIS, {
            color: "#ffffff00",
            lineWidth: 0.5,
          });
          // drawConnectors(canvasCtx, landmarks, FACEMESH_FACE_OVAL, {
          //   color: "#E0E0E0",
          // });
        }
      }
      canvasCtx.restore();
    };

    // Starting new Face Mesh
    const faceMesh = new FaceMesh({
      locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`;
      },
    });
    faceMesh.setOptions({
      maxNumFaces: 1,
      refineLandmarks: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });
    faceMesh.onResults(onResults);

    // Starting new camera
    const videoElement = webcamRef.current;
    if (
      imgSrc === null &&
      typeof videoElement !== "undefined" &&
      videoElement !== null
    ) {
      const camera = new Camera(videoElement.video, {
        onFrame: async () => {
          await faceMesh.send({ image: videoElement.video });
        },
        width: width,
        height: height,
      });
      camera.start();
      document.querySelector(".container-img").style.display = "none";
    }
    return () => {};
  }, [imgSrc, height, width, deviceWidth]);

  useEffect(() => {}, [numbersList, PDResult]);

  // Function for hiding container with introduction and showing container with info
  /*const showInfo = () => {
    document.querySelector("#card-1").style.display = "none";
    document.querySelector("#card-2").style.display = "flex";
    document.querySelector(".container-display").style.display = "none";
    document.querySelector(".container-img").style.display = "none";
  };*/

  // Function for hiding container with info and showing results with video
  /*const openApp = () => {
    document.querySelector("#card-2").style.display = "none";
    document.querySelector(".container-display").style.display = "flex";
  };*/

  // Function to capture image from canvas with Face Mesh and hide video section
  const capturePhoto = () => {
    document.querySelector(".container-img").style.display = "flex";
    const canvas = document.querySelector("#output-canvas");
    const data = canvas.toDataURL("image/png");
    setImgSrc(data);
    //document.querySelector(".container-display").style.display = "none";
    setPDResult(PDValue);
    const tempNumbers = [...numbersList];
    tempNumbers.push(+PDValue);
    console.log("All numbers: ");
    console.log(tempNumbers);
    setNumbersList(tempNumbers);
    //let average = tempNumbers.reduce((a, b) => a + b, 0) / tempNumbers.length;
    //console.log("Average: ");
    //console.log(average);
    //setAverageValue(tempNumbers.length > 0 ? average.toFixed(0) : 0);
  };

  // Function to reset image source and showing back video section
  const resetPhoto = () => {
    setImgSrc(null);
    document.querySelector(".container-display").style.display = "flex";
  };

  // Function to handle button selection based on gaze direction
  const handleGazeSelection = () => {
    const gazeDirection = positionIndicator.toLowerCase(); // Convert to lowercase for case-insensitive comparison

    // Reset the timer when making a manual selection
    if (gazingRightTimer) {
      clearTimeout(gazingRightTimer);
      setGazingRightTimer(null);
    }

    switch (gazeDirection) {
      case 'right':
        navigate('/gaming');
        break;
      case 'left':
        navigate('/communication');
        break;
      default:
        navigate('/browser');
        break;
    }
  };

  // DOM elements which shows depending on what's happening in app
  return (
    <Fragment>
      <div className="container-app">
      

        <div className="container-display">
        <div  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}> 
        <p>Outer Corner to Pupil Center - Left Eye: <span id="innerCornerLeftEye"></span></p>
        <p>Inner Corner to Pupil Center - Left Eye: <span id="outerCornerLeftEye"></span></p>
      </div>
      <div  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}><p>Application <span id="positionIndicator"></span></p></div>
      <div className="values" >
            <button
            className="buttonClass"
            onClick={() => navigate('/browser')}
            >
            Browser
            </button>
            </div>

            
            <div className="values1" >
            <button
            className="buttonClass1"
            onClick={() => navigate('/communication')}
            >
            Communication
            </button>
            <button className="buttonClass1"
              onClick={() => navigate('/gaming')}
                
              >Gaming
              </button>
            </div>
          <div className="container-video">
            <Webcam
              ref={webcamRef}
              videoConstraints={videoConstraints}
              width={width}
              height={height}
              audio={false}
              imageSmoothing={true}
              screenshotFormat="image/jpeg"
              id="input-video"
              className="result"
              style={{
                marginLeft: "auto",
                marginRight: "auto",
                left: 0,
                right: 0,
                textAlign: "center",
                zindex: 9,
                display: "none",
              }}
            />{" "}
            <canvas
              ref={canvasRef}
              id="output-canvas"
              className="result"
              style={{
                marginLeft: "auto",
                marginRight: "auto",
                left: 0,
                right: 0,
                textAlign: "left",
                zindex: 9,
                width: width,
                height: height,
              }}
            ></canvas>
            
          </div>
        </div>
        <div className="container-img">
          <img src={imgSrc} className="result" id="photo" alt="screenshot" />
           <div className="values">
          
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default WebcamImg;