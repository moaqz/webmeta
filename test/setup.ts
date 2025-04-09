// https://vitest.dev/config/#globalsetup
import { createApp, eventHandler, serveStatic, toNodeListener } from "h3";
import type { TestProject } from "vitest/node";

import { readFile, stat } from "node:fs/promises";
import { createServer } from "node:http";
import path from "node:path";

const TEST_SERVER_PORT = 9000;
const PUBLIC_DIR = path.join(import.meta.dirname, "fixtures");

export async function setup({ provide }: TestProject) {
  provide("SERVER_PORT", TEST_SERVER_PORT);

  const app = createApp()
    .use(
      "/ok",
      eventHandler(() => {
        return { status: "ok" };
      }),
    )
    .use(
      eventHandler((event) => {
        return serveStatic(event, {
          getContents: (id) => {
            const filePath = path.join(PUBLIC_DIR, id);
            return readFile(filePath, "utf8");
          },
          getMeta: async (id) => {
            const filePath = path.join(PUBLIC_DIR, id);
            const stats = await stat(filePath).catch(() => { });

            if (!stats || !stats.isFile()) {
              return;
            }

            return {
              // By default the serverStatic does not add the content-type.
              // https://github.com/unjs/h3/blob/b92ca59cbed89bced2ccb786e26a61f9d008be06/src/utils/static.ts#L91
              type: id.endsWith(".html") ? "text/html" : undefined,
              size: stats.size,
              mtime: stats.mtimeMs,
            };
          },
        });
      }),
    );

  const nodeHandler = toNodeListener(app);
  const listener = createServer(nodeHandler);

  await new Promise<void>((resolve) => {
    listener.listen(TEST_SERVER_PORT, () => {
      console.warn(`Server is listening on http://localhost:${TEST_SERVER_PORT}`);
      resolve();
    });
  });

  return () => {
    console.warn("Shutting down server");
    // eslint-disable-next-line no-console
    listener.close(console.error);
  };
};

declare module "vitest" {
  export interface ProvidedContext {
    SERVER_PORT: number;
  }
}
