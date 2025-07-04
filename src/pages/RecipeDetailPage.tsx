import React from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { useRecipes } from "../hooks/useRecipes";

const RecipeDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { recetas, addToFavoritos, removeFromFavoritos, isFavorito } =
    useRecipes();

  const receta = recetas.find((r) => r.id === Number(id));

  if (!receta) {
    return <Navigate to="/recetas" replace />;
  }

  const handleFavoritoClick = () => {
    if (isFavorito(receta.id)) {
      removeFromFavoritos(receta.id);
    } else {
      addToFavoritos(receta.id);
    }
  };
  const handleShareClick = async () => {
    const shareData = {
      title: receta.nombre,
      text: `¡Mira esta receta deliciosa: ${receta.nombre}!`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error("Error al compartir", err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert(
          "URL copiada al portapapeles porque tu navegador no soporta compartir directamente."
        );
      } catch {
        alert("Tu navegador no permite compartir ni copiar el enlace.");
      }
    }
  };
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
    <div className="recipe-detail-page">
      <div className="recipe-header">
        <div className="recipe-navigation">
          <Link to="/recetas" className="back-link">
            ← Volver a Recetas
          </Link>
        </div>

        <div className="recipe-hero">
          <div className="recipe-image-large">
            <img
              src={receta.imagen}
              alt={receta.nombre}
              onError={(e) => {
                e.currentTarget.src = "/placeholder-large.svg";
              }}
            />
            <button
              className={`favorite-btn-large ${
                isFavorito(receta.id) ? "active" : ""
              }`}
              onClick={handleFavoritoClick}
              aria-label="Marcar como favorito"
            >
              {isFavorito(receta.id) ? "❤️" : "🤍"}
            </button>
          </div>

          <div className="recipe-info">
            <h1 className="recipe-title-large">{receta.nombre}</h1>

            <div className="recipe-meta-large">
              <div className="meta-item">
                <span className="meta-label">⏱️ Tiempo total:</span>
                <span className="meta-value">{receta.tiempo} minutos</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Dificultad:</span>
                <span className="meta-value">
                  {getDificultadEmoji(receta.dificultad)} {receta.dificultad}
                </span>
              </div>
              <div className="meta-item">
                <span className="meta-label">👥 Porciones:</span>
                <span className="meta-value">{receta.porciones}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Categoría:</span>
                <span className="meta-value category-tag">
                  {receta.categoria}
                </span>
              </div>
            </div>

            <div className="recipe-rating-large">
              <span className="rating-stars">
                {"⭐".repeat(Math.floor(receta.valoracion))}
              </span>
              <span className="rating-number">{receta.valoracion}/5</span>
            </div>

            <div className="recipe-actions-inline">
              <button
                onClick={handleShareClick}
                className="action-button secondary"
              >
                🔗 Compartir Receta
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="recipe-content">
        <div className="recipe-section">
          <h2 className="section-title">🛒 Ingredientes</h2>
          <ul className="ingredients-list">
            {receta.ingredientes.map((ingrediente, index) => (
              <li key={index} className="ingredient-item">
                <span className="ingredient-bullet">•</span>
                {ingrediente}
              </li>
            ))}
          </ul>
        </div>

        <div className="recipe-section">
          <h2 className="section-title">👨‍🍳 Pasos de Preparación</h2>
          <ol className="steps-list">
            {receta.pasos.map((paso, index) => (
              <li key={index} className="step-item">
                <span className="step-number">{index + 1}</span>
                <span className="step-text">{paso}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <div className="recipe-actions">
        <button
          onClick={handleFavoritoClick}
          className={`action-button ${
            isFavorito(receta.id) ? "favorited" : ""
          }`}
        >
          {isFavorito(receta.id) ? "❤️ En Favoritos" : "🤍 Agregar a Favoritos"}
        </button>
        <Link to="/recetas" className="action-button secondary">
          Ver Más Recetas
        </Link>
      </div>
    </div>
  );
};

export default RecipeDetailPage;
