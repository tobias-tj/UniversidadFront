import React, { useEffect, useRef } from "react";
import { startCamera } from "@/usecases/useStartCam";
import { useLocation, useNavigate } from "react-router-dom";
import { useFaceApi } from "@/usecases/useFaceApi";

const CaptureFace: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { uploadFaceImage, validateFaceImage } = useFaceApi();

  const documentId = location.state?.userId;

  const isNewUser = location.state?.isNewUser; // Verificar si el usuario es nuevo o recurrente

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

      let success = false;

      if (isNewUser) {
        // Si es nuevo usuario, crea el rostro en el backend
        success = await uploadFaceImage(imageData, documentId);
      } else {
        // Si es usuario recurrente, valida el rostro
        success = await validateFaceImage(imageData, documentId);
      }

      if (success) {
        // Redirige a la siguiente pantalla después de la validación o subida
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
