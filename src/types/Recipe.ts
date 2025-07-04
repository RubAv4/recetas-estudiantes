export interface Recipe {
  id: number;
  nombre: string;
  imagen: string;
  ingredientes: string[];
  pasos: string[];
  tiempo: number;
  dificultad: 'fácil' | 'medio' | 'difícil';
  categoria: string;
  valoracion: number;
  porciones: number;
}

export interface RecipeFormData {
  nombre: string;
  imagen: string; // Nuevo campo para URL de imagen
  ingredientes: string;
  pasos: string;
  tiempo: number;
  dificultad: 'fácil' | 'medio' | 'difícil';
  categoria: string;
  porciones: number;
}

export interface RecipeFormErrors {
  nombre?: string;
  imagen?: string; // Nuevo campo para errores de imagen
  ingredientes?: string;
  pasos?: string;
  tiempo?: string;
  dificultad?: string;
  categoria?: string;
  porciones?: string;
}
//nueva interfaz para los filtros
export interface RecipeFilters {
  searchTerm: string;
  category: string;
  difficulty: string;
  minRating: number;
  maxTime: number | null;
}