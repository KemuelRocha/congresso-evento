"use client";
import { useState, useEffect } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../services/firebase";
import { useFindInscrito } from "../hooks/useFindInscrito";
import { QRScanner } from "../components/QRScanner";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";

export default function PresencaPage() {
  const [input, setInput] = useState("");
  const [inscritoSelecionado, setInscritoSelecionado] = useState<any>(null);
  const [confirmado, setConfirmado] = useState(false);
  const [modoQR, setModoQR] = useState(false);

  const { inscritos, buscar, loading, limpar } = useFindInscrito();

  async function marcarPresenca() {
    if (!inscritoSelecionado) return;

    const hoje = new Date().toISOString().split("T")[0];
    const ref = doc(db, "inscricoes", inscritoSelecionado.id);

    await updateDoc(ref, {
      [`presencas.${hoje}`]: true,
    });

    setConfirmado(true);
  }

  // ✅ Reset automático após 5 segundos
  useEffect(() => {
    if (confirmado) {
      const timer = setTimeout(() => {
        setConfirmado(false);
        setInput("");
        setInscritoSelecionado(null);
        limpar();
      }, 5000); // 5 segundos
      return () => clearTimeout(timer);
    }
  }, [confirmado, limpar]);

  function handleScan(value: string) {
    buscar(value);
    setModoQR(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primary-900 to-primary-700 p-4">
      <Card shadow="elevated" className="w-full max-w-md text-center animate-fadeIn">
        <h1 className="font-display text-2xl font-extrabold mb-6 text-primary-700">
          Registro de Presença — Ensaio do Grande Coral 🎶
        </h1>

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
                  onChange={(e) => setInput(e.target.value)}
                />
                <Button
                  variant="primary"
                  fullWidth
                  onClick={() => buscar(input)}
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

            {/* Lista de inscritos */}
            {inscritos.length > 0 && !inscritoSelecionado && (
              <div className="mt-6 space-y-4">
                {inscritos.map((i) => (
                  <div
                    key={i.id}
                    className="bg-primary-100 border border-primary-300 p-4 rounded-lg shadow-card cursor-pointer hover:bg-primary-200"
                    onClick={() => setInscritoSelecionado(i)}
                  >
                    <p className="text-lg font-bold text-primary-800">
                      {i.nome}
                    </p>
                    <p className="text-neutral-700 text-sm">
                      Código: <b>{i.codigo}</b>
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Inscrito selecionado */}
            {inscritoSelecionado && !confirmado && (
              <div className="mt-6 bg-primary-100 border border-primary-300 p-5 rounded-lg shadow-card text-center">
                <p className="text-xl font-bold text-primary-800">
                  {inscritoSelecionado.nome}
                </p>
                <p className="text-neutral-700 text-sm mb-4">
                  Código: <b>{inscritoSelecionado.codigo}</b>
                </p>
                <Button variant="accent" fullWidth onClick={marcarPresenca}>
                  ✅ Confirmar Presença
                </Button>
                <button
                  onClick={() => setInscritoSelecionado(null)}
                  className="mt-3 text-error underline cursor-pointer"
                >
                  Cancelar
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
