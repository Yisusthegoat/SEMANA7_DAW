import { useCallback, useRef, useState, type FormEvent } from 'react'

export function useSearchForm(initialValue: string, onSearch: (term: string) => void) {
  const [searchTerm, setSearchTerm] = useState(initialValue)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = useCallback((event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const term = searchTerm.trim()
    if (!term) {
      inputRef.current?.focus()
      return
    }
    onSearch(term)
  }, [onSearch, searchTerm])

  return { inputRef, searchTerm, setSearchTerm, handleSubmit }
}
