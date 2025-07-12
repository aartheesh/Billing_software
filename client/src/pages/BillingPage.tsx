import React, { useEffect, useState } from "react";
import { Product } from "./ProductPage";
import { Select, InputNumber, Button, Table, message, Form, Row, Col, Typography } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const { Option } = Select;
const { Text } = Typography;

interface BillItem extends Product {
  quantity: number;
}

const BillingPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [billItems, setBillItems] = useState<BillItem[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(0);
  const [maxQty, setMaxQty] = useState<number>(1);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  useEffect(() => {
    if (!window.api) return;
    const list = window.api.getProducts();
    setProducts(list ? list : []);
  }, []);

  const handleProductChange = (value: string) => {
    setSelectedProductId(value);
    const product = products.find((p) => p.id === value);
    if (product) {
      setMaxQty(product.stock);
      setQuantity(1);
    }
    setEditingIndex(null); // Reset editing if product changes
  };

  const handleAddOrEditToBill = () => {
    if (!selectedProductId) return;
    const product = products.find((p) => p.id === selectedProductId);
    if (!product) return;

    if (quantity > product.stock) {
      message.error(`Only ${product.stock} units available in stock.`);
      return;
    }

    if (editingIndex !== null) {
      // Edit mode
      const updatedItems = [...billItems];
      updatedItems[editingIndex] = { ...product, quantity };
      setBillItems(updatedItems);
      message.success("Item updated!");
    } else {
      // Add mode
      const existing = billItems.find((item) => item.id === product.id);
      if (existing) {
        const totalQty = existing.quantity + quantity;
        if (totalQty > product.stock) {
          message.error(`Only ${product.stock - existing.quantity} more units allowed.`);
          return;
        }
        setBillItems(
          billItems.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          )
        );
      } else {
        setBillItems([...billItems, { ...product, quantity }]);
      }
    }

    setSelectedProductId("");
    setQuantity(0);
    setMaxQty(1);
    setEditingIndex(null);
  };

  const handleEdit = (record: BillItem, index: number) => {
    setSelectedProductId(record.id);
    setQuantity(record.quantity);
    setMaxQty(products.find((p) => p.id === record.id)?.stock ?? 1);
    setEditingIndex(index);
  };

  const handleDelete = (index: number) => {
    setBillItems(billItems.filter((_, i) => i !== index));
    // If deleting the item being edited, reset form
    if (editingIndex === index) {
      setSelectedProductId("");
      setQuantity(1);
      setMaxQty(1);
      setEditingIndex(null);
    }
  };

  const subtotal = billItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const totalGST = billItems.reduce(
    (acc, item) => acc + (item.price * item.quantity * item.gstRate) / 100,
    0
  );
  const grandTotal = subtotal + totalGST;

  const handleCreateInvoice = () => {
    billItems.forEach((item) => {
      window.api.reduceStock(item.id, item.quantity);
    });
    message.success("Invoice created and stock updated ✅");
    setBillItems([]);
  };

  const handleGeneratePDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("RO Billing Invoice", 14, 20);
    doc.setFontSize(10);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 28);

    const tableData = billItems.map((item, index) => [
      index + 1,
      item.name,
      item.hsnCode,
      item.quantity,
      `Rs${item.price}`,
      `${item.gstRate}%`,
      `Rs${(item.price * item.quantity).toFixed(2)}`,
    ]);

    autoTable(doc, {
      head: [["#", "Product", "HSN", "Qty", "Rate", "GST", "Amount"]],
      body: tableData,
      startY: 35,
    });

    const finalY = (doc as any).lastAutoTable?.finalY || 60;

    doc.setFontSize(12);
    doc.text(`Subtotal: Rs${subtotal.toFixed(2)}`, 140, finalY + 10);
    doc.text(`Total GST: Rs${totalGST.toFixed(2)}`, 140, finalY + 18);
    doc.text(`Grand Total: Rs${grandTotal.toFixed(2)}`, 140, finalY + 26);

    doc.save("invoice.pdf");
  };

  const columns = [
    {
      title: "Product",
      dataIndex: "name",
    },
    {
      title: "HSN",
      dataIndex: "hsnCode",
    },
    {
      title: "Qty",
      dataIndex: "quantity",
    },
    {
      title: "Rate",
      render: (_: any, record: BillItem) => `₹${record.price}`,
    },
    {
      title: "GST%",
      dataIndex: "gstRate",
    },
    {
      title: "Amount",
      render: (_: any, record: BillItem) =>
        `₹${(record.price * record.quantity).toFixed(2)}`,
    },
    {
      title: "Action",
      render: (_: any, record: BillItem, index: number) => (
        <>
          <Button
            icon={<EditOutlined />}
            size="small"
            onClick={() => handleEdit(record, index)}
            style={{ marginRight: 8 }}
          />
          <Button
            icon={<DeleteOutlined />}
            size="small"
            danger
            onClick={() => handleDelete(index)}
          />
        </>
      ),
    },
  ];

  return (
    <div className="max-w-4xl mx-auto mt-10 p-4">
      <Form layout="vertical" onFinish={handleAddOrEditToBill}>
  <Row gutter={24} align="middle" style={{ marginBottom: 24 }}>
    <Col span={6}>
      <Form.Item label="Product" required>
        <Select
          style={{ width: "100%" }}
          value={selectedProductId || undefined}
          placeholder="Select Product"
          onChange={handleProductChange}
        >
          {products.map((p) => (
            <Option key={p.id} value={p.id}>
              {p.name}
            </Option>
          ))}
        </Select>
      </Form.Item>
    </Col>
    <Col span={4}>
      <Form.Item label="Price">
        <InputNumber
          style={{ width: "100%" }}
          value={
            selectedProductId
              ? products.find((p) => p.id === selectedProductId)?.price
              : ""
          }
          disabled
          placeholder="Price"
        />
      </Form.Item>
    </Col>
    <Col span={4}>
      <Form.Item label="Available QTY">
        <InputNumber
          value={
            selectedProductId
              ? products.find((p) => p.id === selectedProductId)?.stock
              : ""
          }
          disabled
          style={{ width: "100%" }}
        />
      </Form.Item>
    </Col>
    <Col span={4}>
      <Form.Item label="Salte Qty" required>
        <InputNumber
          max={maxQty}
          value={quantity ? quantity : null}
          onChange={(val) => setQuantity(val || 1)}
          placeholder="Qty"
          style={{ width: "100%" }}
          disabled={!selectedProductId}
        />
      </Form.Item>
    </Col>
    
    <Col span={4}>
      <Form.Item label="Action">
        <Button
          type={editingIndex !== null ? "default" : "primary"}
          htmlType="submit"
          disabled={!selectedProductId}
          style={{ width: "100%" }}
        >
          {editingIndex !== null ? "Edit" : "Add"}
        </Button>
      </Form.Item>
    </Col>
  </Row>
</Form>

<Table
  columns={columns}
  dataSource={billItems}
  pagination={false}
  rowKey="id"
  size="middle"
  style={{ width: "100%", marginTop: 32 }}
/>

      <div className="text-right mt-4 space-y-1 text-sm">
        <div>Subtotal: ₹{subtotal.toFixed(2)}</div>
        <div>Total GST: ₹{totalGST.toFixed(2)}</div>
        <div className="text-lg font-semibold">Grand Total: ₹{grandTotal.toFixed(2)}</div>
      </div>

      <div className="flex justify-end gap-4 mt-6">
        <Button onClick={handleCreateInvoice} type="primary">
          Create Invoice & Reduce Stock
        </Button>
        <Button onClick={handleGeneratePDF} type="default">
          Generate PDF
        </Button>
      </div>
    </div>
  );
};

export default BillingPage;