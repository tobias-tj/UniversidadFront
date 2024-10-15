import axios from "axios";

export const useFaceApi = () => {
  const uploadFaceImage = async (image: string, documentId: string) => {
    try {
      // Convertir la imagen en base64 a Blob si es necesario
      const response = await fetch(image);
      const blob = await response.blob();

      const formData = new FormData();
      formData.append("image", blob, "face-image.jpg"); // Aquí le damos un nombre de archivo
      formData.append("document_id", documentId);

      console.log("Imagen para enviar al back-->", blob);
      console.log("DocumentId para enviar al back-->", documentId);

      const responseUpload = await axios.post(
        "http://localhost:8000/create-face/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (responseUpload.status === 201) {
        console.log("Imagen de la cara subida con éxito.");
        return true;
      } else {
        throw new Error("Error al subir la imagen.");
      }
    } catch (error) {
      // Manejo de errores
      if (axios.isAxiosError(error) && error.response) {
        console.error(error.response.data);
      } else if (error instanceof Error) {
        console.error(error.message);
      } else {
        console.error("Error desconocido");
      }
      return false;
    }
  };

  // Función para validar la imagen de la cara de un usuario recurrente
  const validateFaceImage = async (image: string, documentId: string) => {
    try {
      const response = await fetch(image);
      const blob = await response.blob();

      const formData = new FormData();
      formData.append("image", blob, "face-image.jpg");
      formData.append("document_id", documentId);

      console.log("Validando imagen de usuario recurrente", blob);

      const responseValidation = await axios.post(
        "http://localhost:8000/validation-face/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (responseValidation.status === 200) {
        console.log("Validación de imagen exitosa.");
        return true;
      } else {
        throw new Error("Error al validar la imagen.");
      }
    } catch (error) {
      // Manejo de errores
      if (axios.isAxiosError(error) && error.response) {
        console.error(error.response.data);
      } else if (error instanceof Error) {
        console.error(error.message);
      } else {
        console.error("Error desconocido");
      }
      return false;
    }
  };

  return { uploadFaceImage, validateFaceImage };
};
