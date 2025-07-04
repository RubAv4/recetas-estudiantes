import React, { useState, useMemo } from "react";
import { useRecipes } from "../hooks/useRecipes";
import RecipeCard from "../components/RecipeCard";
import FilterBar from "../components/FilterBar";
import Modal from "../components/Modal";

const RecipesPage: React.FC = () => {
  // Obtener recetas y función de eliminación del contexto
  const { recetas, deleteReceta } = useRecipes();

  // Estados para los filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("");
  const [selectedRating, setSelectedRating] = useState("0");
  const [selectedTime, setSelectedTime] = useState("0");

  // Estados para el modal de confirmación
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [recipeToDelete, setRecipeToDelete] = useState<number | null>(null);

  // Obtener categorías únicas para el filtro
  const categories = useMemo(() => {
    return Array.from(new Set(recetas.map((receta) => receta.categoria)));
  }, [recetas]);

  // Filtrar recetas basado en los criterios seleccionados
  const filteredRecetas = useMemo(() => {
    return recetas.filter((receta) => {
      const matchesSearch =
        receta.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        receta.ingredientes.some((ingrediente) =>
          ingrediente.toLowerCase().includes(searchTerm.toLowerCase())
        );

      const matchesCategory =
        selectedCategory === "" || receta.categoria === selectedCategory;

      const matchesDifficulty =
        selectedDifficulty === "" || receta.dificultad === selectedDifficulty;

      const matchesRating =
        Number(selectedRating) === 0 ||
        receta.valoracion >= Number(selectedRating);

      const matchesTime =
        Number(selectedTime) === 0 || receta.tiempo <= Number(selectedTime);

      return (
        matchesSearch &&
        matchesCategory &&
        matchesDifficulty &&
        matchesRating &&
        matchesTime
      );
    });
  }, [
    recetas,
    searchTerm,
    selectedCategory,
    selectedDifficulty,
    selectedRating,
    selectedTime,
  ]);

  // Manejador para abrir el modal de confirmación
  const handleDeleteClick = (id: number) => {
    setRecipeToDelete(id);
    setIsModalOpen(true);
  };

  // Confirmar eliminación de receta
  const confirmDelete = () => {
    if (recipeToDelete) {
      deleteReceta(recipeToDelete);
    }
    setIsModalOpen(false);
    setRecipeToDelete(null);
  };

  // Cancelar eliminación
  const cancelDelete = () => {
    setIsModalOpen(false);
    setRecipeToDelete(null);
  };

  // Limpiar todos los filtros
  const clearAllFilters = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setSelectedDifficulty("");
    setSelectedRating("0");
    setSelectedTime("0");
  };

  return (
    <div className="recipes-page">
      <div className="page-header">
        <h1 className="page-title">📖 Todas las Recetas</h1>
        <p className="page-subtitle">
          Descubre recetas deliciosas y fáciles de preparar
        </p>
      </div>

      {/* Componente de filtros */}
      <FilterBar
        searchTerm={searchTerm}
        selectedCategory={selectedCategory}
        selectedDifficulty={selectedDifficulty}
        selectedRating={selectedRating}
        selectedTime={selectedTime}
        onSearchChange={setSearchTerm}
        onCategoryChange={setSelectedCategory}
        onDifficultyChange={setSelectedDifficulty}
        onRatingChange={setSelectedRating}
        onTimeChange={setSelectedTime}
        categories={categories}
      />

      {/* Información de resultados */}
      <div className="results-info">
        <p className="results-count">
          {filteredRecetas.length === recetas.length
            ? `Mostrando todas las ${recetas.length} recetas`
            : `Mostrando ${filteredRecetas.length} de ${recetas.length} recetas`}
        </p>
      </div>

      {/* Mensaje cuando no hay resultados */}
      {filteredRecetas.length === 0 ? (
        <div className="no-results">
          <h3>😔 No se encontraron recetas</h3>
          <p>Intenta cambiar los filtros o términos de búsqueda</p>
          <button onClick={clearAllFilters} className="clear-filters-btn">
            Limpiar Filtros
          </button>
        </div>
      ) : (
        <div className="recipes-grid">
          {/* Listado de recetas filtradas */}
          {filteredRecetas.map((receta) => (
            <RecipeCard
              key={receta.id}
              recipe={receta}
              onDelete={() => handleDeleteClick(receta.id)}
            />
          ))}
        </div>
      )}

      {/* Modal de confirmación para eliminar receta */}
      <Modal
        isOpen={isModalOpen}
        title="Eliminar Receta"
        message="¿Estás seguro que deseas eliminar esta receta? Esta acción no se puede deshacer."
        confirmText="Eliminar"
        cancelText="Cancelar"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </div>
  );
};

export default RecipesPage;
