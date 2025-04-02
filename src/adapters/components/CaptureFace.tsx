import React, { useEffect, useRef, useState } from "react";
import { startCamera } from "@/usecases/useStartCam";
import { useLocation, useNavigate } from "react-router-dom";
import { useFaceApi } from "@/usecases/useFaceApi";
import { motion } from "framer-motion";
import { Camera } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { checkAppIsRunning } from "@/usecases/useCheckApp";

type FaceValidationError = {
  error: string;
};

const MAX_ATTEMPTS = 3;
const MAX_CHECKS = 2;

const CaptureFace: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { uploadFaceImage, validateFaceImage } = useFaceApi();
  const token = localStorage.getItem("Token-Security");
  const isNewUser = location.state?.isNewUser;
  const { toast } = useToast();
  const [attempts, setAttempts] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const createdId = location.state?.createdId;
  const [checkAttempts, setCheckAttempts] = useState(0);
  const moddleUrl = localStorage.getItem("moddleUrl");

  const checkApp = async () => {
    if (checkAttempts >= MAX_CHECKS) {
      console.log("Aplicación no encontrada después de múltiples intentos.");
      navigate("/tutorial-app", {
        state: { createdId, urlString: "/capture-face" },
      });
      return;
    }

    setIsLoading(true);
    try {
      const appIsRunning = await checkAppIsRunning();
      if (appIsRunning) {
        console.log("La aplicación está ejecutándose.");
      } else {
        console.log("La aplicación no está disponible, redirigiendo...");
        navigate("/tutorial-app", {
          state: { createdId, urlString: "/capture-face" },
        });
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      console.log("Error al verificar la aplicación, reintentando...");
      setCheckAttempts((prev) => prev + 1);
      setTimeout(checkApp, 2000);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const initialize = async () => {
      if (videoRef.current) {
        await startCamera(videoRef.current);
      }
    };
    initialize();
    checkApp();
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

              window.location.href = `${moddleUrl}`;
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
        <video
          ref={videoRef}
          autoPlay
          muted
          className="w-full h-auto border rounded-lg transform scale-x-[-1]"
        />
      </div>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleCapture}
        disabled={isLoading}
        className="w-[720px] max-w-full mt-6 py-4 text-white rounded-lg bg-primary flex items-center justify-center"
      >
        Estoy listo <Camera className="ml-2" />
      </motion.button>
    </div>
  );
};

export default CaptureFace;
