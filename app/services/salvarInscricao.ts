import { db } from "./firebase";
import {
  collection,
  doc,
  runTransaction,
  serverTimestamp,
} from "firebase/firestore";

export async function salvarInscricao(dados: any) {
  try {
    const inscricoesRef = collection(db, "inscricoes");
    const counterRef = doc(db, "counters", "inscricoes");

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

      // Formata o código: CJ2025-0001
      const codigo = `CJ2025-${String(lastCodigo).padStart(4, "0")}`;

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
    return { success: false };
  }
}
