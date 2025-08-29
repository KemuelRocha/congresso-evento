"use client";

import { useState } from "react";
import { areas } from "../mock/areas.mock";
import { Modal } from "./ui/Modal";
import { salvarInscricao } from "../services/salvarInscricao";
import { ConfirmacaoInscricao } from "./ConfirmacaoInscricao";

export default function RegisterModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [nome, setNome] = useState("");
  const [sexo, setSexo] = useState<string>("");
  const [idade, setIdade] = useState<number | null>(null);
  const [lideranca, setLideranca] = useState<string>("jovem");
  const [whatsapp, setWhatsapp] = useState("");
  const [area, setArea] = useState<number | null>(null);
  const [congregacao, setCongregacao] = useState<string>("");
  const [fardamentoCiente, setFardamentoCiente] = useState(false);
  const [expandedImage, setExpandedImage] = useState<string | null>(null);

  const [confirmation, setConfirmation] = useState<string | null>(null);

  const congregacoes = area ? areas[area]?.congregacoes || [] : [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = {
      nome,
      sexo,
      idade,
      lideranca,
      whatsapp,
      area,
      congregacao,
      fardamentoCiente,
    };

    const { success, codigo } = await salvarInscricao(formData);

    if (success && codigo) {
      setConfirmation(codigo);
      // resetar form
      setNome("");
      setSexo("");
      setIdade(null);
      setLideranca("jovem");
      setWhatsapp("");
      setArea(null);
      setCongregacao("");
      setFardamentoCiente(false);
    } else {
      alert("Erro ao enviar inscrição.");
    }
  };

  const isValid = (() => {
    if (!nome.trim()) return false;
    if (!sexo) return false;
    if (idade === null || idade < 14) return false;
    if (!lideranca) return false; // já tem valor padrão, então sempre true
    if (!whatsapp.trim()) return false;
    if (area === null) return false;
    if (!fardamentoCiente) return false;

    return true;
  })();

  return confirmation ? (
    <ConfirmacaoInscricao
      codigo={confirmation}
      onClose={() => {
        setConfirmation(null);
        onClose();
      }}
    />
  ) : (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Inscrição - Congresso de Jovens"
    >
      <form className="space-y-4">
        {/* Área */}
        <div>
          <label className="block font-medium">Área</label>
          <select
            value={area || ""}
            onChange={(e) => {
              setArea(Number(e.target.value));
              setCongregacao(""); // resetar congregação
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
            required
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="w-full rounded-md border p-2"
          />
        </div>

        {/* Sexo */}
        <div>
          <label className="block font-medium">Sexo</label>
          <select
            value={sexo}
            onChange={(e) => setSexo(e.target.value)}
            className="w-full rounded-md border p-2"
          >
            <option value="">Selecione</option>
            <option value="M">Masculino</option>
            <option value="F">Feminino</option>
          </select>
        </div>

        {/* Exibe a imagem do fardamento conforme sexo */}
        {sexo && (
          <div className="p-2">
            {sexo === "M" ? (
              <img
                src="/assets/farda-masc.jpg"
                alt="Fardamento Masculino"
                className="w-40 mx-auto"
                onClick={() => setExpandedImage("/assets/farda-masc.jpg")}
              />
            ) : (
              <div className="flex justify-center gap-4 p-2">
                <img
                  src="/assets/farda-fem.jpg"
                  alt="Fardamento Feminino"
                  className="w-50 cursor-pointer"
                  onClick={() => setExpandedImage("/assets/farda-fem.jpg")}
                />
              </div>
            )}
            <p className="text-sm mt-2 text-gray-600">
              Conforme autorização do Pastor, para este congresso — que também
              marca a comemoração dos 75 anos da Assembleia de Deus em nossa
              filial — a Supervisão das Campanhas, em conjunto com a UMADEPE,
              definiu um fardamento a ser utilizado além da camisa já adquirida
              pelos jovens nos Pré-Congressos das áreas. <br /> <br />
              {sexo === "M" && (
                <>
                  Gravata + Lenço —{" "}
                  <span className="font-semibold">R$ 40,00</span>
                </>
              )}
              {sexo === "F" && (
                <>
                  Vestido — <span className="font-semibold">R$ 100,00</span>
                </>
              )}
            </p>

            <p className="text-xs text-red-500">
              Pagamento em até 2x (10/10 e 10/11)
            </p>

            <div className="mt-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={fardamentoCiente}
                  onChange={(e) => setFardamentoCiente(e.target.checked)}
                  required
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700">
                  Declaro que estou ciente da necessidade de adquirir o
                  fardamento para formar no Grande Coral do Congresso.
                </span>
              </label>
            </div>
          </div>
        )}

        {/* Jovem ou Liderança */}
        <div>
          <label className="block font-medium">Você é:</label>
          <select
            value={lideranca}
            onChange={(e) => setLideranca(e.target.value)}
            className="w-full rounded-md border p-2"
          >
            <option value="jovem">Jovem</option>
            <option value="lider">Liderança</option>
          </select>
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
          {idade !== null && idade < 14 && (
            <p className="text-red-500 text-sm">Idade mínima: 14 anos</p>
          )}
        </div>

        {/* WhatsApp */}
        <div>
          <label className="block font-medium">WhatsApp</label>
          <input
            type="tel"
            required
            value={whatsapp}
            onChange={(e) => {
              let val = e.target.value.replace(/\D/g, ""); // remove tudo que não é número
              if (val.length > 11) val = val.slice(0, 11);
              // Formata (XX) XXXXX-XXXX
              if (val.length > 6) {
                val = `(${val.slice(0, 2)}) ${val.slice(2, 7)}-${val.slice(7)}`;
              } else if (val.length > 2) {
                val = `(${val.slice(0, 2)}) ${val.slice(2)}`;
              } else if (val.length > 0) {
                val = `(${val}`;
              }
              setWhatsapp(val);
            }}
            className="w-full rounded-md border p-2"
            placeholder="(XX) XXXXX-XXXX"
          />
        </div>

        {/* Botão */}
        <button
          type="submit"
          disabled={!isValid}
          className="w-full rounded-md bg-blue-600 text-white p-2 disabled:bg-gray-400 cursor-pointer"
          onClick={handleSubmit}
        >
          Enviar Inscrição
        </button>
      </form>
      {expandedImage && (
        <Modal isOpen={!!expandedImage} onClose={() => setExpandedImage(null)}>
          <img
            src={expandedImage}
            alt="Imagem expandida"
            className="w-full h-auto"
          />
        </Modal>
      )}
    </Modal>
  );
}
