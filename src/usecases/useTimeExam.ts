import { useEffect, useCallback } from "react";
import axios from "axios";

interface UseTimeExamProps {
  createdId: string | undefined;
}

const useTimeExam = ({ createdId }: UseTimeExamProps) => {
  // Definir sendTimeFinish usando useCallback
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

  useEffect(() => {
    const sendTimeStart = async () => {
      try {
        console.log("createdId en useTimeExam = " + createdId);

        const response = await axios.patch(
          "http://localhost:3000/api/manageStartTimeExam",
          { createdId, token }
        );
        if (response.status === 200) {
          console.log("Tiempo de examen iniciado correctamente.");

          // Abrir una nueva ventana emergente con el formulario de Moodle
          const examWindow = window.open(
            response.data.formUrl,
            "_blank",
            "width=800,height=600"
          );

          // Comprobar si la ventana se ha abierto correctamente
          if (!examWindow) {
            console.error("No se pudo abrir la ventana emergente.");
            return;
          }

          // Monitorear si la ventana emergente se cierra
          const examInterval = setInterval(() => {
            if (examWindow.closed) {
              console.log(
                "El examen ha terminado, cerrando ventana emergente."
              );
              clearInterval(examInterval);
              sendTimeFinish(); // Llamar a la función de finalización del examen
            }
          }, 1000);

          // Limpiar el intervalo cuando el componente se desmonte
          return () => clearInterval(examInterval);
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
  }, [createdId, sendTimeFinish]);

  // useEffect para el listener de mensaje
  useEffect(() => {
    const handleMessage = (event) => {
      if (
        event.origin === "http://localhost" &&
        event.data === "exam-finished"
      ) {
        console.log("Examen completado, cerrando ventana emergente.");
        // Buscar la referencia de la ventana emergente si sigue abierta
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

export default useTimeExam;
