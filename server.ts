import { createServer, IncomingMessage, ServerResponse } from "http";
import { config } from "dotenv";

config({ path: ".env" });

function makeVercelRes(res: ServerResponse) {
  const vRes = res as any;

  // Save originals BEFORE overwriting
  const originalSetHeader = res.setHeader.bind(res);
  const originalEnd = res.end.bind(res);

  vRes.status = (code: number) => {
    res.statusCode = code;
    return vRes;
  };

  vRes.json = (data: unknown) => {
    originalSetHeader("Content-Type", "application/json");
    originalEnd(JSON.stringify(data));
    return vRes;
  };

  vRes.setHeader = (key: string, value: string | string[]) => {
    originalSetHeader(key, value);
    return vRes;
  };

  vRes.end = (data?: string) => {
    originalEnd(data);
    return vRes;
  };

  return vRes;
}

const server = createServer(async (req: IncomingMessage, res: ServerResponse) => {
  if (req.url?.startsWith("/api/contact")) {
    const { default: handler } = await import(`./api/contact.ts?t=${Date.now()}`);

    let body = "";
    req.on("data", (chunk: Buffer) => (body += chunk.toString()));
    req.on("end", async () => {
      const vReq = req as any;
      const vRes = makeVercelRes(res);

      try {
        vReq.body = body ? JSON.parse(body) : {};
      } catch {
        vReq.body = {};
      }

      try {
        await handler(vReq, vRes);
      } catch (err) {
        console.error("Handler error:", err);
        if (!res.headersSent) {
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Internal server error" }));
        }
      }
    });
  } else {
    res.writeHead(404);
    res.end("Not found");
  }
});

server.listen(3001, () => {
  console.log("✅ API server running on http://localhost:3001");
});