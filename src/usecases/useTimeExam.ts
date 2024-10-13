import { useEffect } from "react";
import axios from "axios";

interface UseTimeExamProps {
  createdId: string | undefined;
  formUrl: string | undefined;
}

const useTimeExam = ({ createdId, formUrl }: UseTimeExamProps) => {
  useEffect(() => {
    const sendTimeStart = async () => {
      try {
        const response = await axios.patch(
          "http://localhost:3000/api/manageStartTimeExam",
          { createdId }
        );
        if (response.status === 200) {
          console.log("Tiempo de examen iniciado correctamente.");

          // Abrir una nueva ventana emergente con el formulario de Moodle
          const examWindow = window.open(
            formUrl,
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
        } else {
          console.error("Error al iniciar el tiempo del examen.");
        }
      } catch (error) {
        console.error("Error al enviar los datos al backend: ", error);
      }
    };

    const sendTimeFinish = async () => {
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
    };

    if (createdId && formUrl) {
      sendTimeStart();
    }
  }, [createdId, formUrl]);
};

export default useTimeExam;
