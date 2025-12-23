import type { GiftCategory } from "../data/gifts";

export const categoryEmoji: Record<GiftCategory, string> = {
    "Кофе": "☕️",
    "Сладкое": "🍫",
    "Косметика": "🧴",
    "Пробники духов": "🌸",
};

export const categoryColorSeed: Record<GiftCategory, string> = {
    "Кофе": "coffee",
    "Сладкое": "sweet",
    "Косметика": "beauty",
    "Пробники духов": "perfume",
};
