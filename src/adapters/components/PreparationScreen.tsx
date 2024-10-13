import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useExamUser } from "@/usecases/useExamUser";
import { PreparationData } from "./data/PreparationData";
import PreparationSingle from "./PreparationSingleScreen";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

const PreparationScreen: React.FC = () => {
  const navigate = useNavigate();
  const { firstProcess, createExamUser, error } = useExamUser();
  const [createdId, setCreatedId] = useState("");

  const location = useLocation();
  const formId = location.state?.formId;
  const formUrl = location.state?.formUrl;
  const userId = location.state?.userId;
  const fullname = location.state?.fullname;
  const courseName = location.state?.courseName;
  const email = location.state?.email;

  useEffect(() => {
    const initiateProcess = async () => {
      // Primero, inicia el examen
      const examStarted = await firstProcess(
        formId,
        userId,
        fullname,
        courseName,
        email
      );
      if (examStarted) {
        // Luego, si el examen se inició correctamente, creamos el usuario del examen
        const newCreatedId = await createExamUser(formId, userId);
        if (newCreatedId) {
          setCreatedId(newCreatedId);
          console.log("Proceso completado: formulario y usuario sincronizados");
        } else {
          console.error("Error al crear el usuario del examen", error);
        }
      } else {
        console.error("Error al iniciar el examen", error);
      }
    };

    initiateProcess();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleContinue = () => {
    navigate("/capture-face", { state: { formUrl, createdId, userId } });
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
