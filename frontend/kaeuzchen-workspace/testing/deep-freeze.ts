export function deepFreeze<T>(obj: T, seen: WeakSet<object> = new WeakSet()): T {
  if (obj === null || typeof obj !== 'object') return obj;

  const o = obj as unknown as object;
  if (seen.has(o)) return obj;
  seen.add(o);

  // Alle eigenen Keys inkl. Symbolen
  for (const key of Reflect.ownKeys(o)) {
    const value = (o as Record<PropertyKey, unknown>)[key as PropertyKey];
    if (value && typeof value === 'object') {
      deepFreeze(value, seen);
    }
  }
  return Object.freeze(o) as unknown as T;
}
