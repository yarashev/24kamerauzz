import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ShoppingCart, Plus } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";
import { useCart } from "@/hooks/use-cart";
import { productCategories, formatPrice } from "@/lib/products";
import type { Product } from "@shared/schema";

const cameraBrands = [
  { id: "all", name: "Barcha", nameRu: "Все", nameEn: "All" },
  { id: "hikvision", name: "Hikvision", nameRu: "Hikvision", nameEn: "Hikvision" },
  { id: "hilook", name: "Hilook", nameRu: "Hilook", nameEn: "Hilook" },
  { id: "hiwatch", name: "Hiwatch", nameRu: "Hiwatch", nameEn: "Hiwatch" },
  { id: "ezviz", name: "Ezviz", nameRu: "Ezviz", nameEn: "Ezviz" },
  { id: "dahua", name: "Dahua", nameRu: "Dahua", nameEn: "Dahua" },
  { id: "imou", name: "Imou", nameRu: "Imou", nameEn: "Imou" }
];

export default function Products() {
  const { t, language } = useLanguage();
  const { addToCart, isAddingToCart } = useCart();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedBrand, setSelectedBrand] = useState("all");

  const { data: allProducts = [], isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  // Filter products by category and brand
  const filteredProducts = allProducts.filter(product => {
    const categoryMatch = selectedCategory === "all" || product.category === selectedCategory;
    const brandMatch = selectedBrand === "all" || 
      (product.name && product.name.toLowerCase().includes(selectedBrand.toLowerCase()));
    return categoryMatch && brandMatch;
  });

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
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
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

        <div className="text-center mt-8">
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 font-semibold">
            {t("view-more")}
          </Button>
        </div>
      </div>
    </section>
  );
}
