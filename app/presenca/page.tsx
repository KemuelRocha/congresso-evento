"use client";
import { useState, useEffect } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../services/firebase";
import { useFindInscrito } from "../hooks/useFindInscrito";
import { QRScanner } from "../components/QRScanner";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { dataLocalISO } from "../utils/datas";
import { ChevronRight } from "lucide-react";

const ETAPAS = ["Buscar", "Escolher", "Confirmar"];

// Indicador de etapas do registro de presença
function Etapas({ atual }: { atual: number }) {
  return (
    <ol className="mb-6 flex items-center justify-center gap-2 text-xs font-medium">
      {ETAPAS.map((nome, idx) => {
        const n = idx + 1;
        const feita = n < atual;
        const ativa = n === atual;
        return (
          <li key={nome} className="flex items-center gap-2">
            <span
              className={[
                "flex h-6 w-6 items-center justify-center rounded-full",
                ativa
                  ? "bg-primary-600 text-white"
                  : feita
                  ? "bg-primary-100 text-primary-700"
                  : "bg-neutral-200 text-neutral-500",
              ].join(" ")}
            >
              {feita ? "✓" : n}
            </span>
            <span className={ativa ? "text-primary-700" : "text-neutral-500"}>
              {nome}
            </span>
            {n < ETAPAS.length && <span className="h-px w-4 bg-neutral-300" />}
          </li>
        );
      })}
    </ol>
  );
}

