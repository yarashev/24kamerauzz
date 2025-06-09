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
      // Check if data already exists
      const existingProducts = await db.select().from(products).limit(1);
      if (existingProducts.length > 0) {
        return; // Data already seeded
      }

      // Real product data from catalog
      const sampleProducts: InsertProduct[] = [
        {
          name: "IPC-B449H",
          description: "4 MP, 1/1.8\" Progressive Scan CMOS, Rangli ko'rish 24/7, IP67, H.265+",
          price: 117,
          category: "ip_camera",
          imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&ixid=MnwxMJA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300",
          inStock: true,
          features: ["4MP", "24/7 Color", "IP67", "H.265+"]
        },
        {
          name: "IPC-B249H",
          description: "4 MP, 1/3\" Progressive Scan CMOS, Rangli ko'rish 24/7, IP67, H.265+",
          price: 90,
          category: "ip_camera",
          imageUrl: "https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&ixid=MnwxMJA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300",
          inStock: true,
          features: ["4MP", "24/7 Color", "IP67", "H.265+"]
        },
        {
          name: "IPC-B469HA-LU",
          description: "6 MP, Smart Hybrid Light, Odam va transport vositalarini aniqlash",
          price: 75,
          category: "ip_camera",
          imageUrl: "https://images.unsplash.com/photo-1567443120781-89bf8eeebe44?ixlib=rb-4.0.3&ixid=MnwxMJA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300",
          inStock: true,
          features: ["6MP", "Smart Hybrid Light", "AI Detection", "H.265+"]
        },
        {
          name: "IPC-B449HA-LU",
          description: "4 MP, Smart Hybrid Light, Odam va transport vositalarini aniqlash",
          price: 70,
          category: "ip_camera",
          imageUrl: "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?ixlib=rb-4.0.3&ixid=MnwxMJA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300",
          inStock: true,
          features: ["4MP", "Smart Hybrid Light", "AI Detection", "Microphone"]
        },
        {
          name: "IPC-B169HA",
          description: "6 MP, 1/3\" Progressive Scan CMOS, Rangli ko'rish 24/7, IP67",
          price: 70,
          category: "ip_camera",
          imageUrl: "https://images.unsplash.com/photo-1558618047-c99d7b6fdbad?ixlib=rb-4.0.3&ixid=MnwxMJA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300",
          inStock: true,
          features: ["6MP", "24/7 Color", "IP67", "H.265+"]
        },
        {
          name: "IPC-B149HA",
          description: "4 MP, 1/3\" Progressive Scan CMOS, Rangli ko'rish 24/7, IP67",
          price: 63,
          category: "ip_camera",
          imageUrl: "https://images.unsplash.com/photo-1560472353-dc4de84ceb6a?ixlib=rb-4.0.3&ixid=MnwxMJA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300",
          inStock: true,
          features: ["4MP", "24/7 Color", "IP67", "H.265+"]
        },
        {
          name: "IPC-B129HA",
          description: "2 MP, 1/2.8\" Progressive Scan CMOS, Rangli ko'rish 24/7, IP67",
          price: 43,
          category: "ip_camera",
          imageUrl: "https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?ixlib=rb-4.0.3&ixid=MnwxMJA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300",
          inStock: true,
          features: ["2MP", "24/7 Color", "IP67", "H.265+"]
        },
        {
          name: "IPC-D159H",
          description: "5 MP dome kamera, 1/2.7\" Progressive Scan CMOS, IP67, IK08",
          price: 65,
          category: "ip_camera",
          imageUrl: "https://images.unsplash.com/photo-1509391366360-2e959784a276?ixlib=rb-4.0.3&ixid=MnwxMJA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300",
          inStock: true,
          features: ["5MP", "Dome", "IP67", "IK08"]
        },
        {
          name: "IPC-D149H",
          description: "4 MP dome kamera, 1/2.7\" Progressive Scan CMOS, IP67, IK08",
          price: 60,
          category: "ip_camera",
          imageUrl: "https://images.unsplash.com/photo-1553354103-b0a2bf2912e7?ixlib=rb-4.0.3&ixid=MnwxMJA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300",
          inStock: true,
          features: ["4MP", "Dome", "IP67", "IK08"]
        }
      ];

      await db.insert(products).values(sampleProducts);

      // Seed articles
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
    const [product] = await db
      .insert(products)
      .values(insertProduct)
      .returning();
    return product;
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
