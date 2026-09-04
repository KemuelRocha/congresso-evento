"use client";
import LandingPage from "../components/LandingPage";

// Acesso direto (link divulgável) que abre a inscrição do Vestibular Bíblico
// automaticamente ao carregar — útil enquanto as inscrições do Grande Coral
// estiverem fechadas e só o Vestibular estiver aberto.
export default function VestibularPage() {
  return <LandingPage autoOpen="vestibular" />;
}
