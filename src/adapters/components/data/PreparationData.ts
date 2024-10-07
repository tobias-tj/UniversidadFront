// preparationData.ts
import animation1 from "@/assets/lottie/animation1.json";
import animation2 from "@/assets/lottie/animationnew.json";
import animation3 from "@/assets/lottie/animationnew2.json";
import animation4 from "@/assets/lottie/animationnew3.json";

export const PreparationData = [
  {
    id: 1,
    title: "Asegúrate de tener buena iluminación",
    description:
      "Antes de comenzar, verifica que el lugar donde te encuentras esté bien iluminado. Esto ayudará a que el reconocimiento facial sea más efectivo.",
    animation: animation1,
  },
  {
    id: 2,
    title: "Mira directamente a la cámara",
    description:
      "Es importante que mantengas tu mirada enfocada en la cámara. Esto facilitará que el sistema capture una imagen clara de tu rostro.",
    animation: animation2,
  },
  {
    id: 3,
    title: "Mantén tu cara visible durante todo el proceso",
    description:
      "Asegúrate de que tu rostro esté completamente visible en el marco de la cámara. Evita cubrirte la cara o inclinarte demasiado hacia un lado.",
    animation: animation3,
  },
  {
    id: 4,
    title: "Evita movimientos bruscos mientras te capturamos",
    description:
      "Intenta mantenerte lo más quieto posible durante la captura. Los movimientos bruscos pueden dificultar el reconocimiento facial y causar errores.",
    animation: animation4,
  },
];
