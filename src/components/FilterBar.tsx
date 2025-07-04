import React from "react";

interface FilterBarProps {
  searchTerm: string;
  selectedCategory: string;
  selectedDifficulty: string;
  selectedRating: string;
  selectedTime: string;
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onDifficultyChange: (value: string) => void;
  onRatingChange: (value: string) => void;
  onTimeChange: (value: string) => void;
  categories: string[];
}

const FilterBar: React.FC<FilterBarProps> = ({
  searchTerm,
  selectedCategory,
  selectedDifficulty,
  selectedRating,
  selectedTime,
  onSearchChange,
  onCategoryChange,
  onDifficultyChange,
  onRatingChange,
  onTimeChange,
  categories,
}) => {
  return (
    <div className="filter-bar">
      <div className="search-container">
        <input
          type="text"
          placeholder="🔍 Buscar recetas..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="filters-container">
        <select
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="filter-select"
        >
          <option value="">Todas las categorías</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </option>
          ))}
        </select>

        <select
          value={selectedDifficulty}
          onChange={(e) => onDifficultyChange(e.target.value)}
          className="filter-select"
        >
          <option value="">Todas las dificultades</option>
          <option value="fácil">🟢 Fácil</option>
          <option value="medio">🟡 Medio</option>
          <option value="difícil">🔴 Difícil</option>
        </select>

        {/* Nuevo filtro por valoración */}
        <select
          value={selectedRating}
          onChange={(e) => onRatingChange(e.target.value)}
          className="filter-select"
        >
          <option value="0">Todas las valoraciones</option>
          <option value="3">⭐ 3+ estrellas</option>
          <option value="4">⭐⭐ 4+ estrellas</option>
          <option value="5">⭐⭐⭐ 5 estrellas</option>
        </select>

        {/* Nuevo filtro por tiempo */}
        <select
          value={selectedTime}
          onChange={(e) => onTimeChange(e.target.value)}
          className="filter-select"
        >
          <option value="0">Cualquier tiempo</option>
          <option value="15">≤ 15 minutos</option>
          <option value="30">≤ 30 minutos</option>
          <option value="60">≤ 1 hora</option>
          <option value="120">≤ 2 horas</option>
        </select>
      </div>
    </div>
  );
};

export default FilterBar;
