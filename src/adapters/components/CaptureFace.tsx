import React, { useEffect, useRef, useState } from "react";
import {
  captureFace,
  startCamera,
} from "../../usecases/students/faceRecognition";
import { useLocation, useNavigate } from "react-router-dom";

const CaptureFace: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [faceId, setFaceId] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const initialize = async () => {
      if (videoRef.current) {
        await startCamera(videoRef.current);
      }
    };
    initialize();
  }, []);

  const capturaCara = async () => {
    if (videoRef.current) {
      const generatedFaceId = await captureFace(videoRef.current);
      if (generatedFaceId) {
        setFaceId(generatedFaceId);
        console.log("FaceId generado: ", generatedFaceId);
        // Redirige a la pantalla de cargando y pasa el faceId
        navigate("/loading", { state: { faceId: generatedFaceId, ...location.state } });
      }
    }
  };

  const handlePlay = () => {
    capturaCara();
  };

  return (
    <div>
      <video
        ref={videoRef}
        autoPlay
        muted
        width="720"
        height="560"
        id="inputVideo"
        onPlay={handlePlay}
        style={{ display: faceId ? "none" : "block" }}
      />
    </div>
  );
};

export default CaptureFace;
