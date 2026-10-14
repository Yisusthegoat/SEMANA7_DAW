import type { Meal } from '../types'

const mealNames: Record<string, string> = {
  'chicken handi': 'Pollo handi',
  'chicken mandi': 'Pollo mandi',
  'sticky chicken': 'Pollo glaseado',
  'chicken congee': 'Arroz caldoso con pollo',
  'chicken karaage': 'Pollo karaage',
  'chicken marengo': 'Pollo a la Marengo',
  'spanish chicken': 'Pollo a la española',
  'tandoori chicken': 'Pollo tandoori',
  'chicken couscous': 'Cuscús con pollo',
  'kung pao chicken': 'Pollo kung pao',
  'chicken lollipop': 'Alitas de pollo',
  'chicken basquaise': 'Pollo a la vasca',
  'chicken fried rice': 'Arroz frito con pollo',
  'chicken parmentier': 'Pastel de pollo',
  'brown stew chicken': 'Pollo guisado',
  'spanish chicken pie': 'Pastel de pollo español',
  'katsu chicken curry': 'Curry japonés de pollo',
  'nutty chicken curry': 'Curry de pollo con frutos secos',
  'easy spanish chicken': 'Pollo español fácil',
  'general tsos chicken': 'Pollo del general Tso',
  'smoky chicken skewers': 'Brochetas de pollo ahumadas',
  'sweet and sour chicken': 'Pollo agridulce',
  'kentucky fried chicken': 'Pollo frito estilo Kentucky',
  'chinese orange chicken': 'Pollo a la naranja',
  'creamy mustard chicken': 'Pollo cremoso a la mostaza',
  'mediterranean pasta salad': 'Ensalada mediterránea de pasta',
}

const categories: Record<string, string> = {
  beef: 'Res',
  chicken: 'Pollo',
  dessert: 'Postre',
  lamb: 'Cordero',
  miscellaneous: 'Varios',
  pasta: 'Pasta',
  pork: 'Cerdo',
  seafood: 'Mariscos',
  side: 'Acompañamiento',
  starter: 'Entrada',
  vegan: 'Vegano',
  vegetarian: 'Vegetariano',
  breakfast: 'Desayuno',
  goat: 'Cabra',
}

const cuisines: Record<string, string> = {
  american: 'Estadounidense',
  british: 'Británica',
  canadian: 'Canadiense',
  chinese: 'China',
  french: 'Francesa',
  greek: 'Griega',
  indian: 'India',
  italian: 'Italiana',
  japanese: 'Japonesa',
  mexican: 'Mexicana',
  moroccan: 'Marroquí',
  spanish: 'Española',
  thai: 'Tailandesa',
  turkish: 'Turca',
  vietnamese: 'Vietnamita',
  australian: 'Australiana',
}

const ingredients: Record<string, string> = {
  'all purpose flour': 'harina de trigo',
  'baking powder': 'polvo de hornear',
  'bell pepper': 'pimiento',
  'bell peppers': 'pimientos',
  butter: 'mantequilla',
  carrot: 'zanahoria',
  carrots: 'zanahorias',
  'chicken breast': 'pechuga de pollo',
  'chicken breasts': 'pechugas de pollo',
  'chicken stock': 'caldo de pollo',
  chicken: 'pollo',
  'chilli powder': 'ají molido',
  'chili powder': 'chile en polvo',
  'chopped tomatoes': 'tomates picados',
  cream: 'crema de leche',
  'cumin seeds': 'semillas de comino',
  'curry powder': 'curry en polvo',
  'coconut milk': 'leche de coco',
  coriander: 'cilantro',
  'coriander seeds': 'semillas de cilantro',
  'cream cheese': 'queso crema',
  'fresh basil': 'albahaca fresca',
  garlic: 'ajo',
  'garlic cloves': 'dientes de ajo',
  'fenugreek': 'fenogreco seco',
  'garam masala': 'garam masala',
  ginger: 'jengibre',
  'ginger paste': 'pasta de jengibre',
  'green chilli': 'chile verde',
  'green pepper': 'pimiento verde',
  'green peppers': 'pimientos verdes',
  'ground beef': 'carne molida',
  'ground cinnamon': 'canela molida',
  'ground cumin': 'comino molido',
  'ground ginger': 'jengibre molido',
  'heavy cream': 'nata para cocinar',
  'lemon juice': 'jugo de limón',
  'lime juice': 'jugo de lima',
  milk: 'leche',
  mushroom: 'champiñón',
  mushrooms: 'champiñones',
  'olive oil': 'aceite de oliva',
  onion: 'cebolla',
  onions: 'cebollas',
  'parmesan cheese': 'queso parmesano',
  parsley: 'perejil',
  pasta: 'pasta',
  'peanut butter': 'mantequilla de maní',
  'red chilli': 'chile rojo',
  'red pepper': 'pimiento rojo',
  rice: 'arroz',
  'soy sauce': 'salsa de soja',
  'spring onion': 'cebolla china',
  'spring onions': 'cebollas chinas',
  sugar: 'azúcar',
  'tomato puree': 'puré de tomate',
  tomatoes: 'tomates',
  turmeric: 'cúrcuma',
  'turmeric powder': 'cúrcuma en polvo',
  'vegetable oil': 'aceite vegetal',
  water: 'agua',
  yogurt: 'yogur',
  'greek yogurt': 'yogur griego',
  'red wine': 'vino tinto',
  salt: 'sal',
  pepper: 'pimienta',
  egg: 'huevo',
  eggs: 'huevos',
  cheese: 'queso',
  potato: 'papa',
  potatoes: 'papas',
}

