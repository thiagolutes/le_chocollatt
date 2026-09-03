function doisDigitos(valor: number): string {
  return String(valor).padStart(2, "0");
}

/**
 * Data de hoje no formato "AAAA-MM-DD" (mesmo formato do input type="date"),
 * usando o horário local do navegador para evitar erros de fuso horário.
 */
export function obterDataDeHojeIso(): string {
  const agora = new Date();
  return [agora.getFullYear(), doisDigitos(agora.getMonth() + 1), doisDigitos(agora.getDate())].join(
    "-",
  );
}

/**
 * Compara datas no formato "AAAA-MM-DD" como texto: como os componentes são
 * sempre preenchidos com zero à esquerda, a ordem lexicográfica coincide com
 * a ordem cronológica, sem precisar converter para Date.
 */
export function dataEhAnteriorAHoje(dataIso: string): boolean {
  return dataIso < obterDataDeHojeIso();
}

export function formatarDataBrasileira(dataIso: string): string {
  const [ano, mes, dia] = dataIso.split("-");
  if (!ano || !mes || !dia) return dataIso;
  return `${dia}/${mes}/${ano}`;
}
