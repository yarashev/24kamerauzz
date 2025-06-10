import { useState } from "react";
import { ShoppingCart, Menu, X, Globe, Key } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/hooks/use-language";
import { useCart } from "@/hooks/use-cart";
import CartSidebar from "@/components/cart-sidebar";
import CatalogModal from "@/components/catalog-modal";
import type { Language } from "@/lib/translations";

export default function Header() {
  const { language, setLanguage, t } = useLanguage();
  const { cartCount } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleScrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMenuOpen(false);
  };

  const NavigationLinks = ({ className = "" }: { className?: string }) => (
    <nav className={className}>
      <button
        onClick={() => handleScrollTo("hero")}
        className="text-gray-700 hover:text-primary transition-colors font-medium"
      >
        {t("nav-home")}
      </button>
      
      <button
        onClick={() => handleScrollTo("news")}
        className="text-gray-700 hover:text-primary transition-colors font-medium"
      >
        {t("nav-news")}
      </button>
      
    </nav>
  );

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-primary bg-[#27226e00]">
              <span className="bg-primary text-white px-2 py-1 rounded-md">24</span>kamera.uz
            </h1>
          </div>

          {/* Desktop Navigation */}
          <NavigationLinks className="hidden md:flex space-x-8" />

          {/* Right Side */}
          <div className="flex items-center space-x-2">
            {/* Catalog Button */}
            <CatalogModal>
              <Button className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90">
                {language === "uz" && "Katalog"}
                {language === "ru" && "Каталог"}
                {language === "en" && "Catalog"}
              </Button>
            </CatalogModal>

            {/* Masters Button */}
            <Button 
              onClick={() => window.location.hash = '#masters'}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
            >
              {language === "uz" && "Ustalar"}
              {language === "ru" && "Мастера"}
              {language === "en" && "Masters"}
            </Button>

            {/* Password Recovery Button */}
            <Button 
              onClick={() => handleScrollTo('password-recovery')}
              className="bg-red-600 text-white px-3 py-2 rounded-md hover:bg-red-700 flex items-center gap-2"
            >
              <Key className="h-4 w-4" />
              <span className="hidden lg:inline">
                {language === "uz" && "Parolni tiklash"}
                {language === "ru" && "Восстановление пароля"}
                {language === "en" && "Password Recovery"}
              </span>
              <span className="lg:hidden">
                {language === "uz" && "Parolni tiklash"}
                {language === "ru" && "Пароль"}
                {language === "en" && "Password"}
              </span>
            </Button>

            {/* Language Selector */}
            <Select value={language} onValueChange={(value: Language) => setLanguage(value)}>
              <SelectTrigger className="w-12 h-10 border-0 bg-transparent hover:bg-gray-100 rounded-full">
                <Globe className="h-5 w-5 text-gray-600" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="uz">🇺🇿 O'zbek</SelectItem>
                <SelectItem value="ru">🇷🇺 Русский</SelectItem>
                <SelectItem value="en">🇺🇸 English</SelectItem>
              </SelectContent>
            </Select>

            {/* Cart */}
            <CartSidebar>
              <Button
                variant="ghost"
                size="icon"
                className="relative"
              >
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                    {cartCount}
                  </Badge>
                )}
              </Button>
            </CartSidebar>

            {/* Mobile Menu Button */}
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <div className="flex flex-col space-y-4 mt-8">
                  <NavigationLinks className="flex flex-col space-y-4" />
                  
                  {/* Mobile Menu Buttons */}
                  <div className="border-t pt-4 space-y-3">
                    <CatalogModal>
                      <Button className="w-full bg-primary text-white justify-start">
                        {language === "uz" && "Katalog"}
                        {language === "ru" && "Каталог"}
                        {language === "en" && "Catalog"}
                      </Button>
                    </CatalogModal>
                    
                    <Button 
                      onClick={() => {
                        handleScrollTo('masters');
                        setIsMenuOpen(false);
                      }}
                      className="w-full bg-green-600 text-white justify-start hover:bg-green-700"
                    >
                      {language === "uz" && "Ustalar"}
                      {language === "ru" && "Мастера"}
                      {language === "en" && "Masters"}
                    </Button>
                    
                    <Button 
                      onClick={() => {
                        handleScrollTo('password-recovery');
                        setIsMenuOpen(false);
                      }}
                      className="w-full bg-red-600 text-white justify-start hover:bg-red-700 flex items-center gap-2"
                    >
                      <Key className="h-4 w-4" />
                      {language === "uz" && "Parol tiklash"}
                      {language === "ru" && "Восстановление пароля"}
                      {language === "en" && "Password Recovery"}
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
