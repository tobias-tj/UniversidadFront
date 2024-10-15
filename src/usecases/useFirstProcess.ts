import { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useExamUser } from "./useExamUser";

const useFirstProcess = (
  userId: string | null,
  formId: string | null,
  formUrl: string | null,
  fullname: string | null,
  courseName: string | null,
  email: string | null
) => {
  const navigate = useNavigate();
  const { firstProcess } = useExamUser(); // Traer lógica de sincronización

  useEffect(() => {
    const sendUserIdToBackend = async () => {
      if (!userId) return;

      try {
        const response = await axios.get(
          "http://localhost:3000/api/accessCheckout",
          {
            params: { userId },
          }
        );

        if (response.status === 200) {
          console.log("UserId enviado al backend correctamente");
          console.log(response.data);

          const createdId = await firstProcess(
            Number(formId),
            Number(userId),
            fullname!,
            courseName!,
            email!
          );

          setTimeout(async () => {
            if (!response.data.isExist) {
              console.log("Inicia proceso para usuario Nuevo. (Tutorial)");
              if (createdId) {
                console.log("El proceso de sincronizacion con exito");
                navigate("/preparation", {
                  state: {
                    createdId,
                    userId,
                    formId,
                    formUrl,
                    fullname,
                    courseName,
                    email,
                  },
                });
              }
            } else {
              if (createdId) {
                console.log("El proceso de sincronizacion con exito");
                navigate("/capture-face", {
                  state: {
                    createdId,
                    userId,
                    formId,
                    formUrl,
                    isNewUser: false,
                  },
                });
              }
            }
          }, 2000);
        } else {
          console.error("Error al enviar el userId");
        }
      } catch (error) {
        console.error("Error al enviar el userId al backend: ", error);
      }
    };

    sendUserIdToBackend();
  }, [
    userId,
    formId,
    formUrl,
    navigate,
    firstProcess,
    fullname,
    courseName,
    email,
  ]);
};

export default useFirstProcess;
