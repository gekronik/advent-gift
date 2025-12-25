import { useEffect, useMemo, useRef, useState } from "react";
import cl from "./App.module.scss";
import { cloudLoad, cloudSave } from "./lib/cloud";

import { gifts, type GiftItem, cellGiftIds } from "./data/gifts";
import { pickRandomIndex } from "./lib/random";
import {
    // clearState,
    fromStoredState,
    loadState,
    saveState,
    toStoredState,
    type RevealedCell,
} from "./lib/storage";

import { CalendarGrid } from "./components/CalendarGrid/CalendarGrid";
import { DetailCard } from "./components/DetailCard/DetailCard";

const SHARE_CODE = "ADVENT-2025-SERGEY";

const CELLS_COUNT = 30;
const ROLL_DURATION_MS = 5000;
const ROLL_TICK_MS = 110;

function getTodayKey() {
    // День считается по локальному времени устройства: новый день с 00:00
    const d = new Date();
    const yyyy = String(d.getFullYear());
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
}

function getNextOrder(revealed: Array<RevealedCell | null>) {
    let max = 0;
    for (const c of revealed) {
        if (c && typeof c.order === "number" && c.order > max) max = c.order;
    }
    return max + 1;
}

export default function App() {
    // защитимся от рассинхрона: количество ячеек должно совпадать с mapping
    if (cellGiftIds.length !== CELLS_COUNT) {
        console.warn(
            `cellGiftIds.length (${cellGiftIds.length}) != CELLS_COUNT (${CELLS_COUNT}).`
        );
    }

    const byId = useMemo(() => new Map(gifts.map((g) => [g.id, g] as const)), []);
    const todayKey = useMemo(() => getTodayKey(), [/* ререндер — ок */]);

    const [revealed, setRevealed] = useState<Array<RevealedCell | null>>(
        Array.from({ length: CELLS_COUNT }, () => null)
    );
    const [selectedCellIndex, setSelectedCellIndex] = useState<number | null>(null);
    const [lastOpenDate, setLastOpenDate] = useState<string | null>(null);
    const [opensTodayCount, setOpensTodayCount] = useState<number>(0);

    const [rollingIndex, setRollingIndex] = useState<number | null>(null);
    const [isRolling, setIsRolling] = useState(false);

    const [hydrated, setHydrated] = useState(false);
    const cloudTimerRef = useRef<number | null>(null);

    const rollIntervalRef = useRef<number | null>(null);
    const rollTimeoutRef = useRef<number | null>(null);
    const rollingIndexRef = useRef<number | null>(null);

    const openedCount = useMemo(() => revealed.filter(Boolean).length, [revealed]);
    const unopenedCount = CELLS_COUNT - openedCount;

    const MAX_PER_DAY = 2;

    const opensUsedToday = lastOpenDate === todayKey ? opensTodayCount : 0;
    const canOpenToday = opensUsedToday < MAX_PER_DAY;

    // Правая карточка: мета выбранной ячейки
    const selectedMeta = useMemo(() => {
        if (selectedCellIndex == null) return null;
        return revealed[selectedCellIndex] ?? null;
    }, [revealed, selectedCellIndex]);

    const selectedGift = useMemo(() => {
        if (!selectedMeta) return null;
        return byId.get(selectedMeta.giftId) ?? null;
    }, [selectedMeta, byId]);

    // Для сетки: показываем подарок только если ячейка открыта
    const gridGifts: Array<GiftItem | null> = useMemo(() => {
        return Array.from({ length: CELLS_COUNT }, (_, i) => {
            if (!revealed[i]) return null;
            const id = cellGiftIds[i];
            return byId.get(id) ?? null;
        });
    }, [revealed, byId]);

    // LOAD: local -> cloud
    useEffect(() => {
        (async () => {
            const stored = loadState();
            if (stored) {
                const restored = fromStoredState(stored, gifts, CELLS_COUNT);
                setRevealed(restored.revealed);
                setSelectedCellIndex(restored.selectedCellIndex);
                setLastOpenDate(restored.lastOpenDate);
                setOpensTodayCount(restored.opensTodayCount ?? 0);
            }

            try {
                const cloud = await cloudLoad(SHARE_CODE);
                if (cloud.state) {
                    const restored = fromStoredState(cloud.state, gifts, CELLS_COUNT);
                    setRevealed(restored.revealed);
                    setSelectedCellIndex(restored.selectedCellIndex);
                    setLastOpenDate(restored.lastOpenDate);
                    setOpensTodayCount(restored.opensTodayCount ?? 0);
                }
            } catch (e) {
                console.warn("Cloud load failed:", e);
            } finally {
                setHydrated(true);
            }
        })();
    }, []);

    // SAVE: local + cloud (debounce)
    useEffect(() => {
        if (!hydrated) return;

        const stateToSave = toStoredState(
            revealed,
            gifts,
            selectedCellIndex,
            lastOpenDate,
            opensTodayCount
        );

        saveState(stateToSave);

        if (cloudTimerRef.current) window.clearTimeout(cloudTimerRef.current);
        cloudTimerRef.current = window.setTimeout(() => {
            cloudSave(SHARE_CODE, stateToSave).catch((e) =>
                console.warn("Cloud save failed:", e)
            );
        }, 500);

        return () => {
            if (cloudTimerRef.current) window.clearTimeout(cloudTimerRef.current);
        };
    }, [hydrated, revealed, selectedCellIndex, lastOpenDate,opensTodayCount]);

    useEffect(() => {
        if (!hydrated) return;

        // если наступил новый день — обнуляем лимит
        if (lastOpenDate !== todayKey && opensTodayCount !== 0) {
            setOpensTodayCount(0);
        }
    }, [hydrated, todayKey, lastOpenDate, opensTodayCount]);

    const stopRolling = () => {
        if (rollIntervalRef.current) window.clearInterval(rollIntervalRef.current);
        if (rollTimeoutRef.current) window.clearTimeout(rollTimeoutRef.current);
        rollIntervalRef.current = null;
        rollTimeoutRef.current = null;

        setIsRolling(false);
        setRollingIndex(null);
        rollingIndexRef.current = null;
    };

    useEffect(() => {
        return () => stopRolling();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const openCell = (cellIndex: number) => {
        if (cellIndex < 0 || cellIndex >= CELLS_COUNT) return;

        // уже открыта — просто выбрать справа
        if (revealed[cellIndex]) {
            setSelectedCellIndex(cellIndex);
            return;
        }

        // ✅ ограничение 1 в день
        if (!canOpenToday) return;

        const openedAt = getTodayKey();

        setRevealed((prev) => {
            const next = [...prev];
            next[cellIndex] = {
                giftId: cellGiftIds[cellIndex],
                openedAt,
                order: getNextOrder(prev),
            };
            return next;
        });

        setSelectedCellIndex(cellIndex);
        setLastOpenDate(openedAt);
        setOpensTodayCount((prev) => {
            const isSameDay = lastOpenDate === openedAt;
            return (isSameDay ? prev : 0) + 1;
        });
    };

    const onCellClick = (index: number) => {
        // ✅ закрытые НЕ открываем
        // ✅ открытые можно выбирать для просмотра
        if (!revealed[index]) return;
        setSelectedCellIndex(index);
    };

    const startRandomRoll = () => {
        if (isRolling) return;
        if (!canOpenToday) return;

        const unopened = Array.from({ length: CELLS_COUNT }, (_, i) => i).filter((i) => !revealed[i]);
        if (unopened.length === 0) return;

        setIsRolling(true);

        const start = unopened[pickRandomIndex(unopened.length)];
        setRollingIndex(start);
        rollingIndexRef.current = start;

        rollIntervalRef.current = window.setInterval(() => {
            const currentUnopened = Array.from({ length: CELLS_COUNT }, (_, i) => i).filter(
                (i) => !revealed[i]
            );
            if (currentUnopened.length === 0) return;

            const next = currentUnopened[pickRandomIndex(currentUnopened.length)];
            setRollingIndex(next);
            rollingIndexRef.current = next;
        }, ROLL_TICK_MS);

        rollTimeoutRef.current = window.setTimeout(() => {
            const currentUnopened = Array.from({ length: CELLS_COUNT }, (_, i) => i).filter(
                (i) => !revealed[i]
            );
            if (currentUnopened.length === 0) {
                stopRolling();
                return;
            }

            const chosen =
                rollingIndexRef.current ?? currentUnopened[pickRandomIndex(currentUnopened.length)];

            stopRolling();
            openCell(chosen);
        }, ROLL_DURATION_MS);
    };

    // const resetAll = () => {
    //     stopRolling();
    //     clearState();
    //     setRevealed(Array.from({ length: CELLS_COUNT }, () => null));
    //     setSelectedCellIndex(null);
    //     setLastOpenDate(null);
    // };

    const canRandom = !isRolling && openedCount < CELLS_COUNT && canOpenToday;

    return (
        <div className={cl.page}>
            <div className={cl.shell}>
                <div className={cl.header}>
                    <div>
                        <div className={cl.title}>Адвент-календарь</div>
                        <div className={cl.sub}>
                            Открыто: <b>{openedCount}</b> / {CELLS_COUNT} · Осталось: <b>{unopenedCount}</b>
                            {!canOpenToday ? (
                                <span className={cl.todayLock}>
  · Сегодня: {opensUsedToday} / {MAX_PER_DAY}
</span>
                            ) : null}
                        </div>
                    </div>

                    <div className={cl.actions}>
                        {/*<button className={cl.btnSecondary} type="button" onClick={resetAll}>*/}
                        {/*    Сбросить*/}
                        {/*</button>*/}
                    </div>
                </div>

                <div className={cl.layout}>
                    <div className={cl.left}>
                        <div className={cl.controls}>
                            <button
                                className={cl.btnPrimary}
                                type="button"
                                onClick={startRandomRoll}
                                disabled={!canRandom}
                                aria-busy={isRolling}
                            >
                                {isRolling ? "Выбираю..." : "Random 🎲"}
                            </button>

                            <div className={cl.controlsHint}>
                                {isRolling
                                    ? "Флажок прыгает по ячейкам — через ~5 секунд откроется выбранная."
                                    : !canOpenToday
                                        ? `Сегодня уже открыто ${MAX_PER_DAY} подарка. Следующие — после 00:00.`
                                        : "Открытие только через Random. Открытые ячейки можно кликать для просмотра справа."}
                            </div>
                        </div>

                        <CalendarGrid
                            cellsCount={CELLS_COUNT}
                            revealed={gridGifts}
                            isRolling={isRolling}
                            rollingIndex={rollingIndex}
                            onCellClick={onCellClick}
                        />
                    </div>

                    <div className={cl.right}>
                        <DetailCard
                            gift={selectedGift}
                            openedAt={selectedMeta?.openedAt ?? null}
                            order={selectedMeta?.order ?? null}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
