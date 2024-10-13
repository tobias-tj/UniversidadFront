import React from "react";
import { useLocation } from "react-router-dom";
import useTimeExam from "@/usecases/useTimeExam";

const FormScreen: React.FC = () => {
  const location = useLocation();
  const formUrl = location.state?.formUrl || "";
  const createdId = location.state?.createdId;

  // Usar el hook para manejar el tiempo del examen
  useTimeExam({ createdId, formUrl });

  return (
    <div>
      <p>Iniciando el examen...</p>
    </div>
  );
};

export default FormScreen;
