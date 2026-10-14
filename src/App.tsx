import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { RecipeCard } from './components/RecipeCard'
import { useApp } from './hooks/useApp'
import { useFetch } from './hooks/useFetch'
import { useSearchForm } from './hooks/useSearchForm'
import type { Meal, MealResponse } from './types'
import {
  getApiSearchTerm,
  getMealIngredients,
  getSpanishCategory,
  getSpanishCuisine,
  getSpanishMealName,
  translateIngredient,
  translateMeasure,
} from './utils/recipeLocalization'
import './App.css'

const EMPTY_MEALS: Meal[] = []
const DEFAULT_SEARCH_TERM = 'pollo'

const isMealResponse = (value: unknown): value is MealResponse => {
  if (!value || typeof value !== 'object' || !('meals' in value)) return false
  const meals = value.meals
  return meals === null || (
    Array.isArray(meals) &&
    meals.every((meal) =>
      typeof meal === 'object' &&
      meal !== null &&
      'idMeal' in meal &&
      typeof meal.idMeal === 'string' &&
      'strMeal' in meal &&
      typeof meal.strMeal === 'string' &&
      'strMealThumb' in meal &&
      typeof meal.strMealThumb === 'string',
    )
  )
}

type AppSection = 'dishes' | 'menu' | 'shopping'

