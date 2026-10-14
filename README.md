# SazónGo

Aplicación de recetas hecha con React, TypeScript y Vite para la práctica de Hooks de la Semana 7. Busca platos en TheMealDB, organiza hasta cinco recetas en un menú semanal y genera una lista de compras.

## Ejecutar el proyecto

```bash
npm install
npm run dev
```

La aplicación consulta [TheMealDB](https://www.themealdb.com/api.php). Se necesita conexión a internet para cargar las recetas. La interfaz, las categorías, varios nombres frecuentes de platos, los ingredientes y las medidas se muestran en español; algunos nombres e instrucciones dependen del idioma original publicado por la API y se identifican como contenido original.

## Hooks implementados

1. **Ciclo de renderizado:** la aplicación está dentro de `React.StrictMode` en desarrollo. Usa React DevTools Profiler para comparar los renders al buscar, cambiar tema y añadir un plato al menú; la búsqueda cancelada al cambiar de término usa `AbortController`.
2. **Efectos y API:** `src/hooks/useFetch.ts` obtiene recetas con `fetch`, valida la respuesta y cancela solicitudes anteriores o desmontadas. `src/context/AppContext.tsx` sincroniza el tema con el documento mediante `useEffect`.
3. **Estado global:** `AppProvider` comparte el tema y el menú semanal mediante `useContext`, sin prop drilling.
4. **Renders y referencias:** `useMemo` deriva los platos del menú y agrupa sus ingredientes para la lista de compras; `useCallback` estabiliza acciones del contexto y el envío del formulario; `useRef` permite enfocar el campo de búsqueda si se envía vacío.
5. **Hooks personalizados:** `useFetch` y `useSearchForm` encapsulan lógica reutilizable.

## Navegación

- **Platos:** busca y explora todas las recetas; al seleccionar una se abre su detalle en un modal. Admite búsquedas en español como “pollo”, “arroz”, “carne” y “salmón”.
- **Mi menú:** muestra únicamente hasta cinco platos elegidos para la semana.
- **Lista de compras:** combina ingredientes del menú, traduce nombres y medidas frecuentes al español y permite marcarlos al comprar.
- **Tema:** alterna entre modo claro y oscuro.

## Verificación

```bash
npm run lint
npm run build
```
