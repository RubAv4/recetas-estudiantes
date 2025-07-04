import { useContext, useState } from 'react';
import { RecipeContext } from '../context/RecipeContext';
import type { Recipe } from '../types/Recipe';

//dificultad definido
type DifficultyLevel = 'fácil' | 'medio' | 'difícil';

export const useRecipes = () => {
  const context = useContext(RecipeContext);
  if (context === undefined) {
    throw new Error('useRecipes debe ser usado dentro de un RecipeProvider');
  }

  //filtro de dificultad
  const [difficultyFilter, setDifficultyFilter] = useState<DifficultyLevel | null>(null);

  //filtra las recetas por dificultad
  const filterByDifficulty = (difficulty: DifficultyLevel): Recipe[] => {
    if (!context.recetas) return [];
    return context.recetas.filter(
      (recipe) => recipe.dificultad.toLowerCase() === difficulty.toLowerCase()
    );
  };

  return {
    ...context,
    difficultyFilter,
    setDifficultyFilter,
    filterByDifficulty,
  };
};
