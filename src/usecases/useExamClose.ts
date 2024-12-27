import { toast } from "@/hooks/use-toast";
import axios from "axios";

export const useCloseExam = async (
  quizid: number,
  attemptId: number,
  cmid: number
) => {
  try {
    const response = await axios.post(
      `http://localhost/local/quiz_closer/index.php?quizid=${quizid}&attemptid=${attemptId}&cmid=${cmid}`,
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
