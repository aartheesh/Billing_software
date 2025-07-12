import React from "react";
import { Table, Button, message } from "antd";
import { DeleteOutlined ,EditOutlined} from "@ant-design/icons";

interface Product {
  id: string;
  name: string;
  hsnCode: string;
  price: number;
  stock: number;
  gstRate: number;
}

interface Props {
  products: Product[];
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
}

const ProductList: React.FC<Props> = ({ products, onDelete,onEdit }) => {
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "HSN",
      dataIndex: "hsnCode",
      key: "hsnCode",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price: number) => <>₹{price}</>,
    },
    {
      title: "Stock",
      dataIndex: "stock",
      key: "stock",
    },
    {
      title: "GST Rate",
      dataIndex: "gstRate",
      key: "gstRate",
      render: (rate: number) => `${rate}`,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: Product) => (
        <>
        <Button
          type="text"
          variant="solid"
          icon={<EditOutlined />}
          onClick={() => {onEdit(record.id);}}
        >
        </Button>
        <Button
          type="text"
          danger
          icon={<DeleteOutlined />}
          onClick={() => {
            const confirmDelete = window.confirm(
              `Are you sure you want to delete ${record.name}?`
            );
            if (confirmDelete) {
              onDelete(record.id);
            }
          }}
        >
        </Button>
        
        </>
      ),
    },
  ];

  return (
    <div style={{ marginTop: 24 }}>
      <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 16 }}>Product List</h2>
      <Table
        dataSource={products}
        columns={columns}
        rowKey="id"
        pagination={false}
        locale={{ emptyText: "No products added" }}
        bordered
      />
    </div>
  );
};

export default ProductList;