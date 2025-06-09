import { Shield, Wrench, Headphones } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";

export default function Features() {
  const { language } = useLanguage();

  const features = [
    {
      icon: Shield,
      title: {
        uz: "Xavfsizlik Kafolati",
        ru: "Гарантия Безопасности",
        en: "Security Guarantee"
      },
      description: {
        uz: "Yuqori sifatli kameralar bilan to'liq himoya",
        ru: "Полная защита с качественными камерами",
        en: "Complete protection with high-quality cameras"
      },
      bgColor: "bg-primary/10",
      iconColor: "text-primary"
    },
    {
      icon: Wrench,
      title: {
        uz: "Professional O'rnatish",
        ru: "Профессиональная Установка",
        en: "Professional Installation"
      },
      description: {
        uz: "Mutaxassis jamoamiz tomonidan o'rnatish xizmati",
        ru: "Услуга установки нашей экспертной командой",
        en: "Installation service by our expert team"
      },
      bgColor: "bg-accent/10",
      iconColor: "text-accent"
    },
    {
      icon: Headphones,
      title: {
        uz: "24/7 Qo'llab-quvvatlash",
        ru: "24/7 Поддержка",
        en: "24/7 Support"
      },
      description: {
        uz: "Doimo mavjud texnik yordam va maslahat",
        ru: "Всегда доступная техническая помощь и консультации",
        en: "Always available technical support and consultation"
      },
      bgColor: "bg-green-100",
      iconColor: "text-green-600"
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="text-center">
                <div className={`${feature.bgColor} rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4`}>
                  <Icon className={`${feature.iconColor} h-8 w-8`} />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  {feature.title[language]}
                </h3>
                <p className="text-gray-600">
                  {feature.description[language]}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
