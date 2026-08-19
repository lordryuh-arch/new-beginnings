import { createServerFn } from "@tanstack/react-start";
import { readdir, readFile, writeFile } from "fs/promises";
import { join } from "path";

export const fixIcons = createServerFn({ method: "POST" })
  .handler(async () => {
    const iconsDir = join(process.cwd(), "src/assets/icons");
    const files = await readdir(iconsDir);
    const jsonFiles = files.filter(f => f.endsWith(".asset.json"));
    
    const results = [];
    for (const file of jsonFiles) {
      const path = join(iconsDir, file);
      const content = JSON.parse(await readFile(path, "utf-8"));
      if (content.url && !content.url.startsWith("http")) {
         // Se for um URL relativo do Lovable Assets, vamos garantir que ele seja absoluto se necessário
         // Mas o problema parece ser que o preview não está resolvendo.
         // Vamos tentar forçar o URL para o CDN global se possível, ou apenas logar.
         results.push({ file, url: content.url });
      }
    }
    return results;
  });
