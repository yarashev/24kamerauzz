import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Phone, MessageCircle, Instagram, MapPin } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";
import { useToast } from "@/hooks/use-toast";

export default function Contact() {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    message: ""
  });

  const contactInfo = [
    {
      icon: Phone,
      title: t("phone"),
      content: "+998 91 308 95 12",
      subtitle: language === "uz" ? "Dush-Shan: 9:00-18:00" : 
                language === "ru" ? "Пн-Сб: 9:00-18:00" : 
                "Mon-Sat: 9:00-18:00",
      bgColor: "bg-primary/10",
      iconColor: "text-primary"
    },
    {
      icon: MessageCircle,
      title: "Telegram",
      content: "@24kameraBot",
      subtitle: language === "uz" ? "24/7 onlayn qo'llab-quvvatlash" : 
                language === "ru" ? "24/7 онлайн поддержка" : 
                "24/7 online support",
      bgColor: "bg-accent/10",
      iconColor: "text-accent"
    },
    {
      icon: Instagram,
      title: "Instagram",
      content: "@24kamera.uz",
      subtitle: language === "uz" ? "Yangiliklar va mahsulot ko'rgazmalari" : 
                language === "ru" ? "Новости и демонстрации продуктов" : 
                "News and product demonstrations",
      bgColor: "bg-pink-100",
      iconColor: "text-pink-600"
    },
    {
      icon: MapPin,
      title: t("address"),
      content: language === "uz" ? "Toshkent sh., Chilonzor tumani" :
               language === "ru" ? "г. Ташкент, Чиланзарский район" :
               "Tashkent city, Chilanzar district",
      subtitle: language === "uz" ? "Ofis: 9:00-18:00" : 
                language === "ru" ? "Офис: 9:00-18:00" : 
                "Office: 9:00-18:00",
      bgColor: "bg-green-100",
      iconColor: "text-green-600"
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.phone || !formData.message) {
      toast({
        title: language === "uz" ? "Xatolik" : language === "ru" ? "Ошибка" : "Error",
        description: language === "uz" ? "Barcha maydonlarni to'ldiring" : 
                    language === "ru" ? "Заполните все поля" : 
                    "Please fill all fields",
        variant: "destructive"
      });
      return;
    }

    // Here you would typically send the form data to your backend
    toast({
      title: language === "uz" ? "Xabar yuborildi" : 
             language === "ru" ? "Сообщение отправлено" : 
             "Message sent",
      description: language === "uz" ? "Tez orada siz bilan bog'lanamiz" : 
                  language === "ru" ? "Мы свяжемся с вами в ближайшее время" : 
                  "We will contact you soon"
    });

    setFormData({ name: "", phone: "", message: "" });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <section id="contact" className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-secondary mb-4">
            {t("contact")}
          </h3>
          <p className="text-gray-600 text-lg">
            {language === "uz" && "Bizning mutaxassislar bilan bog'laning"}
            {language === "ru" && "Свяжитесь с нашими специалистами"}
            {language === "en" && "Contact our specialists"}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-8">
            {contactInfo.map((info, index) => {
              const Icon = info.icon;
              return (
                <div key={index} className="flex items-start space-x-4">
                  <div className={`${info.bgColor} rounded-full w-12 h-12 flex items-center justify-center`}>
                    <Icon className={`${info.iconColor} h-6 w-6`} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg mb-1">{info.title}</h4>
                    <p className="text-gray-600 font-medium">{info.content}</p>
                    <p className="text-sm text-gray-500">{info.subtitle}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Contact Form */}
          <Card className="bg-gray-50">
            <CardContent className="p-8">
              <h4 className="text-xl font-semibold mb-6">
                {t("send-message")}
              </h4>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Input
                    type="text"
                    placeholder={t("name-placeholder")}
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="w-full"
                  />
                </div>
                <div>
                  <Input
                    type="tel"
                    placeholder={t("phone-placeholder")}
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className="w-full"
                  />
                </div>
                <div>
                  <Textarea
                    placeholder={t("message-placeholder")}
                    rows={4}
                    value={formData.message}
                    onChange={(e) => handleInputChange("message", e.target.value)}
                    className="w-full resize-none"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 font-semibold"
                >
                  {t("send-message-btn")}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
