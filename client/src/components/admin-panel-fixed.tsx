import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, EyeOff, Plus, Edit, Trash2, Save, X, Upload, Camera } from "lucide-react";
import type { Product as DBProduct } from "@shared/schema";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  brand: string;
  imageUrl: string;
  inStock: boolean;
  features: string[];
  additionalImages?: string[];
}

interface Article {
  id: number;
  title: string;
  content: string;
  date: string;
  imageUrl: string;
}

interface Store {
  id: number;
  name: string;
  address: string;
  phone: string;
  hours: string;
  rating: number;
}

interface Advertisement {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  buttonText: string;
  link: string;
  isActive?: boolean;
}

interface Master {
  id: number;
  name: string;
  specialization: string;
  region: string;
  city: string;
  phone: string;
  experience: number;
  rating: number;
  reviewCount: number;
  imageUrl?: string;
  description?: string;
  services?: string[];
  fullAddress?: string;
  telegram?: string;
  instagram?: string;
  isActive: boolean;
}

interface PasswordRecoveryBrand {
  id: number;
  name: string;
  logo: string;
  telegramSupport?: string;
  whatsappSupport?: string;
  phoneSupport?: string;
  emailSupport?: string;
  isActive: boolean;
}

const regionNames: { [key: string]: string } = {
  tashkent: "Toshkent",
  samarkand: "Samarqand",
  bukhara: "Buxoro",
  andijan: "Andijon",
  fergana: "Farg'ona",
  namangan: "Namangan",
  kashkadarya: "Qashqadaryo",
  surkhandarya: "Surxondaryo",
  jizzakh: "Jizzax",
  sirdarya: "Sirdaryo",
  navoiy: "Navoiy",
  khorezm: "Xorazm",
  karakalpakstan: "Qoraqalpog'iston"
};

