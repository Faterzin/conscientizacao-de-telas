"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type {
  CharacterGender,
  Choice,
  ChoiceOption,
  ChoiceRecord,
  Stats,
} from "./types";
import { CHOICES, TOTAL_DAYS } from "./choices";

interface GameState {
  // ---- save ----
  hydrated: boolean;
  gender: CharacterGender;
  day: number;
  /** Índice da escolha atual dentro do dia. */
  orderInDay: number;
  stats: Stats;
  history: ChoiceRecord[];
  /** Última variação aplicada — usado para animar deltas. */
  lastDelta: Partial<Stats>;
  /** true assim que o jogador chegou em um final ou morreu. */
  finished: boolean;

  // ---- ações ----
  startNewGame: (gender: CharacterGender) => void;
  setGender: (g: CharacterGender) => void;
  applyChoice: (choice: Choice, option: ChoiceOption) => void;
  resetGame: () => void;
  setHydrated: () => void;
  currentChoice: () => Choice | null;
}

const INITIAL_STATS: Stats = {
  health: 70,
  focus: 60,
  social: 60,
  money: 50,
};

const clamp = (n: number) => Math.max(0, Math.min(100, n));

/** Aplica um delta parcial aos stats, fazendo clamp em [0,100]. */
function applyDelta(stats: Stats, delta: Partial<Stats>): Stats {
  return {
    health: clamp(stats.health + (delta.health ?? 0)),
    focus: clamp(stats.focus + (delta.focus ?? 0)),
    social: clamp(stats.social + (delta.social ?? 0)),
    money: clamp(stats.money + (delta.money ?? 0)),
  };
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      hydrated: false,
      gender: "boy",
      day: 1,
      orderInDay: 1,
      stats: { ...INITIAL_STATS },
      history: [],
      lastDelta: {},
      finished: false,

      setHydrated: () => set({ hydrated: true }),

      setGender: (gender) => set({ gender }),

      startNewGame: (gender) =>
        set({
          gender,
          day: 1,
          orderInDay: 1,
          stats: { ...INITIAL_STATS },
          history: [],
          lastDelta: {},
          finished: false,
        }),

      resetGame: () =>
        set({
          day: 1,
          orderInDay: 1,
          stats: { ...INITIAL_STATS },
          history: [],
          lastDelta: {},
          finished: false,
        }),

      currentChoice: () => {
        const { day, orderInDay } = get();
        return (
          CHOICES.find((c) => c.day === day && c.order === orderInDay) ?? null
        );
      },

      applyChoice: (choice, option) => {
        const prev = get();
        const stats = applyDelta(prev.stats, option.effects);
        const record: ChoiceRecord = {
          choiceId: choice.id,
          optionId: option.id,
          day: choice.day,
          label: option.label,
          effects: option.effects,
          tags: option.tags,
        };

        // Avança ponteiro: próxima escolha do mesmo dia, ou dia seguinte.
        const sameDay = CHOICES.filter((c) => c.day === choice.day);
        const isLastOfDay = choice.order >= sameDay.length;
        let nextDay = prev.day;
        let nextOrder = prev.orderInDay + 1;
        if (isLastOfDay) {
          nextDay = prev.day + 1;
          nextOrder = 1;
        }

        // Game over precoce: saúde a zero encerra o jogo antes do último dia.
        const tragicDeath = stats.health <= 0;
        const completed = nextDay > TOTAL_DAYS;

        set({
          stats,
          history: [...prev.history, record],
          lastDelta: option.effects,
          day: tragicDeath || completed ? prev.day : nextDay,
          orderInDay: tragicDeath || completed ? prev.orderInDay : nextOrder,
          finished: tragicDeath || completed,
        });
      },
    }),
    {
      name: "dailyquiz-save-v1",
      storage: createJSONStorage(() => localStorage),
      // Não persistir hydrated/lastDelta — são efêmeros.
      partialize: (s) => ({
        gender: s.gender,
        day: s.day,
        orderInDay: s.orderInDay,
        stats: s.stats,
        history: s.history,
        finished: s.finished,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
    },
  ),
);

export { INITIAL_STATS };
