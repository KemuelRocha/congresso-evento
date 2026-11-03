"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";

// Relatório do ensaio em texto, pronto para colar no WhatsApp
export function RelatorioWhatsApp({ texto }: { texto: string }) {
  const [editado, setEditado] = useState(texto);
  const [copiado, setCopiado] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // volta ao texto gerado quando a data ou os filtros mudam
  useEffect(() => {
    setEditado(texto);
  }, [texto]);

  useEffect(() => {
    if (!copiado) return;
    const timer = setTimeout(() => setCopiado(false), 2000);
    return () => clearTimeout(timer);
  }, [copiado]);

  async function copiar() {
    try {
      await navigator.clipboard.writeText(editado);
    } catch {
      // fallback para navegadores sem Clipboard API (ex: http fora do localhost)
      textareaRef.current?.select();
      document.execCommand("copy");
    }
    setCopiado(true);
  }

  function abrirWhatsApp() {
    window.open(
      `https://wa.me/?text=${encodeURIComponent(editado)}`,
      "_blank",
      "noopener,noreferrer"
    );
  }

  return (
    <Card>
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-lg font-bold text-secondary-900">
            💬 Relatório para WhatsApp
          </h2>
          <p className="text-sm text-neutral-500">
            Segue a data e os filtros selecionados. Dá para editar o texto antes de copiar.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {editado !== texto && (
            <Button variant="ghost" size="sm" onClick={() => setEditado(texto)}>
              Restaurar texto
            </Button>
          )}
          <Button variant="secondary" size="sm" onClick={abrirWhatsApp}>
            Abrir no WhatsApp
          </Button>
          <Button variant="primary" size="sm" onClick={copiar}>
            {copiado ? "✅ Copiado!" : "📋 Copiar relatório"}
          </Button>
        </div>
      </div>
      <textarea
        ref={textareaRef}
        value={editado}
        onChange={(e) => setEditado(e.target.value)}
        rows={18}
        className="w-full rounded-xl border border-neutral-300 bg-neutral-50 p-3.5 font-mono text-sm text-neutral-900 focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary-500/15"
      />
    </Card>
  );
}
