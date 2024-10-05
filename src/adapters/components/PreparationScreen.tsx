import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
      navigate("/capture-face", { state: {} }); // Navega a la pantalla de captura facial
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
