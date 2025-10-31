"use client";
import { useState, useEffect } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../services/firebase";
import { useFindInscrito } from "../hooks/useFindInscrito";
import { QRScanner } from "../components/QRScanner";

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-900 to-green-700 p-4">
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md text-center animate-fadeIn">
        <h1 className="text-2xl font-extrabold mb-6 text-green-700">
          Registro de Presença — Ensaio do Grande Coral 🎶
        </h1>

        {modoQR ? (
          <div className="flex flex-col items-center gap-4">
            <QRScanner onScan={handleScan} />
            <button
              onClick={() => setModoQR(false)}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg w-full transition"
            >
              Cancelar
            </button>
          </div>
        ) : (
          <>
            {!inscritoSelecionado && !confirmado && (
              <div className="flex flex-col gap-4">
                <input
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 text-black"
                  placeholder="Digite seu nome ou código"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                />
                <button
                  onClick={() => buscar(input)}
                  disabled={loading}
                  className="w-full bg-green-600 hover:bg-green-500 transition text-white p-3 rounded-lg font-semibold"
                >
                  Buscar
                </button>
                <button
                  onClick={() => setModoQR(true)}
                  className="w-full bg-blue-600 hover:bg-blue-500 transition text-white p-3 rounded-lg font-semibold"
                >
                  Ler QR Code 📷
                </button>
              </div>
            )}

            {loading && <p className="mt-4 text-gray-700">⏳ Procurando...</p>}

            {/* Lista de inscritos */}
            {inscritos.length > 0 && !inscritoSelecionado && (
              <div className="mt-6 space-y-4">
                {inscritos.map((i) => (
                  <div
                    key={i.id}
                    className="bg-green-100 border border-green-300 p-4 rounded-lg shadow cursor-pointer hover:bg-green-200"
                    onClick={() => setInscritoSelecionado(i)}
                  >
                    <p className="text-lg font-bold text-green-800">{i.nome}</p>
                    <p className="text-gray-700 text-sm">
                      Código: <b>{i.codigo}</b>
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Inscrito selecionado */}
            {inscritoSelecionado && !confirmado && (
              <div className="mt-6 bg-green-100 border border-green-300 p-5 rounded-lg shadow text-center">
                <p className="text-xl font-bold text-green-800">
                  {inscritoSelecionado.nome}
                </p>
                <p className="text-gray-700 text-sm mb-4">
                  Código: <b>{inscritoSelecionado.codigo}</b>
                </p>
                <button
                  onClick={marcarPresenca}
                  className="w-full bg-yellow-500 text-black font-bold px-6 py-3 rounded-lg hover:bg-yellow-400 transition"
                >
                  ✅ Confirmar Presença
                </button>
                <button
                  onClick={() => setInscritoSelecionado(null)}
                  className="mt-3 text-red-500 underline"
                >
                  Cancelar
                </button>
              </div>
            )}

            {/* Presença confirmada */}
            {confirmado && (
              <div className="mt-6 flex flex-col items-center gap-4">
                <h2 className="text-green-600 text-xl font-bold animate-bounce">
                  ✅ Presença registrada com sucesso!
                </h2>
                <button
                  onClick={() => {
                    setConfirmado(false);
                    setInput("");
                    setInscritoSelecionado(null);
                    limpar();
                  }}
                  className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold"
                >
                  Registrar Nova Presença
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
