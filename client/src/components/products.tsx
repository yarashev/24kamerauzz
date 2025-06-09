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

const cameraBrands = [
  { id: "hilook", name: "Hilook", nameRu: "Hilook", nameEn: "Hilook" }
];

export default function Products() {
  const { t, language } = useLanguage();
  const { addToCart, isAddingToCart } = useCart();
  const [selectedCategory, setSelectedCategory] = useState("ip_camera");
  const [selectedBrand, setSelectedBrand] = useState("");

  const { data: allProducts = [], isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  // Ensure products is always an array
  const products = Array.isArray(allProducts) ? allProducts : [];

  // Filter products by category and brand
  const filteredProducts = selectedBrand ? products.filter(product => {
    const categoryMatch = product.category === selectedCategory;
    const brandMatch = product.name && product.name.toLowerCase().includes(selectedBrand.toLowerCase());
    return categoryMatch && brandMatch;
  }) : [];

  const handleAddToCart = (productId: number) => {
    addToCart(productId, 1);
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

        {/* Product Categories */}
        <div className="flex flex-wrap justify-center gap-4 mb-6">
          {productCategories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              onClick={() => setSelectedCategory(category.id)}
              className="font-medium"
            >
              {getCategoryName(category)}
            </Button>
          ))}
        </div>

        {/* Brand Filter */}
        <div className="mb-8">
          <h4 className="text-lg font-semibold text-center mb-4">
            {language === "uz" && "Brendlar"}
            {language === "ru" && "Бренды"}
            {language === "en" && "Brands"}
          </h4>
          <div className="flex flex-wrap justify-center gap-3">
            {cameraBrands.map((brand) => (
              <Button
                key={brand.id}
                variant={selectedBrand === brand.id ? "default" : "outline"}
                onClick={() => setSelectedBrand(brand.id)}
                className="min-w-[100px] text-sm"
                size="sm"
              >
                {getBrandName(brand)}
              </Button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        {selectedBrand ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {isLoading ? (
              // Loading skeletons
              Array.from({ length: 8 }).map((_, index) => (
                <Card key={index} className="overflow-hidden">
                  <Skeleton className="w-full h-48" />
                  <CardContent className="p-6">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-full mb-3" />
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-8 w-16" />
                      <Skeleton className="h-10 w-24" />
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              filteredProducts.map((product) => (
              <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-square bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg flex items-center justify-center mb-4 overflow-hidden relative group border-2 border-blue-200/50">
                  <Camera className="h-16 w-16 text-blue-600 group-hover:text-blue-700 transition-colors duration-300" />
                  <div className="absolute inset-0 bg-blue-500 bg-opacity-0 group-hover:bg-opacity-5 transition-opacity duration-300 rounded-lg"></div>
                </div>
                <CardContent className="p-6">
                  <h4 className="text-lg font-semibold mb-2">{product.name}</h4>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-primary">
                      {formatPrice(product.price)}
                    </span>
                    <Button
                      onClick={() => handleAddToCart(product.id)}
                      disabled={isAddingToCart || !product.inStock}
                      className="bg-accent hover:bg-accent/90 text-accent-foreground font-medium"
                    >
                      <Plus className="mr-1 h-4 w-4" />
                      {t("add-to-cart")}
                    </Button>
                  </div>
                  {!product.inStock && (
                    <Badge variant="secondary" className="mt-2">
                      {language === "uz" && "Mavjud emas"}
                      {language === "ru" && "Нет в наличии"}
                      {language === "en" && "Out of stock"}
                    </Badge>
                  )}
                </CardContent>
              </Card>
              ))
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <Camera className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h4 className="text-xl font-semibold text-gray-600 mb-2">
              {language === "uz" && "Brand tanlang"}
              {language === "ru" && "Выберите бренд"}
              {language === "en" && "Select a brand"}
            </h4>
            <p className="text-gray-500">
              {language === "uz" && "Yuqoridagi brendlardan birini tanlang va mahsulotlarni ko'ring"}
              {language === "ru" && "Выберите один из брендов выше и просмотрите продукты"}
              {language === "en" && "Choose one of the brands above to view products"}
            </p>
          </div>
        )}

        <div className="text-center mt-8">
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 font-semibold">
            {t("view-more")}
          </Button>
        </div>
      </div>
    </section>
  );
}