import React, { useEffect, useState } from "react";
import ProductForm from "../components/ProductForm";
import ProductList from "../components/ProductList";

export interface Product {
  id: string;
  name: string;
  hsnCode: string;
  price: number;
  stock: number;
  gstRate: number;
}

const ProductPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  useEffect(() => {
    if(window.api) {
    const loaded = window.api.getProducts(); // ✅ fetch from SQLite
    setProducts(loaded);
    }
  }, []);

  const addProduct = (product: Product) => {
    if (products.some((p) => p.id === product.id)) {
      // Edit: update existing product
      window.api.addProduct(product); // You may want a separate update API
      setProducts(products.map((p) => (p.id === product.id ? product : p)));
    } else {
      // Add: add new product
      window.api.addProduct(product);
      setProducts([...products, product]);
    }
    setEditingProduct(null); // Reset editing state after add/edit
  };

  const deleteProduct = (id: string) => {
   handleDelete(id);
    setProducts(products.filter((p) => p.id !== id));
  };

const handleDelete = async (id: string) => {
  try {
    await window.api.deleteProduct(id);
    alert("Deleted!");
  } catch (error: any) {
    alert("Failed to delete: " + (error?.message || error));
  }
};

    const handleEdit = (id: string) => {
    const product = products.find((p) => p.id === id);
    if (product) {
      setEditingProduct(product);
    }
  };

  const handleCancelEdit = () => {
    setEditingProduct(null);
  };


  return (
    <div className="max-w-3xl mx-auto mt-10">
      <ProductForm onAdd={addProduct} editingProduct={editingProduct} onCancelEdit={handleCancelEdit}  />
      <ProductList products={products} onDelete={deleteProduct} onEdit={handleEdit} />
    </div>
  );
};

export default ProductPage;
