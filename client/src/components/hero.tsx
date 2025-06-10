import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/use-language";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Promotions from "./promotions";

interface Advertisement {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  buttonText: string;
  link: string;
}

export default function Hero() {
  const { t } = useLanguage();
  const [showPromotions, setShowPromotions] = useState(false);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);

  // Fetch advertisements from API
  const { data: advertisements = [] } = useQuery<Advertisement[]>({
    queryKey: ["/api/advertisements"],
  });

  // Auto-rotate advertisements every 10 seconds
  useEffect(() => {
    if (advertisements.length > 0) {
      const interval = setInterval(() => {
        setCurrentAdIndex((prev) => (prev + 1) % advertisements.length);
      }, 10000);
      return () => clearInterval(interval);
    }
  }, [advertisements.length]);

  const handleShowPromotions = () => {
    setShowPromotions(true);
  };

  const nextAd = () => {
    setCurrentAdIndex((prev) => (prev + 1) % advertisements.length);
  };

  const prevAd = () => {
    setCurrentAdIndex((prev) => (prev - 1 + advertisements.length) % advertisements.length);
  };

  if (showPromotions) {
    return <Promotions />;
  }

  const currentAd = advertisements[currentAdIndex];

  return (
    <section id="hero" className="relative bg-gradient-to-r from-blue-900 to-blue-700 py-6">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        {advertisements.length > 0 && currentAd ? (
          <div className="relative bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <div className="flex items-center gap-6">
              <div className="flex-1">
                <h2 className="text-xl lg:text-2xl font-bold mb-2 text-white leading-tight">
                  {currentAd.title}
                </h2>
                <p className="text-sm mb-4 text-blue-100 line-clamp-2">
                  {currentAd.description}
                </p>
                <Button
                  onClick={() => window.open(currentAd.link, '_blank')}
                  className="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 text-sm font-semibold"
                  size="sm"
                >
                  {currentAd.buttonText}
                </Button>
              </div>
              <div className="w-48 lg:w-64 flex-shrink-0">
                <img 
                  src={currentAd.imageUrl} 
                  alt={currentAd.title}
                  className="w-full h-24 lg:h-32 object-cover rounded-lg"
                />
              </div>
            </div>
            
            {/* Navigation buttons */}
            {advertisements.length > 1 && (
              <>
                <button
                  onClick={prevAd}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-1 rounded-full transition-colors"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={nextAd}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-1 rounded-full transition-colors"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
                
                {/* Dots indicator */}
                <div className="flex justify-center mt-3 space-x-1">
                  {advertisements.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentAdIndex(index)}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === currentAdIndex ? 'bg-yellow-500' : 'bg-white/30'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="text-center py-16">
            <h2 className="text-4xl lg:text-6xl font-bold mb-6 text-white leading-tight">
              {t("hero-title")}
            </h2>
            <p className="text-xl mb-8 text-blue-100">
              {t("hero-desc")}
            </p>
            <Button
              onClick={handleShowPromotions}
              className="bg-yellow-500 hover:bg-yellow-600 text-black px-8 py-3 text-lg font-semibold"
              size="lg"
            >
              Mahsulotlarni ko'rish
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}