export default function PresencaPage() {
  const [input, setInput] = useState("");
  const [inscritoSelecionado, setInscritoSelecionado] = useState<any>(null);
  const [confirmado, setConfirmado] = useState(false);
  const [modoQR, setModoQR] = useState(false);
  const [buscado, setBuscado] = useState(false);
  const [salvando, setSalvando] = useState(false);

  const { inscritos, buscar, loading, limpar } = useFindInscrito();

  const etapa = confirmado ? 4 : inscritoSelecionado ? 3 : inscritos.length > 0 ? 2 : 1;

  function pesquisar(valor: string) {
    setBuscado(valor.trim() !== "");
    buscar(valor);
  }

  async function marcarPresenca() {
    if (!inscritoSelecionado) return;

    const hoje = dataLocalISO();
    const ref = doc(db, "inscricoes", inscritoSelecionado.id);

    setSalvando(true);
    try {
      await updateDoc(ref, {
        [`presencas.${hoje}`]: true,
      });
      setConfirmado(true);
    } finally {
      setSalvando(false);
    }
  }

  // ✅ Reset automático após 5 segundos
  useEffect(() => {
    if (confirmado) {
      const timer = setTimeout(() => {
        setConfirmado(false);
        setInput("");
        setInscritoSelecionado(null);
        setBuscado(false);
        limpar();
      }, 5000); // 5 segundos
      return () => clearTimeout(timer);
    }
  }, [confirmado, limpar]);

  function handleScan(value: string) {
    pesquisar(value);
    setModoQR(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primary-900 to-primary-700 p-4">
      <Card shadow="elevated" className="w-full max-w-md text-center animate-fadeIn">
        <h1 className="font-display text-2xl font-extrabold mb-4 text-primary-700">
          Registro de Presença — Ensaio do Grande Coral 🎶
        </h1>

        <Etapas atual={etapa} />
        {modoQR ? (
          <div className="flex flex-col items-center gap-4">
            <QRScanner onScan={handleScan} />
            <Button variant="danger" fullWidth onClick={() => setModoQR(false)}>
              Cancelar
            </Button>
          </div>
        ) : (
          <>
            {!inscritoSelecionado && !confirmado && (
              <div className="flex flex-col gap-4">
                <Input
                  placeholder="Digite seu nome ou código"
                  value={input}
                  onChange={(e) => {
                    setInput(e.target.value);
                    setBuscado(false);
                  }}
                />
                <Button
                  variant="primary"
                  fullWidth
                  onClick={() => pesquisar(input)}
                  disabled={loading}
                >
                  Buscar
                </Button>
                <Button
                  variant="secondary"
                  fullWidth
                  onClick={() => setModoQR(true)}
                >
                  Ler QR Code 📷
                </Button>
              </div>
            )}

            {loading && (
              <p className="mt-4 text-neutral-700">⏳ Procurando...</p>
            )}

            {/* Nenhum inscrito encontrado */}
            {buscado && !loading && inscritos.length === 0 && !inscritoSelecionado && !confirmado && (
              <div className="mt-6 rounded-lg border border-accent-300 bg-accent-50 p-4 text-left">
                <p className="font-bold text-accent-800">
                  Não encontramos sua inscrição.
                </p>
                <p className="mt-1 text-sm text-neutral-700">
                  Confira o nome ou o código digitado. Se ainda assim não
                  aparecer, procure a organização do ensaio.
                </p>
              </div>
            )}

            {/* Lista de inscritos */}
            {inscritos.length > 0 && !inscritoSelecionado && (
              <div className="mt-6">
                <div className="mb-4 rounded-lg bg-primary-50 p-3">
                  <p className="font-bold text-primary-800">
                    👇 Toque no card com o seu nome
                  </p>
                  <p className="text-sm text-neutral-700">
                    {inscritos.length === 1
                      ? "Encontramos 1 inscrição."
                      : `Encontramos ${inscritos.length} inscrições. Escolha a sua.`}{" "}
                    Depois é só confirmar a presença.
                  </p>
                </div>
                <div className="space-y-3">
                  {inscritos.map((i) => (
                    <button
                      key={i.id}
                      type="button"
                      onClick={() => setInscritoSelecionado(i)}
                      className="flex w-full cursor-pointer items-center gap-3 rounded-lg border-2 border-primary-300 bg-white p-4 text-left shadow-card transition-all hover:border-primary-500 hover:bg-primary-50 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-500/30"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="text-lg font-bold text-primary-800">
                          {i.nome}
                        </p>
                        <p className="text-sm text-neutral-700">
                          Código: <b>{i.codigo}</b>
                        </p>
                        {(i.area || i.congregacao) && (
                          <p className="text-sm text-neutral-500">
                            {i.area ? `Área ${i.area}` : ""}
                            {i.area && i.congregacao ? " · " : ""}
                            {i.congregacao ?? ""}
                          </p>
                        )}
                      </div>
                      <span className="flex shrink-0 items-center gap-1 text-sm font-semibold text-primary-600">
                        Sou eu
                        <ChevronRight className="h-5 w-5" aria-hidden />
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Inscrito selecionado */}
            {inscritoSelecionado && !confirmado && (
              <div className="mt-2 text-center">
                <p className="mb-4 font-bold text-primary-800">
                  Confira seus dados e toque em “Confirmar presença”
                </p>
                <div className="mb-4 rounded-lg border border-primary-300 bg-primary-100 p-5 shadow-card">
                  <p className="text-xl font-bold text-primary-800">
                    {inscritoSelecionado.nome}
                  </p>
                  <p className="text-sm text-neutral-700">
                    Código: <b>{inscritoSelecionado.codigo}</b>
                  </p>
                  {(inscritoSelecionado.area || inscritoSelecionado.congregacao) && (
                    <p className="text-sm text-neutral-500">
                      {inscritoSelecionado.area ? `Área ${inscritoSelecionado.area}` : ""}
                      {inscritoSelecionado.area && inscritoSelecionado.congregacao ? " · " : ""}
                      {inscritoSelecionado.congregacao ?? ""}
                    </p>
                  )}
                </div>
                <p className="mb-3 text-sm text-neutral-600">
                  ⚠️ Sua presença só é registrada depois de confirmar.
                </p>
                <Button
                  variant="accent"
                  fullWidth
                  onClick={marcarPresenca}
                  disabled={salvando}
                >
                  {salvando ? "⏳ Registrando..." : "✅ Confirmar presença"}
                </Button>
                <button
                  onClick={() => setInscritoSelecionado(null)}
                  disabled={salvando}
                  className="mt-3 cursor-pointer text-sm text-neutral-600 underline"
                >
                  Não sou eu, voltar para a lista
                </button>
              </div>
            )}

            {/* Presença confirmada */}
            {confirmado && (
              <div className="mt-6 flex flex-col items-center gap-4">
                <h2 className="text-primary-600 text-xl font-bold animate-bounce">
                  ✅ Presença registrada com sucesso!
                </h2>
                <Button
                  variant="secondary"
                  onClick={() => {
                    setConfirmado(false);
                    setInput("");
                    setInscritoSelecionado(null);
                    setBuscado(false);
                    limpar();
                  }}
                >
                  Registrar Nova Presença
                </Button>
              </div>
            )}
          </>
        )}
      </Card>
    </div>
  );
}
