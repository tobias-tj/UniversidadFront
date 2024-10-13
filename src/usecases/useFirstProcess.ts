import { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const useFirstProcess = (
  userId: string | null,
  formId: string | null,
  formUrl: string | null,
  fullname: string | null,
  courseName: string | null,
  email: string | null
) => {
  const navigate = useNavigate();

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

          setTimeout(() => {
            if (!response.data.isExist) {
              console.log("Inicia proceso para usuario Nuevo. (Tutorial)");
              navigate("/preparation", {
                state: { userId, formId, formUrl, fullname, courseName, email },
              });
            } else {
              console.log(
                "Inicia proceso para usuario registrado. (Checkout FaceId)"
              );
              navigate("/capture-face", { state: { userId, formId, formUrl } });
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
  }, [userId, formId, formUrl, navigate]);
};

export default useFirstProcess;
