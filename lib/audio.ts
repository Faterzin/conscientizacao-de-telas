"use client";

import { Howl } from "howler";

/**
 * Wrapper preguiçoso pro Howler — só carrega áudio quando chamado.
 * Caso o arquivo não exista em /public/sounds, falha silenciosamente.
 *
 * Para adicionar trilha: coloque o arquivo em public/sounds/ e referencie aqui.
 */

let bgm: Howl | null = null;
const sfxCache = new Map<string, Howl>();

function safeHowl(src: string, opts: Partial<{ loop: boolean; volume: number }> = {}) {
  try {
    return new Howl({
      src: [src],
      loop: opts.loop ?? false,
      volume: opts.volume ?? 0.5,
      preload: true,
    });
  } catch {
    return null;
  }
}

export function playBgm(src = "/sounds/bgm.mp3") {
  if (typeof window === "undefined") return;
  if (bgm) return;
  bgm = safeHowl(src, { loop: true, volume: 0.25 });
  bgm?.play();
}

export function stopBgm() {
  bgm?.stop();
  bgm = null;
}

export function playSfx(name: "click" | "good" | "bad" | "day" | "ending") {
  if (typeof window === "undefined") return;
  const path = `/sounds/${name}.mp3`;
  let s = sfxCache.get(path);
  if (!s) {
    const created = safeHowl(path, { volume: 0.4 });
    if (!created) return;
    s = created;
    sfxCache.set(path, created);
  }
  s.play();
}
