export const productCategories = [
  { id: "all", name: "Hammasi", nameEn: "All", nameRu: "Все" },
  { id: "cameras", name: "Kameralar", nameEn: "Cameras", nameRu: "Камеры" },
  { id: "doorbells", name: "Eshik qo'ng'iroqlari", nameEn: "Doorbells", nameRu: "Звонки" },
  { id: "systems", name: "Tizimlar", nameEn: "Systems", nameRu: "Системы" },
  { id: "accessories", name: "Aksessuarlar", nameEn: "Accessories", nameRu: "Аксессуары" }
];

export const formatPrice = (price: number) => {
  return `$${price.toFixed(0)}`;
};