export default function AdminPanel() {
  const [isVisible, setIsVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [editingStore, setEditingStore] = useState<Store | null>(null);
  const [editingAdvertisement, setEditingAdvertisement] = useState<Advertisement | null>(null);
  const [editingMaster, setEditingMaster] = useState<Master | null>(null);
  const [editingPasswordBrand, setEditingPasswordBrand] = useState<PasswordRecoveryBrand | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedRegion, setSelectedRegion] = useState<string>("all");
  const [newFeature, setNewFeature] = useState("");
  const [newImageUrl, setNewImageUrl] = useState("");
  
  // Bulk selection states
  const [selectedProducts, setSelectedProducts] = useState<Set<number>>(new Set());
  const [selectAll, setSelectAll] = useState(false);
  
  // Brand management states
  const [customBrands, setCustomBrands] = useState<string[]>([]);
  const [newBrandName, setNewBrandName] = useState("");
  const [showAddBrand, setShowAddBrand] = useState(false);

  // Yangi brend qo'shish funksiyasi
  const handleAddBrand = () => {
    if (newBrandName.trim() && !customBrands.includes(newBrandName.trim())) {
      setCustomBrands([...customBrands, newBrandName.trim()]);
      setNewBrandName("");
      setShowAddBrand(false);
    }
  };

  // Brendlar ro'yxati (asosiy + qo'shilgan)
  const getAllBrands = () => {
    const baseBrands = [
      { id: "Hikvision", name: "Hikvision", logo: "🎥" },
      { id: "Dahua", name: "Dahua", logo: "📹" },
      { id: "HiLook", name: "HiLook", logo: "👁️" },
      { id: "HiWatch", name: "HiWatch", logo: "📺" },
      { id: "EZVIZ", name: "EZVIZ", logo: "🔒" },
      { id: "Imou", name: "Imou", logo: "🏠" },
      { id: "TP-Link", name: "TP-Link", logo: "📡" },
      { id: "TVT", name: "TVT", logo: "📱" }
    ];
    
    const customBrandList = customBrands.map(brand => ({
      id: brand,
      name: brand,
      logo: "🏢"
    }));
    
    return [...baseBrands, ...customBrandList];
  };

  // Kategoriyalar ro'yxati
  const categories = [
    { id: "ip_camera", name: "IP Kameralar" },
    { id: "turbo_hd_camera", name: "HD Kameralar" },
    { id: "nvr", name: "NVR" },
    { id: "dvr", name: "DVR" },
    { id: "analog_camera", name: "Analog Kameralar" },
    { id: "accessories", name: "Aksessuarlar" }
  ];

  const getRegionDisplayName = (regionKey: string): string => {
    return regionNames[regionKey] || regionKey;
  };

  // Ustalarni filtrlash funksiyasi
  const getFilteredMasters = () => {
    if (selectedRegion === "all") return masters;
    return masters.filter(master => master.region === selectedRegion);
  };

  // Fetch products from API
  const { data: allDbProducts = [], isLoading: productsLoading } = useQuery<DBProduct[]>({
    queryKey: ["/api/products"],
  });

  // Fetch advertisements from API
  const { data: advertisements = [], isLoading: advertisementsLoading } = useQuery<Advertisement[]>({
    queryKey: ["/api/advertisements"],
  });

  // Fetch masters from API
  const { data: masters = [], isLoading: mastersLoading } = useQuery<Master[]>({
    queryKey: ["/api/masters"],
  });

  // Fetch password recovery brands from API
  const { data: passwordBrands = [], isLoading: passwordBrandsLoading } = useQuery<PasswordRecoveryBrand[]>({
    queryKey: ["/api/password-recovery-brands"],
  });

  // Mahsulotlarni bazadan filtrlash funksiyasi
  const getDisplayProducts = () => {
    if (!allDbProducts) return [];
    
    let filtered = allDbProducts;
    
    // Brend bo'yicha filtrlash
    if (selectedBrand !== 'all') {
      filtered = filtered.filter(product => 
        product.brand?.toLowerCase() === selectedBrand.toLowerCase()
      );
    }
    
    // Kategoriya bo'yicha filtrlash
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => 
        product.category?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }
    
    return filtered;
  };

  // Tanlangan brendning ma'lumotlarini olish
  const getSelectedBrandInfo = () => {
    return getAllBrands().find(brand => brand.id.toLowerCase() === selectedBrand.toLowerCase());
  };

  // Bulk selection handlers
  const handleSelectProduct = (productId: number) => {
    const newSelected = new Set(selectedProducts);
    if (newSelected.has(productId)) {
      newSelected.delete(productId);
    } else {
      newSelected.add(productId);
    }
    setSelectedProducts(newSelected);
    setSelectAll(false);
  };

  const handleSelectAll = () => {
    const displayProducts = getDisplayProducts();
    if (selectAll) {
      setSelectedProducts(new Set());
      setSelectAll(false);
    } else {
      setSelectedProducts(new Set(displayProducts.map(p => p.id)));
      setSelectAll(true);
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedProducts.size === 0) {
      alert('Hech qanday mahsulot tanlanmagan');
      return;
    }

    if (confirm(`${selectedProducts.size} ta mahsulotni o'chirmoqchimisiz?`)) {
      try {
        for (const productId of Array.from(selectedProducts)) {
          await fetch(`/api/products/${productId}`, {
            method: 'DELETE'
          });
        }
        
        queryClient.invalidateQueries({ queryKey: ['/api/products'] });
        setSelectedProducts(new Set());
        setSelectAll(false);
        alert(`${selectedProducts.size} ta mahsulot o'chirildi`);
      } catch (error) {
        alert('Mahsulotlarni o\'chirishda xatolik yuz berdi');
      }
    }
  };

  const handleSaveProduct = async () => {
    if (!editingProduct) return;
    
    try {
      if (editingProduct.id === 0) {
        // Yangi mahsulot qo'shish
        const response = await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: editingProduct.name,
            description: editingProduct.description,
            price: editingProduct.price,
            category: editingProduct.category,
            brand: editingProduct.brand,
            imageUrl: editingProduct.imageUrl,
            inStock: editingProduct.inStock,
            features: editingProduct.features,
            additionalImages: editingProduct.additionalImages || []
          })
        });
        
        if (response.ok) {
          queryClient.invalidateQueries({ queryKey: ['/api/products'] });
          setEditingProduct(null);
        } else {
          alert('Mahsulot qo\'shishda xatolik yuz berdi');
        }
      } else {
        // Mahsulotni tahrirlash
        const response = await fetch(`/api/products/${editingProduct.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: editingProduct.name,
            description: editingProduct.description,
            price: editingProduct.price,
            category: editingProduct.category,
            brand: editingProduct.brand,
            imageUrl: editingProduct.imageUrl,
            inStock: editingProduct.inStock,
            features: editingProduct.features,
            additionalImages: editingProduct.additionalImages || []
          })
        });
        
        if (response.ok) {
          queryClient.invalidateQueries({ queryKey: ['/api/products'] });
          setEditingProduct(null);
        } else {
          alert('Mahsulotni tahrirlashda xatolik yuz berdi');
        }
      }
    } catch (error) {
      alert('Tarmoq xatoligi yuz berdi');
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if (confirm('Haqiqatan ham bu mahsulotni o\'chirmoqchimisiz?')) {
      try {
        const response = await fetch(`/api/products/${id}`, {
          method: 'DELETE'
        });
        
        if (response.ok) {
          queryClient.invalidateQueries({ queryKey: ['/api/products'] });
        } else {
          alert('Mahsulotni o\'chirishda xatolik yuz berdi');
        }
      } catch (error) {
        alert('Tarmoq xatoligi yuz berdi');
      }
    }
  };

  const handleDeleteAllProducts = async () => {
    if (confirm('Haqiqatan ham barcha mahsulotlarni o\'chirmoqchimisiz? Bu amalni bekor qilib bo\'lmaydi!')) {
      try {
        const response = await fetch('/api/products', {
          method: 'DELETE'
        });
        
        if (response.ok) {
          queryClient.invalidateQueries({ queryKey: ['/api/products'] });
          alert('Barcha mahsulotlar o\'chirildi');
        } else {
          alert('Mahsulotlarni o\'chirishda xatolik yuz berdi');
        }
      } catch (error) {
        alert('Tarmoq xatoligi yuz berdi');
      }
    }
  };

  const handleSaveMaster = async () => {
    if (!editingMaster) return;
    
    try {
      const masterData = {
        name: editingMaster.name,
        specialization: editingMaster.specialization,
        region: editingMaster.region,
        city: editingMaster.city,
        phone: editingMaster.phone,
        experience: editingMaster.experience,
        rating: editingMaster.rating,
        reviewCount: editingMaster.reviewCount,
        imageUrl: editingMaster.imageUrl,
        description: editingMaster.description,
        services: editingMaster.services || [],
        fullAddress: editingMaster.fullAddress,
        telegram: editingMaster.telegram,
        instagram: editingMaster.instagram,
        isActive: editingMaster.isActive
      };

      if (editingMaster.id === 0) {
        const response = await fetch('/api/masters', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(masterData)
        });
        
        if (response.ok) {
          queryClient.invalidateQueries({ queryKey: ['/api/masters'] });
          setEditingMaster(null);
        } else {
          alert('Usta qo\'shishda xatolik yuz berdi');
        }
      } else {
        const response = await fetch(`/api/masters/${editingMaster.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(masterData)
        });
        
        if (response.ok) {
          queryClient.invalidateQueries({ queryKey: ['/api/masters'] });
          setEditingMaster(null);
        } else {
          alert('Ustani tahrirlashda xatolik yuz berdi');
        }
      }
    } catch (error) {
      alert('Tarmoq xatoligi yuz berdi');
    }
  };

  const handleDeleteMaster = async (id: number) => {
    if (confirm('Haqiqatan ham bu ustani o\'chirmoqchimisiz?')) {
      try {
        const response = await fetch(`/api/masters/${id}`, {
          method: 'DELETE'
        });
        
        if (response.ok) {
          queryClient.invalidateQueries({ queryKey: ['/api/masters'] });
        } else {
          alert('Ustani o\'chirishda xatolik yuz berdi');
        }
      } catch (error) {
        alert('Tarmoq xatoligi yuz berdi');
      }
    }
  };

  if (!isVisible) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsVisible(true)}
          variant="outline"
          size="sm"
          className="bg-gray-800 text-white border-gray-600 hover:bg-gray-700"
        >
          <Eye className="h-4 w-4 mr-2" />
          Admin
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b bg-gray-800 text-white">
          <h2 className="text-xl font-bold">Admin Panel - 24kamera.uz</h2>
          <Button
            onClick={() => setIsVisible(false)}
            variant="ghost"
            size="sm"
            className="text-white hover:bg-gray-700"
          >
            <EyeOff className="h-4 w-4 mr-2" />
            Yashirish
          </Button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          <Tabs defaultValue="products" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="products">Mahsulotlar</TabsTrigger>
              <TabsTrigger value="masters">Ustalar</TabsTrigger>
              <TabsTrigger value="advertisements">Reklamalar</TabsTrigger>
              <TabsTrigger value="password-recovery">Parol tiklash</TabsTrigger>
              <TabsTrigger value="settings">Sozlamalar</TabsTrigger>
            </TabsList>

            {/* Products Tab */}
            <TabsContent value="products" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Mahsulotlar boshqaruvi</h3>
                <div className="flex gap-4 items-center">
                  <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Brend bo'yicha filtrlash" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">
                        📋 Barcha brendlar
                      </SelectItem>
                      {getAllBrands().map(brand => (
                        <SelectItem key={brand.id} value={brand.id}>
                          {brand.logo} {brand.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Kategoriyani tanlang" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">
                        📦 Barcha kategoriyalar
                      </SelectItem>
                      {categories.map(category => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Button onClick={() => setEditingProduct({ 
                    id: 0, 
                    name: '', 
                    description: '', 
                    price: 0, 
                    category: selectedCategory !== 'all' ? selectedCategory : '', 
                    brand: selectedBrand !== 'all' ? selectedBrand : '',
                    imageUrl: '', 
                    inStock: true, 
                    features: [],
                    additionalImages: []
                  })}>
                    <Plus className="h-4 w-4 mr-2" />
                    Yangi mahsulot
                  </Button>
                  
                  <Button onClick={() => setShowAddBrand(true)} variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Yangi brend
                  </Button>
                  
                  {selectedProducts.size > 0 && (
                    <Button 
                      onClick={handleDeleteSelected}
                      variant="destructive"
                      className="bg-orange-600 hover:bg-orange-700"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Tanlanganlarni o'chirish ({selectedProducts.size})
                    </Button>
                  )}
                  
                  <Button 
                    onClick={handleDeleteAllProducts}
                    variant="destructive"
                    className="bg-red-600 hover:bg-red-700"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Barchasini o'chirish
                  </Button>
                </div>
              </div>

              {/* Yangi brend qo'shish modal */}
              {showAddBrand && (
                <Card className="mb-4">
                  <CardHeader>
                    <CardTitle>Yangi brend qo'shish</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Brend nomi</label>
                      <Input 
                        value={newBrandName}
                        onChange={(e) => setNewBrandName(e.target.value)}
                        placeholder="Yangi brend nomini kiriting"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleAddBrand}>
                        <Plus className="h-4 w-4 mr-2" />
                        Qo'shish
                      </Button>
                      <Button variant="outline" onClick={() => {
                        setShowAddBrand(false);
                        setNewBrandName("");
                      }}>
                        <X className="h-4 w-4 mr-2" />
                        Bekor qilish
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Mahsulot tahrirlash */}
              {editingProduct && (
                <Card>
                  <CardHeader>
                    <CardTitle>
                      {editingProduct.id === 0 ? 'Yangi mahsulot' : 'Mahsulotni tahrirlash'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Nomi</label>
                        <Input 
                          value={editingProduct.name}
                          onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})}
                          placeholder="Mahsulot nomini kiriting"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Narxi (so'm)</label>
                        <Input 
                          type="number"
                          value={editingProduct.price}
                          onChange={(e) => setEditingProduct({...editingProduct, price: Number(e.target.value)})}
                          placeholder="0"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium">Tavsifi</label>
                      <Textarea 
                        value={editingProduct.description}
                        onChange={(e) => setEditingProduct({...editingProduct, description: e.target.value})}
                        placeholder="Mahsulot haqida batafsil ma'lumot"
                        rows={3}
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="text-sm font-medium">Kategoriya</label>
                        <Select value={editingProduct.category} onValueChange={(value) => setEditingProduct({...editingProduct, category: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Kategoriya tanlang" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map(category => (
                              <SelectItem key={category.id} value={category.id}>
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Brend</label>
                        <Select value={editingProduct.brand} onValueChange={(value) => setEditingProduct({...editingProduct, brand: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Brend tanlang" />
                          </SelectTrigger>
                          <SelectContent>
                            {getAllBrands().map(brand => (
                              <SelectItem key={brand.id} value={brand.id}>
                                {brand.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center gap-2">
                        <input 
                          type="checkbox" 
                          id="inStock"
                          checked={editingProduct.inStock}
                          onChange={(e) => setEditingProduct({...editingProduct, inStock: e.target.checked})}
                        />
                        <label htmlFor="inStock" className="text-sm font-medium">Mavjud</label>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button onClick={handleSaveProduct}>
                        <Save className="h-4 w-4 mr-2" />
                        Saqlash
                      </Button>
                      <Button variant="outline" onClick={() => setEditingProduct(null)}>
                        <X className="h-4 w-4 mr-2" />
                        Bekor qilish
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {productsLoading ? (
                <div className="col-span-full text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Mahsulotlar yuklanmoqda...</p>
                </div>
              ) : (
                <>
                  {/* Bulk Selection Controls */}
                  {getDisplayProducts().length > 0 && (
                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectAll}
                          onChange={handleSelectAll}
                          className="w-4 h-4"
                        />
                        <span className="text-sm font-medium">
                          Barchasini tanlash ({getDisplayProducts().length})
                        </span>
                      </label>
                      {selectedProducts.size > 0 && (
                        <span className="text-sm text-blue-600">
                          {selectedProducts.size} ta mahsulot tanlandi
                        </span>
                      )}
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {getDisplayProducts().map((product) => (
                      <Card key={product.id} className={`hover:shadow-md transition-shadow ${selectedProducts.has(product.id) ? 'ring-2 ring-blue-500 bg-blue-50' : ''}`}>
                        <CardContent className="p-3">
                          <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={selectedProducts.has(product.id)}
                                onChange={() => handleSelectProduct(product.id)}
                                className="w-4 h-4"
                              />
                              <img src={product.imageUrl || '/placeholder.jpg'} alt={product.name} className="w-12 h-12 object-cover rounded" />
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-sm truncate">{product.name}</h4>
                                <Badge variant="outline" className="text-xs">
                                  {product.brand}
                                </Badge>
                              </div>
                            </div>
                          
                            <p className="text-xs text-gray-600 line-clamp-2">{product.description}</p>
                          
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-bold text-primary">${product.price}</p>
                              <div className="flex gap-1">
                                <Button size="sm" variant="outline" className="h-7 w-7 p-0" onClick={() => setEditingProduct({
                                  id: product.id,
                                  name: product.name,
                                  description: product.description,
                                  price: product.price,
                                  category: product.category,
                                  brand: product.brand || '',
                                  imageUrl: product.imageUrl || '',
                                  inStock: product.inStock,
                                  features: product.features || [],
                                  additionalImages: product.additionalImages || []
                                })}>
                                  <Edit className="h-3 w-3" />
                                </Button>
                                <Button size="sm" variant="outline" className="h-7 w-7 p-0" onClick={() => handleDeleteProduct(product.id)}>
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          
                            <div className="flex items-center gap-1">
                              <Badge variant={product.inStock ? "default" : "secondary"} className="text-xs">
                                {product.inStock ? "Mavjud" : "Tugagan"}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {product.category}
                              </Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </>
              )}
            </TabsContent>

            {/* Masters Tab */}
            <TabsContent value="masters" className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold">Ustalar boshqaruvi</h3>
                  <p className="text-sm text-gray-600">{masters.length} usta</p>
                </div>
                <div className="flex gap-2">
                  <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Viloyat bo'yicha filtrlash" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Barcha viloyatlar</SelectItem>
                      {Object.entries(regionNames).map(([key, name]) => (
                        <SelectItem key={key} value={key}>{name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button 
                    onClick={() => setEditingMaster({ 
                      id: 0, 
                      name: '', 
                      specialization: '', 
                      region: selectedRegion !== 'all' ? selectedRegion : 'tashkent',
                      city: '', 
                      phone: '', 
                      experience: 1, 
                      rating: 0, 
                      reviewCount: 0, 
                      imageUrl: '', 
                      description: '', 
                      services: [], 
                      fullAddress: '', 
                      telegram: '', 
                      instagram: '', 
                      isActive: true 
                    })}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Yangi usta
                  </Button>
                </div>
              </div>

              {editingMaster && (
                <Card>
                  <CardHeader>
                    <CardTitle>{editingMaster.id === 0 ? 'Yangi usta' : 'Ustani tahrirlash'}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Ism</label>
                        <Input 
                          value={editingMaster.name}
                          onChange={(e) => setEditingMaster({...editingMaster, name: e.target.value})}
                          placeholder="Usta ismi"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Mutaxassislik</label>
                        <Input 
                          value={editingMaster.specialization}
                          onChange={(e) => setEditingMaster({...editingMaster, specialization: e.target.value})}
                          placeholder="Mutaxassislik"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Viloyat</label>
                        <Select 
                          value={editingMaster.region}
                          onValueChange={(value) => setEditingMaster({...editingMaster, region: value})}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Viloyat tanlang" />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(regionNames).map(([key, name]) => (
                              <SelectItem key={key} value={key}>
                                {name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Shahar</label>
                        <Input 
                          value={editingMaster.city}
                          onChange={(e) => setEditingMaster({...editingMaster, city: e.target.value})}
                          placeholder="Shahar nomi"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium">To'liq manzil</label>
                      <Input 
                        value={editingMaster.fullAddress || ''}
                        onChange={(e) => setEditingMaster({...editingMaster, fullAddress: e.target.value})}
                        placeholder="Batafsil manzil (ko'cha, uy raqami va h.k.)"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Telefon</label>
                        <Input 
                          value={editingMaster.phone}
                          onChange={(e) => setEditingMaster({...editingMaster, phone: e.target.value})}
                          placeholder="+998 90 123 45 67"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Tajriba (yil)</label>
                        <Input 
                          type="number"
                          min="1"
                          value={editingMaster.experience}
                          onChange={(e) => setEditingMaster({...editingMaster, experience: Number(e.target.value)})}
                          placeholder="1"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium">Tavsifi</label>
                      <Textarea 
                        value={editingMaster.description || ''}
                        onChange={(e) => setEditingMaster({...editingMaster, description: e.target.value})}
                        placeholder="Usta haqida qo'shimcha ma'lumot"
                        rows={3}
                      />
                    </div>

                    <div className="flex gap-2">
                      <Button onClick={handleSaveMaster}>
                        <Save className="h-4 w-4 mr-2" />
                        Saqlash
                      </Button>
                      <Button variant="outline" onClick={() => setEditingMaster(null)}>
                        <X className="h-4 w-4 mr-2" />
                        Bekor qilish
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="grid gap-4">
                {getFilteredMasters().map((master) => (
                  <Card key={master.id}>
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                          {master.imageUrl ? (
                            <img 
                              src={master.imageUrl} 
                              alt={master.name}
                              className="w-full h-full object-cover rounded-full"
                            />
                          ) : (
                            <span className="text-2xl">👨‍🔧</span>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-semibold">{master.name}</h4>
                              <p className="text-sm text-gray-600">{master.specialization}</p>
                              <p className="text-sm text-gray-500">
                                {getRegionDisplayName(master.region)}, {master.city}
                              </p>
                              {master.fullAddress && (
                                <p className="text-xs text-gray-400">{master.fullAddress}</p>
                              )}
                            </div>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline" onClick={() => setEditingMaster(master)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => handleDeleteMaster(master.id)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          <div className="mt-2 flex items-center gap-4 text-sm">
                            <span>📞 {master.phone}</span>
                            <span>⭐ {master.rating}/5</span>
                            <span>🎯 {master.experience} yil tajriba</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Other tabs can be added here */}
            <TabsContent value="advertisements" className="space-y-4">
              <div className="text-center py-8">
                <p className="text-gray-500">Reklamalar bo'limi</p>
              </div>
            </TabsContent>

            <TabsContent value="password-recovery" className="space-y-4">
              <div className="text-center py-8">
                <p className="text-gray-500">Parol tiklash bo'limi</p>
              </div>
            </TabsContent>

            <TabsContent value="settings" className="space-y-4">
              <div className="text-center py-8">
                <p className="text-gray-500">Sozlamalar bo'limi</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}