import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { initializefaceapi } from "../../usecases/students/faceRecognition";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import axios from "axios";

const PreparationScreen: React.FC = () => {
  const navigate = useNavigate();
  const [modelsLoaded, setModelsLoaded] = useState<boolean>(false);
  const [searchParams] = useSearchParams();

  const formUrl = searchParams.get("formUrl") || "URL no disponible";
  const id = searchParams.get("id") || "Id no disponible";
  const code = searchParams.get("code") || "Code no disponible";

  useEffect(() => {
    const loadModels = async () => {
      await initializefaceapi();
      setModelsLoaded(true);
      console.log(formUrl);
      console.log(id);
      console.log(code);

      try {
        await axios.post("http://localhost:3000/api/manageExamUser", {
          id,
          code,
        });
        console.log("Datos enviados al backend correctamente");
      } catch (error) {
        console.error("Error al enviar los datos al backend: ", error);
      }
    };
    loadModels();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleContinue = () => {
    if (modelsLoaded) {
      navigate("/capture-face", { state: { formUrl } }); // Navega a la pantalla de captura facial
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-[50%] bg-transparent">
        <CardHeader>
          <CardTitle>Preparación para el Reconocimiento Facial</CardTitle>
          <CardDescription>Presta Atencion</CardDescription>
        </CardHeader>
        <CardContent>
          <p>
            En la siguiente pantalla, te solicitaremos encender tu cámara. Por
            favor, asegúrate de estar en un lugar tranquilo y sin distracciones
            para poder capturar tu rostro correctamente.
          </p>
        </CardContent>
        <CardFooter>
          {/* Aca cargamos un boton de nuestra libreria que Shadcn que es la que vamos a utilizar en nuestro UIX */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleContinue}
            disabled={!modelsLoaded}
            className="p-2 text-white rounded-lg bg-primary"
          >
            {modelsLoaded ? "Continuar" : "Cargando modelos..."}
          </motion.button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default PreparationScreen;
