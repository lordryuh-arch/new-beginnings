// Assets live on the project-id-specific origin.
const CURRENT_PROJECT_ID = "b1ac3029-d58f-4a0f-841e-3954421931d9";

export function assetUrl(url: string) {
  if (!url.startsWith("/__l5e/assets-v1/")) return url;
  // Always use the relative URL in the preview, the platform handles routing.
  // Using absolute URLs to happy-local-buddy.lovable.app can cause CORS or session issues in the preview.
  return url;
}

export function assetUrlFromJson(asset: { url: string; project_id?: string }) {
  if (!asset.url.startsWith("/__l5e/assets-v1/")) return asset.url;
  return asset.url;
}

