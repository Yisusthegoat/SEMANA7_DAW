import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { AppContext } from './appContext'
import type { Meal, PlanEntry } from '../types'

type Theme = 'light' | 'dark'

const planDays = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes']

export function AppProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light')
  const [plan, setPlan] = useState<PlanEntry[]>([])

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  const toggleTheme = useCallback(() => {
    setTheme((current) => current === 'light' ? 'dark' : 'light')
  }, [])

  const togglePlan = useCallback((meal: Meal) => {
    setPlan((current) => {
      const existing = current.find((entry) => entry.meal.idMeal === meal.idMeal)
      if (existing) return current.filter((entry) => entry.meal.idMeal !== meal.idMeal)
      if (current.length >= planDays.length) return current
      const usedDays = new Set(current.map((entry) => entry.day))
      const day = planDays.find((candidate) => !usedDays.has(candidate))
      return day ? [...current, { meal, day }] : current
    })
  }, [])

  const value = useMemo(() => ({
    theme,
    plan,
    toggleTheme,
    togglePlan,
  }), [plan, theme, togglePlan, toggleTheme])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
