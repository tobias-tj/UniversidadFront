import { useEffect, useCallback, useState } from "react";
import axios from "axios";
import { useReportApi } from "./useReportApi";
import { useToast } from "@/hooks/use-toast";

interface useProtoringExamProps {
  createdId: string | undefined;
}

const useProtoringExam = ({ createdId }: useProtoringExamProps) => {
  const token = localStorage.getItem("Token");
  const { sendReport } = useReportApi();
  const { toast } = useToast();
  const [exitCount, setExitCount] = useState(0); // Contador de salidas
  const [isRedirecting, setIsRedirecting] = useState(false); // Nuevo estado para manejar la animación
  const [isExamFinished, setIsExamFinished] = useState(false); // Estado para manejar si el examen ha terminado
  const [examWindow, setExamWindow] = useState<Window | null>(null); // Guardamos la referencia de la ventana

  const sendTimeFinish = useCallback(async () => {
    try {
      const response = await axios.patch(
        "http://localhost:3000/api/manageFinishTimeExam",
        { createdId }
      );
      if (response.status === 200) {
        console.log("Tiempo de examen finalizado correctamente.");
      } else {
        console.error("Error al finalizar el tiempo del examen.");
      }
    } catch (error) {
      console.error(
        "Error al enviar los datos de finalización al backend: ",
        error
      );
    }
  }, [createdId]);

  // Capturar 3-5 imágenes y enviarlas al backend
  const captureAndSendImages = useCallback(async () => {
    if (!createdId) return;

    try {
      // Obtener la cámara
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      const video = document.createElement("video");
      video.srcObject = stream;
      await new Promise((resolve) => (video.onloadedmetadata = resolve));
      video.play();

      const captures = [];
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");

      for (let i = 0; i < 10; i++) {
        // Capturar 10 imágenes
        context!.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL("image/jpeg");
        captures.push(dataUrl);
        await new Promise((resolve) => setTimeout(resolve, 100)); // Pausa de 100ms entre capturas
      }

      // Parar el video y liberar la cámara
      video.pause();
      stream.getTracks().forEach((track) => track.stop());

      // Enviar capturas al backend
      await axios.post("http://localhost:8000/proctoring-exam/", {
        createdId,
        images: captures,
        token,
      });

      console.log("Capturas enviadas al backend.");
    } catch (error) {
      console.error("Error al capturar o enviar imágenes: ", error);
    }
  }, [createdId, token]);

  useEffect(() => {
    const handleVisibilityChange = async () => {
      if (document.hidden && createdId) {
        setExitCount((prev) => prev + 1);

        if (exitCount < 2) {
          toast({
            variant: "default",
            title: `Advertencia ${exitCount + 1}/2`,
            description:
              "No debes salir de la ventana emergente durante el examen.",
            duration: 5000,
          });
          sendReport(createdId, "window_changed", new Date().toISOString());
          console.log("El usuario cambió de ventana.");
        } else {
          toast({
            variant: "destructive",
            title: "Examen Cancelado",
            description:
              "Has superado el límite de salidas permitidas. Tu intento ha sido eliminado.",
            duration: 3000,
          });
          setIsRedirecting(true); // Activar la animación de redirección
          console.log(
            "Examen completado, debido a incidencia cerrando ventana emergente."
          );
          // Cerrar la ventana emergente
          if (examWindow && !examWindow.closed) {
            examWindow.close();
          }

          await new Promise((resolve) => setTimeout(resolve, 2000));
          window.location.href = "http://localhost/my/";
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [createdId, sendReport, toast, exitCount]);

  useEffect(() => {
    const sendTimeStart = async () => {
      try {
        // Mostrar el mensaje profesional antes de iniciar el examen
        toast({
          variant: "default",
          title: "Iniciando el Examen",
          description:
            "El examen está protegido bajo un sistema de monitoreo avanzado. Se utilizará tu cámara y se controlará la actividad en tu pantalla para garantizar la validez del examen. Por favor, asegúrate de cumplir con las normas establecidas.",
          duration: 4000,
        });

        const response = await axios.patch(
          "http://localhost:3000/api/manageStartTimeExam",
          { createdId, token }
        );
        if (response.status === 200) {
          console.log("Tiempo de examen iniciado correctamente.");

          const examWindow = window.open(
            response.data.formUrl,
            "_blank",
            "width=800,height=600"
          );

          if (!examWindow) {
            console.error("No se pudo abrir la ventana emergente.");
            return;
          }

          setExamWindow(examWindow); // Guardar la referencia de la ventana

          const examInterval = setInterval(() => {
            if (examWindow.closed) {
              console.log(
                "El examen ha terminado, cerrando ventana emergente."
              );
              clearInterval(examInterval);
              sendTimeFinish();
            }
          }, 1000);

          // Iniciar el intervalo de capturas cada 30 segundos
          // const captureInterval = setInterval(captureAndSendImages, 30000);
          const captureInterval = setInterval(captureAndSendImages, 15000);

          return () => {
            clearInterval(examInterval);
            clearInterval(captureInterval); // Limpiar el intervalo al desmontar
          };
        } else {
          console.error("Error al iniciar el tiempo del examen.");
        }
      } catch (error) {
        console.error("Error al enviar los datos al backend: ", error);
      }
    };

    if (createdId) {
      sendTimeStart();
    }
  }, [createdId, sendTimeFinish, captureAndSendImages]);

  useEffect(() => {
    const handleMessage = async (event) => {
      if (
        event.origin === "http://localhost" &&
        event.data === "exam-finished"
      ) {
        console.log("Examen completado, cerrando ventana emergente.");
        const examWindow = window.open("", "_blank");
        if (examWindow && !examWindow.closed) {
          examWindow.close();
        }
        setIsRedirecting(true); // Activar la animación de redirección
        await new Promise((resolve) => setTimeout(resolve, 2000));
        window.location.href = "http://localhost/my/";
      }
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  return { isRedirecting, isExamFinished }; // Devolver los estados que necesita el componente
};

export default useProtoringExam;
