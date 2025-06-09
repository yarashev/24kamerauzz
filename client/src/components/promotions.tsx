import { useLanguage } from "@/hooks/use-language";
import { Button } from "@/components/ui/button";
import { Star, MapPin, Phone, Clock } from "lucide-react";

export default function Promotions() {
  const { language } = useLanguage();

  const advertisements = [
    {
      id: 1,
      title: language === "uz" ? "Quyosh panellari 30% chegirma" : language === "ru" ? "Солнечные панели скидка 30%" : "Solar Panels 30% Off",
      description: language === "uz" ? "Yuqori sifatli quyosh panellari va akkumulyatorlar" : language === "ru" ? "Высококачественные солнечные панели и аккумуляторы" : "High-quality solar panels and batteries",
      price: "5,000,000 so'm",
      originalPrice: "7,000,000 so'm",
      image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400&h=250&fit=crop",
      badge: language === "uz" ? "Chegirma" : language === "ru" ? "Скидка" : "Sale"
    },
    {
      id: 2,
      title: language === "uz" ? "Smart uy tizimi" : language === "ru" ? "Умный дом система" : "Smart Home System",
      description: language === "uz" ? "Avtomatik boshqaruv va xavfsizlik tizimlari" : language === "ru" ? "Автоматическое управление и системы безопасности" : "Automatic control and security systems",
      price: "3,500,000 so'm",
      originalPrice: "4,500,000 so'm",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=250&fit=crop",
      badge: language === "uz" ? "Yangi" : language === "ru" ? "Новый" : "New"
    },
    {
      id: 3,
      title: language === "uz" ? "Kamera to'plami" : language === "ru" ? "Комплект камер" : "Camera Set",
      description: language === "uz" ? "8 kamera + DVR + kabellar" : language === "ru" ? "8 камер + DVR + кабели" : "8 cameras + DVR + cables",
      price: "2,800,000 so'm",
      originalPrice: "3,200,000 so'm",
      image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=250&fit=crop",
      badge: language === "uz" ? "Mashhur" : language === "ru" ? "Популярный" : "Popular"
    },
    {
      id: 4,
      title: language === "uz" ? "Wi-Fi kameralar" : language === "ru" ? "Wi-Fi камеры" : "Wi-Fi Cameras",
      description: language === "uz" ? "Simsiz kameralar va mobil ilova" : language === "ru" ? "Беспроводные камеры и мобильное приложение" : "Wireless cameras with mobile app",
      price: "1,200,000 so'm",
      originalPrice: "1,500,000 so'm",
      image: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=250&fit=crop",
      badge: language === "uz" ? "Chegirma" : language === "ru" ? "Скидка" : "Sale"
    }
  ];

  const stores = [
    {
      id: 1,
      name: "24kamera Tashkent",
      address: language === "uz" ? "Toshkent sh., Yunusobod t., Abdulla Qodiriy 5" : language === "ru" ? "г. Ташкент, Юнусабадский р-н, Абдулла Кодири 5" : "Tashkent, Yunusabad district, Abdulla Qodiri 5",
      phone: "+998 71 123-45-67",
      hours: "09:00 - 19:00",
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300&h=200&fit=crop"
    },
    {
      id: 2,
      name: "24kamera Samarkand",
      address: language === "uz" ? "Samarqand sh., Rudaki ko'ch., 25-uy" : language === "ru" ? "г. Самарканд, ул. Рудаки, дом 25" : "Samarkand, Rudaki street, house 25",
      phone: "+998 66 234-56-78",
      hours: "09:00 - 18:00",
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300&h=200&fit=crop"
    },
    {
      id: 3,
      name: "24kamera Bukhara",
      address: language === "uz" ? "Buxoro sh., Mustaqillik ko'ch., 12-uy" : language === "ru" ? "г. Бухара, ул. Мустакиллик, дом 12" : "Bukhara, Mustaqillik street, house 12",
      phone: "+998 65 345-67-89",
      hours: "09:00 - 18:00",
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300&h=200&fit=crop"
    },
    {
      id: 4,
      name: "24kamera Andijan",
      address: language === "uz" ? "Andijon sh., Bobur ko'ch., 8-uy" : language === "ru" ? "г. Андижан, ул. Бабур, дом 8" : "Andijan, Bobur street, house 8",
      phone: "+998 74 456-78-90",
      hours: "09:00 - 18:00",
      rating: 4.6,
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300&h=200&fit=crop"
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Advertisements Section */}
        <div className="mb-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {language === "uz" && "Maxsus takliflar"}
              {language === "ru" && "Специальные предложения"}
              {language === "en" && "Special Offers"}
            </h2>
            <p className="text-lg text-gray-600">
              {language === "uz" && "Yuqori sifatli mahsulotlar uchun eng yaxshi narxlar"}
              {language === "ru" && "Лучшие цены на качественные товары"}
              {language === "en" && "Best prices for quality products"}
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {advertisements.map((ad) => (
              <div key={ad.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="relative">
                  <img 
                    src={ad.image} 
                    alt={ad.title}
                    className="w-full h-48 object-cover"
                  />
                  <span className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                    {ad.badge}
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-2 text-gray-900">{ad.title}</h3>
                  <p className="text-gray-600 text-sm mb-3">{ad.description}</p>
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <span className="text-2xl font-bold text-primary">{ad.price}</span>
                      <span className="text-sm text-gray-500 line-through ml-2">{ad.originalPrice}</span>
                    </div>
                  </div>
                  <Button className="w-full bg-primary hover:bg-primary/90">
                    {language === "uz" && "Buyurtma berish"}
                    {language === "ru" && "Заказать"}
                    {language === "en" && "Order Now"}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stores Section */}
        <div>
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {language === "uz" && "Bizning do'konlarimiz"}
              {language === "ru" && "Наши магазины"}
              {language === "en" && "Our Stores"}
            </h2>
            <p className="text-lg text-gray-600">
              {language === "uz" && "O'zbekiston bo'ylab 4 ta do'konimiz mavjud"}
              {language === "ru" && "У нас есть 4 магазина по всему Узбекистану"}
              {language === "en" && "We have 4 stores across Uzbekistan"}
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stores.map((store) => (
              <div key={store.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <img 
                  src={store.image} 
                  alt={store.name}
                  className="w-full h-40 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-2 text-gray-900">{store.name}</h3>
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <div className="flex items-start">
                      <MapPin className="h-4 w-4 mt-0.5 mr-2 text-primary flex-shrink-0" />
                      <span>{store.address}</span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-2 text-primary" />
                      <span>{store.phone}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-primary" />
                      <span>{store.hours}</span>
                    </div>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 mr-2 text-yellow-500 fill-current" />
                      <span>{store.rating}</span>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full">
                    {language === "uz" && "Yo'lni ko'rsatish"}
                    {language === "ru" && "Показать маршрут"}
                    {language === "en" && "Get Directions"}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}