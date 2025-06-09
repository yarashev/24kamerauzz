import { useState } from "react";
import { useLanguage } from "@/hooks/use-language";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ChevronRight, Grid3X3, Video, Phone, Shield, Monitor, Volume2, Flame, Wifi, Zap } from "lucide-react";

interface CatalogModalProps {
  children: React.ReactNode;
}

export default function CatalogModal({ children }: CatalogModalProps) {
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const catalogCategories = {
    uz: [
      { name: "Videoanalitika", icon: Video, description: "Yuz tanish, harakatni aniqlash va intellektual tahlil" },
      { name: "Videokuzatuv", icon: Video, description: "IP kameralar, DVR, NVR va kuzatuv tizimlari" },
      { name: "Domofonlar", icon: Phone, description: "Video va audio domofon tizimlari" },
      { name: "Kirish nazorati", icon: Shield, description: "Elektron qulflar, kartalar va kirish tizimlari" },
      { name: "Belgilangan monitorlar", icon: Monitor, description: "Professional monitorlar va displeylar" },
      { name: "Ovoz kuchaytirish uskunalari", icon: Volume2, description: "Audio tizimlar va ovoz kuchaytirgichlar" },
      { name: "Yong'in signalizatsiyasi", icon: Flame, description: "Tutun va olov datchiklari" },
      { name: "Yong'inga qarshi uskunalar", icon: Flame, description: "O'chirish tizimlari va xavfsizlik uskunalari" },
      { name: "Tarmoq uskunalari", icon: Wifi, description: "Switch, router va tarmoq komponentlari" },
      { name: "Energiya tizimlari", icon: Zap, description: "UPS, akkumulyatorlar va quvvat manbaalari" }
    ],
    ru: [
      { name: "Видеоаналитика", icon: Video, description: "Распознавание лиц, детекция движения и умная аналитика" },
      { name: "Видеонаблюдение", icon: Video, description: "IP камеры, DVR, NVR и системы наблюдения" },
      { name: "Домофоны", icon: Phone, description: "Видео и аудио домофонные системы" },
      { name: "Контроль доступа", icon: Shield, description: "Электронные замки, карты и системы доступа" },
      { name: "Мониторы маркированные", icon: Monitor, description: "Профессиональные мониторы и дисплеи" },
      { name: "Оборудование звукоусиления", icon: Volume2, description: "Аудиосистемы и усилители звука" },
      { name: "Охранно-пожарная сигнализация", icon: Flame, description: "Датчики дыма и пожарные извещатели" },
      { name: "Пожарное оборудование", icon: Flame, description: "Системы пожаротушения и безопасности" },
      { name: "Сетевое оборудование", icon: Wifi, description: "Коммутаторы, маршрутизаторы и сетевые компоненты" },
      { name: "Энергосистемы", icon: Zap, description: "ИБП, аккумуляторы и источники питания" }
    ],
    en: [
      { name: "Video Analytics", icon: Video, description: "Face recognition, motion detection and smart analytics" },
      { name: "Video Surveillance", icon: Video, description: "IP cameras, DVR, NVR and surveillance systems" },
      { name: "Intercom Systems", icon: Phone, description: "Video and audio intercom systems" },
      { name: "Access Control", icon: Shield, description: "Electronic locks, cards and access systems" },
      { name: "Marked Monitors", icon: Monitor, description: "Professional monitors and displays" },
      { name: "Sound Amplification Equipment", icon: Volume2, description: "Audio systems and sound amplifiers" },
      { name: "Fire Alarm Systems", icon: Flame, description: "Smoke detectors and fire alarm systems" },
      { name: "Fire Safety Equipment", icon: Flame, description: "Fire suppression systems and safety equipment" },
      { name: "Network Equipment", icon: Wifi, description: "Switches, routers and network components" },
      { name: "Energy Systems", icon: Zap, description: "UPS, batteries and power supply systems" }
    ]
  };

  const currentCategories = catalogCategories[language] || catalogCategories.uz;

  const handleCategoryClick = (categoryName: string) => {
    // Close modal and scroll to products section
    setIsOpen(false);
    const element = document.getElementById("products");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Grid3X3 className="h-6 w-6" />
            {language === "uz" && "Katalog"}
            {language === "ru" && "Каталог"}
            {language === "en" && "Catalog"}
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          {currentCategories.map((category, index) => {
            const IconComponent = category.icon;
            return (
              <div
                key={index}
                onClick={() => handleCategoryClick(category.name)}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors group"
              >
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                    <IconComponent className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 dark:text-gray-100 group-hover:text-primary transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {category.description}
                    </p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-primary transition-colors" />
              </div>
            );
          })}
        </div>

        {/* Popular Categories Section */}
        <div className="mt-8 pt-6 border-t">
          <h3 className="text-lg font-semibold mb-4">
            {language === "uz" && "Mashhur toifalar"}
            {language === "ru" && "Популярные категории"}
            {language === "en" && "Popular Categories"}
          </h3>
          <div className="flex flex-wrap gap-2">
            {["Videokuzatuv", "Kirish nazorati", "Domofonlar"].map((category) => {
              const displayName = language === "ru" ? 
                (category === "Videokuzatuv" ? "Видеонаблюдение" : 
                 category === "Kirish nazorati" ? "Контроль доступа" : "Домофоны") :
                language === "en" ?
                (category === "Videokuzatuv" ? "Video Surveillance" : 
                 category === "Kirish nazorati" ? "Access Control" : "Intercom Systems") : 
                category;
              
              return (
                <Button
                  key={category}
                  variant="outline"
                  size="sm"
                  onClick={() => handleCategoryClick(category)}
                  className="text-xs"
                >
                  {displayName}
                </Button>
              );
            })}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}