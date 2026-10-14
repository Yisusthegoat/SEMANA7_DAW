import { useEffect, useState } from 'react'

interface FetchState<T> {
  data: T | null
  error: string | null
  completedRequest: string | null
}

interface FetchResult<T> {
  data: T | null
  error: string | null
  isLoading: boolean
}

export function useFetch<T>(
  url: string,
  isResponse: (value: unknown) => value is T,
  refreshKey = 0,
): FetchResult<T> {
  const requestKey = `${url}\u0000${refreshKey}`
  const [state, setState] = useState<FetchState<T>>({
    data: null,
    error: null,
    completedRequest: null,
  })

  useEffect(() => {
    const controller = new AbortController()

    const load = async () => {
      try {
        const response = await fetch(url, { signal: controller.signal })
        if (!response.ok) {
          throw new Error(`El servidor respondió con el código ${response.status}.`)
        }

        const payload: unknown = await response.json()
        if (!isResponse(payload)) {
          throw new Error('La respuesta del servicio no tiene el formato esperado.')
        }

        if (controller.signal.aborted) return
        setState({ data: payload, error: null, completedRequest: requestKey })
      } catch (cause) {
        if (cause instanceof DOMException && cause.name === 'AbortError') return
        if (controller.signal.aborted) return
        const message = cause instanceof TypeError
          ? 'No se pudo conectar con el servicio de recetas. Comprueba tu conexión e inténtalo de nuevo.'
          : cause instanceof Error
            ? cause.message
            : 'Ocurrió un error inesperado.'
        setState({ data: null, error: message, completedRequest: requestKey })
      }
    }

    void load()
    return () => controller.abort()
  }, [isResponse, requestKey, url])

  return {
    data: state.completedRequest === requestKey ? state.data : null,
    isLoading: state.completedRequest !== requestKey,
    error: state.completedRequest === requestKey ? state.error : null,
  }
}
