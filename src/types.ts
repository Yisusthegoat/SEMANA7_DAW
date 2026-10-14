export interface Meal {
  idMeal: string
  strMeal: string
  strMealThumb: string
  strCategory?: string | null
  strArea?: string | null
  strInstructions?: string | null
  strSource?: string | null
  [key: `strIngredient${number}`]: string | null | undefined
  [key: `strMeasure${number}`]: string | null | undefined
}

export interface MealResponse {
  meals: Meal[] | null
}

export interface PlanEntry {
  meal: Meal
  day: string
}
