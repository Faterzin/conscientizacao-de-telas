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

  // Evita mismatch de hidratação: só renderizamos o que depende do save
  // depois que o store rehidratou do localStorage.
  useEffect(() => {
    setMounted(true);
  }, []);

  const hasSave = mounted && hydrated && history.length > 0 && !finished;

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-10 gap-8">
      <motion.h1
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl md:text-4xl text-center leading-relaxed"
        style={{ color: "var(--color-pixel-gold)" }}
      >
        Daily<span style={{ color: "var(--color-pixel-cream)" }}>Quiz</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-[10px] md:text-xs text-center max-w-md opacity-80 leading-relaxed"
      >
        Cada escolha do dia muda quem você se torna.
        <br />
        {TOTAL_DAYS} dias. Sua história. Suas consequências.
      </motion.p>

      {/* Escolha de personagem */}
      <div className="flex flex-col items-center gap-3">
        <span className="text-[10px] uppercase tracking-widest opacity-70">
          Escolha o personagem
        </span>
        <div className="flex gap-3">
          {(["boy", "girl"] as CharacterGender[]).map((g) => (
            <button
              key={g}
              onClick={() => setGender(g)}
              aria-pressed={gender === g}
              className={`pixel-btn pixel-border-soft ${
                gender === g ? "ring-2 ring-pixel-gold" : "opacity-70"
              }`}
              style={
                gender === g
                  ? { background: "var(--color-pixel-gold)", color: "var(--color-pixel-ink)" }
                  : undefined
              }
            >
              {g === "boy" ? "Menino" : "Menina"}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3 items-center mt-2">
        <Link href="/game" onClick={() => startNewGame(gender)}>
          <PixelButton>Começar</PixelButton>
        </Link>

        {hasSave && (
          <Link href="/game">
            <PixelButton variant="ghost">
              Continuar (dia {day})
            </PixelButton>
          </Link>
        )}
      </div>

      <footer className="mt-12 text-[8px] opacity-50 text-center max-w-md leading-relaxed">
        Um jogo pra refletir. Suas decisões somam — ou subtraem — saúde, foco,
        social e finanças.
      </footer>
    </main>
  );
}
