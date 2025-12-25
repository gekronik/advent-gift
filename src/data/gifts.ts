export type GiftCategory = "Кофе" | "Сладкое" | "Косметика" | "Пробники духов";

export type GiftItem = {
    id: string;
    title: string;
    category: GiftCategory;
    imageUrl?: string;
};

export const gifts: GiftItem[] = [
    { id: "c1", title: "Кофе клубника со сливками", category: "Кофе", imageUrl: '/img/gifts/strawberry.jpg' },
    { id: "c2", title: "Кофе бейлиз", category: "Кофе", imageUrl: '/img/gifts/baileys.jpg' },
    { id: "c3", title: "Кофе ирландский крем", category: "Кофе", imageUrl: '/img/gifts/irland.jpg' },
    { id: "c4", title: "Кофе молочный шоколад", category: "Кофе", imageUrl: '/img/gifts/milk.jpg' },
    { id: "c5", title: "Кофе английские сливки", category: "Кофе", imageUrl: '/img/gifts/english.jpg' },
    { id: "c6", title: "Кофе вишня в коьяке", category: "Кофе", imageUrl: '/img/gifts/cherry-cognac.jpg' },

    { id: "s1", title: "Коробка конфет Merci с миндалем", category: "Сладкое", imageUrl: '/img/gifts/merci-mindal.jpeg' },
    { id: "s2", title: "\"Дубайский шоколад с фисташкой\", ручной работы", category: "Сладкое", imageUrl: '/img/gifts/dubai.jpg' },
    { id: "s3", title: "Киндер Джой Очень странные дела", category: "Сладкое", imageUrl: '/img/gifts/kinder.jpg' },
    { id: "s4", title: "Киндер Джой Очень странные дела", category: "Сладкое", imageUrl: '/img/gifts/kinder.jpg' },
    { id: "s5", title: "Коробка конфет Merci шоколадные", category: "Сладкое", imageUrl: '/img/gifts/merci-chocko.jpeg' },
    { id: "s6", title: "Коробка конфет Merci молочный шоколад", category: "Сладкое", imageUrl: '/img/gifts/merci-milk.jpg' },

    { id: "k1", title: "La Fabrique Black Cherry", category: "Косметика", imageUrl: '/img/gifts/black-cherry.jpg' },
    { id: "k2", title: "La Fabrique Tobacco and Vanilla", category: "Косметика", imageUrl: '/img/gifts/tobacco.jpg' },
    { id: "k3", title: "Крем-баттер с маслом кокоса и какао", category: "Косметика", imageUrl: '/img/gifts/butter.jpg'  },
    { id: "k4", title: "Скраб для тела", category: "Косметика", imageUrl: '/img/gifts/scrab.jpg'  },
    { id: "k5", title: "Сыворотка для лица", category: "Косметика", imageUrl: '/img/gifts/serum.jpg'  },
    { id: "k6", title: "Соль мертвого моря", category: "Косметика", imageUrl: '/img/gifts/salt.jpg'  },
    { id: "k7", title: "Жемчуг для ванн", category: "Косметика", imageUrl: '/img/gifts/pearl.jpg'  },
    { id: "k8", title: "Альгинатная маска", category: "Косметика", imageUrl: '/img/gifts/mask.jpg'  },
    { id: "k9", title: "Бомбочки для ванн", category: "Косметика", imageUrl: '/img/gifts/bombs.jpg'  },
    { id: "k10", title: "Пудинг для умывания", category: "Косметика", imageUrl: '/img/gifts/puding.jpg'  },
    { id: "k11", title: "La Fabrique Euphoria", category: "Косметика", imageUrl: '/img/gifts/euphoria.jpg' },

    { id: "p1", title: "Пробник духов Kirke", category: "Пробники духов", imageUrl: '/img/gifts/kirke.jpg' },
    { id: "p2", title: "Пробник духов LostCherry", category: "Пробники духов", imageUrl: '/img/gifts/lost-cherry.jpg' },
    { id: "p3", title: "Пробник духов FleurNarcotique", category: "Пробники духов", imageUrl: '/img/gifts/fleur.jpg' },
    { id: "p4", title: "Пробник духов Mademoiselle", category: "Пробники духов", imageUrl: '/img/gifts/mademosile.jpg' },
    { id: "p5", title: "Пробник духов Imperatrice", category: "Пробники духов", imageUrl: '/img/gifts/imperatrice.jpg' },
    { id: "p6", title: "Пробник духов GoodGirl", category: "Пробники духов", imageUrl: '/img/gifts/good-girl.jpg' },
    { id: "p7", title: "Пробник духов Molecule ", category: "Пробники духов", imageUrl: '/img/gifts/molecule.jpg' },

    // добавь остальные (у тебя ~30)
];

export const cellGiftIds: string[] = [
    "k7", // 1
    "c2", // 2
    "p5", // 3
    "s2", // 4
    "k3", // 5
    "c6", // 6
    "p2", // 7
    "k10", // 8
    "s1", // 9
    "c4", // 10
    "p7", // 11
    "k1", // 12
    "p4", // 13
    "c1", // 14
    "k8", // 15
    "k5", // 16
    "s4", // 17
    "p1", // 18
    "k2", // 19
    "c5", // 20
    "k6", // 21
    "p3", // 22
    "s3", // 23
    "k11", // 24
    "k4", // 25
    "c3", // 26
    "k9", // 27
    "p6", // 28
    "s5", // 29
    "s6", // 30
];