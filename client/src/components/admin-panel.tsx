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

export default function AdminPanel() {
  const [isVisible, setIsVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [editingStore, setEditingStore] = useState<Store | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [newFeature, setNewFeature] = useState("");
  const [newImageUrl, setNewImageUrl] = useState("");

  // Brendlar ro'yxati
  const brands = [
    { id: "hikvision", name: "Hikvision", logo: "🎥" },
    { id: "dahua", name: "Dahua", logo: "📹" },
    { id: "hilook", name: "HiLook", logo: "👁️" },
    { id: "hiwatch", name: "HiWatch", logo: "📺" },
    { id: "ezviz", name: "EZVIZ", logo: "🔒" },
    { id: "imou", name: "Imou", logo: "🏠" },
    { id: "tp_link", name: "TP-Link", logo: "📡" },
    { id: "tvt", name: "TVT", logo: "📱" }
  ];

  // Kategoriyalar ro'yxati
  const categories = [
    { id: "ip_camera", name: "IP Kameralar" },
    { id: "turbo_hd_camera", name: "HD Kameralar" },
    { id: "nvr", name: "NVR" },
    { id: "dvr", name: "DVR" },
    { id: "analog_camera", name: "Analog Kameralar" },
    { id: "accessories", name: "Aksessuarlar" }
  ];

  // Brendlar bo'yicha mahsulotlar
  const [productsByBrand] = useState<{[key: string]: Product[]}>({
    hikvision: [
      {
        id: 1,
        name: "DS-2CD1023G0-I",
        description: "2MP HD IP kamera",
        price: 650000,
        category: "ip_camera",
        brand: "hikvision",
        imageUrl: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=300&h=200&fit=crop",
        inStock: true,
        features: ["2MP", "IR 30m", "H.265+", "PoE"],
        additionalImages: ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop"]
      },
      {
        id: 2,
        name: "DS-2CE16D0T-IR",
        description: "2MP HD-TVI Turbo kamera",
        price: 420000,
        category: "turbo_hd",
        brand: "hikvision",
        imageUrl: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=300&h=200&fit=crop",
        inStock: true,
        features: ["2MP", "IR 20m", "HD-TVI", "Plastik korpus"]
      }
    ],
    dahua: [
      {
        id: 3,
        name: "DH-IPC-HFW1230S",
        description: "2MP HD IP kamera",
        price: 580000,
        category: "ip_camera",
        brand: "dahua",
        imageUrl: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=300&h=200&fit=crop",
        inStock: true,
        features: ["2MP", "IR 30m", "H.265", "PoE", "Smart IR"]
      }
    ],
    hilook: [
      {
        id: 4,
        name: "THC-T259-MS",
        description: "2MP HD Turbo kamera",
        price: 450000,
        category: "turbo_hd",
        brand: "hilook",
        imageUrl: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=300&h=200&fit=crop",
        inStock: true,
        features: ["2MP", "ColorVu", "IR 20m", "Metal korpus"]
      }
    ],
    hiwatch: [
      {
        id: 5,
        name: "DS-T200A",
        description: "2MP HD-TVI kamera",
        price: 380000,
        category: "turbo_hd",
        brand: "hiwatch",
        imageUrl: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=300&h=200&fit=crop",
        inStock: true,
        features: ["2MP", "IR 20m", "HD-TVI"]
      }
    ],
    ezviz: [
      {
        id: 6,
        name: "C3W Pro",
        description: "2MP Wi-Fi kamera",
        price: 520000,
        category: "wifi_camera",
        brand: "ezviz",
        imageUrl: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=300&h=200&fit=crop",
        inStock: true,
        features: ["2MP", "Wi-Fi", "ColorVu", "Bulutga saqlash"]
      }
    ],
    imou: [
      {
        id: 7,
        name: "Ranger 2",
        description: "2MP Wi-Fi PTZ kamera",
        price: 750000,
        category: "wifi_camera",
        brand: "imou",
        imageUrl: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=300&h=200&fit=crop",
        inStock: true,
        features: ["2MP", "Wi-Fi", "PTZ", "Harakatni kuzatish"]
      }
    ],
    tp_link: [
      {
        id: 8,
        name: "Tapo C200",
        description: "2MP Wi-Fi kamera",
        price: 350000,
        category: "wifi_camera",
        brand: "tp_link",
        imageUrl: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=300&h=200&fit=crop",
        inStock: true,
        features: ["2MP", "Wi-Fi", "PTZ", "Tungi ko'rish"]
      }
    ],
    tvt: [
      {
        id: 9,
        name: "TD-9421S3",
        description: "2MP AHD kamera",
        price: 390000,
        category: "ahd_camera",
        brand: "tvt",
        imageUrl: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=300&h=200&fit=crop",
        inStock: true,
        features: ["2MP", "AHD", "IR 20m", "Vandal proof"]
      }
    ]
  });

  const [articles, setArticles] = useState<Article[]>([
    {
      id: 1,
      title: "Uy xavfsizligini oshirish bo'yicha maslahatlar",
      content: "Zamonaviy xavfsizlik tizimlari...",
      date: "2025-01-09",
      imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop"
    }
  ]);

  const [stores, setStores] = useState<Store[]>([
    {
      id: 1,
      name: "24kamera Tashkent",
      address: "Toshkent sh., Yunusobod t., Abdulla Qodiriy 5",
      phone: "+998 71 123-45-67",
      hours: "09:00 - 19:00",
      rating: 4.8
    }
  ]);

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
          // Mahsulotlar ro'yxatini yangilash
          queryClient.invalidateQueries({ queryKey: ['/api/products'] });
          setEditingProduct(null);
        } else {
          alert('Mahsulot qo\'shishda xatolik yuz berdi');
        }
      } else {
        // Mavjud mahsulotni tahrirlash
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
          // Mahsulotlar ro'yxatini yangilash
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
          // Mahsulotlar ro'yxatini yangilash
          queryClient.invalidateQueries({ queryKey: ['/api/products'] });
        } else {
          alert('Mahsulotni o\'chirishda xatolik yuz berdi');
        }
      } catch (error) {
        alert('Tarmoq xatoligi yuz berdi');
      }
    }
  };

  const handleSaveArticle = () => {
    if (!editingArticle) return;
    
    if (editingArticle.id === 0) {
      // Yangi yangilik qo'shish
      if (articles.length >= 50) {
        alert('Maksimal 50 ta yangilik qo\'shish mumkin');
        return;
      }
      
      const newArticle = {
        ...editingArticle,
        id: Math.max(...articles.map(a => a.id), 0) + 1
      };
      setArticles([...articles, newArticle]);
    } else {
      // Mavjud yangilikni tahrirlash
      setArticles(articles.map(article => 
        article.id === editingArticle.id ? editingArticle : article
      ));
    }
    setEditingArticle(null);
  };

  const handleSaveStore = () => {
    if (!editingStore) return;
    
    if (editingStore.id === 0) {
      // Yangi do'kon qo'shish
      if (stores.length >= 50) {
        alert('Maksimal 50 ta do\'kon qo\'shish mumkin');
        return;
      }
      
      const newStore = {
        ...editingStore,
        id: Math.max(...stores.map(s => s.id), 0) + 1
      };
      setStores([...stores, newStore]);
    } else {
      // Mavjud do'konni tahrirlash
      setStores(stores.map(store => 
        store.id === editingStore.id ? editingStore : store
      ));
    }
    setEditingStore(null);
  };

  const handleDeleteArticle = (id: number) => {
    if (confirm('Haqiqatan ham bu yangilikni o\'chirmoqchimisiz?')) {
      setArticles(articles.filter(article => article.id !== id));
    }
  };

  const handleDeleteStore = (id: number) => {
    if (confirm('Haqiqatan ham bu do\'konni o\'chirmoqchimisiz?')) {
      setStores(stores.filter(store => store.id !== id));
    }
  };

  const handleAddFeature = () => {
    if (editingProduct && newFeature.trim()) {
      setEditingProduct({
        ...editingProduct,
        features: [...editingProduct.features, newFeature.trim()]
      });
      setNewFeature("");
    }
  };

  const handleRemoveFeature = (index: number) => {
    if (editingProduct) {
      const newFeatures = editingProduct.features.filter((_, i) => i !== index);
      setEditingProduct({ ...editingProduct, features: newFeatures });
    }
  };

  const handleAddImage = () => {
    if (editingProduct && newImageUrl.trim()) {
      const additionalImages = editingProduct.additionalImages || [];
      setEditingProduct({
        ...editingProduct,
        additionalImages: [...additionalImages, newImageUrl.trim()]
      });
      setNewImageUrl("");
    }
  };

  const handleRemoveImage = (index: number) => {
    if (editingProduct && editingProduct.additionalImages) {
      const newImages = editingProduct.additionalImages.filter((_, i) => i !== index);
      setEditingProduct({ ...editingProduct, additionalImages: newImages });
    }
  };

  // Fetch real products from API
  const { data: allDbProducts = [], isLoading: productsLoading } = useQuery<DBProduct[]>({
    queryKey: ["/api/products"],
  });

  const getCurrentBrandProducts = () => {
    if (selectedBrand === 'all') return allDbProducts;
    return allDbProducts.filter(product => {
      const brandMap: { [key: string]: string } = {
        "ezviz": "EZVIZ",
        "hilook": "HiLook", 
        "hikvision": "Hikvision",
        "hiwatch": "HiWatch",
        "dahua": "Dahua",
        "tvt": "TVT",
        "imou": "Imou",
        "tplink": "TP-Link"
      };
      return product.brand === brandMap[selectedBrand];
    });
  };

  const getAllProducts = () => {
    return allDbProducts;
  };

  const getSelectedBrandInfo = () => {
    return brands.find(b => b.id === selectedBrand);
  };

  const getDisplayProducts = () => {
    let products = getCurrentBrandProducts();
    
    // Kategoriya bo'yicha filterlash
    if (selectedCategory !== 'all') {
      products = products.filter(product => product.category === selectedCategory);
    }
    
    return products;
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
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="products">Mahsulotlar</TabsTrigger>
              <TabsTrigger value="articles">Yangiliklar</TabsTrigger>
              <TabsTrigger value="stores">Do'konlar</TabsTrigger>
              <TabsTrigger value="settings">Sozlamalar</TabsTrigger>
            </TabsList>

            {/* Products Tab */}
            <TabsContent value="products" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Mahsulotlar boshqaruvi</h3>
                <div className="flex gap-4 items-center">
                  <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Brendni tanlang" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">
                        📋 Barcha brendlar
                      </SelectItem>
                      {brands.map(brand => (
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
                    category: '', 
                    brand: selectedBrand,
                    imageUrl: '', 
                    inStock: true, 
                    features: [],
                    additionalImages: []
                  })}>
                    <Plus className="h-4 w-4 mr-2" />
                    Yangi mahsulot
                  </Button>
                </div>
              </div>

              {/* Selected Brand Info */}
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">
                      {selectedBrand === 'all' ? '📋' : getSelectedBrandInfo()?.logo}
                    </span>
                    <div>
                      <h4 className="font-semibold text-lg">
                        {selectedBrand === 'all' ? 'Barcha mahsulotlar' : getSelectedBrandInfo()?.name}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {selectedBrand === 'all' 
                          ? `${getAllProducts().length} ta mahsulot (${brands.length} ta brenddan)`
                          : `${getCurrentBrandProducts().length} ta mahsulot mavjud`
                        }
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Statistika */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <Card>
                  <CardContent className="p-3 text-center">
                    <div className="text-2xl font-bold text-blue-600">{getDisplayProducts().length}</div>
                    <div className="text-sm text-gray-600">
                      {selectedBrand === 'all' && selectedCategory === 'all' ? 'Jami mahsulotlar' :
                       selectedBrand !== 'all' && selectedCategory === 'all' ? `${getSelectedBrandInfo()?.name} mahsulotlari` :
                       selectedBrand === 'all' && selectedCategory !== 'all' ? `${categories.find(c => c.id === selectedCategory)?.name}` :
                       `${getSelectedBrandInfo()?.name} - ${categories.find(c => c.id === selectedCategory)?.name}`}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-3 text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {getDisplayProducts().filter(p => p.inStock).length}
                    </div>
                    <div className="text-sm text-gray-600">Mavjud</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-3 text-center">
                    <div className="text-2xl font-bold text-red-600">
                      {getDisplayProducts().filter(p => !p.inStock).length}
                    </div>
                    <div className="text-sm text-gray-600">Tugagan</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-3 text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {allDbProducts.length}
                    </div>
                    <div className="text-sm text-gray-600">Umumiy</div>
                  </CardContent>
                </Card>
              </div>

              {editingProduct && (
                <Card>
                  <CardHeader>
                    <CardTitle>
                      {editingProduct.id === 0 ? 'Yangi mahsulot' : 'Mahsulotni tahrirlash'} - {getSelectedBrandInfo()?.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Asosiy ma'lumotlar */}
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
                            <SelectItem value="ip_camera">IP Kameralar</SelectItem>
                            <SelectItem value="turbo_hd_camera">HD Kameralar</SelectItem>
                            <SelectItem value="nvr">NVR</SelectItem>
                            <SelectItem value="dvr">DVR</SelectItem>
                            <SelectItem value="analog_camera">Analog Kameralar</SelectItem>
                            <SelectItem value="accessories">Aksessuarlar</SelectItem>
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
                            <SelectItem value="Hikvision">Hikvision</SelectItem>
                            <SelectItem value="HiLook">HiLook</SelectItem>
                            <SelectItem value="HiWatch">HiWatch</SelectItem>
                            <SelectItem value="EZVIZ">EZVIZ</SelectItem>
                            <SelectItem value="Dahua">Dahua</SelectItem>
                            <SelectItem value="TVT">TVT</SelectItem>
                            <SelectItem value="Imou">Imou</SelectItem>
                            <SelectItem value="TP-Link">TP-Link</SelectItem>
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

                    {/* Asosiy rasm */}
                    <div>
                      <label className="text-sm font-medium">Asosiy rasm URL</label>
                      <div className="flex gap-2">
                        <Input 
                          value={editingProduct.imageUrl}
                          onChange={(e) => setEditingProduct({...editingProduct, imageUrl: e.target.value})}
                          placeholder="https://example.com/image.jpg"
                        />
                        <Button type="button" variant="outline" size="sm">
                          <Upload className="h-4 w-4" />
                        </Button>
                      </div>
                      {editingProduct.imageUrl && (
                        <img src={editingProduct.imageUrl} alt="Preview" className="mt-2 w-20 h-20 object-cover rounded border" />
                      )}
                    </div>

                    {/* Qo'shimcha rasmlar */}
                    <div>
                      <label className="text-sm font-medium">Qo'shimcha rasmlar</label>
                      <div className="flex gap-2 mb-2">
                        <Input 
                          value={newImageUrl}
                          onChange={(e) => setNewImageUrl(e.target.value)}
                          placeholder="Yangi rasm URL"
                        />
                        <Button type="button" onClick={handleAddImage} variant="outline" size="sm">
                          <Plus className="h-4 w-4 mr-1" />
                          Qo'shish
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {editingProduct.additionalImages?.map((imageUrl, index) => (
                          <div key={index} className="relative">
                            <img src={imageUrl} alt={`Additional ${index}`} className="w-16 h-16 object-cover rounded border" />
                            <Button
                              type="button"
                              onClick={() => handleRemoveImage(index)}
                              variant="destructive"
                              size="sm"
                              className="absolute -top-1 -right-1 w-5 h-5 p-0"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Xususiyatlar */}
                    <div>
                      <label className="text-sm font-medium">Xususiyatlar</label>
                      <div className="flex gap-2 mb-2">
                        <Input 
                          value={newFeature}
                          onChange={(e) => setNewFeature(e.target.value)}
                          placeholder="Yangi xususiyat (masalan: 2MP, IR 30m)"
                          onKeyPress={(e) => e.key === 'Enter' && handleAddFeature()}
                        />
                        <Button type="button" onClick={handleAddFeature} variant="outline" size="sm">
                          <Plus className="h-4 w-4 mr-1" />
                          Qo'shish
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {editingProduct.features.map((feature, index) => (
                          <Badge key={index} variant="secondary" className="flex items-center gap-1">
                            {feature}
                            <Button
                              type="button"
                              onClick={() => handleRemoveFeature(index)}
                              variant="ghost"
                              size="sm"
                              className="h-4 w-4 p-0 hover:bg-transparent"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2 pt-4 border-t">
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {getDisplayProducts().map((product) => (
                    <Card key={product.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-3">
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-2">
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
                          
                          <div className="flex flex-wrap gap-1">
                            {(product.features || []).slice(0, 2).map((feature, index) => (
                              <span key={index} className="text-xs bg-gray-100 px-1 py-0.5 rounded">
                                {feature}
                              </span>
                            ))}
                            {(product.features || []).length > 2 && (
                              <span className="text-xs text-gray-500">+{(product.features || []).length - 2}</span>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
              
              {getDisplayProducts().length === 0 && selectedBrand !== 'all' && !productsLoading && (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Camera className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <h4 className="text-lg font-medium text-gray-600 mb-2">
                      {getSelectedBrandInfo()?.name} brendida mahsulotlar yo'q
                    </h4>
                    <p className="text-sm text-gray-500 mb-4">
                      Yangi mahsulot qo'shish uchun yuqoridagi "Yangi mahsulot" tugmasini bosing
                    </p>
                    <Button onClick={() => setEditingProduct({ 
                      id: 0, 
                      name: '', 
                      description: '', 
                      price: 0, 
                      category: '', 
                      brand: selectedBrand,
                      imageUrl: '', 
                      inStock: true, 
                      features: [],
                      additionalImages: []
                    })}>
                      <Plus className="h-4 w-4 mr-2" />
                      Birinchi mahsulotni qo'shish
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Articles Tab */}
            <TabsContent value="articles" className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold">Yangiliklar boshqaruvi</h3>
                  <p className="text-sm text-gray-600">{articles.length}/50 yangilik</p>
                </div>
                <Button 
                  onClick={() => {
                    if (articles.length >= 50) {
                      alert('Maksimal 50 ta yangilik qo\'shish mumkin');
                      return;
                    }
                    setEditingArticle({ id: 0, title: '', content: '', date: new Date().toISOString().split('T')[0], imageUrl: '' });
                  }}
                  disabled={articles.length >= 50}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Yangi yangilik
                </Button>
              </div>

              {editingArticle && (
                <Card>
                  <CardHeader>
                    <CardTitle>{editingArticle.id === 0 ? 'Yangi yangilik' : 'Yangilikni tahrirlash'}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Sarlavha</label>
                      <Input 
                        value={editingArticle.title}
                        onChange={(e) => setEditingArticle({...editingArticle, title: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Matn</label>
                      <Textarea 
                        value={editingArticle.content}
                        onChange={(e) => setEditingArticle({...editingArticle, content: e.target.value})}
                        rows={5}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Sana</label>
                        <Input 
                          type="date"
                          value={editingArticle.date}
                          onChange={(e) => setEditingArticle({...editingArticle, date: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Rasm URL</label>
                        <Input 
                          value={editingArticle.imageUrl}
                          onChange={(e) => setEditingArticle({...editingArticle, imageUrl: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleSaveArticle}>
                        <Save className="h-4 w-4 mr-2" />
                        Saqlash
                      </Button>
                      <Button variant="outline" onClick={() => setEditingArticle(null)}>
                        <X className="h-4 w-4 mr-2" />
                        Bekor qilish
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="grid gap-4">
                {articles.map((article) => (
                  <Card key={article.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex gap-4">
                          <img src={article.imageUrl} alt={article.title} className="w-16 h-16 object-cover rounded" />
                          <div>
                            <h4 className="font-semibold">{article.title}</h4>
                            <p className="text-sm text-gray-600">{article.content.substring(0, 100)}...</p>
                            <p className="text-sm text-gray-500">{article.date}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => setEditingArticle(article)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleDeleteArticle(article.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Stores Tab */}
            <TabsContent value="stores" className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold">Do'konlar boshqaruvi</h3>
                  <p className="text-sm text-gray-600">{stores.length}/50 do'kon</p>
                </div>
                <Button 
                  onClick={() => {
                    if (stores.length >= 50) {
                      alert('Maksimal 50 ta do\'kon qo\'shish mumkin');
                      return;
                    }
                    setEditingStore({ id: 0, name: '', address: '', phone: '', hours: '', rating: 5.0 });
                  }}
                  disabled={stores.length >= 50}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Yangi do'kon
                </Button>
              </div>

              {editingStore && (
                <Card>
                  <CardHeader>
                    <CardTitle>{editingStore.id === 0 ? 'Yangi do\'kon' : 'Do\'konni tahrirlash'}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Nomi</label>
                        <Input 
                          value={editingStore.name}
                          onChange={(e) => setEditingStore({...editingStore, name: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Telefon</label>
                        <Input 
                          value={editingStore.phone}
                          onChange={(e) => setEditingStore({...editingStore, phone: e.target.value})}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Manzil</label>
                      <Textarea 
                        value={editingStore.address}
                        onChange={(e) => setEditingStore({...editingStore, address: e.target.value})}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Ish vaqti</label>
                        <Input 
                          value={editingStore.hours}
                          onChange={(e) => setEditingStore({...editingStore, hours: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Reyting</label>
                        <Input 
                          type="number"
                          step="0.1"
                          min="1"
                          max="5"
                          value={editingStore.rating}
                          onChange={(e) => setEditingStore({...editingStore, rating: Number(e.target.value)})}
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleSaveStore}>
                        <Save className="h-4 w-4 mr-2" />
                        Saqlash
                      </Button>
                      <Button variant="outline" onClick={() => setEditingStore(null)}>
                        <X className="h-4 w-4 mr-2" />
                        Bekor qilish
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="grid gap-4">
                {stores.map((store) => (
                  <Card key={store.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold">{store.name}</h4>
                          <p className="text-sm text-gray-600">{store.address}</p>
                          <p className="text-sm">{store.phone}</p>
                          <p className="text-sm">{store.hours}</p>
                          <Badge>★ {store.rating}</Badge>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => setEditingStore(store)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleDeleteStore(store.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Umumiy sozlamalar</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Sayt nomi</label>
                    <Input defaultValue="24kamera.uz" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Asosiy telefon</label>
                    <Input defaultValue="+998 71 123-45-67" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Email</label>
                    <Input defaultValue="info@24kamera.uz" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Manzil</label>
                    <Textarea defaultValue="Toshkent sh., Yunusobod tumani" />
                  </div>
                  <Button>
                    <Save className="h-4 w-4 mr-2" />
                    Sozlamalarni saqlash
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}