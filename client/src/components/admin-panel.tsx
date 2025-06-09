import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Eye, EyeOff, Plus, Edit, Trash2, Save, X } from "lucide-react";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  inStock: boolean;
  features: string[];
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

  // Sample data for demonstration
  const [products] = useState<Product[]>([
    {
      id: 1,
      name: "THC-T259-MS",
      description: "2MP HD Turbo kamera",
      price: 450000,
      category: "hilook_turbo",
      imageUrl: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=300&h=200&fit=crop",
      inStock: true,
      features: ["2MP", "HD", "Night Vision"]
    }
  ]);

  const [articles] = useState<Article[]>([
    {
      id: 1,
      title: "Uy xavfsizligini oshirish bo'yicha maslahatlar",
      content: "Zamonaviy xavfsizlik tizimlari...",
      date: "2025-01-09",
      imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop"
    }
  ]);

  const [stores] = useState<Store[]>([
    {
      id: 1,
      name: "24kamera Tashkent",
      address: "Toshkent sh., Yunusobod t., Abdulla Qodiriy 5",
      phone: "+998 71 123-45-67",
      hours: "09:00 - 19:00",
      rating: 4.8
    }
  ]);

  const handleSaveProduct = () => {
    // Save product logic
    setEditingProduct(null);
  };

  const handleSaveArticle = () => {
    // Save article logic
    setEditingArticle(null);
  };

  const handleSaveStore = () => {
    // Save store logic
    setEditingStore(null);
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
                <Button onClick={() => setEditingProduct({ id: 0, name: '', description: '', price: 0, category: '', imageUrl: '', inStock: true, features: [] })}>
                  <Plus className="h-4 w-4 mr-2" />
                  Yangi mahsulot
                </Button>
              </div>

              {editingProduct && (
                <Card>
                  <CardHeader>
                    <CardTitle>{editingProduct.id === 0 ? 'Yangi mahsulot' : 'Mahsulotni tahrirlash'}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Nomi</label>
                        <Input 
                          value={editingProduct.name}
                          onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Narxi (so'm)</label>
                        <Input 
                          type="number"
                          value={editingProduct.price}
                          onChange={(e) => setEditingProduct({...editingProduct, price: Number(e.target.value)})}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Tavsifi</label>
                      <Textarea 
                        value={editingProduct.description}
                        onChange={(e) => setEditingProduct({...editingProduct, description: e.target.value})}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Kategoriya</label>
                        <Input 
                          value={editingProduct.category}
                          onChange={(e) => setEditingProduct({...editingProduct, category: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Rasm URL</label>
                        <Input 
                          value={editingProduct.imageUrl}
                          onChange={(e) => setEditingProduct({...editingProduct, imageUrl: e.target.value})}
                        />
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

              <div className="grid gap-4">
                {products.map((product) => (
                  <Card key={product.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex gap-4">
                          <img src={product.imageUrl} alt={product.name} className="w-16 h-16 object-cover rounded" />
                          <div>
                            <h4 className="font-semibold">{product.name}</h4>
                            <p className="text-sm text-gray-600">{product.description}</p>
                            <p className="text-lg font-bold text-primary">{product.price.toLocaleString()} so'm</p>
                            <Badge variant={product.inStock ? "default" : "secondary"}>
                              {product.inStock ? "Mavjud" : "Tugagan"}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => setEditingProduct(product)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Articles Tab */}
            <TabsContent value="articles" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Yangiliklar boshqaruvi</h3>
                <Button onClick={() => setEditingArticle({ id: 0, title: '', content: '', date: new Date().toISOString().split('T')[0], imageUrl: '' })}>
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
                          <Button size="sm" variant="outline">
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
                <h3 className="text-lg font-semibold">Do'konlar boshqaruvi</h3>
                <Button onClick={() => setEditingStore({ id: 0, name: '', address: '', phone: '', hours: '', rating: 5.0 })}>
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
                          <Button size="sm" variant="outline">
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