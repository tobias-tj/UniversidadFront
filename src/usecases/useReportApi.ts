import axios from "axios";
import { checkAppIsRunning } from "./useCheckApp";

const APP_URL = import.meta.env.VITE_API_APP_URL;

export const useReportApi = () => {
  const sendReport = async (createId: string) => {
    try {
      // Verificamos si la app esta activa
      const appIsRunnig = await checkAppIsRunning();

      if (!appIsRunnig) {
        console.log("Aplicación no esta activa. Intentando abrirla...");

        // Abrir la aplicacion por primera vez
        const baseUrlSchema = "securityexamapp://open";
        window.location.href = baseUrlSchema;

        // Espera para dar tiempo a que la app se inice
        await new Promise((resolve) => setTimeout(resolve, 3000));
      }

      // Enviar el ID al servidor interno
      console.log("Enviando createId al servidor interno...");
      const response = await axios.post(`${APP_URL}/trigger`, {
        createId, // Axios convierte el objeto automáticamente a JSON
      });

      if (response.status !== 200) {
        throw new Error(`Error en la solicitud: ${response.statusText}`);
      }

      console.log(`Reporte enviado exitosamente con createId: ${createId}`);
      return true;
    } catch (error) {
      console.error("Error al enviar el reporte:", error);
      return false;
    }
  };

  return { sendReport };
};
