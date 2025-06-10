import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Phone, MapPin, Clock, Wrench, MessageCircle, Instagram } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";
import { useQuery } from "@tanstack/react-query";

interface Master {
  id: number;
  name: string;
  specialization: string;
  region: string;
  city: string;
  phone: string;
  experience: number;
  rating: number;
  reviewCount: number;
  imageUrl?: string;
  description?: string;
  services?: string[];
  fullAddress?: string;
  telegram?: string;
  instagram?: string;
  isActive: boolean;
}

const uzbekistanRegions = [
  { key: "tashkent", uz: "Toshkent", ru: "Ташкент", en: "Tashkent" },
  { key: "samarkand", uz: "Samarqand", ru: "Самарканд", en: "Samarkand" },
  { key: "bukhara", uz: "Buxoro", ru: "Бухара", en: "Bukhara" },
  { key: "andijan", uz: "Andijon", ru: "Андижан", en: "Andijan" },
  { key: "fergana", uz: "Farg'ona", ru: "Фергана", en: "Fergana" },
  { key: "namangan", uz: "Namangan", ru: "Наманган", en: "Namangan" },
  { key: "kashkadarya", uz: "Qashqadaryo", ru: "Кашкадарья", en: "Kashkadarya" },
  { key: "surkhandarya", uz: "Surxondaryo", ru: "Сурхандарья", en: "Surkhandarya" },
  { key: "jizzakh", uz: "Jizzax", ru: "Джизак", en: "Jizzakh" },
  { key: "sirdarya", uz: "Sirdaryo", ru: "Сырдарья", en: "Sirdarya" },
  { key: "navoiy", uz: "Navoiy", ru: "Навои", en: "Navoiy" },
  { key: "khorezm", uz: "Xorazm", ru: "Хорезм", en: "Khorezm" },
  { key: "karakalpakstan", uz: "Qoraqalpog'iston", ru: "Каракалпакстан", en: "Karakalpakstan" }
];

