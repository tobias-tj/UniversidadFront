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
import Lottie from "react-lottie";
import robot from "@/assets/lottie/robot.json";
const PreparationScreen: React.FC = () => {
  const navigate = useNavigate();

  const location = useLocation();
  const createdId = location.state?.createdId;

  const handleContinue = () => {
    navigate("/capture-face", {
      state: { createdId, isNewUser: true, proctorType: 1 },
    });
  };
  const carouselRef = React.useRef<CarouselApi | null>(null);
  const scrollNext = () => {
    carouselRef.current?.scrollNext();
  };

  const scrollPrev = () => {
    carouselRef.current?.scrollPrev();
  };

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: robot,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      {/* Título con el nombre de la empresa */}
      <div className="mb-4 text-4xl font-bold text-center text-gray-800">
        {/* YvagaCore */}
        {/* <img src="/Vector.png" className="h-32 w-28" /> */}
        <Lottie options={defaultOptions} height={200} width={180} speed={1.5} />
      </div>

      {/* Subtítulo o descripción opcional */}
      {/* <p className="mb-6 text-lg text-center text-gray-600">
        Soluciones Tecnologicas.
      </p> */}

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
        <div className="w-full pt-8 my-auto text-center">
          <span className="font-semibold opacity-50">Power By YvagaCore</span>
        </div>
      </div>
    </div>
  );
};

export default PreparationScreen;
