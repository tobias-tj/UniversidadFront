import React, { useEffect, useRef } from "react";
import { startCamera } from "@/usecases/useStartCam";
import { useLocation, useNavigate } from "react-router-dom";
import { useFaceApi } from "@/usecases/useFaceApi";
import { motion } from "framer-motion";
import { Camera } from "lucide-react";
const CaptureFace: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { uploadFaceImage, validateFaceImage } = useFaceApi();
  const token = localStorage.getItem("Token");

  const isNewUser = location.state?.isNewUser; // Verificar si el usuario es nuevo o recurrente

  console.log(isNewUser);

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
        success = await uploadFaceImage(imageData, token!);
      } else {
        // Si es usuario recurrente, valida el rostro
        success = await validateFaceImage(imageData, token!);
      }

      if (success) {
        // Redirige a la siguiente pantalla después de la validación o subida
        navigate("/form", { state: { ...location.state } });
      }
    }
  };

  return (
    <div className="w-full h-full bg-gray-200">
      <div className="mx-auto py-[10vh] h-screen w-full ">
        <video
          ref={videoRef}
          autoPlay
          muted
          width="720"
          height="560"
          id="inputVideo"
          style={{ display: "block" }}
          className="mx-auto border rounded-lg"
        />
        <div className="flex justify-end w-10/12 mx-auto">
          <motion.button
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleCapture}
            className="flex p-6 mx-auto my-10 text-white rounded-lg bg-primary"
          >
            Estoy listo <Camera className="mx-2" />
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default CaptureFace;
