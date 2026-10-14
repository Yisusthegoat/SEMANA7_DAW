import { createContext } from 'react'
import type { Meal, PlanEntry } from '../types'

export interface AppContextValue {
  theme: 'light' | 'dark'
  plan: PlanEntry[]
  toggleTheme: () => void
  togglePlan: (meal: Meal) => void
}

export const AppContext = createContext<AppContextValue | null>(null)
