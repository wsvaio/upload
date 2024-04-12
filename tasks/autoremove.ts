import { rmSync, mkdirSync, readdirSync, readFileSync, statSync } from "fs";
import { join } from "path";

export default defineTask({
  meta: {
    name: "autoremove",
    description: "auto remove temp",
  },
  run() {
    console.log("autoremove running");
    console.group();
    const time = new Date().getTime();
    {
      try {
        statSync("temp");
      } catch (e) {
        mkdirSync("temp");
      }
      const dirents = readdirSync("temp", {
        recursive: true,
        withFileTypes: true,
      });
      for (const dirent of dirents.toReversed()) {
        const path = join(dirent.path, dirent.name);
        if (dirent.isDirectory()) {
          const dir = readdirSync(path);
          if (!dir.length) {
            rmSync(path, { recursive: true });
            console.log("remove", path);
          }
        }
        if (dirent.isFile()) {
          const stat = statSync(path);
          // 超过一天删除
          if (time - stat.ctimeMs > 86400) {
            rmSync(path);
            console.log("remove", path);
          }
        }
      }
    }

    {
      try {
        statSync("static");
      } catch (e) {
        mkdirSync("static");
      }
      const dirents = readdirSync("static", {
        recursive: true,
        withFileTypes: true,
      });
      for (const dirent of dirents.toReversed()) {
        if (dirent.isDirectory()) {
          const path = join(dirent.path, dirent.name);
          const dir = readdirSync(path);
          if (!dir.length) {
            rmSync(path, { recursive: true });
            console.log("remove", path);
          }
        }
      }
    }
    console.groupEnd();
    console.log("autoremove end");
    return { result: "success" };
  },
});
