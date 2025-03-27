import { toast } from "@/hooks/use-toast";
import axios from "axios";

export const useCloseExam = async (
  quizid: number,
  attemptId: number,
  cmid: number
) => {
  try {
    const moddleUrl = localStorage.getItem("moddleUrl");

    // TODO: FIJARSE EN LA URL DE MODDLE DE LA UNIVERSIDAD QUE SEA DINAMIC (CAPAZ PODES RECUPERAR DEL JWT NUEVO) y guardar en el localstorage de donde se suponse que vino la persona
    // Develop: http://localhost/local/quiz_closer/index.php
    // Production: http://161.35.53.140:8888/local/quiz_closer/index.php
    const response = await axios.post(
      `${moddleUrl}/local/quiz_closer/index.php`,
      { quizid, attemptid: attemptId, cmid },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const result = response.data; // Axios ya maneja automáticamente la conversión a JSON
    console.log(result);

    toast({
      variant: "default",
      title: "Examen cerrado",
      description: "El examen fue cerrado correctamente.",
    });

    // Opcional: Navegar a otra página después de cerrar el examen
    // navigate(-1);
  } catch (error) {
    console.error("Error closing exam:", error);

    toast({
      variant: "destructive",
      title: "Error al cerrar el examen",
      description: "Ocurrió un error al intentar cerrar el examen.",
    });
  }
};
