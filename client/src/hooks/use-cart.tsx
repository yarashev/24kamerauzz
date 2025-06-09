import { createContext, useContext, useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { Product, CartItem } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

interface CartContextType {
  cartItems: (CartItem & { product: Product })[];
  cartCount: number;
  isLoading: boolean;
  addToCart: (productId: number, quantity?: number) => void;
  updateQuantity: (itemId: number, quantity: number) => void;
  removeFromCart: (itemId: number) => void;
  clearCart: () => void;
  isAddingToCart: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: cartItems = [], isLoading } = useQuery({
    queryKey: ["/api/cart"],
    staleTime: 0,
  });

  const addToCartMutation = useMutation({
    mutationFn: async ({ productId, quantity = 1 }: { productId: number; quantity?: number }) => {
      const response = await apiRequest("POST", "/api/cart", { productId, quantity });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      toast({
        title: "Mahsulot qo'shildi",
        description: "Mahsulot savatchaga muvaffaqiyatli qo'shildi",
      });
    },
    onError: () => {
      toast({
        title: "Xatolik",
        description: "Mahsulotni qo'shishda xatolik yuz berdi",
        variant: "destructive",
      });
    },
  });

  const updateQuantityMutation = useMutation({
    mutationFn: async ({ itemId, quantity }: { itemId: number; quantity: number }) => {
      const response = await apiRequest("PATCH", `/api/cart/${itemId}`, { quantity });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
    },
    onError: () => {
      toast({
        title: "Xatolik",
        description: "Miqdorni yangilashda xatolik yuz berdi",
        variant: "destructive",
      });
    },
  });

  const removeFromCartMutation = useMutation({
    mutationFn: async (itemId: number) => {
      const response = await apiRequest("DELETE", `/api/cart/${itemId}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      toast({
        title: "Mahsulot o'chirildi",
        description: "Mahsulot savatchadan o'chirildi",
      });
    },
    onError: () => {
      toast({
        title: "Xatolik",
        description: "Mahsulotni o'chirishda xatolik yuz berdi",
        variant: "destructive",
      });
    },
  });

  const clearCartMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("DELETE", "/api/cart");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      toast({
        title: "Savat tozalandi",
        description: "Barcha mahsulotlar savatchadan o'chirildi",
      });
    },
    onError: () => {
      toast({
        title: "Xatolik",
        description: "Savatchani tozalashda xatolik yuz berdi",
        variant: "destructive",
      });
    },
  });

  const cartCount = cartItems.reduce((total: number, item: any) => total + item.quantity, 0);

  const addToCart = (productId: number, quantity = 1) => {
    addToCartMutation.mutate({ productId, quantity });
  };

  const updateQuantity = (itemId: number, quantity: number) => {
    updateQuantityMutation.mutate({ itemId, quantity });
  };

  const removeFromCart = (itemId: number) => {
    removeFromCartMutation.mutate(itemId);
  };

  const clearCart = () => {
    clearCartMutation.mutate();
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        isLoading,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        isAddingToCart: addToCartMutation.isPending,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
