import type { Choice } from "./types";

/**
 * Árvore de decisões. 7 dias × 3 escolhas/dia = 21 decisões.
 * Cada escolha é binária; o jogador acumula consequências nos 4 stats.
 *
 * Para adicionar um dia: copie o bloco abaixo, mude `day` e ajuste prompts.
 * Para adicionar uma escolha extra dentro do dia: incremente `order`.
 */
export const CHOICES: Choice[] = [
  // ============ DIA 1 ============
  {
    id: "d1-wake",
    day: 1,
    order: 1,
    room: "bedroom",
    timeOfDay: "manha",
    prompt: "O despertador toca. O quarto ainda está escuro. O que fazer?",
    options: [
      {
        id: "wake-up",
        label: "Levantar",
        hint: "Abrir a janela e começar o dia",
        effects: { health: +4, focus: +3 },
        tags: ["sleep"],
      },
      {
        id: "snooze",
        label: "Dormir mais",
        hint: "Mais 30 minutinhos…",
        effects: { health: -2, focus: -3 },
        tags: ["rest"],
      },
    ],
  },
  {
    id: "d1-breakfast",
    day: 1,
    order: 2,
    room: "kitchen",
    timeOfDay: "manha",
    prompt: "Cheiro de pão na cozinha. O celular vibra na bancada.",
    options: [
      {
        id: "eat",
        label: "Tomar café da manhã",
        hint: "Comer com calma",
        effects: { health: +5, focus: +2, social: +1 },
        tags: ["family"],
      },
      {
        id: "phone-breakfast",
        label: "Mexer no celular",
        hint: "Só ver as notificações",
        effects: { health: -2, focus: -3, social: +1 },
        tags: ["phone", "scroll"],
      },
    ],
  },
  {
    id: "d1-study",
    day: 1,
    order: 3,
    room: "bedroom",
    timeOfDay: "tarde",
    prompt: "Tem uma tarefa de matemática pra entregar amanhã.",
    options: [
      {
        id: "study-real",
        label: "Estudar de verdade",
        hint: "Resolver com a própria cabeça",
        effects: { focus: +8, money: +2 },
        tags: ["study"],
      },
      {
        id: "ai-copy",
        label: "Copiar tudo da IA",
        hint: "Cola, prontinho",
        effects: { focus: -6, money: -1, social: +1 },
        tags: ["ai-cheat", "phone"],
      },
    ],
  },

  // ============ DIA 2 ============
  {
    id: "d2-wake",
    day: 2,
    order: 1,
    room: "bedroom",
    timeOfDay: "manha",
    prompt: "Domingo. Sem aula. Que tal a manhã?",
    options: [
      {
        id: "exercise",
        label: "Sair pra correr",
        hint: "Sol no rosto",
        effects: { health: +8, focus: +3 },
        tags: ["exercise"],
      },
      {
        id: "bed-scroll",
        label: "Ficar na cama no celular",
        hint: "Scroll infinito",
        effects: { health: -4, focus: -4 },
        tags: ["phone", "scroll"],
      },
    ],
  },
  {
    id: "d2-family",
    day: 2,
    order: 2,
    room: "livingroom",
    timeOfDay: "tarde",
    prompt: "A família está jogando um jogo de tabuleiro na sala.",
    options: [
      {
        id: "join-family",
        label: "Jogar junto",
        hint: "Rir um pouco",
        effects: { social: +7, health: +3 },
        tags: ["family"],
      },
      {
        id: "isolate",
        label: "Ir pro quarto",
        hint: "Tô cansado",
        effects: { social: -5, health: -2 },
        tags: ["scroll", "phone"],
      },
    ],
  },
  {
    id: "d2-night",
    day: 2,
    order: 3,
    room: "bedroom",
    timeOfDay: "noite",
    prompt: "23h. Amanhã tem prova. O quarto está silencioso.",
    options: [
      {
        id: "sleep-early",
        label: "Dormir agora",
        hint: "Apagar a luz",
        effects: { health: +6, focus: +5 },
        tags: ["sleep"],
      },
      {
        id: "stay-up",
        label: "Virar a madrugada online",
        hint: "Só mais um vídeo",
        effects: { health: -10, focus: -5 },
        tags: ["phone", "scroll"],
      },
    ],
  },

  // ============ DIA 3 ============
  {
    id: "d3-test",
    day: 3,
    order: 1,
    room: "outside",
    timeOfDay: "manha",
    prompt: "Dia de prova. Você não revisou direito. E agora?",
    options: [
      {
        id: "honest",
        label: "Fazer com calma",
        hint: "Confiar no que sabe",
        effects: { focus: +5, money: +3 },
        tags: ["study"],
      },
      {
        id: "cheat",
        label: "Olhar no celular escondido",
        hint: "Arriscar",
        effects: { focus: -6, money: -4, social: -3 },
        tags: ["phone", "ai-cheat"],
      },
    ],
  },
  {
    id: "d3-snack",
    day: 3,
    order: 2,
    room: "kitchen",
    timeOfDay: "tarde",
    prompt: "Fome no meio da tarde. O que pegar?",
    options: [
      {
        id: "fruit",
        label: "Comer uma fruta",
        effects: { health: +5 },
        tags: ["family"],
      },
      {
        id: "junk",
        label: "Salgadinho + refrigerante",
        effects: { health: -4, focus: -2 },
        tags: ["junk"],
      },
    ],
  },
  {
    id: "d3-create",
    day: 3,
    order: 3,
    room: "bedroom",
    timeOfDay: "noite",
    prompt: "Tempo livre. Você pensa em algo pra fazer.",
    options: [
      {
        id: "make",
        label: "Desenhar / escrever",
        hint: "Criar algo seu",
        effects: { focus: +6, social: +1, health: +2 },
        tags: ["create"],
      },
      {
        id: "binge",
        label: "Maratonar série",
        hint: "Mais um episódio",
        effects: { health: -3, focus: -3 },
        tags: ["scroll"],
      },
    ],
  },

  // ============ DIA 4 ============
  {
    id: "d4-friend",
    day: 4,
    order: 1,
    room: "outside",
    timeOfDay: "tarde",
    prompt: "Um amigo te chama pra dar uma volta na praça.",
    options: [
      {
        id: "go-out",
        label: "Ir encontrar o amigo",
        effects: { social: +8, health: +3 },
        tags: ["family", "exercise"],
      },
      {
        id: "stay-online",
        label: "Conversar online no quarto",
        effects: { social: +1, health: -3 },
        tags: ["phone", "scroll"],
      },
    ],
  },
  {
    id: "d4-money",
    day: 4,
    order: 2,
    room: "livingroom",
    timeOfDay: "tarde",
    prompt: "Sua tia te deu R$ 50 de mesada. O que fazer?",
    options: [
      {
        id: "save",
        label: "Guardar metade",
        hint: "Pensar no futuro",
        effects: { money: +6, focus: +2 },
        tags: ["study"],
      },
      {
        id: "skin",
        label: "Comprar skin no jogo",
        hint: "É só uma…",
        effects: { money: -4, social: +1 },
        tags: ["phone", "junk"],
      },
    ],
  },
  {
    id: "d4-night",
    day: 4,
    order: 3,
    room: "bedroom",
    timeOfDay: "madrugada",
    prompt: "1h da manhã. O celular ainda está aceso na sua cara.",
    options: [
      {
        id: "phone-off",
        label: "Largar e dormir",
        effects: { health: +6, focus: +4 },
        tags: ["sleep"],
      },
      {
        id: "keep-scrolling",
        label: "Mais 10 minutos",
        hint: "Vira facilmente em 2h",
        effects: { health: -8, focus: -4 },
        tags: ["phone", "scroll"],
      },
    ],
  },

  // ============ DIA 5 ============
  {
    id: "d5-mom",
    day: 5,
    order: 1,
    room: "kitchen",
    timeOfDay: "manha",
    prompt: "Sua mãe pede ajuda pra arrumar a cozinha antes da escola.",
    options: [
      {
        id: "help",
        label: "Ajudar",
        effects: { social: +5, health: +2 },
        tags: ["family"],
      },
      {
        id: "ignore-mom",
        label: "Fingir que não ouviu",
        effects: { social: -5, health: -1 },
        tags: ["scroll", "phone"],
      },
    ],
  },
  {
    id: "d5-class",
    day: 5,
    order: 2,
    room: "outside",
    timeOfDay: "tarde",
    prompt: "Aula chata de história. O celular está no bolso.",
    options: [
      {
        id: "pay-attention",
        label: "Prestar atenção",
        effects: { focus: +6, money: +2 },
        tags: ["study"],
      },
      {
        id: "phone-under",
        label: "Mexer no celular escondido",
        effects: { focus: -5, social: -1, money: -2 },
        tags: ["phone", "scroll"],
      },
    ],
  },
  {
    id: "d5-project",
    day: 5,
    order: 3,
    room: "bedroom",
    timeOfDay: "noite",
    prompt: "Você teve uma ideia legal pra um projeto pessoal.",
    options: [
      {
        id: "start-project",
        label: "Começar agora",
        hint: "Anotar e prototipar",
        effects: { focus: +8, money: +3, health: +1 },
        tags: ["create"],
      },
      {
        id: "later",
        label: "Deixar pra depois",
        hint: "Abrir TikTok",
        effects: { focus: -3, health: -2 },
        tags: ["phone", "scroll"],
      },
    ],
  },

  // ============ DIA 6 ============
  {
    id: "d6-exercise",
    day: 6,
    order: 1,
    room: "outside",
    timeOfDay: "manha",
    prompt: "O sol está bonito lá fora. Pernas formigando.",
    options: [
      {
        id: "bike",
        label: "Pegar a bicicleta",
        effects: { health: +8, focus: +3, social: +2 },
        tags: ["exercise"],
      },
      {
        id: "stream",
        label: "Ficar deitado vendo stream",
        effects: { health: -5, focus: -3 },
        tags: ["scroll"],
      },
    ],
  },
  {
    id: "d6-dinner",
    day: 6,
    order: 2,
    room: "kitchen",
    timeOfDay: "noite",
    prompt: "Jantar em família. Todo mundo na mesa. O celular vibra.",
    options: [
      {
        id: "talk",
        label: "Conversar de verdade",
        effects: { social: +7, health: +3 },
        tags: ["family"],
      },
      {
        id: "screen-dinner",
        label: "Comer olhando a tela",
        effects: { social: -5, health: -3 },
        tags: ["phone", "scroll"],
      },
    ],
  },
  {
    id: "d6-help",
    day: 6,
    order: 3,
    room: "livingroom",
    timeOfDay: "noite",
    prompt: "Seu irmão mais novo pede ajuda com o dever.",
    options: [
      {
        id: "teach",
        label: "Sentar e ensinar",
        hint: "Explicar com paciência",
        effects: { social: +6, focus: +4 },
        tags: ["family", "study"],
      },
      {
        id: "send-ai",
        label: "Mandar ele copiar da IA",
        effects: { social: -4, focus: -3 },
        tags: ["ai-cheat", "phone"],
      },
    ],
  },

  // ============ DIA 7 ============
  {
    id: "d7-decision",
    day: 7,
    order: 1,
    room: "bedroom",
    timeOfDay: "manha",
    prompt: "Você acorda pensando: e se eu mudasse hoje?",
    options: [
      {
        id: "commit",
        label: "Tirar o dia pra cuidar de si",
        hint: "Sem celular, com calma",
        effects: { health: +8, focus: +6, social: +3 },
        tags: ["sleep", "create", "family"],
      },
      {
        id: "same",
        label: "Mais um dia igual",
        hint: "Cama, celular, repete",
        effects: { health: -5, focus: -5, social: -3, money: -2 },
        tags: ["phone", "scroll"],
      },
    ],
  },
  {
    id: "d7-future",
    day: 7,
    order: 2,
    room: "livingroom",
    timeOfDay: "tarde",
    prompt: "Você pensa em quem quer ser daqui a 10 anos.",
    options: [
      {
        id: "plan",
        label: "Escrever um plano",
        hint: "Metas, passos, hábitos",
        effects: { focus: +6, money: +5 },
        tags: ["create", "study"],
      },
      {
        id: "avoid",
        label: "Não pensar nisso agora",
        hint: "Distrair com vídeos",
        effects: { focus: -4, money: -3 },
        tags: ["phone", "scroll"],
      },
    ],
  },
  {
    id: "d7-night",
    day: 7,
    order: 3,
    room: "bedroom",
    timeOfDay: "noite",
    prompt: "Última noite antes do amanhã. Como você se despede do dia?",
    options: [
      {
        id: "gratitude",
        label: "Escrever 3 coisas boas do dia",
        hint: "Sono leve",
        effects: { health: +6, social: +3, focus: +3 },
        tags: ["create", "family", "sleep"],
      },
      {
        id: "doom",
        label: "Scroll até cair de sono",
        effects: { health: -8, focus: -5 },
        tags: ["phone", "scroll"],
      },
    ],
  },
];

/** Total de dias considerando a árvore atual. */
export const TOTAL_DAYS = Math.max(...CHOICES.map((c) => c.day));
