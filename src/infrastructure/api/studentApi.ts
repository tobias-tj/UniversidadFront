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

export const getFormUrl = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/form-url`);
    return response.data.url;
  } catch (error) {
    console.error(error);
    throw new Error("Error obteniendo la URL del formulario");
  }
};
