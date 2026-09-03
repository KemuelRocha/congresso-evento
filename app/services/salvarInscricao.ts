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

    // 🔎 Verifica se já existe inscrição com o mesmo número de cartão
    const q = query(
      inscricoesRef,
      where("cartaoMembro", "==", dados.cartaoMembro),
      limit(1)
    );
    const existing = await getDocs(q);

    if (!existing.empty) {
      return {
        success: false,
        error: "Número de cartão de membro já informado em outra inscrição",
      };
    }

    // 🔄 Continua o processo normal com transação para gerar código único
    const codigo = await runTransaction(db, async (transaction) => {
      const counterDoc = await transaction.get(counterRef);
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
      const newDoc = doc(inscricoesRef);
      transaction.set(newDoc, {
        ...dados,
        codigo,
        createdAt: serverTimestamp(),
      });

      return codigo;
    });

    return { success: true, codigo };
  } catch (err) {
    console.error("Erro ao salvar inscrição:", err);
    return { success: false, error: "Erro inesperado ao salvar." };
  }
}
