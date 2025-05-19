import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;
const PYTHON_URL = import.meta.env.VITE_API_PYTHON_URL;

export const sendStartTime = async (
  createdId: string,
  token: string | null
) => {
  return await axios.patch(`${BASE_URL}/manageStartTimeExam`, {
    createdId,
    token,
  });
};

export const sendFinishTime = async (
  createdId: string,
  token: string | null
) => {
  return await axios.patch(`${BASE_URL}/manageFinishTimeExam`, {
    createdId,
    token,
  });
};

export const captureImages = async (
  createdId: string,
  token: string | null
) => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    const video = document.createElement("video");
    video.srcObject = stream;
    await new Promise((resolve) => (video.onloadedmetadata = resolve));
    video.play();

    const captures = [];
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    for (let i = 0; i < 10; i++) {
      context!.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL("image/jpeg");
      captures.push(dataUrl);
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    video.pause();
    stream.getTracks().forEach((track) => track.stop());

    await axios.post(`${PYTHON_URL}/proctoring-exam/`, {
      createdId,
      images: captures,
      token,
    });

    console.log("📷 Capturas enviadas al backend.");
  } catch (error) {
    console.error("❌ Error al capturar o enviar imágenes:", error);
  }
};
