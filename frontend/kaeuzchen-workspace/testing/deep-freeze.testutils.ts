export function assertDeepFrozen(obj: unknown, seen: WeakSet<object> = new WeakSet()): void {
    if (obj === null || typeof obj !== 'object' || seen.has(obj)) return;

    seen.add(obj);

    if (!Object.isFrozen(obj)) {
        throw new Error('Found non-frozen node');
    }

    for (const key of Object.getOwnPropertyNames(obj)) {
        const value = (obj as Record<string, unknown>)[key];
        assertDeepFrozen(value, seen);
    }
}
