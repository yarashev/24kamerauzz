export const productCategories = [
  { id: "all", name: "Hammasi", nameEn: "All", nameRu: "Все" },
  { id: "ip", name: "IP kameralar", nameEn: "IP Cameras", nameRu: "IP камеры" },
  { id: "turbo_hd", name: "Turbo HD", nameEn: "Turbo HD", nameRu: "Turbo HD" },
  { id: "nvr", name: "NVR", nameEn: "NVR", nameRu: "NVR" },
  { id: "dvr", name: "DVR", nameEn: "DVR", nameRu: "DVR" },
  { id: "doorbells", name: "Eshik qo'ng'iroqlari", nameEn: "Doorbells", nameRu: "Звонки" },
  { id: "systems", name: "Tizimlar", nameEn: "Systems", nameRu: "Системы" }
];

export const formatPrice = (price: number) => {
  return `$${price.toFixed(0)}`;
};
