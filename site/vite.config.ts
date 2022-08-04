import { defineConfig } from "vite";
import solid from "solid-start/vite";


export default defineConfig({
  optimizeDeps: {
    include: ["debug"],
    exclude: ["kysely","pg","ip-num"]
  },
  plugins: [
    {
      ...(await import("@mdx-js/rollup")).default({
        jsx: true,
        jsxImportSource: "solid-js",
        providerImportSource: "solid-mdx"
      }),
      enforce: "pre"
    },
    solid({
      extensions: [".mdx", ".md"]
    }),
  ]
});
