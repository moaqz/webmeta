import * as cheerio from "cheerio";

export interface Metadata {
  title: string;
  description: string;
  favicon: string;
  og_type: string;
  og_title: string;
  og_description: string;
  og_image: string;
};

type Selector =
  | { selector: string; type: "attr"; attr: string }
  | { selector: string; type: "text" };

const METADATA_SELECTORS: Record<keyof Metadata, Selector[]> = {
  title: [
    { selector: "head title", type: "text" },
  ],
  description: [
    { selector: "head meta[name='description']", type: "attr", attr: "content" },
  ],
  favicon: [
    { selector: "head link[rel='icon']", type: "attr", attr: "href" },
    { selector: "head link[rel='shortcut icon']", type: "attr", attr: "href" },
    { selector: "head link[rel='apple-touch-icon']", type: "attr", attr: "href" },
  ],
  og_title: [
    { selector: "head meta[property='og:title']", type: "attr", attr: "content" },
  ],
  og_description: [
    { selector: "head meta[property='og:description']", type: "attr", attr: "content" },
  ],
  og_type: [
    { selector: "head meta[property='og:type']", type: "attr", attr: "content" },
  ],
  og_image: [
    { selector: "head meta[property='og:image']", type: "attr", attr: "content" },
  ],
};

export function extractMetadata(html: string): Metadata {
  const $ = cheerio.load(html);

  const findValidMetadataValue = (selectors: Selector[], fallback = "") => {
    for (const selector of selectors) {
      const value = selector.type === "text"
        ? $(selector.selector).text()
        : $(selector.selector).attr(selector.attr);

      if (value && value.length > 0) {
        return value;
      }
    }

    return fallback;
  };

  return {
    title: findValidMetadataValue(METADATA_SELECTORS.title),
    description: findValidMetadataValue(METADATA_SELECTORS.description),
    favicon: findValidMetadataValue(METADATA_SELECTORS.favicon),
    og_description: findValidMetadataValue(METADATA_SELECTORS.og_description),
    og_title: findValidMetadataValue(METADATA_SELECTORS.og_title),
    og_type: findValidMetadataValue(METADATA_SELECTORS.og_type),
    og_image: findValidMetadataValue(METADATA_SELECTORS.og_image),
  };
}

const METADATA_VALID_FIELDS = [
  "title",
  "description",
  "favicon",
  "og_title",
  "og_description",
  "og_type",
  "og_image",
];

export function filterMetadata(metadata: Metadata, fields: string[] | null): Partial<Metadata> {
  /**
   * If no fields are provided, return all the fields.
   */
  if (!fields) {
    return metadata;
  }

  const _data: Partial<Metadata> = {};

  for (const field of fields) {
    if (!METADATA_VALID_FIELDS.includes(field)) {
      continue;
    }

    if (field in metadata) {
      // eslint-disable-next-line ts/ban-ts-comment
      // @ts-expect-error
      _data[field] = metadata[field];
    }
  }

  return _data;
};

export function normalizeURLs(metadata: Metadata, baseUrl: string): Metadata {
  const _baseURL = new URL(baseUrl);

  const normalizeURL = (url: string) => {
    if (!url) {
      return url;
    }

    return new URL(url, _baseURL.origin).toString();
  };

  return {
    ...metadata,
    favicon: normalizeURL(metadata.favicon),
    og_image: normalizeURL(metadata.og_image),
  };
}
