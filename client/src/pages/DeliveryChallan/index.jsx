import React, { useState } from "react";
import { Table, Button,Card } from "antd";
import DCdetails from "./DCdetails";
import { data, Link } from "react-router-dom";

const sampleData = [
  {
    key: "1",
    invoiceNo: "DC-001",
    invoiceDate: "2024-07-12",
    invoiceType: "Regular",
    buyerName: "M.Santhoshkumar",
    amount: 1500,
    details: "This is the detail for DC-001.",
  },
  {
    key: "2",
    invoiceNo: "DC-002",
    invoiceDate: "2024-07-13",
    invoiceType: "Return",
    buyerName: "M.Santhoshkumar", 
    amount: 800,
    details: "This is the detail for DC-002.",
  },
  {
    key: "1",
    invoiceNo: "DC-001",
    invoiceDate: "2024-07-12",
    invoiceType: "Regular",
    buyerName: "M.Santhoshkumar",
    amount: 1500,
    details: "This is the detail for DC-001.",
  },
  {
    key: "2",
    invoiceNo: "DC-002",
    invoiceDate: "2024-07-13",
    invoiceType: "Return",
    buyerName: "M.Santhoshkumar",
    amount: 800,
    details: "This is the detail for DC-002.",
  },
  {
    key: "1",
    invoiceNo: "DC-001",
    invoiceDate: "2024-07-12",
    invoiceType: "Regular",
    buyerName: "M.Santhoshkumar",
    amount: 1500,
    details: "This is the detail for DC-001.",
  },
  {
    key: "2",
    invoiceNo: "DC-002",
    invoiceDate: "2024-07-13",
    invoiceType: "Return",
    amount: 800,
    details: "This is the detail for DC-002.",
  },
  
];

export default function DeliveryChallan() {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState("");

  const columns = [
    {
      title: "Invoice No",
      dataIndex: "invoiceNo",
      key: "invoiceNo",
    },
    {
      title: "Invoice Date",
      dataIndex: "invoiceDate",
      key: "invoiceDate",
    },
    {
      title: "Invoice Type",
      dataIndex: "invoiceType",
      key: "invoiceType",
    },
    {
      title: "Buyer Name",
      key: "buyerName",
      dataIndex: "buyerName",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (amt) => `₹${amt}`,
    },
    {
      title: "Details",
      key: "details",
      render: (_, record) => (
        <>
        <Link to={`/dc/${record.key}`}>View</Link>
        </>
      ),
    },
  ];

  return (
    <div>
      <Card title="Delivery Challan List" extra={<Button type="primary">Add Delivery Challan</Button>} style={{ marginBottom: 16 }}>
        <Table
          columns={columns}
          dataSource={sampleData}
          pagination={{ pageSize: 5 }}
          rowKey="key"
        />
      </Card>
    </div>
  );
}