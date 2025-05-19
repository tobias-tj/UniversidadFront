import { useEffect, useCallback, useState } from "react";
import { useReportApi } from "./useReportApi";
import { useToast } from "@/hooks/use-toast";
import { useCloseExam } from "./useExamClose";
import {
  sendStartTime,
  sendFinishTime,
  captureImages,
} from "./helpers/examUtils";

interface useProtoringExamProps {
  createdId: string | undefined;
  proctorType: number | undefined;
}

const useProtoringExam = ({
  createdId,
  proctorType,
}: useProtoringExamProps) => {
  const token = localStorage.getItem("Token-Security");
  const attempt = localStorage.getItem("attempt");
  const quizId = localStorage.getItem("quizId");
  const cmid = localStorage.getItem("cmid");
  const moddleUrl = localStorage.getItem("moddleUrl");

  const { sendReport } = useReportApi();
  const { toast } = useToast();
  const [exitCount, setExitCount] = useState(0);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [isExamFinished, setIsExamFinished] = useState(false);
  const [examWindow, setExamWindow] = useState<Window | null>(null);

  const handleStartExam = useCallback(async () => {
    if (!createdId || isExamFinished) return;

    toast({
      variant: "default",
      title: "Iniciando el Examen",
      description:
        "Se utilizará tu cámara y se controlará tu pantalla para garantizar la validez del examen.",
      duration: 4000,
    });

    try {
      const response = await sendStartTime(createdId, token);
      const newWindow = window.open(
        response.data.formUrl,
        "_blank",
        "width=800,height=600"
      );

      if (!newWindow) throw new Error("No se pudo abrir la ventana emergente.");

      setExamWindow(newWindow);

      const examInterval = setInterval(() => {
        if (newWindow.closed && !isExamFinished) {
          setIsExamFinished(true);
          sendFinishTime(createdId, token);
          clearInterval(examInterval);
        }
      }, 1000);

      if (proctorType !== 2) {
        const captureInterval = setInterval(() => {
          if (!isExamFinished) captureImages(createdId, token);
        }, 15000);

        return () => clearInterval(captureInterval);
      }
    } catch (err) {
      console.error("❌ Error al iniciar el examen:", err);
    }
  }, [createdId, token, proctorType, isExamFinished]);

  const handleVisibilityChange = useCallback(async () => {
    if (document.hidden && createdId && !isExamFinished && proctorType !== 2) {
      const updatedCount = exitCount + 1;
      setExitCount(updatedCount);

      if (updatedCount < 3) {
        toast({
          variant: "default",
          title: `Advertencia ${updatedCount}/2`,
          description: "No debes salir del examen.",
        });
        await sendReport(createdId);
      } else {
        toast({
          variant: "destructive",
          title: "Examen Cancelado",
          description: "Has salido demasiadas veces del examen.",
        });
        setIsExamFinished(true);
        setIsRedirecting(true);

        if (examWindow && !examWindow.closed) {
          examWindow.close();
          // eslint-disable-next-line react-hooks/rules-of-hooks
          useCloseExam(Number(quizId), Number(attempt), Number(cmid));
        }

        await new Promise((res) => setTimeout(res, 2000));
        window.location.href = `${moddleUrl}`;
      }
    }
  }, [createdId, examWindow, exitCount, toast, isExamFinished]);

  const handleMessage = useCallback(
    async (event: MessageEvent) => {
      if (
        event.origin === `${moddleUrl}` &&
        event.data === "exam-finished" &&
        !isExamFinished
      ) {
        examWindow?.close();
        setIsExamFinished(true);
        setIsRedirecting(true);
        await new Promise((res) => setTimeout(res, 2000));
        window.location.href = `${moddleUrl}`;
      }
    },
    [moddleUrl, examWindow, isExamFinished]
  );

  useEffect(() => {
    if (createdId && !isExamFinished) handleStartExam();
  }, [handleStartExam]);

  useEffect(() => {
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("message", handleMessage);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("message", handleMessage);
    };
  }, [handleVisibilityChange, handleMessage]);

  return { isRedirecting, isExamFinished };
};

export default useProtoringExam;
