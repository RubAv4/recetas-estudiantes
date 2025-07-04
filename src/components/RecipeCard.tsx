import React, { useState } from "react"; // Añadimos useState
import { Link } from "react-router-dom";
import type { Recipe } from "../types/Recipe";
import { useRecipes } from "../hooks/useRecipes";
import Modal from "../components/Modal"; // Importamos el Modal

interface RecipeCardProps {
  recipe: Recipe;
  onDelete?: (id: string) => void; // Cambiamos a recibir el ID
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, onDelete }) => {
  const { addToFavoritos, removeFromFavoritos, isFavorito } = useRecipes();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // Estado para el modal

  // Manejador para favoritos con prevención de propagación
  const handleFavoritoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isFavorito(recipe.id)) {
      removeFromFavoritos(recipe.id);
    } else {
      addToFavoritos(recipe.id);
    }
  };

  // Manejador para abrir modal de eliminación
  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDeleteModalOpen(true); // Abre el modal en lugar de eliminar directamente
  };

  // Manejador para confirmar eliminación
  const handleConfirmDelete = () => {
    onDelete?.(String(recipe.id)); // Convertimos a string
    setIsDeleteModalOpen(false);
  };

  // Función para obtener emoji de dificultad
  const getDificultadEmoji = (dificultad: string) => {
    switch (dificultad) {
      case "fácil":
        return "🟢";
      case "medio":
        return "🟡";
      case "difícil":
        return "🔴";
      default:
        return "⚪";
    }
  };

  return (
    <>
      <Link to={`/receta/${recipe.id}`} className="recipe-card-link">
        <div className="recipe-card">
          <div className="recipe-image-container">
            <img
              src={recipe.imagen}
              alt={recipe.nombre}
              className="recipe-image"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                target.src = "/placeholder-recipe.svg";
              }}
            />

            {/* Botón de favoritos */}
            <button
              className={`favorite-btn ${
                isFavorito(recipe.id) ? "active" : ""
              }`}
              onClick={handleFavoritoClick}
              aria-label={
                isFavorito(recipe.id)
                  ? "Quitar de favoritos"
                  : "Agregar a favoritos"
              }
            >
              {isFavorito(recipe.id) ? "❤️" : "🤍"}
            </button>

            {/* Botón de eliminar (solo si hay onDelete) */}
            {onDelete && (
              <button
                className="delete-btn"
                onClick={handleDeleteClick}
                aria-label="Eliminar receta"
              >
                🗑️
              </button>
            )}
          </div>

          <div className="recipe-content">
            <h3 className="recipe-title">{recipe.nombre}</h3>

            <div className="recipe-cooking-time">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <circle cx="12" cy="12" r="10" strokeWidth="2" />
                <polyline
                  points="12 6 12 12 16 14"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
              <span>{recipe.tiempo} min</span>
            </div>

            <div className="recipe-meta">
              <span className="recipe-difficulty">
                {getDificultadEmoji(recipe.dificultad)} {recipe.dificultad}
              </span>
              <span className="recipe-portions">
                👥 {recipe.porciones} porciones
              </span>
            </div>

            <div className="recipe-category">
              <span className="category-tag">{recipe.categoria}</span>
            </div>

            <div className="recipe-rating">
              <span className="rating-stars">
                {"⭐".repeat(Math.floor(recipe.valoracion))}
              </span>
              <span className="rating-number">
                {recipe.valoracion.toFixed(1)}
              </span>
            </div>
          </div>
        </div>
      </Link>

      {/* Modal de confirmación para eliminar */}
      <Modal
        isOpen={isDeleteModalOpen}
        title="¿Eliminar receta?"
        message={`Estás a punto de eliminar "${recipe.nombre}". ¿Estás seguro?`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
      />
    </>
  );
};

export default RecipeCard;
