### Parameters

- **`from`**: (required) The page URL from which to extract metadata.
- **`fields`**: (optional) A comma-separated list of specific fields to return. If not provided, all available fields will be returned.

### Allowed Fields

- **`title`**
- **`description`**
- **`favicon`**
- **`og_type`**
- **`og_title`**
- **`og_description`**
- **`og_image`**

### Example Request

```
GET https://webmeta.moaqz.workers.dev?from=https://www.cloudflare.com&fields=title,og_image
```

### Example Response

If the request is successful and specific fields are requested, the response will include those fields:

```json
{
  "data": {
    "title": "Connect, Protect and Build Everywhere | Cloudflare",
    "og_image": "https://cf-assets.www.cloudflare.com/slt3lc6tev37/2FNnxFZOBEha1W2MhF44EN/e9438de558c983ccce8129ddc20e1b8b/CF_MetaImage_1200x628.png"
  }
}
```

If no fields are specified, the response will include all available fields:

```json
{
  "data": {
    "title": "Connect, Protect and Build Everywhere | Cloudflare",
    "description": "Make employees, applications and networks faster and more secure everywhere, while reducing complexity and cost.",
    "favicon": "https://www.cloudflare.com/favicon.ico",
    "og_description": "Make employees, applications and networks faster and more secure everywhere, while reducing complexity and cost.",
    "og_title": "Connect, Protect and Build Everywhere",
    "og_type": "",
    "og_image": "https://cf-assets.www.cloudflare.com/slt3lc6tev37/2FNnxFZOBEha1W2MhF44EN/e9438de558c983ccce8129ddc20e1b8b/CF_MetaImage_1200x628.png"
  }
}
```
