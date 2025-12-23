import type { GiftItem } from "../data/gifts";

const KEY = "advent_gift_v3";

export type RevealedCell = {
    giftId: string;
    openedAt: string; // "YYYY-MM-DD"
    order: number; // 1..28 (порядок выдачи)
};

export type StoredState = {
    revealed: Array<RevealedCell | null>; // length 28
    remainingIds: string[];
    selectedCellIndex: number | null;
    lastOpenDate: string | null; // "YYYY-MM-DD"
};

export function loadState(): StoredState | null {
    try {
        const raw = localStorage.getItem(KEY);
        if (!raw) return null;
        return JSON.parse(raw) as StoredState;
    } catch {
        return null;
    }
}

export function saveState(state: StoredState) {
    try {
        localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
        // ignore
    }
}

export function clearState() {
    try {
        localStorage.removeItem(KEY);
    } catch {
        // ignore
    }
}

export function toStoredState(
    revealed: Array<RevealedCell | null>,
    remaining: GiftItem[],
    selectedCellIndex: number | null,
    lastOpenDate: string | null
): StoredState {
    return {
        revealed,
        remainingIds: remaining.map((g) => g.id),
        selectedCellIndex,
        lastOpenDate,
    };
}

export function fromStoredState(
    stored: StoredState,
    all: GiftItem[],
    cellsCount: number
): {
    revealed: Array<RevealedCell | null>;
    remaining: GiftItem[];
    selectedCellIndex: number | null;
    lastOpenDate: string | null;
} {
    const byId = new Map(all.map((g) => [g.id, g] as const));

    const revealed = Array.from({ length: cellsCount }, (_, i) => {
        const cell = stored.revealed?.[i] ?? null;
        if (!cell) return null;
        if (!byId.get(cell.giftId)) return null;
        if (typeof cell.order !== "number") return null;
        if (typeof cell.openedAt !== "string") return null;
        return cell;
    });

    const remaining = (stored.remainingIds ?? [])
        .map((id) => byId.get(id))
        .filter(Boolean) as GiftItem[];

    const selectedCellIndex =
        typeof stored.selectedCellIndex === "number" ? stored.selectedCellIndex : null;

    const lastOpenDate = typeof stored.lastOpenDate === "string" ? stored.lastOpenDate : null;

    return { revealed, remaining, selectedCellIndex, lastOpenDate };
}
