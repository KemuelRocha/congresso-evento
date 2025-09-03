import { db } from "./firebase";
import {
  collection,
  doc,
  runTransaction,
  serverTimestamp,
  query,
  where,
  getDocs,
} from "firebase/firestore";

export async function salvarVestibular(dados: any) {
  try {
    const vestibularRef = collection(db, "vestibular");
    const counterRef = doc(db, "counters", "vestibular");

    // 🔎 Verifica se já existe inscrição com o mesmo número de cartão
    const q = query(
      vestibularRef,
      where("cartaoMembro", "==", dados.cartaoMembro)
    );
    const existing = await getDocs(q);

    if (!existing.empty) {
      return {
        success: false,
        error:
          "Número de cartão de membro já informado em outra inscrição do vestibular",
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

      // Formata o código: VB2025-0001
      const codigo = `VB2025-${String(lastCodigo).padStart(4, "0")}`;

      // Cria inscrição
      const newDoc = doc(vestibularRef);
      transaction.set(newDoc, {
        ...dados,
        codigo,
        createdAt: serverTimestamp(),
      });

      return codigo;
    });

    return { success: true, codigo };
  } catch (err) {
    console.error("Erro ao salvar inscrição no vestibular:", err);
    return {
      success: false,
      error: "Erro inesperado ao salvar no vestibular.",
    };
  }
}
