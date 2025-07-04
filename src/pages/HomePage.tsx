import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useRecipes } from "../hooks/useRecipes";
import RecipeCard from "../components/RecipeCard";
import SearchBar from "../components/SearchBar";

const HomePage: React.FC = () => {
  const { recetas } = useRecipes();
  const [searchTerm, setSearchTerm] = useState("");

  //filtro recetas por nombre si hay término de búsqueda
  const recetasFiltradas = searchTerm
    ? recetas.filter((r) =>
        r.nombre.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : recetas;

  const recetasDestacadas = [...recetasFiltradas]
    .sort((a, b) => b.valoracion - a.valoracion)
    .slice(0, 3);

  const recetasRapidas = recetasFiltradas
    .filter((receta) => receta.tiempo <= 20)
    .slice(0, 3);

  return (
    <div className="home-page container mt-4">
      <section className="hero-section text-center mb-5">
        <div className="hero-content">
          <h1 className="hero-title">🍳 Recetas para Estudiantes</h1>
          <p className="hero-subtitle">
            Deliciosas recetas fáciles, rápidas y económicas para estudiantes
            universitarios
          </p>
          <div className="hero-buttons d-flex justify-content-center gap-3 mt-3">
            <Link to="/recetas" className="btn custom-outline-white">
              Explorar Recetas
            </Link>
            <Link to="/crear" className="btn custom-outline-white">
              Crear Mi Receta
            </Link>
          </div>
        </div>
      </section>

      <SearchBar onSearch={setSearchTerm} />

      <section className="featured-section mb-5">
        <h2 className="section-title">⭐ Recetas Más Valoradas</h2>
        <div className="recipes-grid row row-cols-1 row-cols-md-3 g-4">
          {recetasDestacadas.map((receta) => (
            <RecipeCard key={receta.id} recipe={receta} />
          ))}
        </div>
        <div className="section-footer text-end mt-3">
          <Link to="/recetas" className="text-decoration-none">
            Ver todas las recetas →
          </Link>
        </div>
      </section>

      <section className="quick-section mb-5">
        <h2 className="section-title">⚡ Recetas Rápidas</h2>
        <p className="section-subtitle">
          Perfectas para cuando tienes poco tiempo
        </p>
        <div className="recipes-grid row row-cols-1 row-cols-md-3 g-4">
          {recetasRapidas.map((receta) => (
            <RecipeCard key={receta.id} recipe={receta} />
          ))}
        </div>
      </section>

      <section className="stats-section py-4 border-top">
        <div className="stats-container d-flex justify-content-around text-center">
          <div className="stat-item">
            <span className="stat-number fw-bold fs-3">{recetas.length}</span>
            <div className="stat-label">Recetas</div>
          </div>
          <div className="stat-item">
            <span className="stat-number fw-bold fs-3">
              {Math.round(
                recetas.reduce((acc, r) => acc + r.tiempo, 0) / recetas.length
              )}
            </span>
            <div className="stat-label">Min Promedio</div>
          </div>
          <div className="stat-item">
            <span className="stat-number fw-bold fs-3">
              {recetas.filter((r) => r.dificultad === "fácil").length}
            </span>
            <div className="stat-label">Recetas Fáciles</div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
