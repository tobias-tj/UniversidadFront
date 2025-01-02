import React, { useState } from "react";
import { motion } from "framer-motion"; // Librería de animaciones
import { Button } from "@/components/ui/button"; // Componente de Shadcn
import { Check } from "lucide-react"; // Icono para los pasos completados
import { checkAppIsRunning } from "@/usecases/useCheckApp";

export default function TutorialApp() {
  const [step, setStep] = useState(1);
  const [, setIsAppRunning] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleDownload = () => {
    window.open(
      "https://www.dropbox.com/scl/fi/86n3xhiaqvvok563crfaf/ProctorGuardInstaller.exe?rlkey=dusmzk9e0cntpkpswt9rx2zo8&st=y972kd0n&dl=1",
      "_blank"
    );
    setStep(2);
  };

  const handleNextStep = () => {
    alert(
      "¡Recuerda hacer doble clic en el instalador descargado para continuar!"
    );
    setStep(3);
  };

  const checkApp = async () => {
    setIsLoading(true);
    try {
      const appIsRunning = await checkAppIsRunning(); // Simular llamada a la app
      setIsAppRunning(appIsRunning);
      if (appIsRunning) {
        setStep(4); // Avanzar al último paso
      } else {
        alert("La aplicación no está ejecutándose. Por favor, revisa.");
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      alert("Hubo un error al verificar la aplicación.");
    } finally {
      setIsLoading(false);
    }
  };

  const steps = [
    { id: 1, label: "Descargar la aplicación" },
    { id: 2, label: "Ejecutar el instalador" },
    { id: 3, label: "Verificar ejecución de la aplicación" },
    { id: 4, label: "Completar la instalación" },
  ];

  const progressWidth = (step / steps.length) * 100;

  return (
    <div className="flex items-center justify-center w-screen h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
        <h1 className="mb-6 text-2xl font-bold text-center">
          Guía de Instalación
        </h1>

        {/* Barra de Progreso */}
        <div className="w-full mb-6">
          <div className="w-full h-2 overflow-hidden bg-gray-200 rounded-full">
            <motion.div
              className="h-full bg-blue-500"
              initial={{ width: 0 }}
              animate={{ width: `${progressWidth}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <div className="mt-2 text-sm text-center text-gray-500">
            Paso {step} de {steps.length}
          </div>
        </div>

        {/* Checklist de Pasos */}
        <ul className="w-full mb-6">
          {steps.map(({ id, label }) => (
            <li
              key={id}
              className={`flex items-center gap-3 mb-4 text-lg ${
                id <= step ? "text-blue-500 font-bold" : "text-gray-500"
              }`}
            >
              <div
                className={`w-6 h-6 flex items-center justify-center rounded-full border-2 ${
                  id <= step ? "border-blue-500 bg-blue-100" : "border-gray-300"
                }`}
              >
                {id <= step && <Check className="w-4 h-4 text-blue-500" />}
              </div>
              <span>{label}</span>
            </li>
          ))}
        </ul>

        {/* Botones según el paso */}
        {step === 1 && (
          <Button
            onClick={handleDownload}
            className="w-full text-white bg-blue-500 hover:bg-blue-600"
          >
            Descargar Instalador
          </Button>
        )}
        {step === 2 && (
          <Button
            onClick={handleNextStep}
            className="w-full text-white bg-green-500 hover:bg-green-600"
          >
            Entendido, continuar
          </Button>
        )}
        {step === 3 && (
          <Button
            onClick={checkApp}
            disabled={isLoading}
            className={`w-full text-white ${
              isLoading ? "bg-gray-500" : "bg-yellow-500 hover:bg-yellow-600"
            }`}
          >
            {isLoading ? "Verificando..." : "Verificar aplicación"}
          </Button>
        )}
        {step === 4 && (
          <p className="font-bold text-center text-green-600">
            ¡Instalación completada con éxito!
          </p>
        )}
        <div className="w-full pt-8 my-auto text-center">
          <span className="font-semibold opacity-50">Power By YvagaCore</span>
        </div>
      </div>
    </div>
  );
}
