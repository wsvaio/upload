import { writeFileSync, statSync, mkdirSync } from "fs";
import { join, extname } from "path";
export default defineEventHandler(async (event) => {
  const path = getRouterParam(event, "path");
  const query = await getValidatedQuery(
    event,
    (data: Record<string, string>) => ({
      temp: data.temp != "false",
    })
  );
  const filepath = join(query.temp ? "temp" : "static", path);
  const formData = await readFormData(event);
  const files = formData
    .getAll("file")
    .filter((item) => item instanceof File) as File[];

  const result: string[] = [];

  if (files.length) {
    try {
      statSync(filepath);
    } catch (e) {
      mkdirSync(filepath, { recursive: true });
    }
    for (const file of files) {
      const uuid = crypto.randomUUID() + extname(file.name);
      writeFileSync(
        join(filepath, uuid),
        new Uint8Array(await file.arrayBuffer())
      );
      result.push(join(path, uuid));
    }
  }

  return result.length > 1 ? result : result[0];
});
