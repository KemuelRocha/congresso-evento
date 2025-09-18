"use client";

import { useState } from "react";
import { areas } from "../mock/areas.mock";
import { Modal } from "./ui/Modal";
import { salvarVestibular } from "../services/salvarVestibular";
import { ConfirmacaoInscricao } from "./ConfirmacaoInscricao";

export default function RegisterVestibularModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [step, setStep] = useState<"form" | "pagamento" | "confirmacao">(
    "form"
  );
  const [comprovante, setComprovante] = useState<File | null>(null);

  const [nome, setNome] = useState("");
  const [idade, setIdade] = useState<number | null>(null);
  const [whatsapp, setWhatsapp] = useState("");
  const [area, setArea] = useState<number | null>(null);
  const [congregacao, setCongregacao] = useState<string>("");
  const [cartaoMembro, setCartaoMembro] = useState("");

  const [confirmation, setConfirmation] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [copiado, setCopiado] = useState(false);

  const congregacoes = area ? areas[area]?.congregacoes || [] : [];

  const dataLimite = new Date("2025-10-20T23:59:59");
  const hoje = new Date();
  const inscricoesEncerradas = hoje > dataLimite;

  const isValidForm = (() => {
    if (!nome.trim()) return false;
    if (idade === null || idade < 17) return false;
    if (!whatsapp.trim()) return false;
    if (area === null) return false;
    if (!congregacao) return false;
    if (!cartaoMembro.trim()) return false;
    return true;
  })();

  async function handleUpload(file: File) {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (data.success) return data.result.secure_url;
    else throw new Error(data.error || "Erro no upload");
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidForm) {
      alert("Preencha todos os campos corretamente.");
      return;
    }
    setStep("pagamento");
  };

  const handlePagamentoSubmit = async () => {
    if (loading) return; // evita clique duplo
    if (!comprovante) {
      alert("Por favor, envie o comprovante do PIX.");
      return;
    }

    setLoading(true);

    try {
      const urlComprovante = await handleUpload(comprovante);

      const formData = {
        nome,
        idade,
        whatsapp,
        area,
        congregacao,
        cartaoMembro,
        comprovante: urlComprovante,
      };

      const { success, codigo, error } = await salvarVestibular(formData);

      if (success && codigo) {
        setConfirmation(codigo);
        // Reset
        setNome("");
        setIdade(null);
        setWhatsapp("");
        setArea(null);
        setCongregacao("");
        setCartaoMembro("");
        setComprovante(null);
        setStep("confirmacao");
      } else {
        alert(error || "Erro ao enviar inscrição.");
      }
    } catch (err) {
      console.error(err);
      alert("Falha ao enviar comprovante.");
    } finally {
      setLoading(false);
    }
  };

  if (inscricoesEncerradas) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Inscrições Encerradas">
        <div className="text-center p-6">
          <p className="text-lg font-semibold text-red-600">
            As inscrições para o Vestibular Bíblico foram encerradas em{" "}
            <strong>20/10/2025</strong>.
          </p>
        </div>
      </Modal>
    );
  }

  if (step === "confirmacao" && confirmation) {
    return (
      <ConfirmacaoInscricao
        codigo={confirmation}
        onClose={() => {
          setConfirmation(null);
          setStep("form");
          onClose();
        }}
        isVestibular
      />
    );
  }

  if (step === "pagamento") {
    const pixNumber = "(87) 98833-7969"; // número do PIX
    const valor = "R$ 5,00"; // valor do pagamento

    return (
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="Pagamento do Vestibular Bíblico"
      >
        <div className="space-y-4">
          <p className="text-center">
            Faça o pagamento via Pix usando a chave:
          </p>

          {/* Valor a pagar */}
          <p className="text-center font-semibold">
            Valor do pagamento: {valor}
          </p>

          <div className="flex flex-col items-center gap-2">
            <div className="flex justify-center items-center gap-2">
              <strong className="text-lg">{pixNumber}</strong>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(pixNumber);
                  setCopiado(true);
                  setTimeout(() => setCopiado(false), 2000); // some após 2s
                }}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-2 py-1 rounded cursor-pointer"
              >
                Copiar
              </button>
            </div>
            {copiado && (
              <span className="text-green-600 text-sm">Número copiado!</span>
            )}
          </div>

          <div className="flex justify-center">
            <img
              src="/assets/pix.jpg"
              alt="QR Code Pix"
              className="w-48 h-48"
            />
          </div>

          <div>
            <label className="block font-medium">Comprovante do PIX</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setComprovante(e.target.files?.[0] || null)}
              className="w-full rounded-md border p-2"
            />
          </div>

          <button
            onClick={handlePagamentoSubmit}
            disabled={!comprovante || loading}
            className="w-full rounded-md bg-purple-600 text-white p-2 disabled:bg-gray-400"
          >
            {loading
              ? "Enviando..."
              : "Enviar Comprovante e Finalizar Inscrição"}
          </button>
        </div>
      </Modal>
    );
  }

  // Step = "form"
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Inscrição - Vestibular Bíblico"
    >
      <form className="space-y-4" onSubmit={handleFormSubmit}>
        {/* Área */}
        <div>
          <label className="block font-medium">Área</label>
          <select
            value={area || ""}
            onChange={(e) => {
              const novaArea = Number(e.target.value);
              setArea(novaArea);
              const congPadrao = areas[novaArea]?.congregacoes?.[0] || "";
              setCongregacao(congPadrao);
            }}
            className="w-full rounded-md border p-2"
          >
            <option value="">Selecione</option>
            {Array.from({ length: 20 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                Área {i + 1}
              </option>
            ))}
          </select>
        </div>

        {/* Congregação */}
        {area && congregacoes.length > 0 && (
          <div>
            <label className="block font-medium">Congregação</label>
            <select
              value={congregacao}
              onChange={(e) => setCongregacao(e.target.value)}
              className="w-full rounded-md border p-2"
            >
              {congregacoes.map((c, i) => (
                <option key={i} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Nome */}
        <div>
          <label className="block font-medium">Nome Completo</label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="w-full rounded-md border p-2"
          />
        </div>

        {/* Data de Nascimento */}
        <div>
          <label className="block font-medium">Data de Nascimento</label>
          <input
            type="date"
            required
            className="w-full rounded-md border p-2"
            onChange={(e) => {
              const birthDate = new Date(e.target.value);
              const today = new Date();
              let age = today.getFullYear() - birthDate.getFullYear();
              const m = today.getMonth() - birthDate.getMonth();
              if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate()))
                age--;
              setIdade(age);
            }}
          />
          {idade !== null && idade < 17 && (
            <p className="text-red-500 text-sm">Idade mínima: 17 anos</p>
          )}
        </div>

        {/* Cartão de Membro */}
        <div>
          <label className="block font-medium">
            Número do Cartão de Membro
          </label>
          <input
            type="text"
            value={cartaoMembro}
            onChange={(e) => setCartaoMembro(e.target.value)}
            className="w-full rounded-md border p-2"
            placeholder="Digite seu número de cartão de membro"
          />
        </div>

        {/* WhatsApp */}
        <div>
          <label className="block font-medium">WhatsApp</label>
          <input
            type="tel"
            value={whatsapp}
            onChange={(e) => {
              let val = e.target.value.replace(/\D/g, "");
              if (val.length > 11) val = val.slice(0, 11);
              if (val.length > 6)
                val = `(${val.slice(0, 2)}) ${val.slice(2, 7)}-${val.slice(7)}`;
              else if (val.length > 2)
                val = `(${val.slice(0, 2)}) ${val.slice(2)}`;
              else if (val.length > 0) val = `(${val}`;
              setWhatsapp(val);
            }}
            className="w-full rounded-md border p-2"
            placeholder="(XX) XXXXX-XXXX"
          />
        </div>

        <button
          type="submit"
          disabled={!isValidForm}
          className="w-full rounded-md bg-purple-600 text-white p-2 disabled:bg-gray-400"
        >
          Próximo: Pagamento
        </button>
      </form>
    </Modal>
  );
}
