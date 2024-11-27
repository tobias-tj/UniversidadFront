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

  const isNewUser = location.state?.isNewUser;

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
        success = await uploadFaceImage(imageData, token!);
      } else {
        success = await validateFaceImage(imageData, token!);
      }

      if (success) {
        navigate("/form", { state: { ...location.state } });
      }
    }
  };

  return (
    <div className="w-full h-screen bg-gray-200 flex flex-col justify-center items-center">
      <div className="relative w-[720px] max-w-full">
        {/* Video */}
        <video
          ref={videoRef}
          autoPlay
          muted
          id="inputVideo"
          className="w-full h-auto border rounded-lg transform scale-x-[-1]"
        />

        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-72 h-72 stroke-gray-600 opacity-50"
            viewBox="0 0 100 100"
          >
            <rect
              x="5"
              y="5"
              width="90"
              height="90"
              fill="none"
              strokeDasharray="5 5"
              strokeWidth="2"
            />
          </svg>
        </div>
      </div>

      {/* Botón */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleCapture}
        className="w-[720px] max-w-full mt-6 py-4 text-white rounded-lg bg-primary flex items-center justify-center"
      >
        Estoy listo <Camera className="ml-2" />
      </motion.button>
    </div>
  );
};

export default CaptureFace;
