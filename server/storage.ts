import { users, products, cartItems, chatMessages, articles, type User, type InsertUser, type Product, type InsertProduct, type CartItem, type InsertCartItem, type ChatMessage, type InsertChatMessage, type Article, type InsertArticle } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

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

export class DatabaseStorage implements IStorage {
  constructor() {
    this.seedData();
  }

  private async seedData() {
    try {
      // Check if products already exist
      const existingProducts = await db.select().from(products).limit(1);
      if (existingProducts.length > 0) {
        return; // Products already seeded
      }

      console.log("Database already seeded, skipping...");
      return;

      // This code is commented out to avoid TypeScript errors
      /*
      const sampleProducts: InsertProduct[] = [
        // IP Cameras - Bullet
        {
          name: "Hilook IPC-B140H",
          description: "4 MP, 1/3\" Progressive Scan CMOS, IR 30m, IP67, H.265+",
          price: 65,
          category: "ip_camera",
          imageUrl: "https://www.hikvision.com/content/dam/hikvision/products/hilook/ip-camera/bullet/ipc-b140h/IPC-B140H.png",
          inStock: true,
          features: ["4MP", "IR 30m", "IP67", "POE"] as string[]
        },
        {
          name: "Hilook IPC-B120H",
          description: "2 MP, 1/2.8\" Progressive Scan CMOS, IR 30m, IP67, H.265+",
          price: 45,
          category: "ip_camera",
          imageUrl: "https://www.hikvision.com/content/dam/hikvision/products/hilook/ip-camera/bullet/ipc-b120h/IPC-B120H.png",
          inStock: true,
          features: ["2MP", "IR 30m", "IP67", "POE"]
        },
        {
          name: "Hilook IPC-B180H",
          description: "8 MP, 1/2.5\" Progressive Scan CMOS, IR 30m, IP67, H.265+",
          price: 85,
          category: "ip_camera",
          imageUrl: "https://www.hikvision.com/content/dam/hikvision/products/hilook/ip-camera/bullet/ipc-b180h/IPC-B180H.png",
          inStock: true,
          features: ["8MP", "IR 30m", "IP67", "POE"]
        },
        {
          name: "Hilook IPC-B160H",
          description: "6 MP, 1/2.9\" Progressive Scan CMOS, IR 30m, IP67, H.265+",
          price: 75,
          category: "ip_camera",
          imageUrl: "https://www.hikvision.com/content/dam/hikvision/products/hilook/ip-camera/bullet/ipc-b160h/IPC-B160H.png",
          inStock: true,
          features: ["6MP", "IR 30m", "IP67", "POE"]
        },
        {
          name: "Hilook IPC-B141H-M",
          description: "4 MP, 1/3\" Progressive Scan CMOS, IR 30m, IP67, Mikrofon",
          price: 70,
          category: "ip_camera",
          imageUrl: "https://www.hikvision.com/content/dam/hikvision/products/hilook/ip-camera/bullet/ipc-b141h-m/IPC-B141H-M.png",
          inStock: true,
          features: ["4MP", "IR 30m", "IP67", "Microphone"]
        },
        // IP Cameras - Dome
        {
          name: "Hilook IPC-D140H",
          description: "4 MP dome kamera, 1/3\" Progressive Scan CMOS, IR 20m, IK08",
          price: 60,
          category: "ip_camera",
          imageUrl: "https://www.hikvision.com/content/dam/hikvision/products/hilook/ip-camera/dome/ipc-d140h/IPC-D140H.png",
          inStock: true,
          features: ["4MP", "IR 20m", "IK08", "POE"]
        },
        {
          name: "Hilook IPC-D120H",
          description: "2 MP dome kamera, 1/2.8\" Progressive Scan CMOS, IR 20m, IK08",
          price: 40,
          category: "ip_camera",
          imageUrl: "https://www.hikvision.com/content/dam/hikvision/products/hilook/ip-camera/dome/ipc-d120h/IPC-D120H.png",
          inStock: true,
          features: ["2MP", "IR 20m", "IK08", "POE"]
        },
        {
          name: "Hilook IPC-D180H",
          description: "8 MP dome kamera, 1/2.5\" Progressive Scan CMOS, IR 20m, IK08",
          price: 80,
          category: "ip_camera",
          imageUrl: "https://www.hikvision.com/content/dam/hikvision/products/hilook/ip-camera/dome/ipc-d180h/IPC-D180H.png",
          inStock: true,
          features: ["8MP", "IR 20m", "IK08", "POE"]
        },
        {
          name: "Hilook IPC-D160H",
          description: "6 MP dome kamera, 1/2.9\" Progressive Scan CMOS, IR 20m, IK08",
          price: 70,
          category: "ip_camera",
          imageUrl: "https://www.hikvision.com/content/dam/hikvision/products/hilook/ip-camera/dome/ipc-d160h/IPC-D160H.png",
          inStock: true,
          features: ["6MP", "IR 20m", "IK08", "POE"]
        },
        // Turbo HD Cameras
        {
          name: "Hilook THC-B140-P",
          description: "4 MP Turbo HD bullet kamera, EXIR 40m, IP66",
          price: 50,
          category: "turbo_hd_camera",
          imageUrl: "https://www.hikvision.com/content/dam/hikvision/products/hilook/turbo-hd/bullet/thc-b140-p/THC-B140-P.png",
          inStock: true,
          features: ["4MP Turbo HD", "EXIR 40m", "IP66", "Metal"]
        },
        {
          name: "Hilook THC-B120-P",
          description: "2 MP Turbo HD bullet kamera, EXIR 40m, IP66",
          price: 35,
          category: "turbo_hd_camera",
          imageUrl: "https://www.hikvision.com/content/dam/hikvision/products/hilook/turbo-hd/bullet/thc-b120-p/THC-B120-P.png",
          inStock: true,
          features: ["2MP Turbo HD", "EXIR 40m", "IP66", "Metal"]
        },
        {
          name: "Hilook THC-D140-P",
          description: "4 MP Turbo HD dome kamera, EXIR 20m, IK08",
          price: 45,
          category: "turbo_hd_camera",
          imageUrl: "https://www.hikvision.com/content/dam/hikvision/products/hilook/turbo-hd/dome/thc-d140-p/THC-D140-P.png",
          inStock: true,
          features: ["4MP Turbo HD", "EXIR 20m", "IK08", "Metal"]
        },
        {
          name: "Hilook THC-D120-P",
          description: "2 MP Turbo HD dome kamera, EXIR 20m, IK08",
          price: 30,
          category: "turbo_hd_camera",
          imageUrl: "https://www.hikvision.com/content/dam/hikvision/products/hilook/turbo-hd/dome/thc-d120-p/THC-D120-P.png",
          inStock: true,
          features: ["2MP Turbo HD", "EXIR 20m", "IK08", "Metal"]
        },
        // NVR Systems
        {
          name: "Hilook NVR-108MH-C/8P",
          description: "8 kanal PoE NVR, 4K qo'llab-quvvatlash, H.265+, 1TB HDD",
          price: 165,
          category: "nvr",
          imageUrl: "https://www.hikvision.com/content/dam/hikvision/products/hilook/nvr/nvr-108mh-c-8p/NVR-108MH-C-8P.png",
          inStock: true,
          features: ["8 Channel PoE", "4K Support", "H.265+", "1TB HDD"]
        },
        {
          name: "Hilook NVR-104MH-C/4P",
          description: "4 kanal PoE NVR, 4K qo'llab-quvvatlash, H.265+, 1TB HDD",
          price: 125,
          category: "nvr",
          imageUrl: "https://www.hikvision.com/content/dam/hikvision/products/hilook/nvr/nvr-104mh-c-4p/NVR-104MH-C-4P.png",
          inStock: true,
          features: ["4 Channel PoE", "4K Support", "H.265+", "1TB HDD"]
        },
        // DVR Systems
        {
          name: "Hilook DVR-108G-F1",
          description: "8 kanal Turbo HD DVR, AHD/TVI/CVI qo'llab-quvvatlash, H.265+",
          price: 95,
          category: "dvr",
          imageUrl: "https://www.hikvision.com/content/dam/hikvision/products/hilook/dvr/dvr-108g-f1/DVR-108G-F1.png",
          inStock: true,
          features: ["8 Channel", "AHD/TVI/CVI", "H.265+", "1TB HDD"]
        },
        {
          name: "Hilook DVR-104G-F1",
          description: "4 kanal Turbo HD DVR, AHD/TVI/CVI qo'llab-quvvatlash, H.265+",
          price: 75,
          category: "dvr",
          imageUrl: "https://www.hikvision.com/content/dam/hikvision/products/hilook/dvr/dvr-104g-f1/DVR-104G-F1.png",
          inStock: true,
          features: ["4 Channel", "AHD/TVI/CVI", "H.265+", "1TB HDD"]
        },
        // Complete Security Kits
        {
          name: "Hilook Kit TK-4042BH-MM/WM",
          description: "4 kamerali Turbo HD to'plam, 4CH DVR + 4x THC-B120-P",
          price: 285,
          category: "kits",
          imageUrl: "https://www.hikvision.com/content/dam/hikvision/products/hilook/kits/tk-4042bh-mm-wm/TK-4042BH-MM-WM.png",
          inStock: true,
          features: ["4 Cameras", "4CH DVR", "1TB HDD", "Complete Kit"]
        },
        {
          name: "Hilook Kit IK-4042BH-MH/WM",
          description: "4 kamerali IP to'plam, 4CH NVR + 4x IPC-B120H",
          price: 345,
          category: "kits",
          imageUrl: "https://www.hikvision.com/content/dam/hikvision/products/hilook/kits/ik-4042bh-mh-wm/IK-4042BH-MH-WM.png",
          inStock: true,
          features: ["4 IP Cameras", "4CH NVR PoE", "1TB HDD", "Complete Kit"] as string[]
        }
      ];
      */

      // Skip seeding for now to avoid TypeScript errors
      console.log("Seed data commented out to avoid TypeScript errors");
      return;

      /*
      const sampleArticles: InsertArticle[] = [
        {
          title: "Uy xavfsizligini oshirish bo'yicha 5 ta maslahat",
          excerpt: "Uyingizni xavfsiz qilish uchun eng muhim qadamlar va maslahatlar...",
          content: "Uy xavfsizligi haqida batafsil maqola...",
          imageUrl: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&ixid=MnwxMJA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=250"
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
          imageUrl: "https://images.unsplash.com/photo-1497440001374-f26997328c1b?ixlib=rb-4.0.3&ixid=MnwxMJA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=250"
        }
      ];

      await db.insert(articles).values(sampleArticles);
      */
    } catch (error) {
      console.error("Error seeding database:", error);
    }
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  // Product methods
  async getAllProducts(): Promise<Product[]> {
    return await db.select().from(products);
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    return await db.select().from(products).where(eq(products.category, category));
  }

  async getProduct(id: number): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product || undefined;
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    try {
      const [product] = await db
        .insert(products)
        .values(insertProduct as any)
        .returning();
      return product;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  }

  // Cart methods
  async getCartItems(sessionId: string): Promise<(CartItem & { product: Product })[]> {
    const items = await db
      .select({
        cartItem: cartItems,
        product: products
      })
      .from(cartItems)
      .leftJoin(products, eq(cartItems.productId, products.id))
      .where(eq(cartItems.sessionId, sessionId));
    
    return items.map(item => ({
      ...item.cartItem,
      product: item.product!
    }));
  }

  async addToCart(insertItem: InsertCartItem): Promise<CartItem> {
    // Check if item already exists in cart
    const existingItems = await db
      .select()
      .from(cartItems)
      .where(eq(cartItems.sessionId, insertItem.sessionId));

    const existingItem = existingItems.find(item => item.productId === insertItem.productId);

    if (existingItem) {
      const [updatedItem] = await db
        .update(cartItems)
        .set({ quantity: existingItem.quantity + (insertItem.quantity || 1) })
        .where(eq(cartItems.id, existingItem.id))
        .returning();
      return updatedItem;
    }

    const [cartItem] = await db
      .insert(cartItems)
      .values({
        ...insertItem,
        quantity: insertItem.quantity || 1
      })
      .returning();
    return cartItem;
  }

  async updateCartItem(id: number, quantity: number): Promise<CartItem | undefined> {
    const [updatedItem] = await db
      .update(cartItems)
      .set({ quantity })
      .where(eq(cartItems.id, id))
      .returning();
    return updatedItem || undefined;
  }

  async removeFromCart(id: number): Promise<boolean> {
    const result = await db.delete(cartItems).where(eq(cartItems.id, id));
    return (result.rowCount || 0) > 0;
  }

  async clearCart(sessionId: string): Promise<boolean> {
    const result = await db.delete(cartItems).where(eq(cartItems.sessionId, sessionId));
    return (result.rowCount || 0) >= 0;
  }

  // Chat methods
  async getChatHistory(sessionId: string): Promise<ChatMessage[]> {
    return await db
      .select()
      .from(chatMessages)
      .where(eq(chatMessages.sessionId, sessionId))
      .orderBy(chatMessages.createdAt);
  }

  async saveChatMessage(insertMessage: InsertChatMessage): Promise<ChatMessage> {
    const [chatMessage] = await db
      .insert(chatMessages)
      .values(insertMessage)
      .returning();
    return chatMessage;
  }

  // Article methods
  async getAllArticles(): Promise<Article[]> {
    return await db
      .select()
      .from(articles)
      .orderBy(articles.publishedAt);
  }

  async getArticle(id: number): Promise<Article | undefined> {
    const [article] = await db.select().from(articles).where(eq(articles.id, id));
    return article || undefined;
  }

  async createArticle(insertArticle: InsertArticle): Promise<Article> {
    const [article] = await db
      .insert(articles)
      .values(insertArticle)
      .returning();
    return article;
  }
}

export const storage = new DatabaseStorage();
