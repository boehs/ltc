import { defineConfig } from "vite";
import solid from "solid-start";
import { viteCommonjs } from '@originjs/vite-plugin-commonjs'


export default defineConfig({
  plugins: [solid(),viteCommonjs()],
});
