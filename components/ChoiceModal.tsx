"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { Choice, ChoiceOption } from "@/lib/types";
import PixelButton from "./PixelButton";
import { useState } from "react";
import { playSfx } from "@/lib/audio";

interface Props {
  choice: Choice;
  onPick: (option: ChoiceOption) => void;
}

/**
 * Modal central com a decisão binária do dia. Anima entrada via framer-motion,
 * faz um pequeno "fechar" antes de chamar onPick pra dar feedback visual.
 */
export default function ChoiceModal({ choice, onPick }: Props) {
  const [picked, setPicked] = useState<string | null>(null);

  function handle(option: ChoiceOption) {
    if (picked) return;
    setPicked(option.id);
    const positive = sumPositive(option.effects);
    playSfx(positive >= 0 ? "good" : "bad");
    // Pequena espera pra animação de saída tocar antes de seguir.
    setTimeout(() => {
      onPick(option);
      setPicked(null);
    }, 240);
  }

  return (
    <div
      className="fixed inset-0 z-30 flex items-center justify-center p-4 bg-black/50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="choice-prompt"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={choice.id}
          initial={{ opacity: 0, scale: 0.92, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94 }}
          transition={{ duration: 0.22, ease: [0.2, 0.7, 0.3, 1] }}
          className="w-full max-w-2xl bg-pixel-paper pixel-border p-5 md:p-7"
          style={{ background: "var(--color-pixel-paper)" }}
        >
          <p
            id="choice-prompt"
            className="text-[11px] md:text-sm leading-relaxed mb-6"
            style={{ color: "var(--color-pixel-ink)" }}
          >
            {choice.prompt}
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            {choice.options.map((opt) => (
              <motion.div
                key={opt.id}
                whileHover={{ y: -2 }}
                whileTap={{ y: 1 }}
                className={picked === opt.id ? "animate-shake" : ""}
              >
                <PixelButton
                  onClick={() => handle(opt)}
                  className="w-full text-left flex flex-col items-start gap-1"
                  disabled={picked !== null}
                  aria-label={opt.label}
                >
                  <span>{opt.label}</span>
                  {opt.hint && (
                    <span className="text-[9px] opacity-80 normal-case">
                      {opt.hint}
                    </span>
                  )}
                </PixelButton>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function sumPositive(effects: Partial<Record<string, number>>) {
  return Object.values(effects).reduce<number>((a, b) => a + (b ?? 0), 0);
}
