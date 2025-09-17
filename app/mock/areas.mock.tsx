const congregacoes = [
  {
    area: 1,
    congregacao: "MATRIZ",
  },
  {
    area: 1,
    congregacao: "ANTÔNIO CASSIMIRO I",
  },
  {
    area: 1,
    congregacao: "AREIA BRANCA I",
  },
  {
    area: 1,
    congregacao: "HONORATO VIANA",
  },
  {
    area: 1,
    congregacao: "JARDIM MARAVILHA",
  },
  {
    area: 1,
    congregacao: "MARIA AUXILIADORA",
  },
  {
    area: 1,
    congregacao: "NOVA ATRÁS DA BANCA",
  },
  {
    area: 1,
    congregacao: "OURO PRETO",
  },
  {
    area: 1,
    congregacao: "VILA EULÁLIA",
  },
  {
    area: 2,
    congregacao: "VILA EDUARDO",
  },
  {
    area: 2,
    congregacao: "AREIA BRANCA II",
  },
  {
    area: 2,
    congregacao: "FERNANDO IDALINO I",
  },
  {
    area: 2,
    congregacao: "FERNANDO IDALINO II",
  },
  {
    area: 2,
    congregacao: "HENRIQUE LEITE I",
  },
  {
    area: 2,
    congregacao: "HENRIQUE LEITE II",
  },
  {
    area: 2,
    congregacao: "NOVA VILA VITÓRIA",
  },
  {
    area: 2,
    congregacao: "NOVO JATOBÁ",
  },
  {
    area: 2,
    congregacao: "PORTO DA ILHA",
  },
  {
    area: 2,
    congregacao: "RIVER SHOPPING",
  },
  {
    area: 2,
    congregacao: "VILA VITÓRIA",
  },
  {
    area: 3,
    congregacao: "COHAB IV",
  },
  {
    area: 3,
    congregacao: "ALTO DA BOA VISTA",
  },
  {
    area: 3,
    congregacao: "BR AEROPORTO",
  },
  {
    area: 3,
    congregacao: "COHAB V",
  },
  {
    area: 3,
    congregacao: "JARDIM PETRÓPOLIS III",
  },
  {
    area: 3,
    congregacao: "SÃO GONÇALO I",
  },
  {
    area: 3,
    congregacao: "SÃO GONÇALO II",
  },
  {
    area: 3,
    congregacao: "SÃO GONÇALO III",
  },
  {
    area: 4,
    congregacao: "JOSÉ E MARIA I",
  },
  {
    area: 4,
    congregacao: "DOM AVELAR I",
  },
  {
    area: 4,
    congregacao: "DOM AVELAR II",
  },
  {
    area: 4,
    congregacao: "DOM AVELAR IV",
  },
  {
    area: 4,
    congregacao: "JOSÉ E MARIA II",
  },
  {
    area: 4,
    congregacao: "JOSÉ E MARIA III",
  },
  {
    area: 4,
    congregacao: "NOVA VILA MARCELA",
  },
  {
    area: 4,
    congregacao: "NOVO LOT. RECIFE",
  },
  {
    area: 4,
    congregacao: "VILA DÉBORA I  ",
  },
  {
    area: 4,
    congregacao: "VILA DÉBORA II",
  },
  {
    area: 5,
    congregacao: "JARDIM AMAZONAS I",
  },
  {
    area: 5,
    congregacao: "ALTO DO COCÁ",
  },
  {
    area: 5,
    congregacao: "JARDIM AMAZONAS II",
  },
  {
    area: 5,
    congregacao: "JARDIM SÃO PAULO I",
  },
  {
    area: 5,
    congregacao: "PEDRO RAIMUNDO",
  },
  {
    area: 5,
    congregacao: "QUATI",
  },
  {
    area: 5,
    congregacao: "VALE DO  GRANDE RIO I",
  },
  {
    area: 6,
    congregacao: "KM - 25",
  },
  {
    area: 6,
    congregacao: "ÁREA 19",
  },
  {
    area: 6,
    congregacao: "ÁREA 20",
  },
  {
    area: 6,
    congregacao: "ÁREA 21",
  },
  {
    area: 6,
    congregacao: "FACHEIRO",
  },
  {
    area: 6,
    congregacao: "KM - 22",
  },
  {
    area: 6,
    congregacao: "LAGEDO",
  },
  {
    area: 6,
    congregacao: "R - 4",
  },
  {
    area: 6,
    congregacao: "VILA NOVA KM-25",
  },
  {
    area: 7,
    congregacao: "N - 3",
  },
  {
    area: 7,
    congregacao: "ASS. MANDACARÚ",
  },
  {
    area: 7,
    congregacao: "C - 1",
  },
  {
    area: 7,
    congregacao: "FAZENDA VENEZA",
  },
  {
    area: 7,
    congregacao: "N - 1",
  },
  {
    area: 7,
    congregacao: "N - 2",
  },
  {
    area: 7,
    congregacao: "PONTA DA SERRA",
  },
  {
    area: 7,
    congregacao: "PORTEIRAS",
  },
  {
    area: 7,
    congregacao: "SÍTIO BARRAGEM",
  },
  {
    area: 7,
    congregacao: "TANQUE VELHO",
  },
  {
    area: 8,
    congregacao: "NOVA DESCOBERTA I",
  },
  {
    area: 8,
    congregacao: "BEBEDOURO",
  },
  {
    area: 8,
    congregacao: "NOVA DESCOBERTA III",
  },
  {
    area: 8,
    congregacao: "PEDRINHAS",
  },
  {
    area: 8,
    congregacao: "POÇO DA CRUZ",
  },
  {
    area: 8,
    congregacao: "PORTO DE PALHA",
  },
  {
    area: 8,
    congregacao: "PORTO DE PALHA II",
  },
  {
    area: 8,
    congregacao: "RIO VERDE",
  },
  {
    area: 8,
    congregacao: "SERROTE DE JESUS I",
  },
  {
    area: 8,
    congregacao: "SERROTE DE JESUS II",
  },
  {
    area: 8,
    congregacao: "SERROTE DE JESUS III",
  },
  {
    area: 9,
    congregacao: "LAGOA GRANDE I",
  },
  {
    area: 9,
    congregacao: "ALTO DA AREIA",
  },
  {
    area: 9,
    congregacao: "ALTO GRANDE",
  },
  {
    area: 9,
    congregacao: "ASS. JOSÉ RAMOS",
  },
  {
    area: 9,
    congregacao: "ASS. SÃO FRANCISCO",
  },
  {
    area: 9,
    congregacao: "FAZENDA TANQUE",
  },
  {
    area: 9,
    congregacao: "IZACOLÂNDIA I",
  },
  {
    area: 9,
    congregacao: "IZACOLÂNDIA II",
  },
  {
    area: 9,
    congregacao: "LAGOA GRANDE III",
  },
  {
    area: 9,
    congregacao: "LAGOA GRANDE V",
  },
  {
    area: 9,
    congregacao: "RUA DO CAJUEIRO",
  },
  {
    area: 9,
    congregacao: "VASCO",
  },
  {
    area: 10,
    congregacao: "VILA 12",
  },
  {
    area: 10,
    congregacao: "ASSENT. CACHOEIRA",
  },
  {
    area: 10,
    congregacao: "CAÇIMBA",
  },
  {
    area: 10,
    congregacao: "CAPIM",
  },
  {
    area: 10,
    congregacao: "LOT. SANTA BARBARA",
  },
  {
    area: 10,
    congregacao: "M. BERNARDINO",
  },
  {
    area: 10,
    congregacao: "N - 10",
  },
  {
    area: 10,
    congregacao: "N - 11",
  },
  {
    area: 10,
    congregacao: "VILA RENASCER",
  },
  {
    area: 10,
    congregacao: "VIVENDAS",
  },
  {
    area: 11,
    congregacao: "RAJADA ",
  },
  {
    area: 11,
    congregacao: "ASS. ESPERANÇA",
  },
  {
    area: 11,
    congregacao: "MASSAPÊ",
  },
  {
    area: 11,
    congregacao: "PAU FERRO",
  },
  {
    area: 11,
    congregacao: "URUAIS",
  },
  {
    area: 12,
    congregacao: "CAITITU",
  },
  {
    area: 12,
    congregacao: "BAIXA ALEGRE",
  },
  {
    area: 12,
    congregacao: "CAROÁ",
  },
  {
    area: 12,
    congregacao: "CRUZ DE SALINAS",
  },
  {
    area: 12,
    congregacao: "SIMPATIA",
  },
  {
    area: 13,
    congregacao: "COHAB VI",
  },
  {
    area: 13,
    congregacao: "AGROV. MASSANGANO",
  },
  {
    area: 13,
    congregacao: "ROÇADO",
  },
  {
    area: 13,
    congregacao: "SÍTIO SÃO JOÃO",
  },
  {
    area: 13,
    congregacao: "TAPERA",
  },
  {
    area: 13,
    congregacao: "TERRA DURA",
  },
  {
    area: 14,
    congregacao: "JOÃO DE DEUS I",
  },
  {
    area: 14,
    congregacao: "COSME E DAMIÃO I",
  },
  {
    area: 14,
    congregacao: "COSME E DAMIÃO II",
  },
  {
    area: 14,
    congregacao: "IPSEP",
  },
  {
    area: 14,
    congregacao: "JOÃO DE DEUS II",
  },
  {
    area: 14,
    congregacao: "JOÃO DE DEUS III",
  },
  {
    area: 14,
    congregacao: "JOÃO DE DEUS IV",
  },
  {
    area: 14,
    congregacao: "JOÃO DE DEUS V",
  },
  {
    area: 14,
    congregacao: "NOVO TEMPO",
  },
  {
    area: 14,
    congregacao: "PEDRA LINDA I",
  },
  {
    area: 14,
    congregacao: "PEDRA LINDA III",
  },
  {
    area: 15,
    congregacao: "N - 4 I",
  },
  {
    area: 15,
    congregacao: "ÁGUA VIVA I",
  },
  {
    area: 15,
    congregacao: "ÁGUA VIVA II",
  },
  {
    area: 15,
    congregacao: "C - 2",
  },
  {
    area: 15,
    congregacao: "LOT. SIQUEIRA",
  },
  {
    area: 15,
    congregacao: "LOTE 139",
  },
  {
    area: 15,
    congregacao: "N - 4 II",
  },
  {
    area: 15,
    congregacao: "N - 5 I",
  },
  {
    area: 15,
    congregacao: "N - 5 II",
  },
  {
    area: 16,
    congregacao: "Jutaí",
  },
  {
    area: 16,
    congregacao: "Açude-Saco",
  },
  {
    area: 16,
    congregacao: "B. do Juazeiro",
  },
  {
    area: 16,
    congregacao: "Caldeirãozinho",
  },
  {
    area: 17,
    congregacao: "SANTA LUZIA I",
  },
  {
    area: 17,
    congregacao: "MANDACARU I",
  },
  {
    area: 17,
    congregacao: "MANDACARÚ II",
  },
  {
    area: 17,
    congregacao: "SANTA LUZIA II",
  },
  {
    area: 17,
    congregacao: "SÃO JOAQUIM",
  },
  {
    area: 17,
    congregacao: "SÃO JORGE",
  },
  {
    area: 17,
    congregacao: "TERRA DO SUL I",
  },
  {
    area: 17,
    congregacao: "TERRA DO SUL II",
  },
  {
    area: 17,
    congregacao: "VILA ESPERANÇA",
  },
  {
    area: 18,
    congregacao: "VERMELHOS I",
  },
  {
    area: 18,
    congregacao: "ABREU E LIMA",
  },
  {
    area: 18,
    congregacao: "AGROISIA",
  },
  {
    area: 18,
    congregacao: "CATALÚNIA",
  },
  {
    area: 18,
    congregacao: "CRUZ DO PONTAL",
  },
  {
    area: 18,
    congregacao: "ILHA DO PONTAL",
  },
  {
    area: 18,
    congregacao: "OURO VERDE",
  },
  {
    area: 18,
    congregacao: "RIACHO DO RECREIO",
  },
  {
    area: 18,
    congregacao: "VERMELHOS III",
  },
  {
    area: 19,
    congregacao: "N - 9 I",
  },
  {
    area: 19,
    congregacao: "C - 3",
  },
  {
    area: 19,
    congregacao: "N - 6 I",
  },
  {
    area: 19,
    congregacao: "N - 6 II",
  },
  {
    area: 19,
    congregacao: "N - 6 III",
  },
  {
    area: 19,
    congregacao: "N - 7 I",
  },
  {
    area: 19,
    congregacao: "N - 7 II",
  },
  {
    area: 19,
    congregacao: "N - 8 I",
  },
  {
    area: 19,
    congregacao: "N - 8 II",
  },
  {
    area: 19,
    congregacao: "N - 9 II",
  },
  {
    area: 20,
    congregacao: "RIO CORRENTE",
  },
  {
    area: 20,
    congregacao: "ASS. SÃO PAULO",
  },
  {
    area: 20,
    congregacao: "JARDIM GUARARAPES",
  },
  {
    area: 20,
    congregacao: "JARDIM PETRÓPOLIS I",
  },
  {
    area: 20,
    congregacao: "JARDIM PETRÓPOLIS II",
  },
  {
    area: 20,
    congregacao: "NOVA PETROLINA",
  },
  {
    area: 20,
    congregacao: "RESIDENCIAL BRASIL",
  },
  {
    area: 20,
    congregacao: "RESIDENCIAL PALMARES",
  },
];

export const areas = congregacoes.reduce((acc, item) => {
  if (!acc[item.area]) {
    acc[item.area] = { congregacoes: [] };
  }
  acc[item.area].congregacoes.push(item.congregacao);
  return acc;
}, {} as Record<number, { congregacoes: string[] }>);
