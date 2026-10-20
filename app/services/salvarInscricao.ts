import { db } from "./firebase";
import {
  collection,
  doc,
  runTransaction,
  serverTimestamp,
  query,
  where,
  getDocs,
  limit,
} from "firebase/firestore";

export async function salvarInscricao(dados: any) {
  try {
    const inscricoesRef = collection(db, "inscricoes");
    const counterRef = doc(db, "counters", "inscricoes");

    // Normaliza o cartão (sem espaços/símbolos, maiúsculo, sem zeros à esquerda)
    const cartao = String(dados.cartaoMembro ?? "")
      .replace(/[^a-zA-Z0-9]/g, "")
      .toUpperCase()
      .replace(/^0+(?=.)/, "");

    if (!cartao) {
      return { success: false, error: "Informe o número do cartão de membro" };
    }

    // Nome sem acentos, minúsculo e com espaços simples (para comparar duplicidade)
    const nomeNormalizado = String(dados.nome ?? "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/\s+/g, " ")
      .trim();

    // ⚠️ Aviso (não bloqueia) se nome ou WhatsApp já aparecem em outra inscrição
    const [porWhatsapp, porNome] = await Promise.all([
      getDocs(
        query(inscricoesRef, where("whatsapp", "==", dados.whatsapp), limit(5))
      ),
      getDocs(
        query(
          inscricoesRef,
          where("nomeNormalizado", "==", nomeNormalizado),
          limit(5)
        )
      ),
    ]);
    const possiveisDuplicadas = Array.from(
      new Set(
        [...porWhatsapp.docs, ...porNome.docs]
          .map((d) => d.data().codigo as string)
          .filter(Boolean)
      )
    );

    // 🔄 O cartão é o ID do documento: a transação impede duplicatas mesmo com envios simultâneos
    const newDoc = doc(inscricoesRef, cartao);

    const codigo = await runTransaction(db, async (transaction) => {
      const [counterDoc, existing] = await Promise.all([
        transaction.get(counterRef),
        transaction.get(newDoc),
      ]);

      if (existing.exists()) {
        throw new Error("CARTAO_DUPLICADO");
      }

      let lastCodigo = 0;

      if (!counterDoc.exists()) {
        transaction.set(counterRef, { lastCodigo: 1 });
        lastCodigo = 1;
      } else {
        lastCodigo = counterDoc.data().lastCodigo + 1;
        transaction.update(counterRef, { lastCodigo });
      }

      // Formata o código: CJ2026-0001
      const codigo = `CJ2026-${String(lastCodigo).padStart(4, "0")}`;

      // Cria inscrição
      transaction.set(newDoc, {
        ...dados,
        cartaoMembro: cartao,
        nomeNormalizado,
        possiveisDuplicadas,
        codigo,
        createdAt: serverTimestamp(),
      });

      return codigo;
    });

    return {
      success: true,
      codigo,
      possivelDuplicada: possiveisDuplicadas.length > 0,
    };
  } catch (err) {
    if (err instanceof Error && err.message === "CARTAO_DUPLICADO") {
      return {
        success: false,
        error: "Número de cartão de membro já informado em outra inscrição",
      };
    }
    console.error("Erro ao salvar inscrição:", err);
    return { success: false, error: "Erro inesperado ao salvar." };
  }
}
