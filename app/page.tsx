"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import PixelButton from "@/components/PixelButton";
import { useGameStore } from "@/lib/store";
import { TOTAL_DAYS } from "@/lib/choices";
import type { CharacterGender } from "@/lib/types";

export default function MenuPage() {
  const [mounted, setMounted] = useState(false);
  const setGender = useGameStore((s) => s.setGender);
  const startNewGame = useGameStore((s) => s.startNewGame);
  const gender = useGameStore((s) => s.gender);
  const hydrated = useGameStore((s) => s.hydrated);
  const day = useGameStore((s) => s.day);
  const history = useGameStore((s) => s.history);
  const finished = useGameStore((s) => s.finished);

  useEffect(() => {
    setMounted(true);
  }, []);

  const hasSave = mounted && hydrated && history.length > 0 && !finished;

  return (
    <main className="menu-bg min-h-screen flex flex-col items-center px-4 py-6">
      {/* Logo "DailyQuiz" está desenhado dentro da imagem de fundo,
          então o título textual fica só para leitores de tela. */}
      <h1 className="sr-only">DailyQuiz</h1>

      {/* Empurra o conteúdo pra metade-baixo da lousa, onde o fundo é
          uniforme (verde) — fica longe do logo no topo e dos objetos
          de canto (régua, tesoura, livro, lápis). */}
      <div className="flex-1" aria-hidden="true" />

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex flex-col items-center gap-6 max-w-md w-full"
      >
        <p
          className="text-[10px] md:text-xs text-center leading-relaxed"
          style={{
            color: "var(--color-pixel-cream)",
            textShadow: "2px 2px 0 rgba(0,0,0,0.55)",
          }}
        >
          Cada escolha do dia muda quem você se torna.
          <br />
          {TOTAL_DAYS} dias. Sua história. Suas consequências.
        </p>

        {/* Escolha de personagem */}
        <div className="flex flex-col items-center gap-2">
          <span
            className="text-[9px] uppercase tracking-widest"
            style={{
              color: "var(--color-pixel-cream)",
              textShadow: "1px 1px 0 rgba(0,0,0,0.6)",
            }}
          >
            Escolha o personagem
          </span>
          <div className="flex gap-3">
            {(["boy", "girl"] as CharacterGender[]).map((g) => (
              <button
                key={g}
                onClick={() => setGender(g)}
                aria-pressed={gender === g}
                className={`pixel-btn pixel-border-soft ${
                  gender === g ? "ring-2 ring-pixel-gold" : "opacity-80"
                }`}
                style={
                  gender === g
                    ? {
                        background: "var(--color-pixel-gold)",
                        color: "var(--color-pixel-ink)",
                      }
                    : undefined
                }
              >
                {g === "boy" ? "Menino" : "Menina"}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3 items-center">
          <Link href="/game" onClick={() => startNewGame(gender)}>
            <PixelButton>Começar</PixelButton>
          </Link>

          {hasSave && (
            <Link href="/game">
              <PixelButton variant="ghost">Continuar (dia {day})</PixelButton>
            </Link>
          )}
        </div>
      </motion.div>

      <div className="flex-1" aria-hidden="true" />

      <footer
        className="text-[8px] text-center max-w-md leading-relaxed pb-2"
        style={{
          color: "var(--color-pixel-cream)",
          textShadow: "1px 1px 0 rgba(0,0,0,0.55)",
          opacity: 0.75,
        }}
      >
        Um jogo pra refletir. Suas decisões somam — ou subtraem — saúde, foco,
        social e finanças.
      </footer>
    </main>
  );
}
