import type { GiftItem } from "../../data/gifts";
import { FlipCell } from "../FlipCell/FlipCell";
import cl from "./CalendarGrid.module.scss";

type Props = {
    cellsCount: number;
    revealed: Array<GiftItem | null>;
    isRolling: boolean;
    rollingIndex: number | null;

    onCellClick: (index: number) => void; // ✅
};

export function CalendarGrid({
                                 cellsCount,
                                 revealed,
                                 isRolling,
                                 rollingIndex,
                                 onCellClick,
                             }: Props) {
    return (
        <div className={cl.grid}>
            {Array.from({ length: cellsCount }, (_, i) => (
                <FlipCell
                    key={i}
                    index={i}
                    gift={revealed[i] ?? null}
                    isRolling={isRolling}
                    isRollActive={isRolling && rollingIndex === i}
                    onClickCell={() => onCellClick(i)}
                />
            ))}
        </div>
    );
}
