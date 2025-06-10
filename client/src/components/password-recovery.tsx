import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Send, Phone, Mail, Shield, Key } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";
import { useQuery } from "@tanstack/react-query";

interface Brand {
  id: number;
  name: string;
  logo: string;
  telegramSupport?: string;
  whatsappSupport?: string;
  phoneSupport?: string;
  emailSupport?: string;
  isActive: boolean;
}

export default function PasswordRecovery() {
  const { language, t } = useLanguage();
  const [selectedBrand, setSelectedBrand] = useState<string>("");
  const [deviceModel, setDeviceModel] = useState<string>("");

  // Fetch brands from API
  const { data: brands = [], isLoading } = useQuery<Brand[]>({
    queryKey: ["/api/password-recovery-brands"],
  });

  const handleContactSupport = (brand: Brand, method: string) => {
    const message = `Salom! ${brand.name} ${deviceModel} qurilmasining parolini tiklash uchun yordam kerak.`;
    
    switch (method) {
      case 'telegram':
        if (brand.telegramSupport) {
          const telegramUrl = brand.telegramSupport.startsWith('@') 
            ? `https://t.me/${brand.telegramSupport.slice(1)}`
            : `https://t.me/${brand.telegramSupport}`;
          window.open(`${telegramUrl}?text=${encodeURIComponent(message)}`, '_blank');
        }
        break;
      case 'whatsapp':
        if (brand.whatsappSupport) {
          window.open(`https://wa.me/${brand.whatsappSupport}?text=${encodeURIComponent(message)}`, '_blank');
        }
        break;
      case 'phone':
        if (brand.phoneSupport) {
          window.open(`tel:${brand.phoneSupport}`, '_self');
        }
        break;
      case 'email':
        if (brand.emailSupport) {
          window.open(`mailto:${brand.emailSupport}?subject=Parol tiklash&body=${encodeURIComponent(message)}`, '_self');
        }
        break;
    }
  };

  const selectedBrandData = brands.find(brand => brand.id.toString() === selectedBrand);

  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="bg-red-100 p-3 rounded-full">
              <Key className="h-8 w-8 text-red-600" />
            </div>
            <h2 className="text-4xl font-bold text-gray-900">
              {language === "uz" && "Parolni Tiklash"}
              {language === "ru" && "Восстановление Пароля"}
              {language === "en" && "Password Recovery"}
            </h2>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {language === "uz" && "Kamera parolingizni unutdingizmi? Brendingizni tanlang va texnik yordam olish uchun biz bilan bog'laning"}
            {language === "ru" && "Забыли пароль от камеры? Выберите ваш бренд и свяжитесь с нами для технической поддержки"}
            {language === "en" && "Forgot your camera password? Select your brand and contact us for technical support"}
          </p>
          <div className="mt-6 flex items-center justify-center gap-2">
            <Shield className="h-5 w-5 text-green-600" />
            <span className="text-sm text-green-600 font-medium">
              {language === "uz" && "Xavfsiz va tez yordam"}
              {language === "ru" && "Безопасная и быстрая помощь"}
              {language === "en" && "Safe and fast support"}
            </span>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-center">
                {language === "uz" && "Brendingizni tanlang"}
                {language === "ru" && "Выберите ваш бренд"}
                {language === "en" && "Select Your Brand"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                  <p className="mt-2 text-gray-600">
                    {language === "uz" && "Brendlar yuklanmoqda..."}
                    {language === "ru" && "Загружаются бренды..."}
                    {language === "en" && "Loading brands..."}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {brands.filter(brand => brand.isActive).map((brand) => (
                    <Card 
                      key={brand.id}
                      className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                        selectedBrand === brand.id.toString() 
                          ? 'ring-2 ring-blue-500 bg-blue-50' 
                          : 'hover:bg-gray-50'
                      }`}
                      onClick={() => setSelectedBrand(brand.id.toString())}
                    >
                      <CardContent className="p-4 text-center">
                        <div className="text-3xl mb-2">{brand.logo}</div>
                        <h3 className="font-semibold text-sm">{brand.name}</h3>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {selectedBrandData && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <span className="text-2xl">{selectedBrandData.logo}</span>
                  {selectedBrandData.name} - 
                  {language === "uz" && " Texnik Yordam"}
                  {language === "ru" && " Техническая Поддержка"}
                  {language === "en" && " Technical Support"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {language === "uz" && "Qurilma modeli (ixtiyoriy)"}
                    {language === "ru" && "Модель устройства (необязательно)"}
                    {language === "en" && "Device Model (optional)"}
                  </label>
                  <Input
                    placeholder={language === "uz" ? "Masalan: DS-2CD2043G0-I" : 
                                language === "ru" ? "Например: DS-2CD2043G0-I" : 
                                "Example: DS-2CD2043G0-I"}
                    value={deviceModel}
                    onChange={(e) => setDeviceModel(e.target.value)}
                  />
                </div>

                <div>
                  <h4 className="font-semibold mb-4">
                    {language === "uz" && "Aloqa usullarini tanlang:"}
                    {language === "ru" && "Выберите способ связи:"}
                    {language === "en" && "Choose contact method:"}
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedBrandData.telegramSupport && (
                      <Button
                        variant="outline"
                        className="flex items-center justify-center gap-3 p-4 h-auto"
                        onClick={() => handleContactSupport(selectedBrandData, 'telegram')}
                      >
                        <MessageCircle className="h-6 w-6 text-blue-500" />
                        <div className="text-left">
                          <div className="font-semibold">Telegram</div>
                          <div className="text-sm text-gray-600">{selectedBrandData.telegramSupport}</div>
                        </div>
                      </Button>
                    )}

                    {selectedBrandData.whatsappSupport && (
                      <Button
                        variant="outline"
                        className="flex items-center justify-center gap-3 p-4 h-auto"
                        onClick={() => handleContactSupport(selectedBrandData, 'whatsapp')}
                      >
                        <MessageCircle className="h-6 w-6 text-green-500" />
                        <div className="text-left">
                          <div className="font-semibold">WhatsApp</div>
                          <div className="text-sm text-gray-600">{selectedBrandData.whatsappSupport}</div>
                        </div>
                      </Button>
                    )}

                    {selectedBrandData.phoneSupport && (
                      <Button
                        variant="outline"
                        className="flex items-center justify-center gap-3 p-4 h-auto"
                        onClick={() => handleContactSupport(selectedBrandData, 'phone')}
                      >
                        <Phone className="h-6 w-6 text-blue-600" />
                        <div className="text-left">
                          <div className="font-semibold">
                            {language === "uz" && "Telefon"}
                            {language === "ru" && "Телефон"}
                            {language === "en" && "Phone"}
                          </div>
                          <div className="text-sm text-gray-600">{selectedBrandData.phoneSupport}</div>
                        </div>
                      </Button>
                    )}

                    {selectedBrandData.emailSupport && (
                      <Button
                        variant="outline"
                        className="flex items-center justify-center gap-3 p-4 h-auto"
                        onClick={() => handleContactSupport(selectedBrandData, 'email')}
                      >
                        <Mail className="h-6 w-6 text-red-500" />
                        <div className="text-left">
                          <div className="font-semibold">Email</div>
                          <div className="text-sm text-gray-600">{selectedBrandData.emailSupport}</div>
                        </div>
                      </Button>
                    )}
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h5 className="font-semibold text-yellow-800 mb-2">
                    {language === "uz" && "Muhim eslatma:"}
                    {language === "ru" && "Важное напоминание:"}
                    {language === "en" && "Important Note:"}
                  </h5>
                  <p className="text-sm text-yellow-700">
                    {language === "uz" && "Parol tiklash jarayoni qurilma modeli va firmware versiyasiga bog'liq. Iltimos, qurilma ma'lumotlarini tayyorlang."}
                    {language === "ru" && "Процесс восстановления пароля зависит от модели устройства и версии прошивки. Пожалуйста, подготовьте информацию об устройстве."}
                    {language === "en" && "Password recovery process depends on device model and firmware version. Please prepare your device information."}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </section>
  );
}