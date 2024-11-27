import useProtoringExam from "@/usecases/useProtoringExam";
import React from "react";
import { useLocation } from "react-router-dom";

const FormScreen: React.FC = () => {
  const location = useLocation();
  const createdId = location.state?.createdId;
  console.log("createdId en FormScreen = " + createdId);
  // Usar el hook para manejar el tiempo del examen
  useProtoringExam({ createdId });
  return (
    <div>
      <p>Iniciando el examen...</p>
    </div>
  );
};

export default FormScreen;
