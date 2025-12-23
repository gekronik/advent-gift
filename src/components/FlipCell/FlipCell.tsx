import type { GiftItem } from "../../data/gifts";
import { categoryEmoji } from "../../lib/categoryVisual";
import cl from "./FlipCell.module.scss";

type Props = {
    index: number;
    gift: GiftItem | null;
    isRolling?: boolean;
    isRollActive?: boolean;
    onClickCell: () => void;
};

export function FlipCell({ index, gift, isRolling, isRollActive, onClickCell }: Props) {
    const flipped = Boolean(gift);
    const disabled = isRolling || !flipped; // ✅ закрытые не кликаются

    return (
        <button
            type="button"
            className={[
                cl.cell,
                flipped ? cl.cell_flipped : "",
                isRollActive ? cl.cell_rollActive : "",
            ].join(" ")}
            onClick={onClickCell}
            disabled={disabled}
            aria-label={flipped ? `Открыто: ${gift?.title ?? ""}` : `Закрыто ${index + 1}`}
            title={flipped ? gift?.title : "Открывается только через Random"}
        >
      <span className={cl.inner}>
        <span className={cl.faceFront}>
          <span className={cl.day}>{index + 1}</span>
          <span className={cl.frontIcon}>{flipped ? "🎁" : "🔒"}</span>
          {/*<span className={cl.hint}>{flipped ? "Открыто" : "Только Random"}</span>*/}
        </span>

        <span className={cl.faceBack}>
          {gift ? (
              <>
                  <span className={cl.backIcon}>{categoryEmoji[gift.category]}</span>
                  <span className={cl.title}>{gift.title}</span>
              </>
          ) : null}
        </span>
      </span>
        </button>
    );
}
