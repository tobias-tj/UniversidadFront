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
