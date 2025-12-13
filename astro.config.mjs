// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import icon from "astro-icon";

// https://astro.build/config
export default defineConfig({
  image: {
    service: {
      entrypoint: "astro/assets/services/sharp",
      config: {
        limitInputPixels: false,
      },
    },
  },
  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      include: ["three"],
      exclude: [
        "three/examples/jsm/loaders/GLTFLoader",
        "three/examples/jsm/loaders/DRACOLoader",
      ],
    },
    ssr: {
      noExternal: ["three"],
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            "three-core": ["three"],
          },
        },
      },
    },
  },
  integrations: [icon()],
});
