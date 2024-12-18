import axios from "axios";

export const useReportApi = () => {
  const sendReport = async (
    createId: string,
    incidentType: string,
    time: string
  ) => {
    try {
      const payload = {
        createId,
        incidentType,
        time,
      };

      console.log("Enviando reporte:", payload);

      const response = await axios.post(
        "http://localhost:3000/api/manageReportExam",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        console.log("Reporte enviado con éxito.");
        return true;
      } else {
        throw new Error("Error al enviar el reporte.");
      }
    } catch (error) {
      // Manejo de errores
      if (axios.isAxiosError(error) && error.response) {
        console.error("Error en la respuesta de la API:", error.response.data);
      } else if (error instanceof Error) {
        console.error("Error:", error.message);
      } else {
        console.error("Error desconocido");
      }
      return false;
    }
  };

  return { sendReport };
};
