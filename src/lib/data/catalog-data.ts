import { Category, Subcategory, Product } from "../types/catalog";

export const CATEGORIES: Category[] = [
  {
    id: "grab-and-go",
    name: "Grab and go",
    description: "Opciones frescas, rápidas y listas para disfrutar en cualquier momento del día.",
    image: "/images/grab-and-go.jpg",
  },
  {
    id: "de-nuestro-horno",
    name: "De nuestro horno",
    description: "Panadería y repostería artesanal, horneada en casa con ingredientes premium.",
    image: "/images/de-nuestro-horno.jpg",
  },
  {
    id: "all-day-breakfast",
    name: "All day breakfast",
    description: "Tus opciones favoritas de desayuno y brunch disponibles todo el día.",
    image: "/images/all-day-breakfast.jpg",
  },
];

export const SUBCATEGORIES: Subcategory[] = [
  // Grab and go
  { id: "snacks", name: "Snacks", categoryId: "grab-and-go" },
  { id: "ensaladas", name: "Ensaladas", categoryId: "grab-and-go" },
  { id: "wraps", name: "Wraps", categoryId: "grab-and-go" },
  { id: "jugos-socado", name: "Jugos Socado", categoryId: "grab-and-go" },
  
  // De nuestro horno
  { id: "galletas", name: "Galletas", categoryId: "de-nuestro-horno" },
  { id: "galletas-zero", name: "Galletas zero", categoryId: "de-nuestro-horno" },
  { id: "tortas", name: "Tortas", categoryId: "de-nuestro-horno" },
  { id: "muffins", name: "Muffins", categoryId: "de-nuestro-horno" },
  { id: "cachito", name: "Cachito", categoryId: "de-nuestro-horno" },
  { id: "empanadas-argentinas", name: "Empanadas Argentinas", categoryId: "de-nuestro-horno" },
  { id: "quiche", name: "Quiche", categoryId: "de-nuestro-horno" },
  { id: "croissants", name: "Croissants", categoryId: "de-nuestro-horno" },

  // All day breakfast
  { id: "panquecas", name: "Panquecas", categoryId: "all-day-breakfast" },
  { id: "sanduches", name: "Sanduches", categoryId: "all-day-breakfast" },
];

