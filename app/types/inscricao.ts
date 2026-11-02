// Inscrição do Grande Coral (coleção "inscricoes")
export interface Inscricao {
  id: string;
  codigo?: string;
  nome: string;
  sexo: string;
  idade: number;
  area: number;
  congregacao: string;
  lideranca: string;
  whatsapp: string;
  fardamentoCiente?: boolean; // não coletado a partir de 2026 (fardamento passou a ser só a camisa oficial)
  cartaoMembro: string;
  possiveisDuplicadas?: string[]; // códigos de inscrições com mesmo nome/WhatsApp
  presencas?: Record<string, boolean>; // "AAAA-MM-DD" -> presente no ensaio
  createdAt?: any; // Timestamp do Firestore
}
