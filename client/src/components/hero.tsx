import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/use-language";
import { useState } from "react";
import Promotions from "./promotions";

export default function Hero() {
  const { t } = useLanguage();
  const [showPromotions, setShowPromotions] = useState(false);

  const handleScrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleShowPromotions = () => {
    setShowPromotions(true);
  };

  if (showPromotions) {
    return <Promotions />;
  }

  return (
    <section id="hero" className="hero-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
              {t("hero-title")}
            </h2>
            <p className="text-xl mb-8 text-blue-100">
              {t("hero-desc")}
            </p>
            {/* Reklama uchun bo'sh joy */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-white mb-2">Maxsus taklif!</h3>
                <p className="text-blue-100 mb-4">Professional xavfsizlik tizimlari uchun 25% chegirma</p>
                <Button
                  onClick={handleShowPromotions}
                  className="bg-yellow-500 hover:bg-yellow-600 text-black px-8 py-3 text-lg font-semibold"
                  size="lg"
                >
                  Batafsil ma'lumot
                </Button>
              </div>
            </div>
          </div>
          <div className="hidden lg:block">
            <img
              src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600"
              alt="Smart security cameras and home automation system"
              className="rounded-2xl shadow-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