export const PRODUCTS: Product[] = [
  // --- GRAB AND GO ---
  {
    id: "p-juice-green",
    name: "Jugo Verde Detox",
    description: "Mezcla refrescante de espinaca, pepino, manzana verde, apio y un toque de jengibre. Prensado en frío.",
    price: 4.5,
    categoryId: "grab-and-go",
    subcategoryId: "jugos-socado",
    image: "/images/grab-and-go.jpg",
    minPortions: 5,
    tags: ["Vegano", "Sin Azúcar", "Gluten Free"],
    details: {
      ingredients: ["Espinaca", "Pepino", "Manzana Verde", "Apio", "Jengibre"],
      servingTemp: "Frío",
      presentation: "Botella PET reciclable 250ml",
    }
  },
  {
    id: "p-wrap-chicken",
    name: "Wrap de Pollo y Pesto",
    description: "Pechuga de pollo grillada, pesto de albahaca artesanal, tomates secos y espinaca fresca en tortilla de espinaca.",
    price: 6.5,
    categoryId: "grab-and-go",
    subcategoryId: "wraps",
    image: "/images/grab-and-go.jpg",
    minPortions: 10,
    tags: ["Recomendado"],
    details: {
      allergens: ["Gluten", "Lácteos", "Nueces (Pesto)"],
      servingTemp: "Temperatura ambiente o caliente",
    }
  },
  {
    id: "p-salad-quinoa",
    name: "Ensalada de Quinoa y Salvia",
    description: "Quinoa tricolor, vegetales asados, garbanzos crocantes y aderezo ligero de limón y salvia.",
    price: 7.0,
    categoryId: "grab-and-go",
    subcategoryId: "ensaladas",
    image: "/images/grab-and-go.jpg",
    minPortions: 5,
    tags: ["Vegano", "Gluten Free"],
  },
  {
    id: "p-snack-yuca",
    name: "Chips de Yuca Horneados",
    description: "Crujientes chips de yuca horneados con un toque de sal marina y romero.",
    price: 2.5,
    categoryId: "grab-and-go",
    subcategoryId: "snacks",
    image: "/images/grab-and-go.jpg",
    minPortions: 10,
    tags: ["Vegano", "Gluten Free"],
  },

  // --- DE NUESTRO HORNO ---
  {
    id: "p-cachito-jamon",
    name: "Cachito Tradicional",
    description: "El clásico venezolano. Masa suave y ligeramente dulce, relleno generosamente con jamón ahumado.",
    price: 3.5,
    categoryId: "de-nuestro-horno",
    subcategoryId: "cachito",
    image: "/images/de-nuestro-horno.jpg",
    minPortions: 12,
    tags: ["Clásico", "Recomendado"],
    details: {
      allergens: ["Gluten", "Lácteos", "Huevo"],
      servingTemp: "Caliente",
    }
  },
  {
    id: "p-empanada-carne",
    name: "Empanada Argentina de Carne",
    description: "Masa hojaldrada rellena de jugosa carne de res cortada a cuchillo, aceitunas y huevo duro.",
    price: 4.0,
    categoryId: "de-nuestro-horno",
    subcategoryId: "empanadas-argentinas",
    image: "/images/de-nuestro-horno.jpg",
    minPortions: 12,
  },
  {
    id: "p-quiche-lorraine",
    name: "Mini Quiche Lorraine",
    description: "Tarta salada tradicional francesa con tocineta ahumada, queso gruyere y una suave crema de huevos.",
    price: 4.5,
    categoryId: "de-nuestro-horno",
    subcategoryId: "quiche",
    image: "/images/de-nuestro-horno.jpg",
    minPortions: 10,
  },
  {
    id: "p-croissant-butter",
    name: "Croissant de Mantequilla",
    description: "Hojaldre francés auténtico, crujiente por fuera y alveolado por dentro. Elaborado con mantequilla premium.",
    price: 3.0,
    categoryId: "de-nuestro-horno",
    subcategoryId: "croissants",
    image: "/images/de-nuestro-horno.jpg",
    minPortions: 12,
    tags: ["Vegetariano"],
  },
  {
    id: "p-cookie-choc",
    name: "Galleta de Choco-Chips",
    description: "Textura melcochuda en el centro y crujiente en los bordes, cargada de chispas de chocolate semi-amargo.",
    price: 2.5,
    categoryId: "de-nuestro-horno",
    subcategoryId: "galletas",
    image: "/images/de-nuestro-horno.jpg",
    minPortions: 15,
  },
  {
    id: "p-cookie-zero",
    name: "Cookie de Avena Zero Azúcar",
    description: "Galleta artesanal a base de avena, endulzada naturalmente. Sin azúcar refinada.",
    price: 3.0,
    categoryId: "de-nuestro-horno",
    subcategoryId: "galletas-zero",
    image: "/images/de-nuestro-horno.jpg",
    minPortions: 15,
    tags: ["Sin Azúcar", "Vegetariano"],
  },
  {
    id: "p-cake-choco",
    name: "Porción de Torta de Chocolate",
    description: "Bizcocho extra húmedo de cacao con cobertura de fudge de chocolate oscuro.",
    price: 5.5,
    categoryId: "de-nuestro-horno",
    subcategoryId: "tortas",
    image: "/images/de-nuestro-horno.jpg",
    minPortions: 8,
    tags: ["Vegetariano"],
  },
  {
    id: "p-muffin-blueberry",
    name: "Muffin de Arándanos",
    description: "Esponjoso muffin coronado con crumble de almendras y relleno de arándanos frescos.",
    price: 3.5,
    categoryId: "de-nuestro-horno",
    subcategoryId: "muffins",
    image: "/images/de-nuestro-horno.jpg",
    minPortions: 12,
  },

  // --- ALL DAY BREAKFAST ---
  {
    id: "p-panquecas-terra",
    name: "Panquecas Socado",
    description: "Torre de esponjosas panquecas acompañadas de frutas de temporada, mantequilla batida y miel o syrup.",
    price: 8.0,
    categoryId: "all-day-breakfast",
    subcategoryId: "panquecas",
    image: "/images/all-day-breakfast.jpg",
    minPortions: 5,
    tags: ["Vegetariano", "Recomendado"],
    details: {
      allergens: ["Gluten", "Lácteos", "Huevo"],
      presentation: "Empaque térmico para mantener temperatura",
    }
  },
  {
    id: "p-sanduche-serrano",
    name: "Sanduche de Jamón Serrano",
    description: "Pan rústico de masa madre, jamón serrano, queso manchego, rúcula fresca y un toque de aceite de oliva.",
    price: 9.5,
    categoryId: "all-day-breakfast",
    subcategoryId: "sanduches",
    image: "/images/all-day-breakfast.jpg",
    minPortions: 8,
    tags: ["Premium"],
  }
];
