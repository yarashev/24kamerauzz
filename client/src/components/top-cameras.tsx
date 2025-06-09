import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Camera } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";
import { useCart } from "@/hooks/use-cart";
import { formatPrice } from "@/lib/products";
import type { Product } from "@shared/schema";

const topCameras = [
  { id: 69, name: "Hilook IPC-B140H", price: 65, category: "ip_camera" },
  { id: 70, name: "Hilook IPC-D140H", price: 62, category: "ip_camera" },
  { id: 83, name: "Ezviz CS-H1C (1080P)", price: 30, category: "ip_camera" },
  { id: 84, name: "Ezviz CS-H6C Pro (1080P)", price: 30, category: "ip_camera" },
  { id: 85, name: "Ezviz CS-H6C Pro (4MP)", price: 44, category: "ip_camera" },
  { id: 87, name: "Ezviz CS-H7C (4MP)", price: 52, category: "ip_camera" }
];

export default function TopCameras() {
  const { language, t } = useLanguage();
  const { addToCart, isAddingToCart } = useCart();

  const { data: allProducts = [], isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const products = Array.isArray(allProducts) ? allProducts : [];
  
  // Get top cameras from the full product list
  const topCameraProducts = topCameras.map(topCamera => 
    products.find(product => product.id === topCamera.id)
  ).filter(Boolean) as Product[];

  const handleAddToCart = (productId: number) => {
    addToCart(productId, 1);
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-secondary mb-4">
            {language === "uz" && "Top kameralar"}
            {language === "ru" && "Топ камеры"}
            {language === "en" && "Top Cameras"}
          </h3>
          <p className="text-gray-600 text-lg">
            {language === "uz" && "Eng mashhur va ishonchli kameralar"}
            {language === "ru" && "Самые популярные и надежные камеры"}
            {language === "en" && "Most popular and reliable cameras"}
          </p>
        </div>

        {/* Top Cameras Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
          {isLoading ? (
            // Loading skeletons
            Array.from({ length: 6 }).map((_, index) => (
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
            topCameraProducts.map((product) => (
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
      </div>
    </section>
  );
}