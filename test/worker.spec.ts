import { SELF } from "cloudflare:test";
import { it, expect, inject, describe } from "vitest";

const baseURL = () => `http://localhost:${inject("SERVER_PORT")}`;

describe("API v1", () => {
  it("should return 400 when no 'from' param is provided", async () => {
    const response = await SELF.fetch("https://worker.test");

    expect(response.status).toBe(400);

    const body = await response.json() as any;
    expect(body).toBeTypeOf("object");
    expect(body).toHaveProperty("status");
    expect(body.status).toBeTypeOf("number");
    expect(body).toHaveProperty("data");
    expect(body.data).toBeTypeOf("object");
    expect(body).toHaveProperty("data.title");
    expect(body.data.title).toBeTypeOf("string");
    expect(body).toHaveProperty("data.errors");
    expect(body.data.errors).toBeTypeOf("object");
  });

  it("should return 400 when 'from' points to a not '.html' file", async () => {
    const params = new URLSearchParams({
      from: `${baseURL()}/ok`,
    });

    const response = await SELF.fetch(`https://worker.test?${params.toString()}`);
    expect(response.status).toBe(400);

    const body = await response.json() as any;
    expect(body).toBeTypeOf("object");
    expect(body).toHaveProperty("status");
    expect(body.status).toBeTypeOf("number");
    expect(body).toHaveProperty("data");
    expect(body.data).toBeTypeOf("object");
    expect(body).toHaveProperty("data.title");
    expect(body.data.title).toBeTypeOf("string");
    expect(body.data.title).toBe("Invalid Content Type");
  });

  it.for([
    { input: "basic.html", output: "basic-all.json" },
    { input: "basic.html", output: "basic-only-og.json", fields: "og_title,og_description,og_image,og_type" },
  ])(
    // https://github.com/vitest-dev/vitest/pull/2405/files
    "metadata extracted from $input must match the snapshot $output",
    async ({ input, output, fields }) => {
      const params = new URLSearchParams({
        from: `${baseURL()}/${input}`,
      });

      if (fields) {
        params.set("fields", fields);
      }

      const url = `https://worker.test?${params.toString()}`;
      const response = await SELF.fetch(url);

      expect(response.status).toBe(200);

      const body = await response.json() as any;
      expect(body).toBeTypeOf("object");
      expect(body).toHaveProperty("data");
      await expect(body.data).toMatchFileSnapshot(`./fixtures/${output}`);
    },
  );
});
