type Channels = {
    id: string;
    title: string;
    image: string;
    source: string;
    category: string;
    number: string;
};

type CategoriesGroups = {
    id: string;
    title: string;
    channels: Channels[];
};

export type {
    Channels,
    CategoriesGroups
};