"use client";

import { useState } from "react";
import { areas } from "../mock/areas.mock";
import { Modal } from "./ui/Modal";
import { Input } from "./ui/Input";
import { Select } from "./ui/Select";
import { Button } from "./ui/Button";
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
  const [cartaoMembro, setCartaoMembro] = useState("");

  const [confirmation, setConfirmation] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);

  const congregacoes = area ? areas[area]?.congregacoes || [] : [];

  const dataLimite = new Date("2026-09-30T23:59:59");
  const hoje = new Date();
  const inscricoesEncerradas = false;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (loading) return; // evita clique duplo
    if (inscricoesEncerradas) {
      alert("As inscrições estão encerradas!");
      return;
    }

    setLoading(true);

    try {
      const formData = {
        nome,
        nomeLower: nome.toLowerCase(),
        sexo,
        idade,
        lideranca,
        whatsapp,
        area,
        congregacao,
        cartaoMembro,
      };

      const { success, codigo, error } = await salvarInscricao(formData);

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
        setCartaoMembro("");
      } else {
        alert(error || "Erro ao enviar inscrição.");
      }
    } finally {
      setLoading(false);
    }
  };

  const isValid = (() => {
    if (!nome.trim()) return false;
    if (!sexo) return false;
    if (idade === null || idade < 14) return false;
    if (!lideranca) return false; // já tem valor padrão, então sempre true
    if (!whatsapp.trim()) return false;
    if (area === null) return false;
    if (!congregacao) return false;

    return true;
  })();

  // 🔴 Se inscrições encerradas, mostra só aviso
  if (inscricoesEncerradas) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Inscrições Encerradas">
        <div className="text-center p-6">
          <p className="text-lg font-semibold text-error">
            As inscrições para o Congresso de Jovens 2026 foram encerradas em{" "}
            <strong>20/09/2026</strong>.
          </p>
        </div>
      </Modal>
    );
  }

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
      title="Inscrição - Grande Coral de Jovens - CJ 2026"
    >
      <form className="space-y-4">
        {/* Área */}
        <Select
          label="Área"
          value={area || ""}
          onChange={(e) => {
            const novaArea = Number(e.target.value);
            setArea(novaArea);
            const congPadrao = areas[novaArea]?.congregacoes?.[0] || "";
            setCongregacao(congPadrao);
          }}
        >
          <option value="">Selecione</option>
          {Array.from({ length: 20 }, (_, i) => (
            <option key={i + 1} value={i + 1}>
              Área {i + 1}
            </option>
          ))}
        </Select>

        {/* Congregação */}
        {area && congregacoes.length > 0 && (
          <Select
            label="Congregação"
            value={congregacao}
            onChange={(e) => setCongregacao(e.target.value)}
          >
            {congregacoes.map((c, i) => (
              <option key={i} value={c}>
                {c}
              </option>
            ))}
          </Select>
        )}

        {/* Nome */}
        <Input
          label="Nome Completo"
          type="text"
          required
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />

        {/* Sexo */}
        <Select
          label="Sexo"
          value={sexo}
          onChange={(e) => setSexo(e.target.value)}
        >
          <option value="">Selecione</option>
          <option value="M">Masculino</option>
          <option value="F">Feminino</option>
        </Select>

        {/* Jovem ou Liderança */}
        <Select
          label="Você é:"
          value={lideranca}
          onChange={(e) => setLideranca(e.target.value)}
        >
          <option value="jovem">Jovem</option>
          <option value="lider">Liderança</option>
        </Select>

        {/* Data de Nascimento */}
        <div>
          <Input
            label="Data de Nascimento"
            type="date"
            required
            onChange={(e) => {
              const birthDate = new Date(e.target.value);
              const eventDate = new Date("2026-11-29"); // data do congresso

              let age = eventDate.getFullYear() - birthDate.getFullYear();
              const m = eventDate.getMonth() - birthDate.getMonth();
              if (
                m < 0 ||
                (m === 0 && eventDate.getDate() < birthDate.getDate())
              ) {
                age--;
              }

              setIdade(age);
            }}
          />
          {idade !== null && idade < 14 && (
            <p className="text-error text-sm">
              Idade mínima: 14 anos até o dia 29/11/2026
            </p>
          )}
        </div>

        {/* Número do Cartão de Membro */}
        <Input
          label="Número do Cartão de Membro"
          type="text"
          value={cartaoMembro}
          onChange={(e) => setCartaoMembro(e.target.value)}
          placeholder="Digite seu número de cartão de membro"
        />

        {/* WhatsApp */}
        <Input
          label="WhatsApp"
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
          placeholder="(XX) XXXXX-XXXX"
        />

        {/* Botão */}
        <Button
          type="submit"
          disabled={!isValid || loading}
          loading={loading}
          fullWidth
          onClick={handleSubmit}
        >
          Enviar Inscrição
        </Button>
      </form>
    </Modal>
  );
}
