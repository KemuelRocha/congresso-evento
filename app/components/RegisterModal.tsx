"use client";

import React, { useState } from "react";
import { areas } from "../mock/areas.mock";
import { Modal } from "./ui/Modal";
import { Input } from "./ui/Input";
import { Select } from "./ui/Select";
import { Button } from "./ui/Button";
import { salvarInscricao } from "../services/salvarInscricao";
import { ConfirmacaoInscricao } from "./ConfirmacaoInscricao";
import { SegmentedControl } from "./ui/SegmentedControl";
import { Church, Lock, Phone, User } from "lucide-react";
import { useInscricoesStatus } from "../hooks/useInscricoesStatus";

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
  const [possivelDuplicada, setPossivelDuplicada] = useState(false);

  const [loading, setLoading] = useState(false);

  const congregacoes = area ? areas[area]?.congregacoes || [] : [];

  const { coralAtivo, loading: carregandoStatus } = useInscricoesStatus();
  const inscricoesEncerradas = !carregandoStatus && !coralAtivo;

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

      const { success, codigo, error, possivelDuplicada: duplicada } =
        await salvarInscricao(formData);

      if (success && codigo) {
        setConfirmation(codigo);
        setPossivelDuplicada(!!duplicada);
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
    if (!cartaoMembro.trim()) return false;
    if (area === null) return false;
    if (!congregacao) return false;

    return true;
  })();

  // 🔴 Se inscrições encerradas, mostra só aviso
  if (inscricoesEncerradas) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Inscrições encerradas">
        <div className="flex flex-col items-center gap-3 py-6 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-neutral-100">
            <Lock className="h-6 w-6 text-neutral-500" aria-hidden />
          </div>
          <p className="text-lg font-semibold text-neutral-800">
            As inscrições para o Grande Coral estão encerradas.
          </p>
        </div>
      </Modal>
    );
  }

  return confirmation ? (
    <ConfirmacaoInscricao
      codigo={confirmation}
      possivelDuplicada={possivelDuplicada}
      onClose={() => {
        setConfirmation(null);
        setPossivelDuplicada(false);
        onClose();
      }}
    />
  ) : (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Grande Coral de Jovens"
      subtitle="Inscrição · Congresso de Jovens 2026"
    >
      <form className="space-y-6" onSubmit={handleSubmit}>
        {/* Congregação */}
        <section className="space-y-4">
          <SectionTitle icon={Church}>Sua congregação</SectionTitle>
          <div className="grid gap-4 sm:grid-cols-[8.5rem_1fr]">
            <Select
              label="Área"
              value={area || ""}
              onChange={(e) => {
                const novaArea = Number(e.target.value);
                setArea(novaArea || null);
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

            <Select
              label="Congregação"
              value={congregacao}
              disabled={!area || congregacoes.length === 0}
              onChange={(e) => setCongregacao(e.target.value)}
            >
              {!area && <option value="">Escolha a área primeiro</option>}
              {congregacoes.map((c, i) => (
                <option key={i} value={c}>
                  {c}
                </option>
              ))}
            </Select>
          </div>
        </section>

        {/* Dados pessoais */}
        <section className="space-y-4">
          <SectionTitle icon={User}>Seus dados</SectionTitle>

          <Input
            label="Nome completo"
            type="text"
            required
            autoComplete="name"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Como está no cartão de membro"
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <SegmentedControl
              label="Sexo"
              value={sexo}
              onChange={setSexo}
              options={[
                { value: "M", label: "Masculino" },
                { value: "F", label: "Feminino" },
              ]}
            />
            <SegmentedControl
              label="Você é"
              value={lideranca}
              onChange={setLideranca}
              options={[
                { value: "jovem", label: "Jovem" },
                { value: "lider", label: "Liderança" },
              ]}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Data de nascimento"
              type="date"
              required
              error={
                idade !== null && idade < 14
                  ? "Idade mínima: 14 anos até 04/12/2026"
                  : undefined
              }
              onChange={(e) => {
                const birthDate = new Date(e.target.value);
                const eventDate = new Date("2026-12-04"); // data do congresso

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

            <Input
              label="Cartão de membro"
              type="text"
              required
              inputMode="numeric"
              value={cartaoMembro}
              onChange={(e) => setCartaoMembro(e.target.value)}
              placeholder="Número do cartão"
            />
          </div>
        </section>

        {/* Contato */}
        <section className="space-y-4">
          <SectionTitle icon={Phone}>Contato</SectionTitle>
          <Input
            label="WhatsApp"
            type="tel"
            required
            autoComplete="tel"
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
            hint="Usaremos para avisos sobre os ensaios."
          />
        </section>

        {/* Botão */}
        <div className="space-y-3 pt-1">
          <Button
            type="submit"
            disabled={!isValid || loading}
            loading={loading}
            fullWidth
          >
            Enviar inscrição
          </Button>
          <p className="text-center text-xs text-neutral-500">
            Ao enviar, você recebe um código com QR Code para apresentar nos
            ensaios.
          </p>
        </div>
      </form>
    </Modal>
  );
}

function SectionTitle({
  icon: Icon,
  children,
}: {
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary-700">
      <span className="flex h-6 w-6 items-center justify-center rounded-md bg-primary-50">
        <Icon className="h-3.5 w-3.5" aria-hidden />
      </span>
      {children}
    </h3>
  );
}
