import { Student } from "../../domain/models/Student";
import { getFormUrl, saveFaceId } from "../../infrastructure/api/studentApi";

export const handleCapture = async (estudiante: Student): Promise<string> => {
  // Guardamos el faceId en la base de datos
  await saveFaceId(estudiante);

  // obtenemos la URL del formulario
  const formUrl = await getFormUrl(estudiante.name);

  return formUrl;
};
