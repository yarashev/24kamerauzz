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

      // Seed products with different brands
      const sampleProducts: InsertProduct[] = [
        {
          name: "Hikvision DS-2CD2143G0-I",
          description: "4K Ultra HD dome kamera, Tungi ko'rish, IP67",
          price: 299,
          category: "cameras",
          imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&ixid=MnwxMJA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300",
          inStock: true,
          features: ["4K Ultra HD", "Night Vision", "H.265+", "IP67"]
        },
        {
          name: "Hilook IPC-B140H",
          description: "4MP bullet kamera, POE quvvatlash, Smart IR",
          price: 89,
          category: "cameras",
          imageUrl: "https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&ixid=MnwxMJA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300",
          inStock: true,
          features: ["4MP Resolution", "POE Power", "Smart IR", "Metal Housing"]
        },
        {
          name: "Hiwatch DS-I220",
          description: "2MP IP kamera, Fixed lens, DWDR",
          price: 65,
          category: "cameras",
          imageUrl: "https://images.unsplash.com/photo-1567443120781-89bf8eeebe44?ixlib=rb-4.0.3&ixid=MnwxMJA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300",
          inStock: true,
          features: ["2MP Resolution", "Fixed Lens", "DWDR", "ICR Day/Night"]
        },
        {
          name: "Ezviz C3WN",
          description: "Wi-Fi kamera, Rangli tungi ko'rish, Harakat aniqlash",
          price: 159,
          category: "cameras",
          imageUrl: "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?ixlib=rb-4.0.3&ixid=MnwxMJA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300",
          inStock: true,
          features: ["Wi-Fi", "Color Night Vision", "Motion Detection", "Two-way Audio"]
        },
        {
          name: "Dahua IPC-HDW1531S",
          description: "5MP dome kamera, WDR, Smart Detection",
          price: 125,
          category: "cameras",
          imageUrl: "https://images.unsplash.com/photo-1558618047-c99d7b6fdbad?ixlib=rb-4.0.3&ixid=MnwxMJA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300",
          inStock: true,
          features: ["5MP Resolution", "WDR", "Smart Detection", "IP67 Rating"]
        },
        {
          name: "Imou Bullet 2E",
          description: "2MP Wi-Fi kamera, PIR aniqlash, Mobil app",
          price: 79,
          category: "cameras",
          imageUrl: "https://images.unsplash.com/photo-1560472353-dc4de84ceb6a?ixlib=rb-4.0.3&ixid=MnwxMJA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300",
          inStock: true,
          features: ["2MP Resolution", "PIR Detection", "Wi-Fi", "Mobile App"]
        },
        {
          name: "Hikvision Video Doorbell",
          description: "Eshik qo'ng'irog'i, 1080p, Ikki tomonlama audio",
          price: 199,
          category: "doorbells",
          imageUrl: "https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?ixlib=rb-4.0.3&ixid=MnwxMJA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300",
          inStock: true,
          features: ["1080p HD", "Two-way Audio", "Motion Detection", "Night Vision"]
        },
        {
          name: "Solar Security Kit Dahua",
          description: "Quyosh paneli bilan, 4G/Wi-Fi, Uzoq masofada ishlash",
          price: 899,
          category: "systems",
          imageUrl: "https://images.unsplash.com/photo-1509391366360-2e959784a276?ixlib=rb-4.0.3&ixid=MnwxMJA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300",
          inStock: true,
          features: ["Solar Powered", "4G/Wi-Fi", "Remote Access", "Weather Resistant"]
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
