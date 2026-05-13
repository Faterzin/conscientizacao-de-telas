import type {
  ChoiceRecord,
  ChoiceTag,
  EndingDescriptor,
  EndingType,
  Stats,
} from "./types";

/**
 * Como o final é escolhido:
 *
 * 1. Se a saúde chegou a 0 → "tragic" (game over precoce, prevalece sobre tudo).
 * 2. Se todos os stats > 70 → "fulfilled".
 * 3. Caso contrário, regras descendentes detectam o perfil dominante.
 * 4. Fallback: "mediocre".
 */
export function calculateEnding(
  stats: Stats,
  history: ChoiceRecord[],
  diedEarly: boolean,
): EndingType {
  if (diedEarly || stats.health <= 0) return "tragic";

  const all = (min: number) =>
    stats.health >= min &&
    stats.focus >= min &&
    stats.social >= min &&
    stats.money >= min;

  if (all(70)) return "fulfilled";

  // Rico mas sozinho: dinheiro + foco altos, social baixo.
  if (stats.money >= 65 && stats.focus >= 60 && stats.social < 40)
    return "rich-lonely";

  // Famoso mas vazio: social alto, saúde baixa (vida noturna / palco).
  if (stats.social >= 70 && stats.health < 45) return "famous-empty";

  // Solidão pura.
  if (stats.social < 25) return "lonely";

  // Pobreza extrema: dinheiro e foco no chão.
  if (stats.money < 30 && stats.focus < 35) return "broke";

  return "mediocre";
}

export const ENDINGS: Record<EndingType, EndingDescriptor> = {
  fulfilled: {
    type: "fulfilled",
    title: "Realizado(a)",
    narrative:
      "Você acordou em uma casa sua, com as janelas abertas. No celular, mensagens de pessoas que importam. No quintal, um projeto que começou pequeno e cresceu junto com você. Foram as escolhas miúdas — dormir cedo, atender quem amava, estudar sem atalho — que te trouxeram até aqui.",
    palette: { sky: "#f6c9a7", ground: "#7fb069", accent: "#e7b94d" },
    scene: "Casa pixelada com jardim ao amanhecer, fumaça do café saindo da chaminé.",
  },
  "rich-lonely": {
    type: "rich-lonely",
    title: "Bem-sucedido(a), mas só",
    narrative:
      "O escritório no alto da cidade tem uma vista linda — e ninguém pra dividir. As conquistas profissionais vieram, o dinheiro também. Mas as ligações dos amigos pararam há tempos, e a família já não sabe ao certo o que você faz. Trocou presença por planilha.",
    palette: { sky: "#2a3a55", ground: "#3a3a4a", accent: "#6b8fd9" },
    scene: "Silhueta sozinha na janela de um arranha-céu à noite.",
  },
  "famous-empty": {
    type: "famous-empty",
    title: "Famoso(a), mas vazio",
    narrative:
      "Milhões de seguidores. Notificações sem parar. Mas a cama nunca foi tão grande, e o corpo já não responde como antes. O reflexo no espelho do camarim te lembra: você se vendeu por curtidas e esqueceu de viver pra si.",
    palette: { sky: "#d96b6b", ground: "#1d2840", accent: "#e7b94d" },
    scene: "Camarim com luzes piscando, espelho rachado refletindo o personagem cansado.",
  },
  mediocre: {
    type: "mediocre",
    title: "Vida mediana",
    narrative:
      "Você não foi mal. Mas também não foi pra lugar nenhum em especial. Tem um trabalho que paga as contas, alguns amigos que ainda chamam, uma rotina que enche os dias sem encher o peito. No fim da tarde, ainda olha o teto pensando 'e se?'.",
    palette: { sky: "#8a8a8a", ground: "#6e6253", accent: "#a87246" },
    scene: "Sala pequena, televisão ligada, café frio na mesa.",
  },
  lonely: {
    type: "lonely",
    title: "Solidão",
    narrative:
      "As telas viraram a sua única companhia. O quarto fechado, as cortinas baixadas. Ninguém ligou pra perguntar como você está há semanas. E você também não ligou pra ninguém. O silêncio dói mais do que qualquer notificação.",
    palette: { sky: "#1d2840", ground: "#2a1b0e", accent: "#6b8fd9" },
    scene: "Quarto escuro iluminado só pela tela do celular.",
  },
  broke: {
    type: "broke",
    title: "Pobreza & arrependimento",
    narrative:
      "Os atalhos que pareciam espertos cobraram seu preço. Sem estudo, sem oficio, sem dinheiro guardado. As contas chegam, as portas se fecham, e o futuro virou um quarto cada vez menor. Você lembra dos dias em que tudo era possível.",
    palette: { sky: "#5a4424", ground: "#2a1b0e", accent: "#d96b6b" },
    scene: "Quarto vazio com colchão no chão e contas espalhadas.",
  },
  tragic: {
    type: "tragic",
    title: "Game over — partida cedo demais",
    narrative:
      "O corpo avisou várias vezes. Você não escutou. Madrugadas demais, comida demais, sol de menos, gente de menos. Restou um arrependimento que ninguém ouve. Era só pra ser um joguinho — virou a sua vida.",
    palette: { sky: "#1d2840", ground: "#2a1b0e", accent: "#d96b6b" },
    scene: "Quarto silencioso, celular caído no chão, tela ainda piscando.",
  },
};

/**
 * Pega as 3 escolhas mais "decisivas" do histórico: as que tiveram
 * o maior impacto absoluto na soma de stats.
 */
export function summarizeDecisions(history: ChoiceRecord[]): ChoiceRecord[] {
  const score = (r: ChoiceRecord) =>
    Math.abs(r.effects.health ?? 0) +
    Math.abs(r.effects.focus ?? 0) +
    Math.abs(r.effects.social ?? 0) +
    Math.abs(r.effects.money ?? 0);
  return [...history].sort((a, b) => score(b) - score(a)).slice(0, 3);
}

/** Conta quantas vezes cada tag apareceu no histórico do jogador. */
export function countTags(history: ChoiceRecord[]): Record<ChoiceTag, number> {
  const out: Record<string, number> = {};
  for (const r of history) {
    for (const t of r.tags) {
      out[t] = (out[t] ?? 0) + 1;
    }
  }
  return out as Record<ChoiceTag, number>;
}
