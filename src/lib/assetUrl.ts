// Legacy assets uploaded from another project (questbound-keeper) are only
// hosted on that project's public origin. Current-project assets live on
// this project's origin. We pick the right host per asset via project_id.
const LEGACY_PROJECT_ID = "761d0e62-e6ea-49aa-8343-99c5e00a533c";
const LEGACY_ORIGIN = "https://questbound-keeper.lovable.app";
const CURRENT_ORIGIN = "https://happy-local-buddy.lovable.app";

export function assetUrl(url: string) {
  if (!url.startsWith("/__l5e/assets-v1/")) return url;
  // Legacy assets always need the legacy origin.
  return `${LEGACY_ORIGIN}${url}`;
}

// Preferred: pass the imported asset json directly so we can route by project_id.
export function assetUrlFromJson(asset: { url: string; project_id?: string }) {
  if (!asset || !asset.url) return "";
  
  // Se a URL não começa com o prefixo de asset gerenciado, retorna a URL bruta
  if (!asset.url.startsWith("/__l5e/assets-v1/")) {
    return asset.url;
  }
  
  // Se o project_id for do projeto legado, usamos o origin legado.
  // Caso contrário, usamos uma string vazia para que seja relativo ao host atual.
  const isLegacy = asset.project_id === LEGACY_PROJECT_ID;
  const origin = isLegacy ? LEGACY_ORIGIN : ""; 
  
  return `${origin}${asset.url}`;
}
