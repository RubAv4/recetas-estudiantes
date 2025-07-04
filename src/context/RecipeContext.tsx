/* eslint-disable react-refresh/only-export-components */
import React, { createContext } from "react";
import type { ReactNode } from "react";
import type { Recipe } from "../types/Recipe";
import recetasData from "../data/recetas.json";
import { useLocalStorage } from "../hooks/useLocalStorage";

interface RecipeContextType {
  recetas: Recipe[];
  favoritos: number[];
  addToFavoritos: (id: number) => void;
  removeFromFavoritos: (id: number) => void;
  isFavorito: (id: number) => boolean;
  addReceta: (receta: Omit<Recipe, "id">) => void;
  deleteReceta: (id: number) => void; // Nueva función
}

export const RecipeContext = createContext<RecipeContextType | undefined>(
  undefined
);

interface RecipeProviderProps {
  children: ReactNode;
}

export const RecipeProvider: React.FC<RecipeProviderProps> = ({ children }) => {
  const [recetas, setRecetas] = useLocalStorage<Recipe[]>(
    "recetas",
    recetasData.recetas as Recipe[]
  );

  const [favoritos, setFavoritos] = useLocalStorage<number[]>("favoritos", []);

  const addToFavoritos = (id: number) => {
    setFavoritos((prev) => [...prev, id]);
  };

  const removeFromFavoritos = (id: number) => {
    setFavoritos((prev) => prev.filter((favId) => favId !== id));
  };

  const isFavorito = (id: number) => {
    return favoritos.includes(id);
  };

  const addReceta = (nuevaReceta: Omit<Recipe, "id">) => {
    const newId = Math.max(0, ...recetas.map((r) => r.id)) + 1;
    const receta: Recipe = {
      ...nuevaReceta,
      id: newId,
    };
    setRecetas((prev) => [...prev, receta]);
  };
  // En el Provider:
  const deleteReceta = (id: number) => {
    setRecetas((prev) => prev.filter((receta) => receta.id !== id));
  };
  const value = {
    recetas,
    favoritos,
    addToFavoritos,
    removeFromFavoritos,
    isFavorito,
    addReceta,
    deleteReceta,
  };

  return (
    <RecipeContext.Provider value={value}>{children}</RecipeContext.Provider>
  );
};
