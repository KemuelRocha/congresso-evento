import { db } from "./firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export async function salvarInscricao(data: any) {
  try {
    await addDoc(collection(db, "inscricoes"), {
      ...data,
      dataCadastro: serverTimestamp(),
    });
    return { success: true, codigo: "CJ2025-00123" };
  } catch (err) {
    console.error("Erro ao salvar inscrição:", err);
    return { success: false };
  }
}