function App() {
  const { plan, theme, togglePlan, toggleTheme } = useApp()
  const [submittedQuery, setSubmittedQuery] = useState(DEFAULT_SEARCH_TERM)
  const [retryCount, setRetryCount] = useState(0)
  const [activeSection, setActiveSection] = useState<AppSection>('dishes')
  const [shoppingMealId, setShoppingMealId] = useState<string | null>(null)
  const [checkedIngredients, setCheckedIngredients] = useState<string[]>([])
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null)
  const closeSelectedMeal = useCallback(() => setSelectedMeal(null), [])
  const apiQuery = getApiSearchTerm(submittedQuery)
  const requestUrl = `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(apiQuery)}`
  const { data, isLoading, error } = useFetch(requestUrl, isMealResponse, retryCount)
  const recipes = data?.meals ?? EMPTY_MEALS
  const plannedMeals = useMemo(() => plan.map((entry) => entry.meal), [plan])
  const shoppingItems = useMemo(() => {
    const groupedItems = new Map<string, {
      name: string
      meals: Map<string, { name: string; measure: string }>
    }>()

    for (const { meal } of plan) {
      for (const ingredient of getMealIngredients(meal)) {
        const name = translateIngredient(ingredient.name)
        const key = name.toLocaleLowerCase()
        const item = groupedItems.get(key) ?? {
          name,
          meals: new Map<string, { name: string; measure: string }>(),
        }
        const measure = translateMeasure(ingredient.measure)
        item.meals.set(meal.idMeal, {
          name: getSpanishMealName(meal.strMeal),
          measure,
        })
        groupedItems.set(key, item)
      }
    }

    return Array.from(groupedItems, ([id, item]) => {
      const recipes = Array.from(item.meals, ([mealId, details]) => ({
        id: mealId,
        ...details,
      }))
      return {
        id,
        name: item.name,
        recipes,
        measure: Array.from(new Set(recipes.map((recipe) => recipe.measure).filter(Boolean))).join(' · '),
        meals: Array.from(new Set(recipes.map((recipe) => recipe.name))).join(', '),
      }
    }).sort((first, second) => first.name.localeCompare(second.name, 'es'))
  }, [plan])

  const selectedShoppingMeal = plan.find((entry) => entry.meal.idMeal === shoppingMealId)
  const visibleShoppingItems = shoppingMealId && selectedShoppingMeal
    ? shoppingItems
      .filter((item) => item.recipes.some((meal) => meal.id === shoppingMealId))
      .map((item) => {
        const mealDetails = item.recipes.find((meal) => meal.id === shoppingMealId)
        return {
          ...item,
          measure: mealDetails?.measure ?? '',
          meals: mealDetails?.name ?? '',
        }
      })
    : shoppingItems
  const visibleRecipes = activeSection === 'menu' ? plannedMeals : recipes

  const { inputRef, searchTerm, setSearchTerm, handleSubmit } = useSearchForm(
    submittedQuery,
    (term) => {
      setSubmittedQuery(term)
      setActiveSection('dishes')
    },
  )
  const clearSearchFilter = () => {
    setSearchTerm(DEFAULT_SEARCH_TERM)
    setSubmittedQuery(DEFAULT_SEARCH_TERM)
    setActiveSection('dishes')
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#" aria-label="SazónGo, inicio">
          <span className="brand-mark" aria-hidden="true">s</span>
          <span>Sazón<span className="brand-accent">Go</span></span>
          <span className="brand-dot">.</span>
        </a>
        <nav className="main-nav" aria-label="Navegación principal">
          <button
            className={`nav-link ${activeSection === 'dishes' ? 'nav-link-active' : ''}`}
            type="button"
            aria-current={activeSection === 'dishes' ? 'page' : undefined}
            onClick={() => setActiveSection('dishes')}
          >
            <span className="nav-icon" aria-hidden="true">◈</span>Platos
          </button>
          <button
            className={`nav-link ${activeSection === 'menu' ? 'nav-link-active' : ''}`}
            type="button"
            aria-current={activeSection === 'menu' ? 'page' : undefined}
            onClick={() => setActiveSection('menu')}
          >
            <span className="nav-icon" aria-hidden="true">▣</span>Mi menú<span className="nav-count">{plan.length}</span>
          </button>
          <button
            className={`nav-link ${activeSection === 'shopping' ? 'nav-link-active' : ''}`}
            type="button"
            aria-current={activeSection === 'shopping' ? 'page' : undefined}
            onClick={() => setActiveSection('shopping')}
          >
            <span className="nav-icon" aria-hidden="true">▤</span>Lista de compras<span className="nav-count">{shoppingItems.length}</span>
          </button>
        </nav>
        <button className="theme-toggle" type="button" onClick={toggleTheme}>
          <span aria-hidden="true">{theme === 'light' ? '☾' : '☀'}</span>
          <span className="theme-label">{theme === 'light' ? 'Modo oscuro' : 'Modo claro'}</span>
        </button>
      </header>

      <main>
        {activeSection === 'dishes' && (
          <>
            <section className="welcome-section">
              <div>
                <p className="eyebrow"><span className="eyebrow-line" /> TU COCINA, MÁS CREATIVA</p>
                <h1>¿Qué se te antoja <span>hoy?</span></h1>
                <p className="welcome-copy">Ideas ricas para cocinar rico, sin complicarte.</p>
              </div>
              <div className="welcome-sticker" aria-hidden="true">
                <span>✳</span>
                <span className="sticker-caption">algo rico<br />te espera</span>
              </div>
            </section>

            <section className="search-panel" aria-label="Buscar platos">
              <form className="search-form" onSubmit={handleSubmit}>
                <span className="search-icon" aria-hidden="true">⌕</span>
                <input
                  ref={inputRef}
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Busca un plato o ingrediente: pollo, pasta, salmón..."
                  aria-label="Buscar un plato"
                />
                <button className="search-button" type="submit">Buscar platos <span aria-hidden="true">↗</span></button>
              </form>
              <div className="search-panel-footer">
                <div className="search-hint"><span className="sparkle">✳</span> Prueba: “pollo”, “pasta” o “salmón”</div>
                {submittedQuery !== DEFAULT_SEARCH_TERM && (
                  <button className="clear-search-button" type="button" onClick={clearSearchFilter}>
                    Quitar filtro
                  </button>
                )}
              </div>
            </section>
          </>
        )}

        {activeSection !== 'shopping' && <section className={`content-layout ${activeSection === 'dishes' ? '' : 'content-layout-compact'}`} id="recetas">
          <div className="recipe-column">
            <div className="section-heading">
              <div>
                <p className="section-kicker">
                  {activeSection === 'dishes' ? 'INSPIRACIÓN PARA HOY' : 'TUS PLATOS SELECCIONADOS'}
                </p>
                <h2>
                  {activeSection === 'dishes' ? 'Todos los platos' : 'Mi menú semanal'}
                  <span className="heading-spark"> ✳</span>
                </h2>
              </div>
              <div className="results-count">
                {activeSection === 'dishes'
                  ? (isLoading ? 'Buscando...' : `${visibleRecipes.length} ${visibleRecipes.length === 1 ? 'plato' : 'platos'}`)
                  : `${visibleRecipes.length} ${visibleRecipes.length === 1 ? 'plato' : 'platos'}`}
              </div>
            </div>

            {activeSection === 'menu' && (
              <p className="section-description">Aquí aparecen únicamente los platos que agregaste a tu menú.</p>
            )}

            {activeSection === 'dishes' && error && (
              <div className="message-card error-card" role="alert">
                <span className="message-icon">!</span>
                <div><strong>No pudimos cargar las recetas.</strong><p>{error}</p><button type="button" onClick={() => setRetryCount((count) => count + 1)}>Intenta de nuevo</button></div>
              </div>
            )}

            {activeSection === 'dishes' && isLoading && (
              <div className="recipe-grid" aria-label="Cargando recetas" aria-busy="true">
                {Array.from({ length: 6 }, (_, index) => <div className="recipe-skeleton" key={index} />)}
              </div>
            )}

            {(activeSection === 'menu' || (!isLoading && !error)) && visibleRecipes.length > 0 && (
              <div className="recipe-grid">
                {visibleRecipes.map((recipe) => (
                  <RecipeCard
                    key={recipe.idMeal}
                    meal={recipe}
                    isPlanned={plan.some((entry) => entry.meal.idMeal === recipe.idMeal)}
                    dayLabel={plan.find((entry) => entry.meal.idMeal === recipe.idMeal)?.day}
                    onPlan={() => togglePlan(recipe)}
                    onOpen={() => setSelectedMeal(recipe)}
                  />
                ))}
              </div>
            )}

            {activeSection === 'menu' && visibleRecipes.length === 0 && (
              <div className="empty-state">
                <span aria-hidden="true">🍋</span>
                <h3>Tu menú todavía está vacío</h3>
                <p>Explora los platos y agrega los que quieras preparar esta semana.</p>
                <button className="empty-action" type="button" onClick={() => setActiveSection('dishes')}>Explorar platos</button>
              </div>
            )}

            {activeSection === 'dishes' && !isLoading && !error && visibleRecipes.length === 0 && (
              <div className="empty-state">
                <span aria-hidden="true">🥣</span>
                <h3>No encontramos platos</h3>
                <p>Prueba con otro ingrediente o nombre de plato.</p>
              </div>
            )}

            {activeSection === 'dishes' && <div className="api-note">
              <span className="api-note-icon" aria-hidden="true">✳</span>
              <span>Platos de <strong>TheMealDB</strong> · una nueva idea empieza con un ingrediente.</span>
            </div>}
          </div>
        </section>}

        {activeSection === 'shopping' && <section className="shopping-section shopping-section-view" id="lista-compras" aria-labelledby="shopping-title">
          <div className="shopping-heading">
            <div>
              <p className="section-kicker">TODO LISTO PARA COCINAR</p>
              <h2 id="shopping-title">Lista de compras <span className="heading-spark">✳</span></h2>
              <p className="shopping-description">
                {selectedShoppingMeal
                  ? `Ingredientes para ${getSpanishMealName(selectedShoppingMeal.meal.strMeal)}.`
                  : 'Los ingredientes de tu menú, reunidos en un solo lugar.'}
              </p>
            </div>
            <span className="shopping-count">
              {visibleShoppingItems.length} {visibleShoppingItems.length === 1 ? 'ingrediente' : 'ingredientes'}
            </span>
          </div>

          {plan.length > 0 && (
            <div className="shopping-filters">
              <label className="shopping-filter-control" htmlFor="shopping-meal-filter">
                <span className="shopping-filter-label">Ver ingredientes de:</span>
                <select
                  className="shopping-filter-select"
                  id="shopping-meal-filter"
                  value={selectedShoppingMeal?.meal.idMeal ?? ''}
                  onChange={(event) => setShoppingMealId(event.target.value || null)}
                >
                  <option value="">Todos los platos ({plan.length})</option>
                  {plan.map(({ meal }) => (
                    <option key={meal.idMeal} value={meal.idMeal}>
                      {getSpanishMealName(meal.strMeal)}
                    </option>
                  ))}
                </select>
              </label>
              {selectedShoppingMeal && (
                <button
                  className="shopping-recipe-link"
                  type="button"
                  onClick={() => setSelectedMeal(selectedShoppingMeal.meal)}
                >
                  Ver receta de {getSpanishMealName(selectedShoppingMeal.meal.strMeal)} <span aria-hidden="true">↗</span>
                </button>
              )}
            </div>
          )}

          {visibleShoppingItems.length > 0 ? (
            <div className="shopping-list">
              {visibleShoppingItems.map((item) => (
                <label className={`shopping-item ${checkedIngredients.includes(item.id) ? 'shopping-item-checked' : ''}`} key={item.id}>
                  <input
                    type="checkbox"
                    checked={checkedIngredients.includes(item.id)}
                    onChange={() => setCheckedIngredients((current) => current.includes(item.id)
                      ? current.filter((checked) => checked !== item.id)
                      : [...current, item.id])}
                  />
                  <span className="shopping-check" aria-hidden="true">✓</span>
                  <span className="shopping-item-name">
                    <strong>{item.name}</strong>
                    <small>Para: {item.meals}</small>
                  </span>
                  {item.measure && <span className="shopping-measure">{item.measure}</span>}
                </label>
              ))}
            </div>
          ) : (
            <div className="shopping-empty">
              <span aria-hidden="true">🧺</span>
              <div>
                <strong>{plan.length === 0 ? 'Tu lista está vacía' : 'Este plato no tiene ingredientes disponibles'}</strong>
                <p>{plan.length === 0
                  ? 'Añade platos a “Mi menú” y aquí aparecerán sus ingredientes.'
                  : 'Prueba con otro plato de tu menú o consulta su receta.'}</p>
              </div>
              {plan.length === 0
                ? <button className="shopping-view-action" type="button" onClick={() => setActiveSection('dishes')}>Ver platos <span aria-hidden="true">↗</span></button>
                : <button className="shopping-view-action" type="button" onClick={() => setShoppingMealId(null)}>Ver todos los ingredientes</button>}
            </div>
          )}
        </section>}

        <section className="hooks-footer" aria-label="Tecnologías React utilizadas">
          <span className="hooks-footer-label">HECHO CON INTENCIÓN</span>
          <span>useState</span><span>useEffect</span><span>useContext</span><span>useMemo</span><span>useCallback</span><span>useRef</span>
          <span className="hooks-footer-note">y un poquito de antojo.</span>
        </section>
      </main>

      <footer className="site-footer"><span>© 2026 SazónGo</span><span>Cocina algo que te haga feliz <span aria-hidden="true">♡</span></span></footer>

      {selectedMeal && <RecipeDialog meal={selectedMeal} onClose={closeSelectedMeal} />}
    </div>
  )
}

