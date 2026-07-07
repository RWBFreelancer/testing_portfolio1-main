import { defineConfig, type Connect, type ViteDevServer } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import tsConfigPaths from "vite-tsconfig-paths";
import { config as loadDotenv } from "dotenv";
import type { ServerResponse } from "http";

// Serves api/contact.ts inside the Vite dev server so `npm run dev` alone
// handles /api/contact (mirrors the Vercel function in production).
function contactApiPlugin() {
  return {
    name: "contact-api-dev",
    configureServer(server: ViteDevServer) {
      loadDotenv({ path: ".env" });

      server.middlewares.use(
        "/api/contact",
        (req: Connect.IncomingMessage, res: ServerResponse) => {
          let body = "";
          req.on("data", (chunk: Buffer) => (body += chunk.toString()));
          req.on("end", async () => {
            const vReq = req as any;
            try {
              vReq.body = body ? JSON.parse(body) : {};
            } catch {
              vReq.body = {};
            }

            const vRes = res as any;
            vRes.status = (code: number) => {
              res.statusCode = code;
              return vRes;
            };
            vRes.json = (data: unknown) => {
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify(data));
              return vRes;
            };

            try {
              const mod = await server.ssrLoadModule("/api/contact.ts");
              await mod.default(vReq, vRes);
            } catch (err) {
              console.error("[contact-api-dev] Handler error:", err);
              if (!res.headersSent) {
                res.statusCode = 500;
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({ error: "Internal server error" }));
              }
            }
          });
        },
      );
    },
  };
}

export default defineConfig({
  plugins: [
    TanStackRouterVite({ autoCodeSplitting: true }),
    react(),
    tailwindcss(),
    tsConfigPaths(),
    contactApiPlugin(),
  ],
});
