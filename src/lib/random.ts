export function pickRandomIndex(maxExclusive: number) {
    return Math.floor(Math.random() * maxExclusive);
}

export function removeAtIndex<T>(arr: T[], idx: number) {
    return [...arr.slice(0, idx), ...arr.slice(idx + 1)];
}
