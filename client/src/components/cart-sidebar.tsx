import { useState } from "react";
import { useCart } from "@/hooks/use-cart";
import { useLanguage } from "@/hooks/use-language";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ShoppingCart, Plus, Minus, Trash2, X } from "lucide-react";
import { formatPrice } from "@/lib/products";

interface CartSidebarProps {
  children: React.ReactNode;
}

export default function CartSidebar({ children }: CartSidebarProps) {
  const { language } = useLanguage();
  const { 
    cartItems, 
    cartCount, 
    updateQuantity, 
    removeFromCart, 
    clearCart,
    isLoading 
  } = useCart();
  const [isOpen, setIsOpen] = useState(false);

  const totalAmount = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

  const handleUpdateQuantity = (itemId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
    } else {
      updateQuantity(itemId, newQuantity);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        {children}
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            {language === "uz" && "Savatcha"}
            {language === "ru" && "Корзина"}
            {language === "en" && "Shopping Cart"}
            {cartCount > 0 && (
              <Badge variant="secondary">{cartCount}</Badge>
            )}
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col h-full">
          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto py-4">
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <Card key={i} className="p-4">
                    <div className="animate-pulse">
                      <div className="flex space-x-4">
                        <div className="w-16 h-16 bg-gray-200 rounded"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : cartItems.length === 0 ? (
              <div className="text-center py-8">
                <ShoppingCart className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {language === "uz" && "Savatcha bo'sh"}
                  {language === "ru" && "Корзина пуста"}
                  {language === "en" && "Cart is empty"}
                </h3>
                <p className="text-gray-500 mb-4">
                  {language === "uz" && "Mahsulotlarni qo'shish uchun katalogga o'ting"}
                  {language === "ru" && "Перейдите в каталог, чтобы добавить товары"}
                  {language === "en" && "Go to catalog to add products"}
                </p>
                <Button onClick={() => setIsOpen(false)} variant="outline">
                  {language === "uz" && "Xarid qilishni davom ettirish"}
                  {language === "ru" && "Продолжить покупки"}
                  {language === "en" && "Continue Shopping"}
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <Card key={item.id} className="p-4">
                    <div className="flex space-x-4">
                      {/* Product Image */}
                      <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                        {item.product.imageUrl ? (
                          <img 
                            src={item.product.imageUrl} 
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <ShoppingCart className="h-6 w-6 text-gray-400" />
                        )}
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900 truncate">
                          {item.product.name}
                        </h4>
                        <p className="text-sm text-gray-500 mb-2">
                          {formatPrice(item.product.price)}
                        </p>

                        {/* Quantity Controls */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center text-sm font-medium">
                              {item.quantity}
                            </span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>

                          {/* Remove Button */}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                            onClick={() => removeFromCart(item.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>

                        {/* Item Total */}
                        <p className="text-sm font-semibold text-green-600 mt-2">
                          {formatPrice(item.product.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Cart Footer */}
          {cartItems.length > 0 && (
            <div className="border-t pt-4 space-y-4">
              {/* Total */}
              <div className="flex justify-between items-center">
                <span className="text-lg font-medium">
                  {language === "uz" && "Jami:"}
                  {language === "ru" && "Итого:"}
                  {language === "en" && "Total:"}
                </span>
                <span className="text-lg font-bold text-green-600">
                  {formatPrice(totalAmount)}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <Button className="w-full" size="lg">
                  {language === "uz" && "Buyurtma berish"}
                  {language === "ru" && "Оформить заказ"}
                  {language === "en" && "Checkout"}
                </Button>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => setIsOpen(false)}
                  >
                    {language === "uz" && "Davom ettirish"}
                    {language === "ru" && "Продолжить"}
                    {language === "en" && "Continue"}
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="flex-1 text-red-500 hover:text-red-700 hover:bg-red-50"
                    onClick={() => {
                      clearCart();
                      setIsOpen(false);
                    }}
                  >
                    {language === "uz" && "Tozalash"}
                    {language === "ru" && "Очистить"}
                    {language === "en" && "Clear"}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}