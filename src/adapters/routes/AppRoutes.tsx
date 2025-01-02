import { Route, Routes } from "react-router-dom";
import PreparationScreen from "../components/PreparationScreen";
import CaptureFace from "../components/CaptureFace";
import FormScreen from "../components/FormScreen";
import LoadingCheckoutScreen from "../components/LoadingCheckoutScreen";
import TutorialApp from "../components/TutorialApp";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LoadingCheckoutScreen />}></Route>
      <Route
        path="/loading-checkout"
        element={<LoadingCheckoutScreen />}
      ></Route>
      <Route path="/preparation" element={<PreparationScreen />}></Route>
      <Route path="/capture-face" element={<CaptureFace />}></Route>
      <Route path="/form" element={<FormScreen />}></Route>
      <Route path="/tutorial-app" element={<TutorialApp />}></Route>
    </Routes>
  );
}
