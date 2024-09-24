/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line no-var
declare var faceapi: any;

const MODEL_URL = "/models";

export async function initializefaceapi() {
  try {
    // Cargamos los modelos necesarios
    await faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL);
    console.log("ssdMobilenetv1 cargado correctamente.");

    await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
    console.log("faceLandmark68Net cargado correctamente.");

    await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
    console.log("faceRecognitionNet cargado correctamente.");

    console.log(
      "Todos los modelos de FaceAPI han sido cargados correctamente."
    );
  } catch (error) {
    console.error("Error al cargar los modelos de FaceAPI: ", error);
  }
}

export async function startCamera(video: HTMLVideoElement) {
  try {
    // Solicitar acceso a la cámara
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;

    // Esperar a que el video esté listo para reproducirse
    await new Promise((resolve) => (video.onloadedmetadata = resolve));
  } catch (error) {
    console.error("Error al acceder a la cámara:", error);
  }
}

export async function captureFace(video: HTMLVideoElement) {
  // Debes usar 'withFaceLandmarks' y 'withFaceDescriptors' juntos
  const fullFaceDescription = await faceapi
    .detectAllFaces(video)
    .withFaceLandmarks() // Incluyendo las marcas faciales
    .withFaceDescriptors(); // Ahora esto debería funcionar

  if (fullFaceDescription.length > 0) {
    const faceDescriptors = fullFaceDescription.map((fd: any) => fd.descriptor);
    const faceId = await generateFaceId(faceDescriptors[0]);
    console.log("FaceID registrado:", faceId);
    return faceId;
  }
  return null;
}

async function generateFaceId(descriptor: Float32Array) {
  const msgUint8 = new TextEncoder().encode(descriptor.join("-"));
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return hashHex;
}

export function keepCameraActive(video: HTMLVideoElement) {
  // Ocultar el video para mantener la cámara activa en segundo plano
  video.style.display = "none"; // Oculta el video del DOM

  // Mantener la detección en segundo plano sin mostrar la imagen
  setInterval(async () => {
    const fullFaceDescription = await faceapi
      .detectAllFaces(video)
      .withFaceLandmarks()
      .withFaceDescriptors();

    if (fullFaceDescription.length > 0) {
      const faceDescriptors = fullFaceDescription.map(
        (fd: any) => fd.descriptor
      );
      const faceId = await generateFaceId(faceDescriptors[0]);
      console.log("FaceID detectado en segundo plano:", faceId);
    }
  }, 5000); // Intervalo de detección cada 5 segundos
}
