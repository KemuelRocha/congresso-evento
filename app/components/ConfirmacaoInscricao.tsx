"use client";

import { QRCodeSVG as QRCode } from "qrcode.react";
import { Modal } from "./ui/Modal";
import { Button } from "./ui/Button";
import { useRef } from "react";
import * as htmlToImage from "html-to-image";
import jsPDF from "jspdf";
import { AlertTriangle, CheckCircle2, Download } from "lucide-react";

export function ConfirmacaoInscricao({
  codigo,
  onClose,
  isVestibular = false,
  possivelDuplicada = false,
}: {
  codigo: string;
  onClose: () => void;
  isVestibular?: boolean;
  possivelDuplicada?: boolean;
}) {
  const pdfRef = useRef<HTMLDivElement>(null);

  const handleDownloadPDF = async () => {
    if (!pdfRef.current) return;

    try {
      // Gera a imagem em alta qualidade
      const dataUrl = await htmlToImage.toPng(pdfRef.current, {
        pixelRatio: 3,
      });

      // Cria PDF
      const pdf = new jsPDF("p", "mm", "a4");
      const imgProps = pdf.getImageProperties(dataUrl);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(dataUrl, "PNG", 0, 20, pdfWidth, pdfHeight);
      pdf.save(`Confirmacao-${codigo}.pdf`);
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      alert("Não foi possível gerar o PDF. Tente novamente.");
    }
  };

  return (
    <Modal isOpen={true} onClose={onClose} title="Inscrição confirmada">
      {/* Fora do pdfRef: o aviso não vai para o PDF do comprovante */}
      {possivelDuplicada && (
        <div className="mb-4 flex gap-3 rounded-2xl border border-accent-200 bg-accent-50 p-4 text-left">
          <AlertTriangle
            className="mt-0.5 h-5 w-5 shrink-0 text-accent-600"
            aria-hidden
          />
          <div className="text-sm text-accent-900">
            <p className="font-semibold">Encontramos uma inscrição parecida</p>
            <p className="mt-1">
              Já existe uma inscrição com este nome e/ou WhatsApp. Se você já
              tinha se inscrito antes, procure a organização para que a
              inscrição repetida seja removida.
            </p>
          </div>
        </div>
      )}

      <div ref={pdfRef} className="space-y-5 rounded-2xl bg-white p-4 text-center">
        <div className="flex flex-col items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-success/10">
            <CheckCircle2 className="h-8 w-8 text-success" aria-hidden />
          </div>
          <div>
            <h2 className="font-display text-2xl font-bold text-secondary-900">
              Inscrição realizada!
            </h2>
            <p className="mt-1 text-neutral-600">
              Obrigado por se inscrever, sua participação está garantida.
            </p>
          </div>
        </div>

        <div className="rounded-2xl border-2 border-dashed border-primary-200 bg-primary-50/60 p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary-700">
            Seu código de inscrição
          </p>
          <p className="mt-1 font-display text-3xl font-bold tracking-wider text-primary-700">
            {codigo}
          </p>

          <div className="mt-4 flex justify-center">
            <div className="rounded-xl bg-white p-3 shadow-card">
              <QRCode value={codigo} size={168} />
            </div>
          </div>
        </div>

        <p className="text-sm text-neutral-500">
          Guarde este código ou apresente o QR Code{" "}
          {isVestibular
            ? "no dia da prova para confirmar sua inscrição."
            : "nos ensaios para confirmar sua presença."}
        </p>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <Button variant="primary" size="md" onClick={handleDownloadPDF}>
          <Download className="h-5 w-5" aria-hidden />
          Baixar comprovante
        </Button>
        <Button variant="ghost" size="md" onClick={onClose}>
          Fechar
        </Button>
      </div>
    </Modal>
  );
}
