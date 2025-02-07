import { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useExamUser } from "./useExamUser";

const BASE_URL = import.meta.env.VITE_API_URL;

const useFirstProcess = () =>
  // token: string | null
  // userId: string | null,
  // formId: string | null,
  // formUrl: string | null,
  // fullname: string | null,
  // courseName: string | null,
  // email: string | null
  {
    const navigate = useNavigate();
    const { firstProcess } = useExamUser(); // Traer lógica de sincronización

    const token = localStorage.getItem("Token");

    useEffect(() => {
      const sendUserIdToBackend = async () => {
        if (!token) return;

        try {
          const response = await axios.get(`${BASE_URL}/accessCheckout`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.status === 200) {
            console.log("UserId enviado al backend correctamente");
            console.log(response.data);

            const createdId = await firstProcess();

            setTimeout(async () => {
              if (!response.data.isExist) {
                console.log("Inicia proceso para usuario Nuevo. (Tutorial)");
                if (createdId) {
                  console.log("El proceso de sincronizacion con exito");
                  navigate("/tutorial-app", {
                    state: {
                      createdId,
                      urlString: "/preparation",
                    },
                  });
                }
              } else {
                if (createdId) {
                  console.log("Inicia proceso para usuario recurrente.");
                  console.log("El proceso de sincronizacion con exito");
                  navigate("/capture-face", {
                    state: {
                      createdId,
                      token,
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
    }, [navigate, firstProcess, token]);
  };

export default useFirstProcess;
