import { Router } from "express";
import { storage } from "./storage";

const router = Router();

// Sample products for demonstration
const sampleProducts = [
  {
    id: 1,
    name: "Hikvision DS-2CE72DFT-F",
    brand: "Hikvision",
    price: 450000,
    image: "/images/hikvision1.jpg",
    category: "hikvision_hd_camera",
    description: "2 MP ColorVu Fixed Turret Camera",
    inStock: true,
    features: ["ColorVu", "2MP", "Turret"]
  },
  {
    id: 2,
    name: "HiLook IPC-T280H-UF",
    brand: "HiLook",
    price: 380000,
    image: "/images/hilook1.jpg",
    category: "ip_camera",
    description: "8 MP Fixed Turret Network Camera",
    inStock: true,
    features: ["8MP", "Network", "Fixed Turret"]
  },
  {
    id: 3,
    name: "Dahua HAC-HDW1200EM-A",
    brand: "Dahua",
    price: 400000,
    image: "/images/dahua1.jpg",
    category: "dahua_hd_camera",
    description: "2MP HDCVI IR Eyeball Camera",
    inStock: true,
    features: ["2MP", "HDCVI", "IR", "Eyeball"]
  }
];

// GET all products
router.get("/", async (req, res) => {
  try {
    const { category, brand } = req.query;
    
    // Get products from database storage
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
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Failed to fetch products" });
  }
});

// GET product by ID
router.get("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const product = await storage.getProduct(id);
    
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    
    res.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ message: "Failed to fetch product" });
  }
});

// GET products by brand
router.get("/brand/:brand", async (req, res) => {
  try {
    const brand = req.params.brand;
    const products = await storage.getAllProducts();
    
    const filteredProducts = products.filter(product => 
      product.brand?.toLowerCase() === brand.toLowerCase()
    );
    
    res.json(filteredProducts);
  } catch (error) {
    console.error("Error fetching products by brand:", error);
    res.status(500).json({ message: "Failed to fetch products by brand" });
  }
});

export default router;