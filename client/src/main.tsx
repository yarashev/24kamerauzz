import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

document.title = "24kamera.uz - Aqlli Kamera va Elektronika";

// Add meta description for SEO
const metaDescription = document.createElement('meta');
metaDescription.name = 'description';
metaDescription.content = 'Xavfsizlik kameralar, quyosh panellari va elektronika jihozlarining ishonchli onlayn do\'koni. Professional o\'rnatish va 24/7 qo\'llab-quvvatlash.';
document.head.appendChild(metaDescription);

// Add Open Graph tags
const ogTitle = document.createElement('meta');
ogTitle.property = 'og:title';
ogTitle.content = '24kamera.uz - Aqlli Kamera va Elektronika Tizimlari';
document.head.appendChild(ogTitle);

const ogDescription = document.createElement('meta');
ogDescription.property = 'og:description';
ogDescription.content = 'Xavfsizlik kameralar va elektronika jihozlarining eng katta tanlovi. Professional maslahat va o\'rnatish xizmati bilan.';
document.head.appendChild(ogDescription);

const ogType = document.createElement('meta');
ogType.property = 'og:type';
ogType.content = 'website';
document.head.appendChild(ogType);

createRoot(document.getElementById("root")!).render(<App />);
