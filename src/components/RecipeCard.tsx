import type { Meal } from '../types'
import {
  getSpanishCategory,
  getSpanishCuisine,
  getSpanishMealName,
} from '../utils/recipeLocalization'

interface RecipeCardProps {
  meal: Meal
  isPlanned: boolean
  dayLabel?: string
  onPlan: () => void
  onOpen: () => void
}

export function RecipeCard({
  meal,
  isPlanned,
  dayLabel,
  onPlan,
  onOpen,
}: RecipeCardProps) {
  return (
    <article className="recipe-card">
      <button className="recipe-image-button" type="button" onClick={onOpen} aria-label={`Ver receta ${getSpanishMealName(meal.strMeal)}`}>
        <img className="recipe-image" src={meal.strMealThumb} alt="" loading="lazy" />
        <span className="recipe-tag">{getSpanishCategory(meal.strCategory)}</span>
      </button>
      <div className="recipe-card-body">
        <div className="recipe-meta">
          {dayLabel ? <span className="recipe-day-label">{dayLabel}</span> : <span>{getSpanishCuisine(meal.strArea)}</span>}
          <span className="meta-dot">·</span><span>{getSpanishCategory(meal.strCategory)}</span>
        </div>
        <button className="recipe-title-button" type="button" onClick={onOpen}>
          <span>{getSpanishMealName(meal.strMeal)}</span><small>Ver receta ↗</small>
        </button>
        <div className="recipe-actions">
          <button className={`plan-button ${isPlanned ? 'is-planned' : ''}`} type="button" onClick={onPlan} aria-pressed={isPlanned}>
            <span aria-hidden="true">{isPlanned ? '✓' : '+'}</span> {isPlanned ? 'Quitar del menú' : 'Añadir al menú'}
          </button>
        </div>
      </div>
    </article>
  )
}
