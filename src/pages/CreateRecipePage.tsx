import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRecipes } from "../hooks/useRecipes";
import type { RecipeFormData, RecipeFormErrors } from "../types/Recipe";

const CreateRecipePage: React.FC = () => {
  const navigate = useNavigate();
  const { addReceta } = useRecipes();
  const nombreInputRef = useRef<HTMLInputElement>(null);

  // Estados para el formulario controlado
  const [formData, setFormData] = useState<RecipeFormData>({
    nombre: "",
    imagen: "",
    ingredientes: "",
    pasos: "",
    tiempo: 10,
    dificultad: "fácil",
    categoria: "",
    porciones: 1,
  });

  const [errors, setErrors] = useState<RecipeFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ingredientsList, setIngredientsList] = useState<string[]>([]);
  const [draggedItem, setDraggedItem] = useState<number | null>(null);

  // Convertir texto de ingredientes a lista al cargar
  useEffect(() => {
    if (formData.ingredientes) {
      setIngredientsList(
        formData.ingredientes
          .split("\n")
          .map((ing) => ing.trim())
          .filter((ing) => ing.length > 0)
      );
    }
  }, [formData.ingredientes]);

  // Manejadores para Drag & Drop
  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.setData("text/plain", index.toString());
    setDraggedItem(index);
    setTimeout(() => {
      e.currentTarget.classList.add("dragging");
    }, 0);
  };

  const handleDragOver = (e: React.DragEvent, overIndex: number) => {
    e.preventDefault();
    if (draggedItem === null || draggedItem === overIndex) return;

    setIngredientsList((prev) => {
      const updated = [...prev];
      const [moved] = updated.splice(draggedItem, 1);
      updated.splice(overIndex, 0, moved);
      return updated;
    });

    setDraggedItem(overIndex);
  };

  const handleDragEnd = (e: React.DragEvent) => {
    e.currentTarget.classList.remove("dragging");
    setDraggedItem(null);
    updateIngredientsText();
  };

  // Actualizar el textarea con los ingredientes
  const updateIngredientsText = () => {
    setFormData((prev) => ({
      ...prev,
      ingredientes: ingredientsList.join("\n"),
    }));
  };

  // Añadir nuevo ingrediente
  const handleAddIngredient = () => {
    setIngredientsList((prev) => {
      const updated = [...prev, ""];
      setFormData((form) => ({
        ...form,
        ingredientes: updated.join("\n"),
      }));
      return updated;
    });
  };

  // Actualizar ingrediente
  const handleIngredientChange = (index: number, value: string) => {
    setIngredientsList((prev) => {
      const updated = [...prev];
      updated[index] = value;

      // Sincroniza el campo de texto original
      setFormData((form) => ({
        ...form,
        ingredientes: updated.join("\n"),
      }));

      return updated;
    });
  };

  // Eliminar ingrediente
  const handleRemoveIngredient = (index: number) => {
    const newIngredients = [...ingredientsList];
    newIngredients.splice(index, 1);
    setIngredientsList(newIngredients);
    updateIngredientsText();
  };

  // Función para validar URL de imagen
  const validateImageUrl = (url: string): boolean => {
    if (!url) return true;
    try {
      new URL(url);
      return /\.(jpg|jpeg|png|webp|avif|gif|svg)$/i.test(url);
    } catch {
      return false;
    }
  };

  // useEffect para enfocar el primer input al cargar la página
  useEffect(() => {
    if (nombreInputRef.current) {
      nombreInputRef.current.focus();
    }
  }, []);

  // Función para manejar cambios en los inputs
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "tiempo" || name === "porciones" ? Number(value) : value,
    }));

    if (errors[name as keyof RecipeFormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  // Función de validación
  const validateForm = (): boolean => {
    const newErrors: RecipeFormErrors = {};
    const validIngredients = ingredientsList.filter(
      (ing) => ing.trim().length > 0
    );

    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre es obligatorio";
    }

    if (formData.imagen && !validateImageUrl(formData.imagen)) {
      newErrors.imagen = "Ingresa una URL válida (jpg, png, gif, etc.)";
    }

    if (validIngredients.length === 0) {
      newErrors.ingredientes = "Debe haber al menos un ingrediente";
    }

    if (!formData.pasos.trim()) {
      newErrors.pasos = "Los pasos son obligatorios";
    }

    if (!formData.categoria.trim()) {
      newErrors.categoria = "La categoría es obligatoria";
    }

    if (formData.tiempo < 1) {
      newErrors.tiempo = "El tiempo debe ser mayor a 0";
    }

    if (formData.porciones < 1) {
      newErrors.porciones = "Las porciones deben ser mayor a 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Función para manejar el envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const nuevaReceta = {
        nombre: formData.nombre.trim(),
        imagen: formData.imagen || "/placeholder-recipe.svg",
        ingredientes: ingredientsList.filter((ing) => ing.trim().length > 0),
        pasos: formData.pasos
          .split("\n")
          .map((paso) => paso.trim())
          .filter((paso) => paso.length > 0),
        tiempo: formData.tiempo,
        dificultad: formData.dificultad as "fácil" | "medio" | "difícil",
        categoria: formData.categoria.trim().toLowerCase(),
        porciones: formData.porciones,
        valoracion: 4.0,
      };

      addReceta(nuevaReceta);
      alert("¡Receta creada exitosamente! 🎉");
      navigate("/recetas");
      navigate("/recetas", { replace: true });
    } catch {
      alert("Error al crear la receta. Inténtalo de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="create-recipe-page">
      <div className="page-header">
        <h1 className="page-title">➕ Crear Nueva Receta</h1>
        <p className="page-subtitle">
          Comparte tu receta favorita con otros estudiantes
        </p>
      </div>

      <form onSubmit={handleSubmit} className="recipe-form">
        <div className="form-section">
          <h3 className="form-section-title">📝 Información Básica</h3>
          <div className="form-group">
            <label htmlFor="imagen" className="form-label">
              URL de la imagen
              <span className="form-hint">
                (Opcional - jpg, png, gif, etc.)
              </span>
            </label>
            <input
              type="url"
              id="imagen"
              name="imagen"
              value={formData.imagen}
              onChange={handleInputChange}
              className={`form-input ${errors.imagen ? "error" : ""}`}
              placeholder="https://ejemplo.com/imagen.jpg"
            />
            {errors.imagen && (
              <span className="error-message">{errors.imagen}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="nombre" className="form-label">
              Nombre de la receta *
            </label>
            <input
              ref={nombreInputRef}
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleInputChange}
              className={`form-input ${errors.nombre ? "error" : ""}`}
              placeholder="ej. Pasta con salsa de tomate"
            />
            {errors.nombre && (
              <span className="error-message">{errors.nombre}</span>
            )}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="tiempo" className="form-label">
                Tiempo total (minutos) *
                <span className="form-hint">Incluye preparación y cocción</span>
              </label>
              <input
                type="number"
                id="tiempo"
                name="tiempo"
                min="1"
                max="300"
                value={formData.tiempo}
                onChange={handleInputChange}
                className={`form-input ${errors.tiempo ? "error" : ""}`}
                placeholder="Tiempo total en minutos"
              />
              {errors.tiempo && (
                <span className="error-message">{errors.tiempo}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="porciones" className="form-label">
                Porciones *
              </label>
              <input
                type="number"
                id="porciones"
                name="porciones"
                min="1"
                max="20"
                value={formData.porciones}
                onChange={handleInputChange}
                className={`form-input ${errors.porciones ? "error" : ""}`}
              />
              {errors.porciones && (
                <span className="error-message">{errors.porciones}</span>
              )}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="dificultad" className="form-label">
                Dificultad *
              </label>
              <select
                id="dificultad"
                name="dificultad"
                value={formData.dificultad}
                onChange={handleInputChange}
                className="form-select"
              >
                <option value="fácil">🟢 Fácil</option>
                <option value="medio">🟡 Medio</option>
                <option value="difícil">🔴 Difícil</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="categoria" className="form-label">
                Categoría *
              </label>
              <input
                type="text"
                id="categoria"
                name="categoria"
                value={formData.categoria}
                onChange={handleInputChange}
                className={`form-input ${errors.categoria ? "error" : ""}`}
                placeholder="ej. italiana, mexicana, saludable"
              />
              {errors.categoria && (
                <span className="error-message">{errors.categoria}</span>
              )}
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3 className="form-section-title">🛒 Ingredientes</h3>
          <div className="form-group">
            <label className="form-label">
              Lista de ingredientes *
              <span className="form-hint">(Arrastra para reordenar)</span>
            </label>

            <div className="ingredients-list">
              {ingredientsList.map((ingredient, index) => (
                <div
                  key={`${ingredient}-${index}`} // Mejor que usar solo index
                  className={`ingredient-item ${
                    draggedItem === index ? "dragging" : ""
                  }`}
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragEnd={(e) => handleDragEnd(e)}
                  onDrop={(e) => e.preventDefault()}
                >
                  <span className="drag-handle" title="Arrastra para reordenar">
                    ☰
                  </span>
                  <input
                    type="text"
                    value={ingredient}
                    onChange={(e) =>
                      handleIngredientChange(index, e.target.value)
                    }
                    className="ingredient-input"
                    placeholder={`Ingrediente ${index + 1}`}
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveIngredient(index)}
                    className="remove-ingredient"
                    aria-label={`Eliminar ingrediente ${index + 1}`}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={handleAddIngredient}
              className="add-ingredient-btn"
            >
              + Añadir Ingrediente
            </button>

            {errors.ingredientes && (
              <span className="error-message">{errors.ingredientes}</span>
            )}
          </div>
        </div>

        <div className="form-section">
          <h3 className="form-section-title">👨‍🍳 Preparación</h3>
          <div className="form-group">
            <label htmlFor="pasos" className="form-label">
              Pasos de preparación (uno por línea) *
            </label>
            <textarea
              id="pasos"
              name="pasos"
              value={formData.pasos}
              onChange={handleInputChange}
              className={`form-textarea ${errors.pasos ? "error" : ""}`}
              rows={8}
              placeholder="ej.&#10;Hervir agua con sal&#10;Cocinar la pasta según instrucciones&#10;En una sartén, calentar aceite&#10;Sofreír el ajo picado"
            />
            {errors.pasos && (
              <span className="error-message">{errors.pasos}</span>
            )}
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={() => navigate("/recetas")}
            className="form-button secondary"
            disabled={isSubmitting}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="form-button primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? "⏳ Creando..." : "✅ Crear Receta"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateRecipePage;
