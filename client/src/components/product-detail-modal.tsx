import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, Star, Shield, Camera, Eye, Zap, Settings, X } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";
import { useCart } from "@/hooks/use-cart";
import { formatPrice } from "@/lib/products";
import type { Product } from "@shared/schema";

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProductDetailModal({ product, isOpen, onClose }: ProductDetailModalProps) {
  const { t, language } = useLanguage();
  const { addToCart, isAddingToCart } = useCart();
  const [selectedImage, setSelectedImage] = useState(0);

  if (!product) return null;

  const handleAddToCart = () => {
    addToCart(product.id, 1);
  };

  const features = Array.isArray(product.features) ? product.features : [];

  // Get additional product images (mock for now, can be extended)
  const productImages = [
    product.imageUrl,
    // Add more angles/views if available
  ].filter(Boolean);

  const getProductSpecs = (product: Product) => {
    const specs = [];
    
    // Extract resolution from features or name
    if (features.some(f => f.includes('4K') || f.includes('8MP'))) {
      specs.push({ 
        label: language === 'uz' ? 'Sifat' : language === 'ru' ? 'Разрешение' : 'Resolution', 
        value: '4K (8MP)' 
      });
    } else if (features.some(f => f.includes('5MP'))) {
      specs.push({ 
        label: language === 'uz' ? 'Sifat' : language === 'ru' ? 'Разрешение' : 'Resolution', 
        value: '5MP' 
      });
    } else if (features.some(f => f.includes('4MP'))) {
      specs.push({ 
        label: language === 'uz' ? 'Sifat' : language === 'ru' ? 'Разрешение' : 'Resolution', 
        value: '4MP' 
      });
    } else if (features.some(f => f.includes('2MP') || f.includes('1080P'))) {
      specs.push({ 
        label: language === 'uz' ? 'Sifat' : language === 'ru' ? 'Разрешение' : 'Resolution', 
        value: '1080P (2MP)' 
      });
    }

    // Night vision
    if (features.some(f => f.includes('IR') || f.includes('night'))) {
      specs.push({ 
        label: language === 'uz' ? 'Tungi ko\'rish' : language === 'ru' ? 'Ночное видение' : 'Night Vision', 
        value: language === 'uz' ? 'Ha' : language === 'ru' ? 'Да' : 'Yes'
      });
    }

    // Storage
    if (product.category === 'nvr' || product.category === 'dvr') {
      if (features.some(f => f.includes('2-SATA'))) {
        specs.push({ 
          label: language === 'uz' ? 'Saqlash' : language === 'ru' ? 'Хранение' : 'Storage', 
          value: '2 x SATA HDD' 
        });
      } else if (features.some(f => f.includes('1-SATA'))) {
        specs.push({ 
          label: language === 'uz' ? 'Saqlash' : language === 'ru' ? 'Хранение' : 'Storage', 
          value: '1 x SATA HDD' 
        });
      }

      // Channels
      if (features.some(f => f.includes('32 channels'))) {
        specs.push({ 
          label: language === 'uz' ? 'Kanallar' : language === 'ru' ? 'Каналы' : 'Channels', 
          value: '32' 
        });
      } else if (features.some(f => f.includes('16 channels'))) {
        specs.push({ 
          label: language === 'uz' ? 'Kanallar' : language === 'ru' ? 'Каналы' : 'Channels', 
          value: '16' 
        });
      } else if (features.some(f => f.includes('8 channels'))) {
        specs.push({ 
          label: language === 'uz' ? 'Kanallar' : language === 'ru' ? 'Каналы' : 'Channels', 
          value: '8' 
        });
      } else if (features.some(f => f.includes('4 channels'))) {
        specs.push({ 
          label: language === 'uz' ? 'Kanallar' : language === 'ru' ? 'Каналы' : 'Channels', 
          value: '4' 
        });
      }
    }

    // Connectivity
    if (product.category === 'ezviz' || product.category === 'ip_camera') {
      specs.push({ 
        label: language === 'uz' ? 'Ulanish' : language === 'ru' ? 'Подключение' : 'Connectivity', 
        value: 'Wi-Fi / Ethernet' 
      });
    }

    return specs;
  };

  const specs = getProductSpecs(product);

  const getCategoryDisplayName = (category: string) => {
    switch (category) {
      case 'ezviz':
        return language === 'uz' ? 'Ezviz Kamera' : language === 'ru' ? 'Камера Ezviz' : 'Ezviz Camera';
      case 'ip_camera':
        return language === 'uz' ? 'IP Kamera' : language === 'ru' ? 'IP Камера' : 'IP Camera';
      case 'hd_camera':
        return language === 'uz' ? 'HD Kamera' : language === 'ru' ? 'HD Камера' : 'HD Camera';
      case 'nvr':
        return language === 'uz' ? 'NVR Qurilma' : language === 'ru' ? 'NVR Устройство' : 'NVR Device';
      case 'dvr':
        return language === 'uz' ? 'DVR Qurilma' : language === 'ru' ? 'DVR Устройство' : 'DVR Device';
      default:
        return category;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold pr-8">
            {product.name}
          </DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative">
              <img
                src={productImages[selectedImage] || product.imageUrl}
                alt={product.name}
                className="w-full h-80 object-cover rounded-lg border"
              />
              {!product.inStock && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                  <Badge variant="secondary" className="text-white">
                    {language === "uz" && "Sotuvda yo'q"}
                    {language === "ru" && "Нет в наличии"}
                    {language === "en" && "Out of Stock"}
                  </Badge>
                </div>
              )}
            </div>
            
            {productImages.length > 1 && (
              <div className="flex gap-2">
                {productImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-16 h-16 border rounded ${
                      selectedImage === index ? 'border-blue-500' : 'border-gray-200'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover rounded"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            {/* Category and Price */}
            <div>
              <Badge variant="outline" className="mb-2">
                {getCategoryDisplayName(product.category)}
              </Badge>
              <div className="text-3xl font-bold text-primary">
                {formatPrice(product.price)}
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="font-semibold text-lg mb-2">
                {language === "uz" && "Tavsif"}
                {language === "ru" && "Описание"}
                {language === "en" && "Description"}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Features */}
            {features.length > 0 && (
              <div>
                <h3 className="font-semibold text-lg mb-3">
                  {language === "uz" && "Xususiyatlar"}
                  {language === "ru" && "Особенности"}
                  {language === "en" && "Features"}
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-500 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Specifications */}
            {specs.length > 0 && (
              <div>
                <h3 className="font-semibold text-lg mb-3">
                  {language === "uz" && "Texnik xususiyatlar"}
                  {language === "ru" && "Технические характеристики"}
                  {language === "en" && "Specifications"}
                </h3>
                <Card>
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      {specs.map((spec, index) => (
                        <div key={index}>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">{spec.label}:</span>
                            <span className="text-sm font-medium">{spec.value}</span>
                          </div>
                          {index < specs.length - 1 && <Separator />}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Add to Cart */}
            <div className="space-y-3">
              <Button
                onClick={handleAddToCart}
                disabled={!product.inStock || isAddingToCart}
                className="w-full"
                size="lg"
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                {!product.inStock 
                  ? (language === "uz" ? "Sotuvda yo'q" : language === "ru" ? "Нет в наличии" : "Out of Stock")
                  : isAddingToCart 
                  ? (language === "uz" ? "Qo'shilmoqda..." : language === "ru" ? "Добавление..." : "Adding...")
                  : (language === "uz" ? "Savatga qo'shish" : language === "ru" ? "Добавить в корзину" : "Add to Cart")
                }
              </Button>
              
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Shield className="h-4 w-4" />
                <span>
                  {language === "uz" && "1 yil kafolat"}
                  {language === "ru" && "1 год гарантии"}
                  {language === "en" && "1 year warranty"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}