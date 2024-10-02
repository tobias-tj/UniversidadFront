import axios from "axios";
import { Student } from "../../domain/models/Student";

const BASE_URL = "http://localhost:3000/api";

export const saveFaceId = async (student: Student) => {
  try {
    const response = await axios.post(`${BASE_URL}/saveFaceId`, student);
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error("Error guardando el FaceId");
  }
};

export const getFormUrl = async (studentName: string) => {
  try {
    const response = await axios.post(`${BASE_URL}/form-url`, {
      name: studentName, // Envía el nombre del estudiante
    });
    console.log("Se lee la url desde el front");
    return response.data.formUrl; // Cambia 'url' a 'formUrl'
  } catch (error) {
    console.error(error);
    throw new Error("Error obteniendo la URL del formulario");
  }
};

export const getStudentDetails = async (faceId: string) => {
  try {
    const response = await axios.get(`${BASE_URL}/student-details/${faceId}`);
    return response.data; // Asegúrate de que esta respuesta incluya todos los datos que necesitas
  } catch (error) {
    console.error(error);
    throw new Error("Error obteniendo los detalles del estudiante");
  }
};
