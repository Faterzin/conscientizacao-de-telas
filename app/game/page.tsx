"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "framer-motion";
import StatsBar from "@/components/StatsBar";
import DayCounter from "@/components/DayCounter";
import ChoiceModal from "@/components/ChoiceModal";
import PixelButton from "@/components/PixelButton";
import { useGameStore } from "@/lib/store";
import { TOTAL_DAYS } from "@/lib/choices";
import { calculateEnding } from "@/lib/endings";
import { playSfx } from "@/lib/audio";
import type { Choice, ChoiceOption } from "@/lib/types";

// Konva precisa de window — carrega só no client.
const GameCanvas = dynamic(() => import("@/components/GameCanvas"), {
  ssr: false,
  loading: () => (
    <div className="w-full aspect-video bg-pixel-night pixel-border flex items-center justify-center text-xs opacity-50">
      Carregando cenário…
    </div>
  ),
});

export default function GamePage() {
  const router = useRouter();
  const hydrated = useGameStore((s) => s.hydrated);
  const day = useGameStore((s) => s.day);
  const orderInDay = useGameStore((s) => s.orderInDay);
  const stats = useGameStore((s) => s.stats);
  const gender = useGameStore((s) => s.gender);
  const lastDelta = useGameStore((s) => s.lastDelta);
  const finished = useGameStore((s) => s.finished);
  const history = useGameStore((s) => s.history);
  const currentChoice = useGameStore((s) => s.currentChoice);
  const applyChoice = useGameStore((s) => s.applyChoice);

  const [transition, setTransition] = useState<string | null>(null);
  // Ref em vez de state: atualizar não causa re-render, então o cleanup
  // do useEffect só roda quando `day` realmente muda — caso contrário, o
  // setTimeout que fecha a tela "Dia X" seria cancelado por si mesmo.
  const prevDayRef = useRef(day);
  // Modal só aparece depois que o jogador teve tempo de observar o cenário.
  // Toca pelo `choice.id` — pode ser pulado clicando "Continuar".
  const [modalReady, setModalReady] = useState(false);
  const MODAL_DELAY_MS = 1500;

  const choice: Choice | null = useMemo(
    () => (hydrated ? currentChoice() : null),
    // orderInDay precisa estar nas deps: sem ele, escolhas dentro do mesmo
    // dia (order 1→2→3) não recalculam e o modal mostra a pergunta velha.
    [hydrated, day, orderInDay, currentChoice],
  );

  // Quando o dia muda, mostra a tela "Dia X" por ~1.4s.
  useEffect(() => {
    if (!hydrated) return;
    if (day !== prevDayRef.current) {
      prevDayRef.current = day;
      setTransition(`Dia ${day}`);
      playSfx("day");
      const t = setTimeout(() => setTransition(null), 1400);
      return () => clearTimeout(t);
    }
  }, [day, hydrated]);

  // Quando finished, navega pra tela de ending.
  useEffect(() => {
    if (!hydrated || !finished) return;
    const type = calculateEnding(stats, history, stats.health <= 0);
    playSfx("ending");
    router.push(`/ending/${type}`);
  }, [finished, hydrated, stats, history, router]);

  // Pausa antes do modal: ao mudar de pergunta, esconde o modal e libera
  // após MODAL_DELAY_MS pra dar tempo de ver o cenário. Se houver
  // transição de dia em curso, o effect re-roda quando ela termina e a
  // espera começa a partir daí — efeito: cenário visível antes da pergunta.
  useEffect(() => {
    if (!hydrated || !choice || transition) {
      setModalReady(false);
      return;
    }
    setModalReady(false);
    const t = setTimeout(() => setModalReady(true), MODAL_DELAY_MS);
    return () => clearTimeout(t);
  }, [choice?.id, hydrated, transition]);

  function handlePick(option: ChoiceOption) {
    if (!choice) return;
    applyChoice(choice, option);
  }

  if (!hydrated) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-xs opacity-60">Carregando…</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-stretch p-4 md:p-8 gap-4 max-w-5xl mx-auto">
      {/* Topo: contador + stats */}
      <header className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <PixelButton
            variant="ghost"
            onClick={() => router.push("/")}
            aria-label="Voltar ao menu"
          >
            ◀ Menu
          </PixelButton>
          <DayCounter
            day={day}
            total={TOTAL_DAYS}
            timeOfDay={choice?.timeOfDay ?? "manha"}
          />
          <div className="w-[64px]" />{/* spacer simétrico */}
        </div>
        <StatsBar stats={stats} delta={lastDelta} />
      </header>

      {/* Cenário */}
      <section className="flex-1 flex items-center justify-center">
        <GameCanvas
          room={choice?.room ?? "bedroom"}
          gender={gender}
          pose={poseFor(choice)}
        />
      </section>

      {/* Modal de escolha */}
      <AnimatePresence>
        {choice && !transition && !finished && modalReady && (
          <ChoiceModal key={choice.id} choice={choice} onPick={handlePick} />
        )}
      </AnimatePresence>

      {/* Transição entre dias */}
      <AnimatePresence>
        {transition && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-pixel-night flex items-center justify-center"
            style={{ background: "var(--color-pixel-night)" }}
          >
            <motion.h2
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="text-2xl md:text-3xl"
              style={{ color: "var(--color-pixel-gold)" }}
            >
              {transition}
            </motion.h2>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

function poseFor(choice: Choice | null) {
  if (!choice) return "idle";
  if (choice.timeOfDay === "madrugada" || choice.timeOfDay === "noite")
    return "sleep";
  if (choice.room === "bedroom" && choice.order === 3) return "study";
  return "idle";
}
