import { rmSync } from "fs";
import { join } from "path";
export default defineEventHandler((event) => {
  const path = getRouterParam(event, "path");
  rmSync(join("static", path), { recursive: true });
  return path;
});
