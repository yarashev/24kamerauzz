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
    <section id="hero" className="relative bg-gradient-to-r from-blue-900 to-blue-700 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {advertisements.length > 0 && currentAd ? (
          <div className="relative bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl lg:text-5xl font-bold mb-4 text-white leading-tight">
                  {currentAd.title}
                </h2>
                <p className="text-lg mb-6 text-blue-100">
                  {currentAd.description}
                </p>
                <Button
                  onClick={() => window.open(currentAd.link, '_blank')}
                  className="bg-yellow-500 hover:bg-yellow-600 text-black px-8 py-3 text-lg font-semibold"
                  size="lg"
                >
                  {currentAd.buttonText}
                </Button>
              </div>
              <div className="relative">
                <img 
                  src={currentAd.imageUrl} 
                  alt={currentAd.title}
                  className="w-full h-64 lg:h-80 object-cover rounded-lg"
                />
              </div>
            </div>
            
            {/* Navigation buttons */}
            {advertisements.length > 1 && (
              <>
                <button
                  onClick={prevAd}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-colors"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  onClick={nextAd}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-colors"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
                
                {/* Dots indicator */}
                <div className="flex justify-center mt-6 space-x-2">
                  {advertisements.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentAdIndex(index)}
                      className={`w-3 h-3 rounded-full transition-colors ${
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