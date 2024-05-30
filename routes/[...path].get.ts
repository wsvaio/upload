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

      if (paths.length) {
        const p = paths[Math.floor(Math.random() * paths.length)];
        // return sendRedirect(event, p.replace('static', ''));
        if (query.url === "") {
          console.log(getRequestHeaders(event));
          return (
            getRequestHeader(event, "x-forwarded-proto") +
            "://" +
            getRequestHeader(event, "host") +
            p.replace("static", "")
          );
        } else {
          setHeader(event, "Content-Type", mine.getType(p));
          return readFileSync(p);
        }
      }
    }

    return readdirSync(join("static", path), { recursive: true });
  }
});
