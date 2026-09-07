"use client";

import { useState } from "react";
import { areas } from "../mock/areas.mock";
import { Modal } from "./ui/Modal";
import { Input } from "./ui/Input";
import { Select } from "./ui/Select";
import { Checkbox } from "./ui/Checkbox";
import { Button } from "./ui/Button";
import { salvarJogral } from "../services/salvarJogral";

const WHATSAPP_GRUPO_JOGRAL_URL =
  "https://chat.whatsapp.com/Er7uWBKtTnA20vGjBR5soH?s=cl&p=i&mlu=0&ilr=4";

export default function RegisterJogralModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [step, setStep] = useState<"form" | "confirmacao">("form");

  const [nome, setNome] = useState("");
  const [sexo, setSexo] = useState("");
  const [idade, setIdade] = useState<number | null>(null);
  const [whatsapp, setWhatsapp] = useState("");
  const [area, setArea] = useState<number | null>(null);
  const [congregacao, setCongregacao] = useState<string>("");
  const [cartaoMembro, setCartaoMembro] = useState("");
  const [cienteGrupo, setCienteGrupo] = useState(false);

  const [confirmado, setConfirmado] = useState(false);
  const [loading, setLoading] = useState(false);

  const congregacoes = area ? areas[area]?.congregacoes || [] : [];

  const isValidForm = (() => {
    if (!nome.trim()) return false;
    if (!sexo) return false;
    if (idade === null || idade < 14) return false;
    if (!whatsapp.trim()) return false;
    if (area === null) return false;
    if (!congregacao) return false;
    if (!cartaoMembro.trim()) return false;
    return true;
  })();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return; // evita clique duplo
    if (!isValidForm || !cienteGrupo) {
      alert("Preencha todos os campos corretamente.");
      return;
    }

    setLoading(true);

    try {
      const formData = {
        nome,
        sexo,
        idade,
        whatsapp,
        area,
        congregacao,
        cartaoMembro,
        cienteGrupo,
      };

      const { success, error } = await salvarJogral(formData);

      if (success) {
        setConfirmado(true);
        // Reset
        setNome("");
        setSexo("");
        setIdade(null);
        setWhatsapp("");
        setArea(null);
        setCongregacao("");
        setCartaoMembro("");
        setCienteGrupo(false);
        setStep("confirmacao");
      } else {
        alert(error || "Erro ao enviar inscrição.");
      }
    } catch (err) {
      console.error(err);
      alert("Falha ao enviar inscrição.");
    } finally {
      setLoading(false);
    }
  };

  if (step === "confirmacao" && confirmado) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="✅ Inscrição Confirmada">
        <div className="text-center space-y-5 p-4">
          <h2 className="font-display text-2xl font-bold text-primary-700">
            Inscrição Realizada!
          </h2>
          <p className="text-neutral-700">
            Obrigado por se inscrever no Jogral, sua participação está
            garantida.
          </p>

          <div className="rounded-lg border-l-4 border-accent-400 bg-accent-50 p-4 text-left">
            <p className="text-sm text-neutral-700 mb-3">
              <strong>Importante:</strong> entre no grupo do WhatsApp do
              Jogral para receber as orientações dos ensaios. A entrada é
              obrigatória.
            </p>
            <a
              href={WHATSAPP_GRUPO_JOGRAL_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="primary" size="sm" fullWidth>
                💬 Entrar no grupo do WhatsApp
              </Button>
            </a>
          </div>
        </div>

        <div className="mt-6 flex justify-center">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              setConfirmado(false);
              setStep("form");
              onClose();
            }}
          >
            Fechar
          </Button>
        </div>
      </Modal>
    );
  }

  // Step = "form"
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Inscrição - Jogral">
      {/* Aviso sobre o grupo do WhatsApp */}
      <div className="mb-4 rounded-md border-l-4 border-accent-400 bg-accent-50 p-4 text-sm text-neutral-700">
        <p>
          Ao concluir sua inscrição, você receberá o link do grupo do WhatsApp
          do Jogral. <strong>A entrada no grupo é obrigatória</strong> para
          receber as orientações dos ensaios.
        </p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
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
          <option value="Masculino">Masculino</option>
          <option value="Feminino">Feminino</option>
        </Select>

        {/* Idade */}
        <div>
          <Input
            label="Idade"
            type="number"
            min={14}
            value={idade ?? ""}
            onChange={(e) =>
              setIdade(e.target.value === "" ? null : Number(e.target.value))
            }
          />
          {idade !== null && idade < 14 && (
            <p className="text-error text-sm">Idade mínima: 14 anos</p>
          )}
        </div>

        {/* WhatsApp */}
        <Input
          label="WhatsApp"
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
          placeholder="(XX) XXXXX-XXXX"
        />

        {/* Cartão de Membro */}
        <Input
          label="Número do Cartão de Membro"
          type="text"
          value={cartaoMembro}
          onChange={(e) => setCartaoMembro(e.target.value)}
          placeholder="Digite seu número de cartão de membro"
        />

        {/* Checkbox de ciência */}
        <Checkbox
          id="cienteGrupo"
          checked={cienteGrupo}
          onChange={(e) => setCienteGrupo(e.target.checked)}
          required
          label="Estou ciente que também vou participar do Grande Coral ou do Back Vocal."
        />

        <Button
          type="submit"
          variant="secondary"
          fullWidth
          disabled={!isValidForm || !cienteGrupo || loading}
          loading={loading}
        >
          Confirmar Inscrição
        </Button>
      </form>
    </Modal>
  );
}
