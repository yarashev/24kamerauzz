export const productCategories = [
  { id: "ip_camera", name: "IP kameralar", nameEn: "IP Cameras", nameRu: "IP камеры" },
  { id: "turbo_hd_camera", name: "Turbo HD", nameEn: "Turbo HD", nameRu: "Turbo HD камеры" },
  { id: "nvr", name: "NVR", nameEn: "NVR", nameRu: "NVR" },
  { id: "dvr", name: "DVR", nameEn: "DVR", nameRu: "DVR" },
  { id: "ptz", name: "PTZ", nameEn: "PTZ", nameRu: "PTZ" },
  { id: "4g_camera", name: "4G kameralar", nameEn: "4G Cameras", nameRu: "4G камеры" },
  { id: "kits", name: "To'plamlar", nameEn: "Kits", nameRu: "Комплекты" }
];

export const formatPrice = (price: number) => {
  return `$${price.toFixed(0)}`;
};
