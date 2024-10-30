import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { PreparationData } from "./data/PreparationData";
import PreparationSingle from "./PreparationSingleScreen";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

const PreparationScreen: React.FC = () => {
  const navigate = useNavigate();

  const location = useLocation();
  const createdId = location.state?.formId;
  const formUrl = location.state?.formUrl;
  const userId = location.state?.userId;

  const handleContinue = () => {
    navigate("/capture-face", {
      state: { formUrl, createdId, userId, isNewUser: true },
    });
  };
  const carouselRef = React.useRef<CarouselApi | null>(null);
  const scrollNext = () => {
    carouselRef.current?.scrollNext();
  };

  const scrollPrev = () => {
    carouselRef.current?.scrollPrev();
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
        <Carousel
          className="w-full h-full max-w-5xl"
          setApi={(api) => {
            // Aquí se guarda la API del carrusel para poder invocar los métodos desde el padre.
            carouselRef.current = api;
          }}
        >
          <CarouselContent>
            {PreparationData.map((prep) => (
              <CarouselItem key={prep.id}>
                <PreparationSingle
                  key={prep.id}
                  preparation={prep}
                  handleContinue={handleContinue}
                  carouselNext={scrollNext}
                  carouselPrevious={scrollPrev}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
        <div className="w-full text-center my-auto pt-8">
          <span className="font-semibold opacity-50">Power By YvagaCore</span>
        </div>
      </div>
    </div>
  );
};

export default PreparationScreen;
