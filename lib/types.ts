// Tipos centrais do DailyQuiz. Mantidos pequenos e estáveis — toda a árvore
// de decisões e lógica de finais depende dessas formas.

export type StatKey = "health" | "focus" | "social" | "money";

export type Stats = Record<StatKey, number>;

export type CharacterGender = "boy" | "girl";

/** Local da casa em que o personagem se encontra ao apresentar a escolha. */
export type Room = "bedroom" | "kitchen" | "livingroom" | "outside";

/** Tag semântica usada para o resumo final ("escolheu celular 5×", etc). */
export type ChoiceTag =
  | "phone"
  | "study"
  | "sleep"
  | "exercise"
  | "family"
  | "create"
  | "junk"
  | "rest"
  | "scroll"
  | "ai-cheat";

export interface ChoiceOption {
  id: string;
  /** Texto curto exibido no botão. */
  label: string;
  /** Descrição opcional logo abaixo do botão. */
  hint?: string;
  /** Delta aplicado nos stats ao escolher esta opção. */
  effects: Partial<Stats>;
  /** Tags acumuladas no histórico para a tela de final. */
  tags: ChoiceTag[];
}

export interface Choice {
  id: string;
  /** Dia (1..N) em que a escolha aparece. */
  day: number;
  /** Ordem dentro do dia (1..M). */
  order: number;
  /** Pergunta apresentada ao jogador. */
  prompt: string;
  /** Onde o personagem está nesse momento. Afeta o GameCanvas. */
  room: Room;
  /** Hora do dia (para texto narrativo). */
  timeOfDay: "manha" | "tarde" | "noite" | "madrugada";
  options: [ChoiceOption, ChoiceOption];
}

export interface ChoiceRecord {
  choiceId: string;
  optionId: string;
  day: number;
  label: string;
  effects: Partial<Stats>;
  tags: ChoiceTag[];
}

export type EndingType =
  | "fulfilled"
  | "rich-lonely"
  | "famous-empty"
  | "mediocre"
  | "lonely"
  | "broke"
  | "tragic";

export interface EndingDescriptor {
  type: EndingType;
  title: string;
  /** Texto narrativo reflexivo (3-5 frases). */
  narrative: string;
  /** Paleta de fundo da cena final. */
  palette: {
    sky: string;
    ground: string;
    accent: string;
  };
  /** Texto curto que ilustra a cena pixelada (mood). */
  scene: string;
}
