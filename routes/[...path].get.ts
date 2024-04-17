import { readFileSync, statSync, readdirSync } from "fs";
import { join } from "path";
import mine from "mime";

export default defineEventHandler((event) => {
  const path = getRouterParam(event, "path");
  const query = getQuery(event);
  let type = "";

  try {
    type = statSync(join("temp", path)).isFile() ? "temp" : "";
  } catch (error) {}

  type ||= statSync(join("static", path)).isFile() ? "static" : "";

  if (type) {
    setHeader(event, "Content-Type", mine.getType(join(type, path)));
    return readFileSync(join(type, path));
  } else {
    if (query.random === "") {
      const paths = readdirSync(join("static", path), {
        recursive: true,
        withFileTypes: true,
      })
        .filter((item) => item.isFile())
        .map((item) => join(item.path, item.name));

      
      
      
      // sendRedirect(event, getRequestHost(event) + paths[Math.floor(Math.random() * paths.length)])
      return readFileSync(paths[Math.floor(Math.random() * paths.length)]);
    }

    return readdirSync(join("static", path), { recursive: true });
  }
});
