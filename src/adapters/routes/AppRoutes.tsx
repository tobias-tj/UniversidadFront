import React from "react";
import { Route, Routes } from "react-router-dom";
import PreparationScreen from "../components/PreparationScreen";
import CaptureFace from "../components/CaptureFace";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<PreparationScreen />}></Route>
      <Route
        path="/capture-face"
        element={<CaptureFace onCapture={() => {}} />}
      ></Route>
    </Routes>
  );
}
