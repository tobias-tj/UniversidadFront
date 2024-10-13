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

  return { uploadFaceImage };
};
