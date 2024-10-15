import { useState } from "react";
import axios from "axios";

export const useExamUser = () => {
  const [error, setError] = useState<string | null>(null);

  const firstProcess = async (
    formId: number,
    userId: number,
    fullname: string,
    courseName: string,
    email: string
  ) => {
    try {
      const data = {
        estado: "pendiente",
        rol: "EST",
        idFormulario: formId,
        idUsuario: userId,
        fullname: fullname,
        courseName: courseName,
        email: email,
      };

      const response = await axios.post(
        "http://localhost:3000/api/firstProcess",
        data
      );
      if (response.status === 201) {
        console.log("Usuario y examen sincronizado correctamente");
        return response.data.createdId;
      } else {
        throw new Error("Error al sincronizar el usuario y el examen");
      }
    } catch (error) {
      // Verifica si el error tiene un mensaje y lo asigna
      if (axios.isAxiosError(error) && error.response) {
        setError(error.response.data.message || "Error en la petición");
      } else if (error instanceof Error) {
        setError(error.message || "Error en la petición");
      } else {
        setError("Error desconocido");
      }
      return null;
    }
  };
  return { firstProcess, error };
};
