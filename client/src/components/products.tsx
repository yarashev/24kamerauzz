import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ShoppingCart, Plus, Camera } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";
import { useCart } from "@/hooks/use-cart";
import { productCategories, formatPrice } from "@/lib/products";
import type { Product } from "@shared/schema";
import ezvizLogo from "@assets/ezviz logo_1749469085610.png";
import hilookLogo from "@assets/hilook 222222_1749477480288.jpg";
import hikvisionLogo from "@assets/hikvision_logo_1749475369969.png";
import hiwatchLogo from "@assets/4974HIWATCH 222222_1749477667922.jpg";
import ProductDetailModal from "./product-detail-modal";

// Function to get product image based on model name
const getProductImage = (productName: string): string => {
  // Extract model number from product name
  const modelMatch = productName.match(/(?:CS-|IPC-|THC-|DVR-|NVR-)([A-Z0-9-]+)/i);
  const model = modelMatch ? modelMatch[0] : productName.split(' ')[1] || productName;

  // Define image mappings for common camera models
  const imageMap: { [key: string]: string } = {
    // Ezviz models
    'CS-H1C': 'https://images.ezvizlife.com/global/website/product/CS-H1C/CS-H1C-1.png',
    'CS-H6C': 'https://images.ezvizlife.com/global/website/product/CS-H6C/CS-H6C-1.png',
    'CS-H7C': 'https://images.ezvizlife.com/global/website/product/CS-H7C/CS-H7C-1.png',
    'CS-C60P': 'https://images.ezvizlife.com/global/website/product/CS-C60P/CS-C60P-1.png',
    'CS-H4': 'https://images.ezvizlife.com/global/website/product/CS-H4/CS-H4-1.png',
    'CS-H6': 'https://images.ezvizlife.com/global/website/product/CS-H6/CS-H6-1.png',
    'CS-C6C': 'https://images.ezvizlife.com/global/website/product/CS-C6C/CS-C6C-1.png',
    'CS-H5': 'https://images.ezvizlife.com/global/website/product/CS-H5/CS-H5-1.png',
    'CS-H3': 'https://images.ezvizlife.com/global/website/product/CS-H3/CS-H3-1.png',
    'CS-H3C': 'https://images.ezvizlife.com/global/website/product/CS-H3C/CS-H3C-1.png',
    'CS-C3X': 'https://images.ezvizlife.com/global/website/product/CS-C3X/CS-C3X-1.png',
    'CS-CB1': 'https://images.ezvizlife.com/global/website/product/CS-CB1/CS-CB1-1.png',
    'CS-CB2': 'https://images.ezvizlife.com/global/website/product/CS-CB2/CS-CB2-1.png',
    'CS-EB3': 'https://images.ezvizlife.com/global/website/product/CS-EB3/CS-EB3-1.png',
    'CS-BC1C': 'https://images.ezvizlife.com/global/website/product/CS-BC1C/CS-BC1C-1.png',
    'CS-EB5': 'https://images.ezvizlife.com/global/website/product/CS-EB5/CS-EB5-1.png',
    'CS-LC3': 'https://images.ezvizlife.com/global/website/product/CS-LC3/CS-LC3-1.png',
    'CS-EL3': 'https://images.ezvizlife.com/global/website/product/CS-EL3/CS-EL3-1.png',
    'CS-C8C': 'https://images.ezvizlife.com/global/website/product/CS-C8C/CS-C8C-1.png',
    'CS-H8C': 'https://images.ezvizlife.com/global/website/product/CS-H8C/CS-H8C-1.png',
    'CS-H8': 'https://images.ezvizlife.com/global/website/product/CS-H8/CS-H8-1.png',
    'CS-H80X': 'https://images.ezvizlife.com/global/website/product/CS-H80X/CS-H80X-1.png',
    'CS-H8X': 'https://images.ezvizlife.com/global/website/product/CS-H8X/CS-H8X-1.png',
    'CS-H80F': 'https://images.ezvizlife.com/global/website/product/CS-H80F/CS-H80F-1.png',
    'CS-H90': 'https://images.ezvizlife.com/global/website/product/CS-H90/CS-H90-1.png',
    'CS-H9C': 'https://images.ezvizlife.com/global/website/product/CS-H9C/CS-H9C-1.png',
    'CS-HB8': 'https://images.ezvizlife.com/global/website/product/CS-HB8/CS-HB8-1.png',
    'CS-EB8': 'https://images.ezvizlife.com/global/website/product/CS-EB8/CS-EB8-1.png',
    'CS-DB1': 'https://images.ezvizlife.com/global/website/product/CS-DB1/CS-DB1-1.png',
    'CS-DP2C': 'https://images.ezvizlife.com/global/website/product/CS-DP2C/CS-DP2C-1.png',
    'CS-DP2': 'https://images.ezvizlife.com/global/website/product/CS-DP2/CS-DP2-1.png',
    'CS-HP4': 'https://images.ezvizlife.com/global/website/product/CS-HP4/CS-HP4-1.png',
    'CS-HP5': 'https://images.ezvizlife.com/global/website/product/CS-HP5/CS-HP5-1.png',
    'CS-HP7': 'https://images.ezvizlife.com/global/website/product/CS-HP7/CS-HP7-1.png',
    'CS-SD7': 'https://images.ezvizlife.com/global/website/product/CS-SD7/CS-SD7-1.png',
    'CS-DL03': 'https://images.ezvizlife.com/global/website/product/CS-DL03/CS-DL03-1.png',
    'CS-DL04': 'https://images.ezvizlife.com/global/website/product/CS-DL04/CS-DL04-1.png',
    'CS-DL05': 'https://images.ezvizlife.com/global/website/product/CS-DL05/CS-DL05-1.png',
    'CS-L2-11FCP': 'https://images.ezvizlife.com/global/website/product/CS-L2/CS-L2-1.png',
    'CS-L2S-11FCP': 'https://images.ezvizlife.com/global/website/product/CS-L2S/CS-L2S-1.png',
    'CS-R5C': 'https://images.ezvizlife.com/global/website/product/CS-R5C/CS-R5C-1.png',
    'CS-X5S': 'https://images.ezvizlife.com/global/website/product/CS-X5S/CS-X5S-1.png',
    'CS-PB18': 'https://images.ezvizlife.com/global/website/product/CS-PB18/CS-PB18-1.png',
    'CS-CMT': 'https://images.ezvizlife.com/global/website/product/CS-CMT/CS-CMT-1.png',

    // Hilook models
    'IPC-B140H': 'https://www.hikvision.com/content/dam/hikvision/products/hilook/ip-camera/bullet/ipc-b140h/IPC-B140H.png',
    'IPC-B120H': 'https://www.hikvision.com/content/dam/hikvision/products/hilook/ip-camera/bullet/ipc-b120h/IPC-B120H.png',
    'IPC-B180H': 'https://www.hikvision.com/content/dam/hikvision/products/hilook/ip-camera/bullet/ipc-b180h/IPC-B180H.png',
    'IPC-B160H': 'https://www.hikvision.com/content/dam/hikvision/products/hilook/ip-camera/bullet/ipc-b160h/IPC-B160H.png',
    'IPC-B141H-M': 'https://www.hikvision.com/content/dam/hikvision/products/hilook/ip-camera/bullet/ipc-b141h-m/IPC-B141H-M.png',
    'IPC-D140H': 'https://www.hikvision.com/content/dam/hikvision/products/hilook/ip-camera/dome/ipc-d140h/IPC-D140H.png',
    'IPC-D120H': 'https://www.hikvision.com/content/dam/hikvision/products/hilook/ip-camera/dome/ipc-d120h/IPC-D120H.png',
    'IPC-D180H': 'https://www.hikvision.com/content/dam/hikvision/products/hilook/ip-camera/dome/ipc-d180h/IPC-D180H.png',
    'IPC-D160H': 'https://www.hikvision.com/content/dam/hikvision/products/hilook/ip-camera/dome/ipc-d160h/IPC-D160H.png',
    'THC-B140-P': 'https://www.hikvision.com/content/dam/hikvision/products/hilook/turbo-hd/bullet/thc-b140-p/THC-B140-P.png',
    'THC-B120-P': 'https://www.hikvision.com/content/dam/hikvision/products/hilook/turbo-hd/bullet/thc-b120-p/THC-B120-P.png',
    'THC-B240-M': 'https://www.hikvision.com/content/dam/hikvision/products/hilook/turbo-hd/bullet/thc-b240-m/THC-B240-M.png',
    'THC-T140-P': 'https://www.hikvision.com/content/dam/hikvision/products/hilook/turbo-hd/turret/thc-t140-p/THC-T140-P.png',
    'THC-T240-M': 'https://www.hikvision.com/content/dam/hikvision/products/hilook/turbo-hd/turret/thc-t240-m/THC-T240-M.png',
    'THC-T340-VF': 'https://www.hikvision.com/content/dam/hikvision/products/hilook/turbo-hd/turret/thc-t340-vf/THC-T340-VF.png',
    'THC-D340-VF': 'https://www.hikvision.com/content/dam/hikvision/products/hilook/turbo-hd/dome/thc-d340-vf/THC-D340-VF.png',

    // Network switches
    'NS-0106MP-35': 'https://www.hikvision.com/content/dam/hikvision/products/network-products/switches/ns-0106mp-35/NS-0106MP-35.png',
    'NS-0110MP-60': 'https://www.hikvision.com/content/dam/hikvision/products/network-products/switches/ns-0110mp-60/NS-0110MP-60.png',
  };

  // First try to find exact match
  if (imageMap[model]) {
    return imageMap[model];
  }

  // Try to find partial match for variations like CS-H6C Pro (4MP)
  for (const key in imageMap) {
    if (model.includes(key) || key.includes(model.split(' ')[0])) {
      return imageMap[key];
    }
  }

  // Generic fallback images based on brand/type
  if (productName.toLowerCase().includes('ezviz')) {
    return 'https://images.ezvizlife.com/global/website/common/default-camera.png';
  } else if (productName.toLowerCase().includes('hilook')) {
    return 'https://www.hikvision.com/content/dam/hikvision/common/default-camera.png';
  }

  // Final fallback - placeholder image
  return `https://via.placeholder.com/300x300/f3f4f6/9ca3af?text=${encodeURIComponent(model)}`;
};

