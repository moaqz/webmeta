import { flatten, safeParseAsync } from "valibot";
import { searchParamsSchema } from "./schemas";
import { responseJSON, parseCacheTTL } from "./utils";
import type { Metadata } from "./metadata";
import { extractMetadata, filterMetadata, normalizeURLs } from "./metadata";

export default {
  async fetch(request: Request, env: Env, _ctx: unknown): Promise<Response> {
    const params = new URL(request.url).searchParams;
    const metadataTTL = parseCacheTTL(env._METADATA_RETENTION_CACHE, 3 * 60 * 60);

    const { success, issues, output } = await safeParseAsync(searchParamsSchema, {
      from: params.get("from"),
      fields: params.get("fields"),
    });

    if (!success) {
      return responseJSON({
        status: 400,
        data: {
          title: "Invalid Query Parameters",
          detail: "The query parameters provided do not match the required schema.",
          errors: flatten(issues).nested,
        },
      }, 400);
    }

    const { from, fields } = output;

    /**
     * Retrieve metadata from cache. If available, return it.
     */
    const cachedMetadata: Metadata | null = await env.KV.get(from, "json");
    if (cachedMetadata) {
      return responseJSON({
        data: filterMetadata(cachedMetadata, fields),
      });
    }

    const response = await fetch(from);
    if (!response.ok) {
      return responseJSON({
        status: response.status,
        data: {
          title: "Failed to Fetch Metadata",
          detail: `Failed to fetch metadata from the provided URL: ${from}.`,
        },
      }, response.status);
    }

    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("text/html")) {
      return responseJSON({
        status: 400,
        data: {
          title: "Invalid Content Type",
          detail: "The URL provided does not point to an HTML document.",
        },
      }, 400);
    }

    const html = await response.text();
    let metadata = extractMetadata(html);
    metadata = normalizeURLs(metadata, from);

    /**
     * Cache the normalized metadata for the specified URL.
     */
    await env.KV.put(
      from,
      JSON.stringify(metadata),
      { expirationTtl: metadataTTL }
    );

    return responseJSON({
      data: filterMetadata(metadata, fields),
    });
  },
} satisfies ExportedHandler<Env>;
