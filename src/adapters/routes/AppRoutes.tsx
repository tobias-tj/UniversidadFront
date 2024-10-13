import { Route, Routes } from "react-router-dom";
import PreparationScreen from "../components/PreparationScreen";
import CaptureFace from "../components/CaptureFace";
import FormScreen from "../components/FormScreen";
import LoadingCheckoutScreen from "../components/LoadingCheckoutScreen";

export default function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/loading-checkout"
        element={<LoadingCheckoutScreen />}
      ></Route>
      <Route path="/preparation" element={<PreparationScreen />}></Route>
      <Route path="/capture-face" element={<CaptureFace />}></Route>
      <Route path="/form" element={<FormScreen />}></Route>
    </Routes>
  );
}
