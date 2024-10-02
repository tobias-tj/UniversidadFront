import React, { useEffect, useRef, useState } from "react";
import {
  captureFace,
  keepCameraActive,
  startCamera,
} from "../../usecases/students/faceRecognition";
import { Student } from "../../domain/models/Student";
import { handleCapture } from "../../usecases/students/handleCapture";
import { getStudentDetails } from "../../infrastructure/api/studentApi";

interface CaptureFaceProps {
  onCapture: (faceId: string) => void;
}

const CaptureFace: React.FC<CaptureFaceProps> = ({ onCapture }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [faceId, setFaceId] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formUrl, setFormUrl] = useState<string | null>(null);

  useEffect(() => {
    const initialize = async () => {
      if (videoRef.current) {
        // Iniciar la cámara y mostrarla inicialmente
        await startCamera(videoRef.current);
      }
    };
    initialize();
  }, []);

  const capturaCara = async () => {
    setIsCapturing(true);
    // Espera hasta que se genere un FaceId válido
    if (videoRef.current) {
      const generatedFaceId = await captureFace(
        videoRef.current
        //canvasRef.current
      );

      if (generatedFaceId) {
        setFaceId(generatedFaceId);
        // Ahora obtén los detalles del estudiante basados en el faceId
        const estudianteDetails = await getStudentDetails(generatedFaceId);
        console.log("Detalles del estudiante: ", estudianteDetails);
        console.log("FaceId generado: ", generatedFaceId);
        // Asegúrate de que estudianteDetails tenga los datos que necesitas
        const estudiante: Student = {
          name: estudianteDetails.name, // Usa el nombre obtenido
          faceId: generatedFaceId, // El faceId recién generado
          formUrl: estudianteDetails.formUrl, // Usa el formUrl obtenido
        };

        const url = await handleCapture(estudiante);
        setFormUrl(url);
        setShowForm(true);
        setIsCapturing(false);
        onCapture(generatedFaceId);

        // Una vez capturado el faceId, mantiene la cámara activa en segundo plano
        keepCameraActive(videoRef.current);
      }
    }
  };

  const handlePlay = () => {
    capturaCara(); // Inicia la captura sin dibujar la máscara
  };

  return (
    <div>
      <video
        ref={videoRef}
        autoPlay
        muted
        width="720"
        height="560"
        id="inputVideo"
        onPlay={handlePlay}
        style={{ zIndex: 1, display: showForm ? "none" : "block" }}
      />
      {isCapturing && (
        <div
          style={{
            position: "absolute",
            top: 10,
            left: 10,
            color: "red",
            zIndex: 3,
            background: "rgba(0, 0, 0, 0.5)",
            padding: "5px 10px",
            borderRadius: "5px",
          }}
        >
          Grabando tu rostro, por favor quédate quieto...
        </div>
      )}
      {showForm && formUrl && (
        <iframe
          src={formUrl}
          title="Google Forms"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 3,
            padding: "20px",
            borderRadius: "10px",
            width: "100%",
            height: "100%",
          }}
        />
      )}
    </div>
  );
};

export default CaptureFace;
