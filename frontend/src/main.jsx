import "./global.css";
import Login from "./pages/login/";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Cadastro from "./pages/cadastro";
import RecuperarSenha from "./pages/recuperarSenha";
import ConfirmarCodigo from "./pages/confirmarCodigo";
import NovaSenha from "./pages/novaSenha";
import Home from "./pages/home";
import { ProtectedRoute } from "./route/protectedRoute";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/recuperar-senha" element={<RecuperarSenha />} />
        <Route path="/confirmar-codigo" element={<ConfirmarCodigo />} />
        <Route path="/nova-senha" element={<NovaSenha />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/home" element={<Home />} />\
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
