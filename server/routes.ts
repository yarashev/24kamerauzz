import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { askJarvis, calculateCameraRecommendation } from "./openai";
import { insertCartItemSchema, insertChatMessageSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Products API
  app.get("/api/products", async (req, res) => {
    try {
      const { category, brand } = req.query;
      let products = category 
        ? await storage.getProductsByCategory(category as string)
        : await storage.getAllProducts();
      
      // Filter by brand if specified
      if (brand) {
        products = products.filter(product => 
          product.brand?.toLowerCase() === (brand as string).toLowerCase()
        );
      }
      
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const product = await storage.getProduct(id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });

  // Cart API
  app.get("/api/cart", async (req, res) => {
    try {
      const sessionId = (req as any).sessionID || "anonymous";
      const cartItems = await storage.getCartItems(sessionId);
      res.json(cartItems);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch cart items" });
    }
  });

  app.post("/api/cart", async (req, res) => {
    try {
      const sessionId = (req as any).sessionID || "anonymous";
      const cartItemData = insertCartItemSchema.parse({
        ...req.body,
        sessionId
      });
      
      const cartItem = await storage.addToCart(cartItemData);
      res.json(cartItem);
    } catch (error) {
      res.status(400).json({ message: "Invalid cart item data" });
    }
  });

  app.patch("/api/cart/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { quantity } = req.body;
      
      if (quantity <= 0) {
        await storage.removeFromCart(id);
        return res.json({ success: true });
      }
      
      const updatedItem = await storage.updateCartItem(id, quantity);
      if (!updatedItem) {
        return res.status(404).json({ message: "Cart item not found" });
      }
      
      res.json(updatedItem);
    } catch (error) {
      res.status(500).json({ message: "Failed to update cart item" });
    }
  });

  app.delete("/api/cart/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.removeFromCart(id);
      if (!success) {
        return res.status(404).json({ message: "Cart item not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to remove cart item" });
    }
  });

  app.delete("/api/cart", async (req, res) => {
    try {
      const sessionId = (req as any).sessionID || "anonymous";
      await storage.clearCart(sessionId);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to clear cart" });
    }
  });

  // Chat API
  app.post("/api/chat", async (req, res) => {
    try {
      const sessionId = (req as any).sessionID || "anonymous";
      const { message } = req.body;
      
      if (!message || typeof message !== 'string') {
        return res.status(400).json({ message: "Message is required" });
      }
      
      const response = await askJarvis(message);
      
      const chatMessageData = insertChatMessageSchema.parse({
        sessionId,
        message,
        response
      });
      
      const savedMessage = await storage.saveChatMessage(chatMessageData);
      res.json({ response, id: savedMessage.id });
    } catch (error) {
      console.error("Chat API error:", error);
      res.status(500).json({ message: "Failed to process chat message" });
    }
  });

  app.get("/api/chat/history", async (req, res) => {
    try {
      const sessionId = (req as any).sessionID || "anonymous";
      const history = await storage.getChatHistory(sessionId);
      res.json(history);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch chat history" });
    }
  });

  // Calculator API
  app.post("/api/calculator", async (req, res) => {
    try {
      const { area, angle, distance } = req.body;
      
      if (!area || !angle || !distance) {
        return res.status(400).json({ message: "Area, angle, and distance are required" });
      }
      
      const recommendation = await calculateCameraRecommendation(
        parseFloat(area),
        parseFloat(angle),
        parseFloat(distance)
      );
      
      res.json(recommendation);
    } catch (error) {
      console.error("Calculator API error:", error);
      res.status(500).json({ message: "Failed to calculate recommendation" });
    }
  });

  // Articles API
  app.get("/api/articles", async (req, res) => {
    try {
      const articles = await storage.getAllArticles();
      res.json(articles);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch articles" });
    }
  });

  app.get("/api/articles/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const article = await storage.getArticle(id);
      if (!article) {
        return res.status(404).json({ message: "Article not found" });
      }
      res.json(article);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch article" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
