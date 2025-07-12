// client/src/components/ProductForm.tsx
import React, { useState,useEffect } from "react";
import { Form, Input, InputNumber, Button } from "antd";

interface Product {
  id: string;
  name: string;
  hsnCode: string;
  price: number;
  stock: number;
  gstRate: number;
}

interface Props {
  onAdd: (product: Product) => void;
   editingProduct?: Product | null;
  onCancelEdit?: () => void;
}

const ProductForm: React.FC<Props> = ({ onAdd, editingProduct, onCancelEdit }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (editingProduct) {
      form.setFieldsValue(editingProduct);
    } else {
      form.resetFields();
    }
  }, [editingProduct, form]);

  const handleFinish = (values: any) => {
    const newProduct: Product = {
      id: editingProduct ? editingProduct.id : Date.now().toString(),
      name: values.name,
      hsnCode: values.hsnCode,
      price: parseFloat(values.price),
      stock: parseInt(values.stock, 10),
      gstRate: parseFloat(values.gstRate),
    };
    onAdd(newProduct);
    form.resetFields();
  };

  return (
    <div className="p-4 border rounded bg-white shadow-sm mb-6">
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        style={{ margin: 0 }}
      >
        <div style={{ display: "flex", gap: 16, alignItems: "flex-end" }}>
          <Form.Item
            label="Product Name"
            name="name"
            rules={[{ required: true, message: "Please enter product name" }]}
            style={{ marginBottom: 0 }}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="HSN Code"
            name="hsnCode"
            rules={[{ required: true, message: "Please enter HSN code" }]}
            style={{ marginBottom: 0 }}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Price"
            name="price"
            rules={[{ required: true, message: "Please enter price" }]}
            style={{ marginBottom: 0 }}
          >
            <InputNumber min={0} style={{ width: 120 }} />
          </Form.Item>
          <Form.Item
            label="Stock"
            name="stock"
            rules={[{ required: true, message: "Please enter stock" }]}
            style={{ marginBottom: 0 }}
          >
            <InputNumber min={0} style={{ width: 100 }} />
          </Form.Item>
          <Form.Item
            label="GST Rate"
            name="gstRate"
            rules={[{ required: true, message: "Please enter GST rate" }]}
            style={{ marginBottom: 0 }}
          >
            <InputNumber min={0} max={100} style={{ width: 100 }} />
          </Form.Item>
          <Form.Item style={{ marginBottom: 0 }}>
            <Button type="primary" htmlType="submit" className="product-form-button">
              {editingProduct ? "Update" : "Add"}
            </Button>
            {editingProduct && onCancelEdit && (
              <Button
                style={{ marginLeft: 8 }}
                onClick={() => {
                  form.resetFields();
                  onCancelEdit();
                }}
              >
                Cancel
              </Button>
            )}
          </Form.Item>
        </div>
      </Form>
    </div>
  );
};

export default ProductForm;
