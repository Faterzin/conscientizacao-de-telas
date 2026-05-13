// Shim de tipos para react-konva.
//
// O pacote publica os types em `react-konva.d.ts` na raiz, mas o `exports`
// map do package.json não inclui essa entrada. Sob `moduleResolution: "bundler"`
// (o nosso), o TypeScript respeita o exports map e não acha os tipos, o que
// quebra o `next build` no Vercel.
//
// Aqui declaramos só os componentes que usamos no projeto — o suficiente pra
// destravar o build sem perder o type-safety dos nossos componentes acima.

declare module "react-konva" {
  import * as React from "react";

  export const Stage: React.ForwardRefExoticComponent<
    React.PropsWithChildren<Record<string, unknown>> &
      React.RefAttributes<unknown>
  >;
  export const Layer: React.ComponentType<
    React.PropsWithChildren<Record<string, unknown>>
  >;
  export const Group: React.ComponentType<
    React.PropsWithChildren<Record<string, unknown>>
  >;
  export const Rect: React.ComponentType<Record<string, unknown>>;
  export const Line: React.ComponentType<Record<string, unknown>>;
  export const Circle: React.ComponentType<Record<string, unknown>>;
  export const Text: React.ComponentType<Record<string, unknown>>;
  export const Image: React.ComponentType<Record<string, unknown>>;
}
