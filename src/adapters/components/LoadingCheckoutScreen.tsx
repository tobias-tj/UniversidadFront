// src/components/LoadingCheckoutScreen.tsx

import React from "react";
import { useLocation } from "react-router-dom";
import Lottie from "react-lottie";
import animation4 from "@/assets/lottie/animationnew3.json";
import useFirstProcess from "@/usecases/useFirstProcess";

const LoadingCheckoutScreen: React.FC = () => {
  const location = useLocation();

  // Obtener el userId de los parámetros de la URL
  const queryParams = new URLSearchParams(location.search);
  const userId = queryParams.get("userId");
  const formId = queryParams.get("formId");
  const formUrl = queryParams.get("formUrl");
  const firstname = queryParams.get("firstname");
  const lastname = queryParams.get("lastname");
  const courseName = queryParams.get("courseName");
  const email = queryParams.get("email");

  const fullname = `${firstname} ${lastname}`.trim();

  console.log("Exam Id:", formId);
  console.log("FormUrl:", formUrl);
  console.log("User Id:", userId);
  console.log("FullName:", fullname);
  console.log("Course Name:", courseName);
  console.log("Email:", email);

  useFirstProcess(userId, formId, formUrl, fullname, courseName, email);

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animation4,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Lottie options={defaultOptions} height={400} width={400} />
      <p className="text-xl font-bold text-center">Cargando...</p>
    </div>
  );
};

export default LoadingCheckoutScreen;
