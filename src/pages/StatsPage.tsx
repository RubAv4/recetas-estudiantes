import React from "react";
import { useRecipes } from "../hooks/useRecipes";

const StatsPage: React.FC = () => {
  const { recetas } = useRecipes();

  const totalRecetas = recetas.length;

  const recetasPorCategoria = recetas.reduce((acc, receta) => {
    acc[receta.categoria] = (acc[receta.categoria] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const recetaPopular = recetas.reduce((max, receta) => {
    return receta.valoracion > max.valoracion ? receta : max;
  }, recetas[0]);

  return (
    <div className="container py-4">
      <h1 className="mb-4">📊 Estadísticas de Recetas</h1>

      <div className="row g-4">
        <div className="col-md-4">
          <div className="card text-center">
            <div className="card-body">
              <h5 className="card-title">Total de Recetas</h5>
              <p className="card-text display-6">{totalRecetas}</p>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card text-center">
            <div className="card-body">
              <h5 className="card-title">Recetas por Categoría</h5>
              {Object.entries(recetasPorCategoria).map(([cat, count]) => (
                <p key={cat} className="mb-1">
                  <strong>{cat}:</strong> {count}
                </p>
              ))}
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card text-center">
            <div className="card-body">
              <h5 className="card-title">Receta Más Popular</h5>
              {recetaPopular ? (
                <>
                  <p className="fw-bold mb-1">{recetaPopular.nombre}</p>
                  <p className="text-muted">⭐ {recetaPopular.valoracion}</p>
                </>
              ) : (
                <p>No hay recetas aún.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsPage;
