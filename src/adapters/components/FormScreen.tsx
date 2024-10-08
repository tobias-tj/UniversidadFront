import axios from "axios";
import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

const FormScreen: React.FC = () => {
  const location = useLocation();
  const formUrl = location.state?.formUrl || "URL no disponible";
  const createdId = location.state?.createdId;

  useEffect(() => {
    const sendTimeStart = async () => {
      try {
        const response = await axios.patch(
          "http://localhost:3000/api/manageStartTimeExam",
          {
            createdId,
          }
        );
        if (response.status === 200) {
          console.log("Se inicia el tiempo de examen guardado.");
        } else {
          console.error("Error al enviar el faceId");
        }
      } catch (error) {
        console.error("Error al enviar el faceId al backend: ", error);
      }
    };

    if (createdId) {
      sendTimeStart();
    }
  }, [createdId]);

  return (
    <div style={{ width: "100%", height: "100vh", position: "relative" }}>
      {formUrl ? (
        <iframe
          src={formUrl}
          title="Google Form"
          style={{
            width: "100%",
            height: "100%",
            border: "none",
            position: "absolute",
            top: 0,
            left: 0,
          }}
        />
      ) : (
        <p>No se pudo cargar el formulario</p>
      )}
    </div>
  );
};

export default FormScreen;
