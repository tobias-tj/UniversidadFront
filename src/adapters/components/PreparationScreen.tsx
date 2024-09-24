import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { initializefaceapi } from "../../usecases/students/faceRecognition";

const PreparationScreen: React.FC = () => {
  const navigate = useNavigate();
  const [modelsLoaded, setModelsLoaded] = useState<boolean>(false); // Tipado de estado booleano

  useEffect(() => {
    const loadModels = async () => {
      await initializefaceapi();
      setModelsLoaded(true);
    };
    loadModels();
  }, []);

  const handleContinue = () => {
    if (modelsLoaded) {
      navigate("/capture-face"); // Navega a la pantalla de captura facial
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Preparación para el Reconocimiento Facial
      </h1>
      <p className="text-lg text-gray-600 text-center mb-8">
        En la siguiente pantalla, te solicitaremos encender tu cámara. Por
        favor, asegúrate de estar en un lugar tranquilo y sin distracciones para
        poder capturar tu rostro correctamente.
      </p>
      <button
        onClick={handleContinue}
        disabled={!modelsLoaded}
        className={`px-6 py-3 text-white rounded-lg transition ${
          modelsLoaded
            ? "bg-green-500 hover:bg-green-600"
            : "bg-gray-300 cursor-not-allowed"
        }`}
      >
        {modelsLoaded ? "Continuar" : "Cargando modelos..."}
      </button>
    </div>
  );
};

export default PreparationScreen;
