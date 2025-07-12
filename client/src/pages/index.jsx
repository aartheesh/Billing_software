import React from "react";
import { Tabs } from "antd";
import ProductPage from "./ProductPage";
import BillingPage from "./BillingPage";
import "./index.css"; // Assuming you have some styles in index.css

function App() {
  return (
    <div className="p-4 page-container">
      <Tabs
        defaultActiveKey="product"
        destroyInactiveTabPane
        items={[
          {
            key: "product",
            label: "Manage Products",
            children: <ProductPage />,
          },
          {
            key: "billing",
            label: "Billing",
            children: <BillingPage />,
          },
        ]}
        tabBarGutter={32}
        centered
      />
    </div>
  );
}

export default App;