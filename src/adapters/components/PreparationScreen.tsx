import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { initializefaceapi } from "../../usecases/students/faceRecognition";

import axios from "axios";
import { PreparationData } from "./data/PreparationData";
import PreparationSingle from "./PreparationSingleScreen";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

const PreparationScreen: React.FC = () => {
  const navigate = useNavigate();
  const [modelsLoaded, setModelsLoaded] = useState<boolean>(false);
  const [searchParams] = useSearchParams();
  const [createdId, setCreatedId] = useState("");

  const formUrl = searchParams.get("formUrl") || "URL no disponible";
  const id = searchParams.get("id") || "Id no disponible";
  const code = searchParams.get("code") || "Code no disponible";

  useEffect(() => {
    const loadModels = async () => {
      await initializefaceapi();
      setModelsLoaded(true);

      try {
        const response = await axios.post(
          "http://localhost:3000/api/manageExamUser",
          {
            id,
            code,
          }
        );
        if (response.status === 201) {
          console.log("Datos enviados al backend correctamente");
          const createdId = response.data.createdId;
          console.log("ID creado: ", createdId);
          setCreatedId(createdId);
        } else {
          console.error(
            "Error al intentar vincular datos: ",
            response.data.errors
          );
        }
      } catch (error) {
        console.error("Error al enviar los datos al backend: ", error);
      }
    };
    loadModels();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleContinue = () => {
    if (modelsLoaded) {
      navigate("/capture-face", { state: { formUrl, createdId, code } });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      {/* Título con el nombre de la empresa */}
      <h1 className="mb-4 text-4xl font-bold text-center text-gray-800">
        YvagaCore
      </h1>

      {/* Subtítulo o descripción opcional */}
      <p className="mb-6 text-lg text-center text-gray-600">
        Soluciones Tecnologicas.
      </p>

      <div className="w-full max-w-5xl">
        <Carousel className="w-full h-full max-w-5xl">
          <CarouselContent>
            {PreparationData.map((prep) => (
              <CarouselItem key={prep.id}>
                <PreparationSingle
                  key={prep.id}
                  preparation={prep}
                  handleContinue={handleContinue}
                  modelsLoaded={modelsLoaded}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </div>
  );
};

export default PreparationScreen;
