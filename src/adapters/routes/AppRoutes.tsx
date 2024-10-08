import { Route, Routes } from "react-router-dom";
import PreparationScreen from "../components/PreparationScreen";
import CaptureFace from "../components/CaptureFace";
import LoadingScreen from "../components/LoadingScreen";
import FormScreen from "../components/FormScreen";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<PreparationScreen />}></Route>
      <Route path="/capture-face" element={<CaptureFace />}></Route>
      <Route path="/loading" element={<LoadingScreen />}></Route>
      <Route path="/form" element={<FormScreen />}></Route>
    </Routes>
  );
}
