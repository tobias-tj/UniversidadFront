import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Lottie from "react-lottie";
import animation4 from "@/assets/lottie/animationnew3.json";
import axios from "axios";

const LoadingScreen: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const faceId = location.state?.faceId;
  const formUrl = location.state?.formUrl;
  // UserId
  const code = location.state?.code;

  useEffect(() => {
    const sendFaceId = async () => {
      try {
        const response = await axios.patch(
          "http://localhost:3000/api/manageFaceId",
          {
            faceId,
            code,
          }
        );
        if (response.status === 200) {
          console.log("FaceId enviado al backend correctamente");
          navigate("/form", { state: { ...location.state } });
        } else {
          console.error("Error al enviar el faceId");
        }
      } catch (error) {
        console.error("Error al enviar el faceId al backend: ", error);
      }
    };

    if (faceId) {
      sendFaceId();
    }
  }, [faceId, navigate, formUrl]);

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animation4,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Lottie options={defaultOptions} height={400} width={400} />
      <p className="text-xl font-bold text-center">Cargando...</p>
    </div>
  );
};

export default LoadingScreen;
