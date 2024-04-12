import { readFileSync, statSync, readdirSync } from "fs";
import { join } from "path";
import mine from "mime";

export default defineEventHandler((event) => {
  const path = getRouterParam(event, "path");
  let type = "";

  try {
    type = statSync(join("temp", path)).isFile() ? "temp" : "";
  } catch (error) {}

  type ||= statSync(join("static", path)).isFile() ? "static" : "";

  if (type) {
    setHeader(event, 'Content-Type', mine.getType(join(type, path)));
    return readFileSync(join(type, path));
  } else {
    return readdirSync(join("static", path), { recursive: true });
  }
});
