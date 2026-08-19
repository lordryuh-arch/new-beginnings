// Legacy assets uploaded from another project (questbound-keeper) are only
// hosted on that project's public origin. Current-project assets live on
// this project's origin. We pick the right host per asset via project_id.
const LEGACY_PROJECT_ID = "761d0e62-e6ea-49aa-8343-99c5e00a533c";
const LEGACY_ORIGIN = "https://questbound-keeper.lovable.app";

export function assetUrl(url: string) {
  if (!url) return "";
  if (typeof url !== "string") return url;
  if (!url.startsWith("/__l5e/assets-v1/")) return url;
  return `${LEGACY_ORIGIN}${url}`;
}

/**
 * Normalizes asset references to a URL string.
 * Handles strings, Vite-imported asset objects (.default), and Lovable asset JSON objects.
 */
export function assetUrlFromJson(asset: any): string {
  if (!asset) return "";
  
  // 1. If it's a Vite asset object (e.g. import logo from './logo.png')
  // It might have a .default property or be the string itself.
  const raw = asset.default || asset;

  // 2. Handle Lovable Asset JSON structure
  if (typeof raw === 'object' && raw !== null && 'url' in raw) {
    const url = raw.url;
    if (typeof url === 'string') {
      if (url.startsWith("/__l5e/assets-v1/")) {
        // If it belongs to the legacy project, use legacy origin.
        // Otherwise, return as-is (absolute path works on current origin).
        const isLegacy = raw.project_id === LEGACY_PROJECT_ID;
        return isLegacy ? `${LEGACY_ORIGIN}${url}` : url;
      }
      return url;
    }
  }

  // 3. Fallback to string handling (handles direct paths or strings extracted above)
  if (typeof raw === "string") {
    return assetUrl(raw);
  }
  
  return "";
}

