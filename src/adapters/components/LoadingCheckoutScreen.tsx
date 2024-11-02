import React from "react";
import { useLocation } from "react-router-dom";
import Lottie from "react-lottie";
import animationloading from "@/assets/lottie/animationloading.json";
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

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationloading,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  useFirstProcess(userId, formId, formUrl, fullname, courseName, email);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-200">
      <div className="flex flex-col items-center justify-center mb-20 sm:mb-32 lg:mb-32">
        {/* Aumenta el margen inferior aquí */}
        <Lottie options={defaultOptions} height={300} width={300} />
        <p className="text-2xl font-bold mt-4 mb-8 animate-pulse text-[#f98012]">
          Cargando, por favor espera...
        </p>
      </div>

      <div className="absolute transform -translate-x-1/2 bottom-20 left-1/2 sm:mt-6 lg:mt-6">
        <div className="max-w-xs w-full p-4 bg-[#f98012] bg-opacity-70 rounded-xl shadow-md text-lg font-medium text-white relative">
          Buena suerte en tu examen, ¡tú puedes lograrlo!
          <div className="absolute w-4 h-4 transform rotate-45 -translate-x-1/2 bg-[#f98012] -bottom-2 left-1/2 bg-opacity-70"></div>
        </div>
      </div>

      <div className="absolute font-semibold opacity-50 bottom-8">
        <span>Power By YvagaCore</span>
      </div>
    </div>
  );
};

export default LoadingCheckoutScreen;