function RecipeDialog({ meal, onClose }: { meal: Meal; onClose: () => void }) {
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const ingredients = useMemo(() => {
    return getMealIngredients(meal)
  }, [meal])

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeButtonRef.current?.focus()

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [onClose])

  return (
    <div className="dialog-backdrop" role="presentation" onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose()
    }}>
      <section className="recipe-dialog" role="dialog" aria-modal="true" aria-labelledby="dialog-title">
        <button ref={closeButtonRef} className="dialog-close" type="button" onClick={onClose} aria-label="Cerrar receta">×</button>
        <img className="dialog-image" src={meal.strMealThumb} alt={getSpanishMealName(meal.strMeal)} />
        <div className="dialog-body">
          <p className="section-kicker">{getSpanishCuisine(meal.strArea)} · {getSpanishCategory(meal.strCategory)}</p>
          <h2 id="dialog-title">{getSpanishMealName(meal.strMeal)}</h2>
          <h3>Ingredientes</h3>
          <ul className="ingredient-list">
            {ingredients.map(({ name, measure }, index) => <li key={`${name}-${index}`}><span>{translateIngredient(name)}</span><span>{translateMeasure(measure)}</span></li>)}
          </ul>
          <h3>Preparación <span className="original-language">(texto original)</span></h3>
          <p className="source-language-note">La fuente comparte estas instrucciones en su idioma original.</p>
          <p className="instructions">{meal.strInstructions || 'Consulta la receta original para ver las instrucciones.'}</p>
          {meal.strSource && <a className="source-link" href={meal.strSource} target="_blank" rel="noreferrer">Consultar fuente original ↗</a>}
        </div>
      </section>
    </div>
  )
}

export default App
