import { statSync, mkdirSync, copyFileSync } from "fs";
import { join, dirname } from "path";
export default defineEventHandler(async (event) => {
  const path = getRouterParam(event, "path");
  const src = join("temp", path);
  const dest = join("static", path);
  const stat = statSync(src);
  if (stat.isFile()) {
    const dir = dirname(dest);
    try {
      statSync(dir);
    } catch (e) {
      mkdirSync(dir, { recursive: true });
    }

    copyFileSync(src, dest);
  }

  return path;
});
