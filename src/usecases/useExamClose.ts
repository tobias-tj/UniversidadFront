import { toast } from "@/hooks/use-toast";
import axios from "axios";

export const useCloseExam = async (
  quizid: number,
  attemptId: number,
  userId: number,
  ws: string
) => {
  try {
    const moddleUrl = localStorage.getItem("moddleUrl");

    const response = await axios.post(
      `${moddleUrl}/webservice/rest/server.php?wstoken=${ws}&wsfunction=local_closexam_close_quiz_attempt&moodlewsrestformat=json&quizid=${quizid}&attemptid=${attemptId}&userid=${userId}`
    );

    const result = response.data;
    console.log(result);

    toast({
      variant: "default",
      title: "Examen cerrado",
      description: "El examen fue cerrado correctamente.",
    });
  } catch (error) {
    console.error("Error closing exam:", error);

    toast({
      variant: "destructive",
      title: "Error al cerrar el examen",
      description: "Ocurrió un error al intentar cerrar el examen.",
    });
  }
};
