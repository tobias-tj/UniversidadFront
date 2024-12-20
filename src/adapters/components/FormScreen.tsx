import useProtoringExam from "@/usecases/useProtoringExam";
import React from "react";
import { useLocation } from "react-router-dom";
import loading from "@/assets/lottie/loadingAnimation.json";
import Lottie from "react-lottie";

const FormScreen: React.FC = () => {
  const location = useLocation();
  const createdId = location.state?.createdId;
  // Usar el hook para manejar el tiempo del examen

  const { isExamFinished, isRedirecting } = useProtoringExam({ createdId });

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: loading,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <p>Iniciando el examen...</p>

      {isRedirecting && !isExamFinished && (
        <div className="flex flex-col items-center space-y-4">
          <Lottie options={defaultOptions} height={400} width={400} />
          <p className="text-xl text-gray-700">
            Guardando tus datos y redirigiendo...
          </p>
        </div>
      )}
    </div>
  );
};

export default FormScreen;
