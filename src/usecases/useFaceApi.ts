import axios from "axios";

const PYTHON_URL = import.meta.env.VITE_API_PYTHON_URL;

export const useFaceApi = () => {
  const uploadFaceImage = async (
    image: string,
    token: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      // Convertir la imagen en base64 a Blob si es necesario
      const response = await fetch(image);
      const blob = await response.blob();

      const formData = new FormData();
      formData.append("image", blob, "face-image.jpg"); // Aquí le damos un nombre de archivo
      formData.append("token", token);

      const responseUpload = await axios.post(
        `${PYTHON_URL}/create-face/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (responseUpload.status === 201) {
        console.log("Imagen de la cara subida con éxito.");
        return { success: true };
      } else {
        return {
          success: false,
          error: "Error al intentar registrar un faceId para este usuario.",
        };
      }
    } catch (error) {
      let errorMessage = "Error desconocido";
      // Manejo de errores
      if (axios.isAxiosError(error) && error.response) {
        errorMessage = error.response.data as string;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      } else {
        console.error(errorMessage);
      }
      return { success: false, error: errorMessage };
    }
  };

  // Función para validar la imagen de la cara de un usuario recurrente
  const validateFaceImage = async (
    image: string,
    token: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch(image);
      const blob = await response.blob();

      const formData = new FormData();
      formData.append("image", blob, "face-image.jpg");
      formData.append("token", token);

      console.log("Validando imagen de usuario recurrente", blob);

      const responseValidation = await axios.post(
        `${PYTHON_URL}/validation-face/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (responseValidation.status === 200) {
        console.log("Validación de imagen exitosa.");
        return { success: true };
      } else {
        return {
          success: false,
          error: "Error al validar la imagen.",
        };
      }
    } catch (error) {
      let errorMessage = "Error desconocido";
      // Manejo de errores
      if (axios.isAxiosError(error) && error.response) {
        errorMessage = error.response.data as string;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      } else {
        console.error(errorMessage);
      }
      return { success: false, error: errorMessage };
    }
  };

  return { uploadFaceImage, validateFaceImage };
};
