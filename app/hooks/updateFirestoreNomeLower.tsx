import { collection, getDocs, writeBatch } from "firebase/firestore";
import { db } from "../services/firebase";

export async function atualizarNomeLower() {
  const snap = await getDocs(collection(db, "inscricoes"));
  console.log("Total docs:", snap.size);

  let batch = writeBatch(db);
  let count = 0;

  for (const doc of snap.docs) {
    const data = doc.data();

    if (!data.nomeLower && data.nome) {
      batch.update(doc.ref, { nomeLower: data.nome.toLowerCase() });
      count++;
    }

    if (count % 200 === 0 && count > 0) {
      await batch.commit();
      console.log(`✅ Atualizados: ${count}`);
      batch = writeBatch(db);
    }
  }

  await batch.commit();
  console.log(`🎯 Finalizado — total atualizados: ${count}`);
}
