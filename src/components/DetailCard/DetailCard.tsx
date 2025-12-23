import type { GiftItem } from "../../data/gifts";
import { categoryEmoji, categoryColorSeed } from "../../lib/categoryVisual";
import cl from "./DetailCard.module.scss";

type Props = {
    gift: GiftItem | null;
    openedAt: string | null; // "YYYY-MM-DD"
    order: number | null;    // 1..28
};

function formatDateKey(dateKey: string) {
    // "YYYY-MM-DD" -> "DD.MM.YYYY"
    const [y, m, d] = dateKey.split("-");
    if (!y || !m || !d) return dateKey;
    return `${d}.${m}.${y}`;
}

export function DetailCard({ gift, openedAt, order }: Props) {
    if (!gift || !openedAt || !order) {
        return (
            <div className={cl.card}>
                <div className={cl.emptyTitle}>Открой подарок через Random 🎲</div>
                <div className={cl.emptyText}>
                    Закрытые ячейки не кликаются. Открытые — можно выбирать для просмотра.
                </div>
            </div>
        );
    }

    const seed = categoryColorSeed[gift.category];

    return (
        <div className={cl.card}>
            <div className={cl.top}>
                <div className={cl.number}>Подарок #{order}</div>
                <div className={cl.date}>Выдано: {formatDateKey(openedAt)}</div>
            </div>

            <div className={`${cl.preview} ${cl[`preview_${seed}`]}`}>
                {gift.imageUrl ? (
                    <img className={cl.img} src={gift.imageUrl} alt={gift.title} />
                ) : (
                    <div className={cl.previewInner}>
                        <div className={cl.bigEmoji}>{categoryEmoji[gift.category]}</div>
                        <div className={cl.previewHint}>Фото добавишь позже</div>
                    </div>
                )}
            </div>

            <div className={cl.title}>{gift.title}</div>
        </div>
    );
}
