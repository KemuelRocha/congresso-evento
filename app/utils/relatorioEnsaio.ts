import { formatDataBR, parseDataISO } from "./datas";

interface GrupoRelatorio {
  chave: string;
  presentes: number;
  inscritos: number;
}

export interface DadosRelatorio {
  data: string; // "AAAA-MM-DD"
  filtro?: string; // descrição dos filtros ativos
  presentes: number;
  ausentes: number;
  inscritos: number;
  dataAnterior?: string;
  presentesAnterior: number | null;
  primeiraVez: number;
  idadeMedia: number | null;
  porSexo: { nome: string; total: number }[];
  porLideranca: { nome: string; total: number }[];
  porArea: GrupoRelatorio[]; // ordem numérica
  porCongregacao: GrupoRelatorio[]; // mais presentes primeiro
  melhores: GrupoRelatorio[];
  piores: GrupoRelatorio[];
  mediaPorEnsaio: number | null;
  totalEnsaios: number;
  listarSemPresentes: boolean; // nomes das congregações sem presentes (só com área filtrada)
}

const DIAS_SEMANA = [
  "Domingo",
  "Segunda-feira",
  "Terça-feira",
  "Quarta-feira",
  "Quinta-feira",
  "Sexta-feira",
  "Sábado",
];

const num = (v: number, casas = 1) => v.toFixed(casas).replace(".", ",");
const pct = (parte: number, total: number) =>
  `${num(total ? (parte / total) * 100 : 0)}%`;

// Texto do ensaio com a formatação do WhatsApp (*negrito*, _itálico_)
export function montarRelatorioEnsaio(d: DadosRelatorio): string {
  const linhas: string[] = [];
  const secao = (titulo: string, itens: string[]) => {
    if (itens.length === 0) return;
    linhas.push("", titulo, ...itens);
  };

  linhas.push(
    "🎶 *Ensaio do Grande Coral*",
    `📅 ${DIAS_SEMANA[parseDataISO(d.data).getDay()]}, ${formatDataBR(d.data)}`
  );
  if (d.filtro) linhas.push(`🔎 _Filtro: ${d.filtro}_`);

  const resumo = [
    `✅ Presentes: *${d.presentes}* de ${d.inscritos} inscritos`,
    `📈 Taxa de presença: *${pct(d.presentes, d.inscritos)}*`,
    `❌ Ausentes: ${d.ausentes}`,
  ];
  if (d.dataAnterior && d.presentesAnterior !== null) {
    const diff = d.presentes - d.presentesAnterior;
    const anterior = `ensaio de ${formatDataBR(d.dataAnterior).slice(0, 5)} (${d.presentesAnterior})`;
    resumo.push(
      diff > 0
        ? `↗️ +${diff} em relação ao ${anterior}`
        : diff < 0
        ? `↘️ ${diff} em relação ao ${anterior}`
        : `➡️ Mesmo número do ${anterior}`
    );
  }
  if (d.primeiraVez > 0) resumo.push(`🆕 Primeira vez em um ensaio: ${d.primeiraVez}`);
  if (d.idadeMedia !== null) resumo.push(`🎂 Idade média: ${num(d.idadeMedia)} anos`);
  secao("📊 *RESUMO*", resumo);

  if (d.presentes > 0) {
    const sexo = d.porSexo
      .map((s) => `${s.nome === "Feminino" ? "👩" : "👨"} ${s.nome}: ${s.total} (${pct(s.total, d.presentes)})`)
      .join(" · ");
    const lideranca = d.porLideranca
      .map((l) => `${l.nome === "Lideranças" ? "🎖️" : "🧑"} ${l.nome}: ${l.total}`)
      .join(" · ");
    secao("👥 *PERFIL DOS PRESENTES*", [sexo, lideranca].filter(Boolean));
  }

  const areasPresentes = d.porArea.filter((a) => a.presentes > 0).length;
  secao(
    `📍 *PRESENÇA POR ÁREA* (${areasPresentes} de ${d.porArea.length} ${
      d.porArea.length === 1 ? "área presente" : "áreas presentes"
    })`,
    d.porArea.map((a) => `Área ${a.chave}: ${a.presentes}/${a.inscritos} (${pct(a.presentes, a.inscritos)})`)
  );

  secao(
    "🏆 *MAIS PRESENTES (quantidade)*",
    d.porCongregacao
      .filter((c) => c.presentes > 0)
      .slice(0, 5)
      .map((c, i) => `${i + 1}. ${c.chave}: ${c.presentes}`)
  );

  const ranking = (lista: GrupoRelatorio[]) =>
    lista.map((c, i) => `${i + 1}. ${c.chave}: ${c.presentes}/${c.inscritos} (${pct(c.presentes, c.inscritos)})`);
  secao("🎯 *MAIOR PRESENÇA (%)*", ranking(d.melhores));
  secao("⚠️ *MENOR PRESENÇA (%)*", ranking(d.piores));

  const semPresentes = d.porCongregacao.filter((c) => c.presentes === 0);
  if (semPresentes.length > 0) {
    linhas.push(
      "",
      `🚫 *Sem nenhum presente:* ${semPresentes.length} ${
        semPresentes.length === 1 ? "congregação" : "congregações"
      }`
    );
    if (d.listarSemPresentes) linhas.push(...semPresentes.map((c) => `• ${c.chave}`));
  }

  if (d.mediaPorEnsaio !== null && d.totalEnsaios > 1) {
    linhas.push(
      "",
      `📈 Média geral: ${num(d.mediaPorEnsaio)} presentes por ensaio (${d.totalEnsaios} ensaios)`
    );
  }

  return linhas.join("\n");
}
