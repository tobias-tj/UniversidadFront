import React, { useEffect, useRef, useState } from "react";
import { startCamera } from "@/usecases/useStartCam";
import { useLocation, useNavigate } from "react-router-dom";
import { useFaceApi } from "@/usecases/useFaceApi";
import { motion } from "framer-motion";
import { Camera } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type FaceValidationError = {
  error: string;
};

const MAX_ATTEMPTS = 3; // Máximo número de intentos

const CaptureFace: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { uploadFaceImage, validateFaceImage } = useFaceApi();
  const token = localStorage.getItem("Token");

  const isNewUser = location.state?.isNewUser;

  const { toast } = useToast();
  const [attempts, setAttempts] = useState(0); // Estado para el contador de intentos

  useEffect(() => {
    const initialize = async () => {
      if (videoRef.current) {
        await startCamera(videoRef.current);
      }
    };
    initialize();
  }, []);

  const handleCapture = async () => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const context = canvas.getContext("2d");
      context?.drawImage(videoRef.current, 0, 0);
      const imageData = canvas.toDataURL("image/jpeg");

      try {
        let result;
        if (isNewUser) {
          result = await uploadFaceImage(imageData, token!);
        } else {
          result = await validateFaceImage(imageData, token!);
        }

        const { success, error } = result;

        if (success) {
          navigate("/form", { state: { ...location.state } });
        } else {
          console.log(`Intento fallido ${attempts} de ${MAX_ATTEMPTS}`);

          const errorMessage = error as unknown as FaceValidationError;
          let mensajeError = "";
          if (
            errorMessage!.error ===
            "No se ha detectado ninguna cara en la imagen."
          ) {
            mensajeError =
              "No se detectó ninguna cara en la imagen. Por favor, asegúrate de capturar tu rostro claramente.";
          } else if (
            errorMessage!.error === "La cara no coincide con la registrada."
          ) {
            mensajeError =
              "La cara capturada no coincide con la registrada. Intenta de nuevo.";
          } else if (
            errorMessage!.error ===
            "El documento de identidad ya está registrado con otra cara."
          ) {
            mensajeError =
              "El usuario ya cuenta con un faceID creado, no puedes registrar uno nuevo.";
          }
          toast({
            variant: "destructive",
            title: "Validacion fallida",
            description: mensajeError,
          });

          // Incrementar el contador de intentos
          setAttempts((prev) => {
            const newAttempts = prev + 1;
            console.log(`Intento fallido ${newAttempts} de ${MAX_ATTEMPTS}`);
            if (newAttempts >= MAX_ATTEMPTS) {
              toast({
                variant: "destructive",
                title: "Demasiados intentos fallidos",
                description:
                  "Has excedido el número máximo de intentos. Regresando a la página anterior.",
              });

              navigate(-2);
            }
            return newAttempts;
          });
        }
      } catch (error) {
        console.error(error);

        toast({
          variant: "destructive",
          title: "Error inesperado",
          description:
            "Ocurrió un error al procesar la validación. Intenta nuevamente.",
        });

        // Incrementar el contador incluso en errores inesperados
        setAttempts((prev) => {
          const newAttempts = prev + 1;
          if (newAttempts >= MAX_ATTEMPTS) {
            toast({
              variant: "destructive",
              title: "Demasiados intentos fallidos",
              description:
                "Has excedido el número máximo de intentos. Regresando a la página anterior.",
            });

            navigate(-2); // Regresa a la página anterior
          }
          return newAttempts;
        });
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-screen bg-gray-200">
      <div className="relative w-[720px] max-w-full">
        {/* Video */}
        <video
          ref={videoRef}
          autoPlay
          muted
          id="inputVideo"
          className="w-full h-auto border rounded-lg transform scale-x-[-1]"
        />

        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="opacity-50 w-72 h-72 stroke-gray-600"
            viewBox="0 0 100 100"
          >
            <rect
              x="5"
              y="5"
              width="90"
              height="90"
              fill="none"
              strokeDasharray="5 5"
              strokeWidth="2"
            />
          </svg>
        </div>
      </div>

      {/* Botón */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleCapture}
        className="w-[720px] max-w-full mt-6 py-4 text-white rounded-lg bg-primary flex items-center justify-center"
      >
        Estoy listo <Camera className="ml-2" />
      </motion.button>
    </div>
  );
};

export default CaptureFace;
