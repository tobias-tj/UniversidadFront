import { useEffect, useCallback } from "react";
import axios from "axios";

interface useProtoringExamProps {
  createdId: string | undefined;
}

const useProtoringExam = ({ createdId }: useProtoringExamProps) => {
  const token = localStorage.getItem("Token");

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
    const sendTimeStart = async () => {
      try {
        console.log("createdId en useProtoringExam = " + createdId);

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
    const handleMessage = (event) => {
      if (
        event.origin === "http://localhost" &&
        event.data === "exam-finished"
      ) {
        console.log("Examen completado, cerrando ventana emergente.");
        const examWindow = window.open("", "_blank");
        if (examWindow && !examWindow.closed) {
          examWindow.close();
        }
      }
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);
};

export default useProtoringExam;
