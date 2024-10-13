import React, { useEffect, useRef } from "react";
import { startCamera } from "@/usecases/useStartCam";
import { useLocation, useNavigate } from "react-router-dom";
import { useFaceApi } from "@/usecases/useFaceApi";

const CaptureFace: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { uploadFaceImage } = useFaceApi();

  const documentId = location.state?.userId;

  useEffect(() => {
    const initialize = async () => {
      if (videoRef.current) {
        await startCamera(videoRef.current);
      }
    };
    initialize();
  }, []);

  const handleCapture = async () => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const context = canvas.getContext("2d");
      context?.drawImage(videoRef.current, 0, 0);
      const imageData = canvas.toDataURL("image/jpeg");

      const success = await uploadFaceImage(imageData, documentId);
      if (success) {
        // Redirige a la pantalla de cargando o donde sea necesario
        navigate("/form", { state: { ...location.state } });
      }
    }
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
        style={{ display: "block" }}
      />
      <button onClick={handleCapture}>Estoy listo</button>
    </div>
  );
};

export default CaptureFace;