export default function Masters() {
  const { language, t } = useLanguage();
  const [selectedRegion, setSelectedRegion] = useState<string>("");

  // Fetch masters from API
  const { data: allMasters = [], isLoading } = useQuery<Master[]>({
    queryKey: ["/api/masters"],
  });

  // Fetch masters by region when region is selected
  const { data: regionMasters = [], isLoading: regionLoading } = useQuery<Master[]>({
    queryKey: ["/api/masters/region", selectedRegion],
    enabled: !!selectedRegion,
  });

  const displayedMasters = selectedRegion ? regionMasters : allMasters;

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating)
            ? "text-yellow-400 fill-current"
            : "text-gray-300"
        }`}
      />
    ));
  };

  const getRegionName = (regionKey: string) => {
    const region = uzbekistanRegions.find(r => r.key === regionKey);
    if (!region) return regionKey;
    return region[language as keyof typeof region] || region.uz;
  };

  return (
    <section id="masters" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {language === "uz" && "Malakali Ustalar"}
            {language === "ru" && "Квалифицированные мастера"}
            {language === "en" && "Qualified Masters"}
          </h2>
          <p className="text-lg text-gray-600">
            {language === "uz" && "O'zbekiston bo'ylab eng yaxshi ustalarni toping"}
            {language === "ru" && "Найдите лучших мастеров по всему Узбекистану"}
            {language === "en" && "Find the best masters across Uzbekistan"}
          </p>
        </div>

        {/* Region Selection */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4 text-center">
            {language === "uz" && "Viloyatni tanlang:"}
            {language === "ru" && "Выберите область:"}
            {language === "en" && "Select Region:"}
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            <Button
              onClick={() => setSelectedRegion("")}
              variant={!selectedRegion ? "default" : "outline"}
              className="w-full text-sm"
            >
              {language === "uz" && "Barchasi"}
              {language === "ru" && "Все"}
              {language === "en" && "All"}
            </Button>
            {uzbekistanRegions.map((region) => (
              <Button
                key={region.key}
                onClick={() => setSelectedRegion(region.key)}
                variant={selectedRegion === region.key ? "default" : "outline"}
                className="w-full text-sm"
              >
                {getRegionName(region.key)}
              </Button>
            ))}
          </div>
        </div>

        {/* Masters Display */}
        {(isLoading || regionLoading) ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">
              {language === "uz" && "Ustalar yuklanmoqda..."}
              {language === "ru" && "Загружаются мастера..."}
              {language === "en" && "Loading masters..."}
            </p>
          </div>
        ) : displayedMasters.length === 0 ? (
          <div className="text-center py-12">
            <Wrench className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {language === "uz" && "Ustalar topilmadi"}
              {language === "ru" && "Мастера не найдены"}
              {language === "en" && "No masters found"}
            </h3>
            <p className="text-gray-500">
              {language === "uz" && selectedRegion 
                ? "Ushbu viloyatda ustalar mavjud emas"
                : "Hozircha ustalar mavjud emas"}
              {language === "ru" && selectedRegion
                ? "В этой области нет доступных мастеров"
                : "Пока нет доступных мастеров"}
              {language === "en" && selectedRegion
                ? "No masters available in this region"
                : "No masters available yet"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedMasters.map((master) => (
              <Card key={master.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                      {master.imageUrl ? (
                        <img 
                          src={master.imageUrl} 
                          alt={master.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Wrench className="h-8 w-8 text-gray-400" />
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-gray-900 mb-1">
                        {master.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        {master.specialization}
                      </p>
                      
                      <div className="flex items-center gap-1 mb-2">
                        {renderStars(master.rating)}
                        <span className="text-sm text-gray-600 ml-1">
                          {master.rating.toFixed(1)} ({master.reviewCount})
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
                        <MapPin className="h-4 w-4" />
                        <span>
                          {master.fullAddress 
                            ? master.fullAddress 
                            : `${getRegionName(master.region)}, ${master.city}`
                          }
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-1 text-sm text-gray-600 mb-3">
                        <Clock className="h-4 w-4" />
                        <span>
                          {master.experience} {language === "uz" ? "yil tajriba" : 
                           language === "ru" ? "лет опыта" : "years experience"}
                        </span>
                      </div>
                      
                      {master.services && master.services.length > 0 && (
                        <div className="mb-3">
                          <div className="flex flex-wrap gap-1">
                            {master.services.slice(0, 3).map((service, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {service}
                              </Badge>
                            ))}
                            {master.services.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{master.services.length - 3}
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}
                      
                      <div className="space-y-2">
                        <Button
                          className="w-full bg-green-600 hover:bg-green-700 text-white"
                          onClick={() => window.open(`tel:${master.phone}`, '_self')}
                        >
                          <Phone className="h-4 w-4 mr-2" />
                          {language === "uz" && "Qo'ng'iroq qilish"}
                          {language === "ru" && "Позвонить"}
                          {language === "en" && "Call"}
                        </Button>
                        
                        {(master.telegram || master.instagram) && (
                          <div className="flex gap-2">
                            {master.telegram && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="flex-1"
                                onClick={() => {
                                  const telegramUrl = master.telegram?.startsWith('@') 
                                    ? `https://t.me/${master.telegram.slice(1)}`
                                    : master.telegram?.startsWith('t.me/') 
                                    ? `https://${master.telegram}`
                                    : `https://t.me/${master.telegram}`;
                                  window.open(telegramUrl, '_blank');
                                }}
                              >
                                <MessageCircle className="h-4 w-4 mr-1" />
                                Telegram
                              </Button>
                            )}
                            {master.instagram && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="flex-1"
                                onClick={() => {
                                  const instagramUrl = master.instagram?.startsWith('@') 
                                    ? `https://instagram.com/${master.instagram.slice(1)}`
                                    : master.instagram?.startsWith('instagram.com/') 
                                    ? `https://${master.instagram}`
                                    : `https://instagram.com/${master.instagram}`;
                                  window.open(instagramUrl, '_blank');
                                }}
                              >
                                <Instagram className="h-4 w-4 mr-1" />
                                Instagram
                              </Button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {master.description && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {master.description}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}