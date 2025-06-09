import { users, products, cartItems, chatMessages, articles, type User, type InsertUser, type Product, type InsertProduct, type CartItem, type InsertCartItem, type ChatMessage, type InsertChatMessage, type Article, type InsertArticle } from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Product methods
  getAllProducts(): Promise<Product[]>;
  getProductsByCategory(category: string): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  
  // Cart methods
  getCartItems(sessionId: string): Promise<(CartItem & { product: Product })[]>;
  addToCart(item: InsertCartItem): Promise<CartItem>;
  updateCartItem(id: number, quantity: number): Promise<CartItem | undefined>;
  removeFromCart(id: number): Promise<boolean>;
  clearCart(sessionId: string): Promise<boolean>;
  
  // Chat methods
  getChatHistory(sessionId: string): Promise<ChatMessage[]>;
  saveChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
  
  // Article methods
  getAllArticles(): Promise<Article[]>;
  getArticle(id: number): Promise<Article | undefined>;
  createArticle(article: InsertArticle): Promise<Article>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private products: Map<number, Product>;
  private cartItems: Map<number, CartItem>;
  private chatMessages: Map<number, ChatMessage>;
  private articles: Map<number, Article>;
  private currentUserId: number;
  private currentProductId: number;
  private currentCartItemId: number;
  private currentChatMessageId: number;
  private currentArticleId: number;

  constructor() {
    this.users = new Map();
    this.products = new Map();
    this.cartItems = new Map();
    this.chatMessages = new Map();
    this.articles = new Map();
    this.currentUserId = 1;
    this.currentProductId = 1;
    this.currentCartItemId = 1;
    this.currentChatMessageId = 1;
    this.currentArticleId = 1;
    
    this.seedData();
  }

  private seedData() {
    // Seed products
    const sampleProducts: InsertProduct[] = [
      {
        name: "Kamera Pro X1",
        description: "4K Ultra HD, Tungi ko'rish, AI harakat aniqlash",
        price: 199,
        category: "cameras",
        imageUrl: "https://pixabay.com/get/g4748008a1fa9bf88b1d1dc20ffe8ad96e3b5281107f2670db10d992844240bcc3ec01fd3e89075b0aba909c46cee58f29a335516feebacae152bb569673d5467_1280.jpg",
        inStock: true,
        features: ["4K Ultra HD", "Night Vision", "AI Motion Detection", "Waterproof"]
      },
      {
        name: "SmartCam 360",
        description: "360° ko'rish, Wi-Fi, Mobil ilovalar",
        price: 249,
        category: "cameras",
        imageUrl: "https://pixabay.com/get/g11e07abbcc13f473ba051b23603aa83c485359dd5de9e87d8fc29ed4dccfcf6b9140aeb076cfa8a8514c838f254b2a52ed71091ae36ba25fe33b5247bb2d7ce4_1280.jpg",
        inStock: true,
        features: ["360° View", "Wi-Fi Connectivity", "Mobile App", "Cloud Storage"]
      },
      {
        name: "Smart Doorbell HD",
        description: "Eshik qo'ng'irog'i, 1080p, Ikki tomonlama audio",
        price: 149,
        category: "doorbells",
        imageUrl: "https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300",
        inStock: true,
        features: ["1080p HD", "Two-way Audio", "Motion Detection", "Night Vision"]
      },
      {
        name: "Solar Security Kit",
        description: "Quyosh paneli bilan, Uzoq masofada ishlash",
        price: 399,
        category: "systems",
        imageUrl: "https://images.unsplash.com/photo-1509391366360-2e959784a276?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300",
        inStock: true,
        features: ["Solar Powered", "Wireless", "Remote Access", "Weather Resistant"]
      }
    ];

    sampleProducts.forEach(product => this.createProduct(product));

    // Seed articles
    const sampleArticles: InsertArticle[] = [
      {
        title: "Uy xavfsizligini oshirish bo'yicha 5 ta maslahat",
        excerpt: "Uyingizni xavfsiz qilish uchun eng muhim qadamlar va maslahatlar...",
        content: "Uy xavfsizligi haqida batafsil maqola...",
        imageUrl: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=250"
      },
      {
        title: "AI kameralar: Kelajak texnologiyasi",
        excerpt: "Sun'iy intellekt bilan jihozlangan kameralarning imkoniyatlari...",
        content: "AI kameralar haqida batafsil maqola...",
        imageUrl: "https://pixabay.com/get/g8c7699e2c6102c49a78100660af86c851d4a7b69ea9c20db3041600e0b872a05049df528a96bd445f547d363e1e2ddeaf7f45400da4723ac00e711403ac69ba7_1280.jpg"
      },
      {
        title: "Quyosh energiyasi bilan ishlaydigan xavfsizlik tizimlari",
        excerpt: "Ekologik va tejamkor xavfsizlik yechimlarining afzalliklari...",
        content: "Quyosh panellari haqida batafsil maqola...",
        imageUrl: "https://images.unsplash.com/photo-1497440001374-f26997328c1b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=250"
      }
    ];

    sampleArticles.forEach(article => this.createArticle(article));
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Product methods
  async getAllProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    return Array.from(this.products.values()).filter(product => product.category === category);
  }

  async getProduct(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = this.currentProductId++;
    const product: Product = { 
      ...insertProduct, 
      id,
      inStock: insertProduct.inStock ?? true,
      features: (insertProduct.features as string[]) || []
    };
    this.products.set(id, product);
    return product;
  }

  // Cart methods
  async getCartItems(sessionId: string): Promise<(CartItem & { product: Product })[]> {
    const items = Array.from(this.cartItems.values()).filter(item => item.sessionId === sessionId);
    return items.map(item => {
      const product = this.products.get(item.productId)!;
      return { ...item, product };
    });
  }

  async addToCart(insertItem: InsertCartItem): Promise<CartItem> {
    // Check if item already exists in cart
    const existingItem = Array.from(this.cartItems.values()).find(
      item => item.sessionId === insertItem.sessionId && item.productId === insertItem.productId
    );

    if (existingItem) {
      // Update quantity
      const updatedItem = { ...existingItem, quantity: existingItem.quantity + (insertItem.quantity || 1) };
      this.cartItems.set(existingItem.id, updatedItem);
      return updatedItem;
    }

    const id = this.currentCartItemId++;
    const cartItem: CartItem = { 
      ...insertItem, 
      id, 
      quantity: insertItem.quantity || 1,
      createdAt: new Date()
    };
    this.cartItems.set(id, cartItem);
    return cartItem;
  }

  async updateCartItem(id: number, quantity: number): Promise<CartItem | undefined> {
    const item = this.cartItems.get(id);
    if (!item) return undefined;

    const updatedItem = { ...item, quantity };
    this.cartItems.set(id, updatedItem);
    return updatedItem;
  }

  async removeFromCart(id: number): Promise<boolean> {
    return this.cartItems.delete(id);
  }

  async clearCart(sessionId: string): Promise<boolean> {
    const itemsToDelete = Array.from(this.cartItems.entries())
      .filter(([_, item]) => item.sessionId === sessionId)
      .map(([id]) => id);
    
    itemsToDelete.forEach(id => this.cartItems.delete(id));
    return true;
  }

  // Chat methods
  async getChatHistory(sessionId: string): Promise<ChatMessage[]> {
    return Array.from(this.chatMessages.values())
      .filter(message => message.sessionId === sessionId)
      .sort((a, b) => a.createdAt!.getTime() - b.createdAt!.getTime());
  }

  async saveChatMessage(insertMessage: InsertChatMessage): Promise<ChatMessage> {
    const id = this.currentChatMessageId++;
    const chatMessage: ChatMessage = {
      ...insertMessage,
      id,
      createdAt: new Date()
    };
    this.chatMessages.set(id, chatMessage);
    return chatMessage;
  }

  // Article methods
  async getAllArticles(): Promise<Article[]> {
    return Array.from(this.articles.values())
      .sort((a, b) => b.publishedAt!.getTime() - a.publishedAt!.getTime());
  }

  async getArticle(id: number): Promise<Article | undefined> {
    return this.articles.get(id);
  }

  async createArticle(insertArticle: InsertArticle): Promise<Article> {
    const id = this.currentArticleId++;
    const article: Article = {
      ...insertArticle,
      id,
      publishedAt: new Date()
    };
    this.articles.set(id, article);
    return article;
  }
}

export const storage = new MemStorage();
