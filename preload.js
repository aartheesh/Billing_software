try {
  const { contextBridge } = require("electron");
  const path = require("path");
  const productService = require("./productService");

  console.log("✅ preload.js is running");

  contextBridge.exposeInMainWorld("api", {
    getProducts: () => {
      try {
        return productService.getAllProducts();
      } catch (error) {
        console.error("❌ Error getting products:", error.message);
        return { success: false, error: error.message };
      }
    },
    addProduct: (product) => {
      try {
        return productService.addProduct(product);
      } catch (error) {
        console.error("❌ Error adding product:", error.message);
        return { success: false, error: error.message };
      }
    },
    deleteProduct: (id) => {
      try {
        return productService.deleteProduct(id);
      } catch (error) {
        console.error("❌ Error deleting product:", error.message);
        return { success: false, error: error.message };
      }
    },
    reduceStock: (id, qty) => {
      try {
        return productService.reduceStock(id, qty);
      } catch (error) {
        console.error("❌ Error reducing stock:", error.message);
        return { success: false, error: error.message };
      }
    },
  });

} catch (error) {
  console.error("❌ preload.js crashed:", error);
}
