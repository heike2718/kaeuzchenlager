// testing/assert-deep-frozen.ts
export function assertDeepFrozen(obj: unknown, seen = new WeakSet()): void {
  if (!obj || typeof obj !== 'object' || seen.has(obj as any)) return;
  seen.add(obj as any);
  if (!Object.isFrozen(obj)) throw new Error('Found non-frozen node');
  for (const key of Object.getOwnPropertyNames(obj)) {
    assertDeepFrozen((obj as any)[key], seen);
  }
}

export function expect(arg0: () => void) {
  throw new Error('Function not implemented.');
}
