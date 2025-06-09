export const productCategories = [
  { id: "all", name: "Hammasi", nameEn: "All", nameRu: "Все" },
  { id: "ip_camera", name: "IP kameralar", nameEn: "IP Cameras", nameRu: "IP камеры" },
  { id: "turbo_hd_camera", name: "Turbo HD", nameEn: "Turbo HD", nameRu: "Turbo HD камеры" },
  { id: "nvr", name: "NVR", nameEn: "NVR", nameRu: "NVR" },
  { id: "dvr", name: "DVR", nameEn: "DVR", nameRu: "DVR" },
  { id: "ptz", name: "PTZ", nameEn: "PTZ", nameRu: "PTZ" },
  { id: "hdd", name: "HDD", nameEn: "HDD", nameRu: "HDD" },
  { id: "domophones", name: "Domofonlar", nameEn: "Doorbells", nameRu: "Домофоны" },
  { id: "terminals", name: "Terminallar", nameEn: "Terminals", nameRu: "Терминалы" },
  { id: "switches", name: "Kommutatorlar", nameEn: "Switches", nameRu: "Коммутаторы" },
  { id: "accessories", name: "Aksessuarlar", nameEn: "Accessories", nameRu: "Аксессуары" },
  { id: "cabinet", name: "Shkaflar", nameEn: "Cabinets", nameRu: "Шкафы" },
  { id: "4g_camera", name: "4G kameralar", nameEn: "4G Cameras", nameRu: "4G камеры" },
  { id: "kits", name: "To'plamlar", nameEn: "Kits", nameRu: "Комплекты" }
];

export const formatPrice = (price: number) => {
  return `$${price.toFixed(0)}`;
};
