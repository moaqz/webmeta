export function parseCacheTTL(value: string | undefined, defaultValue: number) {
  if (!value) {
    return defaultValue;
  }

  const ttl = Number.parseInt(value);
  if (Number.isNaN(ttl)) {
    return 3 * 60 * 60;
  }

  return ttl;
}
