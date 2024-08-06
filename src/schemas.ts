import { array, nullable, object, pipe, string, transform, url } from "valibot";

export const metadataFieldsSchema = nullable(
  pipe(
    string(),
    transform(input => input.split(",")),
    array(string()),
  ),
);

export const searchParamsSchema = object({
  from: pipe(
    string(),
    url(),
    transform((input) => {
      if (input.endsWith("/")) {
        return input.substring(0, input.length - 1);
      }

      return input;
    }),
  ),
  fields: metadataFieldsSchema,
});
