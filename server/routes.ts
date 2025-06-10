import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { askJarvis, calculateCameraRecommendation } from "./openai";
import { insertCartItemSchema, insertChatMessageSchema, insertProductSchema, insertAdvertisementSchema } from "@shared/schema";

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

  app.post("/api/products", async (req, res) => {
    try {
      const productData = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(productData);
      res.json(product);
    } catch (error) {
      res.status(400).json({ message: "Invalid product data" });
    }
  });

  app.put("/api/products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const productData = insertProductSchema.parse(req.body);
      const product = await storage.updateProduct(id, productData);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      res.status(400).json({ message: "Invalid product data" });
    }
  });

  app.delete("/api/products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteProduct(id);
      if (!success) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete product" });
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

  // Advertisements API
  app.get("/api/advertisements", async (req, res) => {
    try {
      const advertisements = await storage.getAllAdvertisements();
      res.json(advertisements);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch advertisements" });
    }
  });

  app.post("/api/advertisements", async (req, res) => {
    try {
      const advertisementData = insertAdvertisementSchema.parse(req.body);
      const advertisement = await storage.createAdvertisement(advertisementData);
      res.json(advertisement);
    } catch (error) {
      res.status(400).json({ message: "Invalid advertisement data" });
    }
  });

  app.put("/api/advertisements/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const advertisementData = insertAdvertisementSchema.parse(req.body);
      const advertisement = await storage.updateAdvertisement(id, advertisementData);
      if (!advertisement) {
        return res.status(404).json({ message: "Advertisement not found" });
      }
      res.json(advertisement);
    } catch (error) {
      res.status(400).json({ message: "Invalid advertisement data" });
    }
  });

  app.delete("/api/advertisements/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteAdvertisement(id);
      if (!success) {
        return res.status(404).json({ message: "Advertisement not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete advertisement" });
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

  // Masters routes
  app.get("/api/masters", async (req, res) => {
    try {
      const masters = await storage.getAllMasters();
      res.json(masters);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch masters" });
    }
  });

  app.get("/api/masters/region/:region", async (req, res) => {
    try {
      const region = req.params.region;
      const masters = await storage.getMastersByRegion(region);
      res.json(masters);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch masters by region" });
    }
  });

  app.post("/api/masters", async (req, res) => {
    try {
      const master = await storage.createMaster(req.body);
      res.status(201).json(master);
    } catch (error) {
      res.status(500).json({ message: "Failed to create master" });
    }
  });

  app.put("/api/masters/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const master = await storage.updateMaster(id, req.body);
      if (!master) {
        return res.status(404).json({ message: "Master not found" });
      }
      res.json(master);
    } catch (error) {
      res.status(500).json({ message: "Failed to update master" });
    }
  });

  app.delete("/api/masters/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteMaster(id);
      if (!success) {
        return res.status(404).json({ message: "Master not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete master" });
    }
  });

  app.put("/api/masters/:id/rating", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { rating } = req.body;
      const master = await storage.updateMasterRating(id, rating);
      if (!master) {
        return res.status(404).json({ message: "Master not found" });
      }
      res.json(master);
    } catch (error) {
      res.status(500).json({ message: "Failed to update master rating" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
