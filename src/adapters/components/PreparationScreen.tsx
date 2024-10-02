import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { initializefaceapi } from "../../usecases/students/faceRecognition";
import axios from "axios";

const PreparationScreen: React.FC = () => {
  const navigate = useNavigate();
  const [modelsLoaded, setModelsLoaded] = useState<boolean>(false); // Tipado de estado booleano
  const [searchParams] = useSearchParams();

  // Obtén el nombre del estudiante y la URL del formulario desde los parámetros de la URL
  const studentName = searchParams.get("studentName") || "Nombre no disponible";
  const formUrl = searchParams.get("formUrl") || "URL no disponible";

  useEffect(() => {
    const loadModels = async () => {
      await initializefaceapi();
      setModelsLoaded(true);

      // Realiza el POST al backend una vez que los modelos se han cargado
      try {
        await axios.post("http://localhost:8080/api/form-url", {
          name: studentName,
          formUrl,
        });
        console.log("Datos enviados al backend correctamente");
      } catch (error) {
        console.error("Error al enviar los datos al backend:", error);
      }
    };
    loadModels();
  }, [studentName, formUrl]);

  const handleContinue = () => {
    if (modelsLoaded) {
      navigate("/capture-face"); // Navega a la pantalla de captura facial
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen p-6 bg-gray-50">
      <h1 className="mb-6 text-3xl font-bold text-gray-800">
        Preparación para el Reconocimiento Facial
      </h1>
      <p className="mb-8 text-lg text-center text-gray-600">
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
