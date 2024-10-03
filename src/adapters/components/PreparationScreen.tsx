import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { initializefaceapi } from "../../usecases/students/faceRecognition";
import axios from "axios";
import { Button } from "@/components/ui/button";

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
      console.log(studentName);
      console.log(formUrl);
      // Realiza el POST al backend una vez que los modelos se han cargado
      try {
        await axios.post("http://localhost:3000/api/saveFormUrl", {
          name: studentName,
          //cedula
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
      navigate("/capture-face", { state: { studentName: studentName } }); // Navega a la pantalla de captura facial
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
      {/* Aca cargamos un boton de nuestra libreria que Shadcn que es la que vamos a utilizar en nuestro UIX */}
      <Button onClick={handleContinue} disabled={!modelsLoaded}>
        {modelsLoaded ? "Continuar" : "Cargando modelos..."}
      </Button>
    </div>
  );
};

export default PreparationScreen;
