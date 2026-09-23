import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.endsWith("/amader-youtube-videos-categorized.json"))
            return "official-video-data";
        },
      },
    },
  },
  plugins: [
    react(),
    tailwindcss(),
    {
      name: "site-metadata",
      transformIndexHtml(html) {
        const raw = process.env.SITE_URL;
        if (!raw) return html;
        const origin = new URL(raw).origin;
        return html
          .replace(
            "</head>",
            `<link rel="canonical" href="${origin}/"/><meta property="og:url" content="${origin}/"/></head>`,
          )
          .replace('content="/logo.png"', `content="${origin}/logo.png"`);
      },
    },
  ],
});