const cameraBrands: any[] = [];

export default function Products() {
  const { t, language } = useLanguage();
  const { addToCart, isAddingToCart } = useCart();
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: allProducts = [], isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  // Ensure products is always an array
  const products = Array.isArray(allProducts) ? allProducts : [];

  // Filter products by category and brand
  const filteredProducts = selectedBrand === "ezviz" 
    ? products.filter(product => product.category === "ezviz")
    : selectedBrand === "hilook" && selectedCategory
    ? products.filter(product => product.category === selectedCategory)
    : selectedBrand === "hikvision" && selectedCategory
    ? products.filter(product => product.category === selectedCategory)
    : selectedBrand === "hiwatch" && selectedCategory
    ? products.filter(product => product.category === selectedCategory)
    : [];

  const handleAddToCart = (productId: number) => {
    addToCart(productId, 1);
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const getCategoryName = (category: any) => {
    switch (language) {
      case "en": return category.nameEn;
      case "ru": return category.nameRu;
      default: return category.name;
    }
  };

  const getBrandName = (brand: any) => {
    switch (language) {
      case "en": return brand.nameEn;
      case "ru": return brand.nameRu;
      default: return brand.name;
    }
  };

  return (
    <section id="products" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-secondary mb-4">
            {t("products")}
          </h3>
          <p className="text-gray-600 text-lg">
            {language === "uz" && "Eng yaxshi kameralar va elektronika jihozlari"}
            {language === "ru" && "Лучшие камеры и электронные устройства"}
            {language === "en" && "Best cameras and electronic devices"}
          </p>
        </div>

        {/* Brand Logos Display */}
        <div className="flex justify-center gap-4 mb-8">
          {/* Hikvision Logo */}
          <button 
            onClick={() => {
              setSelectedBrand("hikvision");
              setSelectedCategory("hikvision_nvr"); // Default to NVR category for Hikvision
            }}
            className={`w-44 h-20 bg-white rounded-lg shadow-lg p-3 flex items-center justify-center border border-gray-200 transition-all duration-200 hover:scale-105 ${
              selectedBrand === "hikvision" ? "ring-4 ring-blue-500" : ""
            }`}
          >
            <img 
              src={hikvisionLogo} 
              alt="Hikvision Logo" 
              className="h-full w-auto object-contain"
            />
          </button>

          {/* Ezviz Logo */}
          <button 
            onClick={() => setSelectedBrand("ezviz")}
            className={`w-44 h-20 bg-black rounded-lg shadow-lg p-3 flex items-center justify-center transition-all duration-200 hover:scale-105 ${
              selectedBrand === "ezviz" ? "ring-4 ring-blue-500" : ""
            }`}
          >
            <img 
              src={ezvizLogo} 
              alt="Ezviz Logo" 
              className="h-full w-auto object-contain"
            />
          </button>
          
          {/* Hilook Logo */}
          <button 
            onClick={() => {
              setSelectedBrand("hilook");
              setSelectedCategory("ip_camera"); // Default to IP camera category for Hilook
            }}
            className={`w-44 h-20 bg-white rounded-lg shadow-lg p-3 flex items-center justify-center border border-gray-200 transition-all duration-200 hover:scale-105 ${
              selectedBrand === "hilook" ? "ring-4 ring-blue-500" : ""
            }`}
          >
            <img 
              src={hilookLogo} 
              alt="Hilook Logo" 
              className="h-full w-auto object-contain"
            />
          </button>

          {/* HiWatch Logo */}
          <button 
            onClick={() => {
              setSelectedBrand("hiwatch");
              setSelectedCategory("hiwatch_nvr"); // Default to NVR category for HiWatch
            }}
            className={`w-44 h-20 bg-white rounded-lg shadow-lg p-3 flex items-center justify-center border border-gray-200 transition-all duration-200 hover:scale-105 ${
              selectedBrand === "hiwatch" ? "ring-4 ring-blue-500" : ""
            }`}
          >
            <img 
              src={hiwatchLogo} 
              alt="HiWatch Logo" 
              className="h-full w-auto object-contain"
            />
          </button>
        </div>



        {/* Hilook Category Buttons */}
        {selectedBrand === "hilook" && (
          <div className="flex justify-center gap-3 mb-6">
            <Button
              onClick={() => setSelectedCategory("nvr")}
              variant={selectedCategory === "nvr" ? "default" : "outline"}
              size="sm"
              className="text-sm"
            >
              NVR
            </Button>
            <Button
              onClick={() => setSelectedCategory("ip_camera")}
              variant={selectedCategory === "ip_camera" ? "default" : "outline"}
              size="sm"
              className="text-sm"
            >
              IP KAMERA
            </Button>
            <Button
              onClick={() => setSelectedCategory("dvr")}
              variant={selectedCategory === "dvr" ? "default" : "outline"}
              size="sm"
              className="text-sm"
            >
              DVR
            </Button>
            <Button
              onClick={() => setSelectedCategory("hd_camera")}
              variant={selectedCategory === "hd_camera" ? "default" : "outline"}
              size="sm"
              className="text-sm"
            >
              HD KAMERA
            </Button>
          </div>
        )}

        {/* Hikvision Category Buttons */}
        {selectedBrand === "hikvision" && (
          <div className="flex justify-center gap-3 mb-6">
            <Button
              onClick={() => setSelectedCategory("hikvision_nvr")}
              variant={selectedCategory === "hikvision_nvr" ? "default" : "outline"}
              size="sm"
              className="text-sm"
            >
              NVR
            </Button>
            <Button
              onClick={() => setSelectedCategory("hikvision_ip_camera")}
              variant={selectedCategory === "hikvision_ip_camera" ? "default" : "outline"}
              size="sm"
              className="text-sm"
            >
              IP KAMERA
            </Button>
            <Button
              onClick={() => setSelectedCategory("hikvision_dvr")}
              variant={selectedCategory === "hikvision_dvr" ? "default" : "outline"}
              size="sm"
              className="text-sm"
            >
              DVR
            </Button>
            <Button
              onClick={() => setSelectedCategory("hikvision_hd_camera")}
              variant={selectedCategory === "hikvision_hd_camera" ? "default" : "outline"}
              size="sm"
              className="text-sm"
            >
              HD KAMERA
            </Button>
          </div>
        )}

        {/* HiWatch Category Buttons */}
        {selectedBrand === "hiwatch" && (
          <div className="flex justify-center gap-3 mb-6">
            <Button
              onClick={() => setSelectedCategory("hiwatch_nvr")}
              variant={selectedCategory === "hiwatch_nvr" ? "default" : "outline"}
              size="sm"
              className="text-sm"
            >
              NVR
            </Button>
            <Button
              onClick={() => setSelectedCategory("hiwatch_ip_camera")}
              variant={selectedCategory === "hiwatch_ip_camera" ? "default" : "outline"}
              size="sm"
              className="text-sm"
            >
              IP KAMERA
            </Button>
            <Button
              onClick={() => setSelectedCategory("hiwatch_dvr")}
              variant={selectedCategory === "hiwatch_dvr" ? "default" : "outline"}
              size="sm"
              className="text-sm"
            >
              DVR
            </Button>
            <Button
              onClick={() => setSelectedCategory("hiwatch_hd_camera")}
              variant={selectedCategory === "hiwatch_hd_camera" ? "default" : "outline"}
              size="sm"
              className="text-sm"
            >
              HD KAMERA
            </Button>
          </div>
        )}



        {/* Products Display */}
        {!selectedBrand ? (
          <div className="text-center py-12">
            <Camera className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              {language === "uz" && "Brend tanlang"}
              {language === "ru" && "Выберите бренд"}
              {language === "en" && "Select a brand"}
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              {language === "uz" && "Mahsulotlarni ko'rish uchun yuqorida brend logosini bosing"}
              {language === "ru" && "Нажмите на логотип бренда выше, чтобы увидеть продукты"}
              {language === "en" && "Click on a brand logo above to view products"}
            </p>
          </div>
        ) : (
          <>
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <Card key={i} className="overflow-hidden">
                    <CardContent className="p-0">
                      <Skeleton className="w-full h-48" />
                      <div className="p-4">
                        <Skeleton className="h-6 w-3/4 mb-2" />
                        <Skeleton className="h-4 w-full mb-2" />
                        <Skeleton className="h-4 w-2/3 mb-3" />
                        <Skeleton className="h-10 w-full" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <Camera className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                  {language === "uz" && "Mahsulotlar topilmadi"}
                  {language === "ru" && "Товары не найдены"}
                  {language === "en" && "No products found"}
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  {language === "uz" && "Ushbu brend uchun mahsulotlar mavjud emas"}
                  {language === "ru" && "Нет доступных продуктов для этого бренда"}
                  {language === "en" && "No products available for this brand"}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                {filteredProducts.map((product) => (
                  <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer">
                    <CardContent className="p-0">
                      <div 
                        className="relative"
                        onClick={() => handleProductClick(product)}
                      >
                        <img
                          src={product.imageUrl || getProductImage(product.name)}
                          alt={product.name}
                          className="w-full h-32 object-cover hover:scale-105 transition-transform duration-200"
                          loading="lazy"
                        />
                        {!product.inStock && (
                          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                            <Badge variant="secondary" className="text-white bg-red-600 text-xs">
                              {language === "uz" && "Mavjud emas"}
                              {language === "ru" && "Нет в наличии"}
                              {language === "en" && "Out of stock"}
                            </Badge>
                          </div>
                        )}
                      </div>
                      
                      <div 
                        className="p-2"
                        onClick={() => handleProductClick(product)}
                      >
                        <h3 className="font-medium text-sm mb-1 text-gray-900 dark:text-gray-100 line-clamp-2 min-h-[2.5rem] hover:text-blue-600 transition-colors">
                          {product.name}
                        </h3>
                        
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 line-clamp-2 min-h-[2rem]">
                          {product.description.length > 60 ? product.description.substring(0, 60) + "..." : product.description}
                        </p>
                        
                        {product.features && product.features.length > 0 && (
                          <div className="mb-2">
                            <div className="flex flex-wrap gap-1">
                              {product.features.slice(0, 2).map((feature, index) => (
                                <Badge key={index} variant="outline" className="text-xs px-1 py-0">
                                  {feature.length > 8 ? feature.substring(0, 8) + "..." : feature}
                                </Badge>
                              ))}
                              {product.features.length > 2 && (
                                <Badge variant="outline" className="text-xs px-1 py-0">
                                  +{product.features.length - 2}
                                </Badge>
                              )}
                            </div>
                          </div>
                        )}
                        
                        <div className="flex flex-col gap-1">
                          <span className="text-sm font-bold text-green-600 dark:text-green-400">
                            ${product.price}
                          </span>
                        </div>
                      </div>
                      
                      <div className="p-2 pt-0">
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddToCart(product.id);
                          }}
                          disabled={!product.inStock || isAddingToCart}
                          size="sm"
                          className="w-full text-xs h-7"
                        >
                          <ShoppingCart className="w-3 h-3 mr-1" />
                          {language === "uz" && "Qo'sh"}
                          {language === "ru" && "Добав"}
                          {language === "en" && "Add"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}
      </div>
      
      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </section>
  );
}