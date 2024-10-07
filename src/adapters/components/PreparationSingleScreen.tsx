import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Lottie from "react-lottie";

interface PreparationProps {
  preparation: {
    id: number;
    title: string;
    description: string;
    animation: Animation;
  };
  handleContinue: () => void;
  modelsLoaded: boolean;
}

const PreparationSingle: React.FC<PreparationProps> = ({
  preparation,
  handleContinue,
  modelsLoaded,
}) => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: preparation.animation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <div className="w-full h-full p-8 bg-white rounded-lg shadow-lg bg-opacity-80">
      <Card className="h-full border-none">
        <CardHeader>
          <CardTitle className="text-center">{preparation.title}</CardTitle>
        </CardHeader>
        <CardContent className="justify-center flex-grow">
          <p className="text-center text-balance">{preparation.description}</p>
        </CardContent>
        <div className="flex justify-center p-4">
          <Lottie
            options={defaultOptions}
            height={200}
            width={180}
            speed={1.5}
          />
        </div>
        {preparation.id === 4 && (
          <CardFooter className="flex justify-end">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleContinue}
              disabled={!modelsLoaded}
              className="p-2 text-white rounded-lg bg-primary"
            >
              {modelsLoaded ? "Continuar" : "Cargando modelos..."}
            </motion.button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
};

export default PreparationSingle;
