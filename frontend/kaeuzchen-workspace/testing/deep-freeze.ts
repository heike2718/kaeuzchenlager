// testing/deep-freeze.ts
export function deepFreeze<T>(obj: T, seen = new WeakSet()): T {
  if (obj && typeof obj === 'object') {
    if (seen.has(obj as any)) return obj;
    seen.add(obj as any);
    Object.freeze(obj as object);
    for (const key of Object.getOwnPropertyNames(obj as object)) {
      const val: unknown = (obj as any)[key];
      if (val && typeof val === 'object' && !Object.isFrozen(val as object)) {
        deepFreeze(val as any, seen);
      }
    }
  }
  return obj;
}
