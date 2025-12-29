import React, { useEffect, useRef, useState } from 'react';
import { FilesetResolver, GestureRecognizer } from '@mediapipe/tasks-vision';

interface WebcamHandTrackerProps {
  isOpen: boolean;
}

export const WebcamHandTracker: React.FC<WebcamHandTrackerProps> = ({ isOpen }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [status, setStatus] = useState<string>('Initializing CV...');
  const recognizerRef = useRef<GestureRecognizer | null>(null);
  const requestRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    let isActive = true;

    const setupVision = async () => {
      try {
        setStatus('Loading models...');
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm"
        );
        
        if (!isActive) return;

        recognizerRef.current = await GestureRecognizer.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: "https://storage.googleapis.com/mediapipe-models/gesture_recognizer/gesture_recognizer/float16/1/gesture_recognizer.task",
            delegate: "GPU"
          },
          runningMode: "VIDEO",
          numHands: 2
        });

        setStatus('Starting camera...');
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        
        if (videoRef.current && isActive) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
             videoRef.current?.play();
             setStatus('Active');
             predictWebcam();
          };
        }
      } catch (err) {
        console.error(err);
        setStatus('Error loading vision.');
      }
    };

    setupVision();

    return () => {
      isActive = false;
      if (videoRef.current && videoRef.current.srcObject) {
        (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
      }
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [isOpen]);

  const predictWebcam = () => {
    if (!videoRef.current || !recognizerRef.current || !canvasRef.current) return;

    const nowInMs = Date.now();
    const results = recognizerRef.current.recognizeForVideo(videoRef.current, nowInMs);

    // Logging gestures as requested
    if (results.gestures.length > 0) {
      const gestureName = results.gestures[0][0].categoryName;
      const confidence = results.gestures[0][0].score;
      if (confidence > 0.6) {
        console.log(`Detected Gesture: ${gestureName} (${(confidence * 100).toFixed(1)}%)`);
      }
    }
    
    // Draw landmarks
    const ctx = canvasRef.current.getContext('2d');
    if (ctx) {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        // Simple visualizer logic could go here, for now just cleaning
        if (results.landmarks) {
            ctx.fillStyle = "#00FF00";
            for (const landmarks of results.landmarks) {
                for (const landmark of landmarks) {
                    ctx.beginPath();
                    ctx.arc(landmark.x * canvasRef.current.width, landmark.y * canvasRef.current.height, 3, 0, 2 * Math.PI);
                    ctx.fill();
                }
            }
        }
    }

    requestRef.current = requestAnimationFrame(predictWebcam);
  };

  return (
    <div className="relative w-full h-full bg-black flex items-center justify-center overflow-hidden">
      <video
        ref={videoRef}
        className="absolute w-full h-full object-cover transform -scale-x-100 opacity-60"
        playsInline
      />
      <canvas 
        ref={canvasRef}
        className="absolute w-full h-full object-cover transform -scale-x-100 z-10"
        width={640} // Default resolution
        height={480}
      />
      <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/60 text-white text-xs rounded font-mono z-20">
        {status}
      </div>
    </div>
  );
};
