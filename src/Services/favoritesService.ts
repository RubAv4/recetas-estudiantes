const FAVORITOS_KEY = 'recetas_favoritas';

export const getFavorites = (): string[] => {
    const data = localStorage.getItem(FAVORITOS_KEY);
    return data ? JSON.parse(data) : [];
};

export const addFavorite = (id: string): void => {
    const favoritos = getFavorites();
    if (!favoritos.includes(id)) {
        favoritos.push(id);
        localStorage.setItem(FAVORITOS_KEY, JSON.stringify(favoritos));
    }
};

export const removeFavorite = (id: string): void => {
    const favoritos = getFavorites().filter(favId => favId !== id);
    localStorage.setItem(FAVORITOS_KEY, JSON.stringify(favoritos));
};
