"use client";
import LandingPage from "../components/LandingPage";

// Acesso direto (link divulgável) que abre a inscrição do Jogral
// automaticamente ao carregar — útil para compartilhar o link do Jogral
// separadamente pelo WhatsApp.
export default function JogralPage() {
  return <LandingPage autoOpen="jogral" />;
}
