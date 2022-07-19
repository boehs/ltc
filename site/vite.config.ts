import { defineConfig } from "vite";
import solid from "solid-start";
import { viteCommonjs } from '@originjs/vite-plugin-commonjs'


export default defineConfig({
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
    viteCommonjs()
  ]
});