const searchTerms: Record<string, string> = {
  arroz: 'rice',
  carne: 'beef',
  cerdo: 'pork',
  'carne de res': 'beef',
  pollo: 'chicken',
  pescado: 'fish',
  pasta: 'pasta',
  salmón: 'salmon',
  salmon: 'salmon',
  camarones: 'shrimp',
  'camarón': 'shrimp',
  huevo: 'egg',
  huevos: 'egg',
}

export function getSpanishMealName(name: string): string {
  return mealNames[name.trim().toLocaleLowerCase()] ?? name
}

export function getSpanishCategory(category: string | null | undefined): string {
  if (!category) return 'Receta'
  return categories[category.toLocaleLowerCase()] ?? category
}

export function getSpanishCuisine(cuisine: string | null | undefined): string {
  if (!cuisine) return 'Casera'
  return cuisines[cuisine.toLocaleLowerCase()] ?? cuisine
}

export function getApiSearchTerm(query: string): string {
  const normalized = query.trim().toLocaleLowerCase()
  return searchTerms[normalized] ?? query
}

export function translateIngredient(ingredient: string): string {
  const normalized = ingredient.trim().toLocaleLowerCase()
  return ingredients[normalized] ?? ingredient
}

export function translateMeasure(measure: string | null | undefined): string {
  if (!measure?.trim()) return ''

  return measure
    .replace(/\bounces?\b/gi, 'onzas')
    .replace(/\bpounds?\b/gi, 'libras')
    .replace(/\bcups?\b/gi, 'taza')
    .replace(/\b(?:tablespoons?|tbsp)\b/gi, 'cucharada')
    .replace(/\b(?:teaspoons?|tsp)\b/gi, 'cucharadita')
    .replace(/\bcloves?\b/gi, 'dientes')
    .replace(/\bpinch(?:es)?\b/gi, 'pizca')
    .replace(/\bsmall\b/gi, 'pequeño')
    .replace(/\bmedium\b/gi, 'mediano')
    .replace(/\blarge\b/gi, 'grande')
    .replace(/\bfresh\b/gi, 'fresco')
    .replace(/\bthinly sliced\b/gi, 'en rodajas finas')
    .replace(/\bfinely chopped\b/gi, 'picado fino')
    .replace(/\bchopped\b/gi, 'picado')
    .replace(/\bsliced\b/gi, 'en rodajas')
    .replace(/\bDried\b/gi, '')
    .replace(/\bto taste\b/gi, 'al gusto')
    .replace(/\b1 (taza|cucharada|cucharadita|pizca)s\b/gi, '1 $1')
    .replace(/\b(?!1\b)(\d+(?:[.,]\d+)?) (taza|cucharada|cucharadita|pizca)\b/gi, '$1 $2s')
    .replace(/\s{2,}/g, ' ')
    .replace(/\b([2-9]\d*(?:[.,]\d+)?) (dientes|rodajas) picado\b/gi, '$1 $2 picados')
    .replace(/\b([2-9]\d*(?:[.,]\d+)?) picado fino\b/gi, '$1 picados finos')
    .trim()
}

export function getMealIngredients(meal: Meal) {
  return Array.from({ length: 20 }, (_, index) => {
    const number = index + 1
    const name = meal[`strIngredient${number}` as keyof Meal]
    const measure = meal[`strMeasure${number}` as keyof Meal]
    return {
      name: typeof name === 'string' ? name.trim() : '',
      measure: typeof measure === 'string' ? measure.trim() : '',
    }
  }).filter(({ name }) => name.length > 0)
}
