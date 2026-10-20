"use client";

import React, { useRef, useState } from "react";
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
  const [tentouEnviar, setTentouEnviar] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

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

    if (!isValid) {
      // Destaca os campos pendentes e leva o usuário até o primeiro
      setTentouEnviar(true);
      requestAnimationFrame(() => {
        const primeiro = formRef.current?.querySelector<HTMLElement>(
          '[aria-invalid="true"]'
        );
        primeiro?.scrollIntoView({ behavior: "smooth", block: "center" });
        primeiro?.focus({ preventScroll: true });
      });
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
        setTentouEnviar(false);
      } else {
        alert(error || "Erro ao enviar inscrição.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Erro de cada campo; só aparece depois da primeira tentativa de envio
  // (exceto a idade mínima, que aparece assim que a data é preenchida)
  const erros: Record<string, string | undefined> = {
    area: area === null ? "Selecione a área" : undefined,
    congregacao: !congregacao ? "Selecione a congregação" : undefined,
    nome: !nome.trim() ? "Informe seu nome completo" : undefined,
    sexo: !sexo ? "Selecione uma opção" : undefined,
    idade:
      idade === null
        ? "Informe sua data de nascimento"
        : idade < 14
        ? "Idade mínima: 14 anos até 04/12/2026"
        : undefined,
    cartaoMembro: !cartaoMembro.trim()
      ? "Informe o número do cartão"
      : undefined,
    whatsapp:
      whatsapp.replace(/\D/g, "").length < 10
        ? "Informe um WhatsApp com DDD"
        : undefined,
  };
  const isValid = Object.values(erros).every((e) => !e);
  const erro = (campo: string) =>
    tentouEnviar || (campo === "idade" && idade !== null)
      ? erros[campo]
      : undefined;

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
      <form ref={formRef} className="space-y-6" onSubmit={handleSubmit} noValidate>
        {/* Congregação */}
        <section className="space-y-4">
          <SectionTitle icon={Church}>Sua congregação</SectionTitle>
          <div className="grid gap-4 sm:grid-cols-[8.5rem_1fr]">
            <Select
              label="Área"
              error={erro("area")}
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
              error={area ? erro("congregacao") : undefined}
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
            error={erro("nome")}
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
              error={erro("sexo")}
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
              error={erro("idade")}
              onChange={(e) => {
                if (!e.target.value) {
                  setIdade(null);
                  return;
                }
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
              error={erro("cartaoMembro")}
              type="text"
              required
              inputMode="numeric"
              value={cartaoMembro}
              onChange={(e) => setCartaoMembro(e.target.value.replace(/\D/g, ""))} // só números
              placeholder="Número do cartão"
            />
          </div>
        </section>

        {/* Contato */}
        <section className="space-y-4">
          <SectionTitle icon={Phone}>Contato</SectionTitle>
          <Input
            label="WhatsApp"
            error={erro("whatsapp")}
            type="tel"
            inputMode="numeric"
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
            loading={loading}
            fullWidth
          >
            Enviar inscrição
          </Button>
          {tentouEnviar && !isValid && (
            <p className="text-center text-sm font-medium text-error" role="alert">
              Preencha os campos destacados em vermelho.
            </p>
          )}
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
