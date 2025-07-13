import React from "react";
import { Modal, Table, Row, Col, Divider, Typography, Button } from "antd";
import { exportDeliveryChallanPDF } from "./exportDeliveryChallanPDF";
import { Link } from "react-router-dom";
import "./dc.css"; // Import your CSS styles

const { Title, Text } = Typography;

export default function DCdetails({ visible, onCancel, data = {} }) {
  // Example static data (replace with props/data)
  const company = {
    name: "IPPI RO SYSTEMS",
    tagline: "& Screening Home Appliance",
    address: "189/2 City Union Bank Opposite, Sultan Petai, Paramathivelur, (po) Namakkal, (Dt) Pin Code:638182",
    email: "ippirosystems@gmail.com",
    gst: "33KUMP5384BN1ZG",
    phone: "9047 56 58 59",
  };
  const billTo = {
    name: "M.Santhoshkumar",
    address: "6/23 kudi street, Unjapalayam (po), Paramathivelur (tk), Namakkal (dt) 638182",
  };
  const invoice = {
    no: "105",
    date: "11.07.2025",
    type: "Credit Bill",
  };
  // Generate 50 sample products
  const items = Array.from({ length: 90 }, (_, i) => {
    const qty = Math.floor(Math.random() * 10) + 1;
    const rate = 1000 + i * 10;
    return {
      key: i + 1,
      description: `Product ${i + 1}`,
      hsn: "85161000",
      qty,
      rate,
      per: "per",
      amount: rate * qty,
    };
  });
  const totals = {
    subtotal: items.reduce((sum, item) => sum + item.amount, 0),
    sgst: Math.round(items.reduce((sum, item) => sum + item.amount * 0.09, 0) * 100) / 100,
    cgst: Math.round(items.reduce((sum, item) => sum + item.amount * 0.09, 0) * 100) / 100,
    roundoff: 0,
    total: 0, // will be calculated below
    words: "Rupees Three Thousand Nine Hundred Fifty Three Only",
  };
  totals.total = totals.subtotal + totals.sgst + totals.cgst + totals.roundoff;

  const bank = {
    name: "Karur Vysya Bank",
    accName: "IPPI RO SYSTEMS & Screening Home Appliance",
    accNo: "1644011000000101",
    ifsc: "KVBL0001644",
    branch: "PARAMATHI VELUR",
  };

  // Table columns for invoice items
  const columns = [
    { title: "S.NO", dataIndex: "key", align: "center", width: 60 },
    { title: "DESCRIPTION OF GOODS", dataIndex: "description", align: "left" },
    { title: "HSN CODE", dataIndex: "hsn", align: "center", width: 100 },
    { title: "QUANTITY", dataIndex: "qty", align: "center", width: 90 },
    { title: "RATE", dataIndex: "rate", align: "right", width: 100, render: (v) => v.toLocaleString() },
    { title: "PER", dataIndex: "per", align: "center", width: 60 },
    { title: "AMOUNT", dataIndex: "amount", align: "right", width: 120, render: (v) => v.toLocaleString() },
  ];

  return (
    // <div className="container">
    <div id="dc-print-area" style={{ padding: "10px 0px",height:"100vh", background: "#fff" }}>
      {/* Header */}
      <Row>
        <Col span={6}>
          <img
            src="../../assets/ippelogo.png" // Adjust the path as necessary
            alt="Logo"
            style={{ width: 90, marginBottom: 8 }}
          />
        </Col>
        <Col span={12} style={{ textAlign: "center" }}>
          <Title level={4} style={{ margin: 0 }}>{company.name}</Title>
          <div>{company.tagline}</div>
          <div style={{ fontSize: 12 }}>{company.address}</div>
          <div style={{ fontSize: 12 }}>E – Mail : {company.email}</div>
        </Col>
        <Col span={6} style={{ textAlign: "right", fontSize: 12 }}>
          <div>Cell : {company.phone}</div>
          <div>GST NO : <span style={{ color: "red" }}>{company.gst}</span></div>
        </Col>
      </Row>
      <Divider style={{ margin: "8px 0" }} />

      {/* Bill To & Invoice Info */}
      <Row>
        <Col span={12}>
          <Text strong>BILL TO :</Text>
          <div>{billTo.name}</div>
          <div>{billTo.address}</div>
        </Col>
        <Col span={12}>
          <Row>
            <Col span={12}><Text strong>INVOICE NO :</Text></Col>
            <Col span={12}>{invoice.no}</Col>
            <Col span={12}><Text strong>INVOICE DATE :</Text></Col>
            <Col span={12}>{invoice.date}</Col>
            <Col span={12}><Text strong>INVOICE TYPE :</Text></Col>
            <Col span={12}>{invoice.type}</Col>
          </Row>
        </Col>
      </Row>
      <Divider style={{ margin: "8px 0" }} />

      {/* Items Table */}
      <Table
        columns={columns}
        dataSource={items}
        pagination={false}
        bordered
        size="small"
        style={{ marginBottom: 0 }}
      />
      <Divider style={{ margin: "8px 0" }} />
      <div className="row">
       <div className="col-6">
        <div>
            <Text strong>Amount in Word :</Text> {totals.words}
          </div>
       </div>
      
      <div className="col-6">
      <table style={{ width: "100%", marginTop: 0, borderCollapse: "collapse" }}>
        <tbody>
          <tr>
            <td colSpan={6} style={{ textAlign: "right", fontWeight: "bold" }}>SUB TOTAL :</td>
            <td style={{ textAlign: "right" }}>{totals.subtotal.toLocaleString()}</td>
          </tr>
          <tr>
            <td colSpan={6} style={{ textAlign: "right", fontWeight: "bold" }}>SGST 9% :</td>
            <td style={{ textAlign: "right" }}>{totals.sgst.toLocaleString()}</td>
          </tr>
          <tr>
            <td colSpan={6} style={{ textAlign: "right", fontWeight: "bold" }}>CGST 9% :</td>
            <td style={{ textAlign: "right" }}>{totals.cgst.toLocaleString()}</td>
          </tr>
          <tr>
            <td colSpan={6} style={{ textAlign: "right", fontWeight: "bold" }}>Rounded Off (+/-) :</td>
            <td style={{ textAlign: "right" }}>{totals.roundoff.toLocaleString()}</td>
          </tr>
          <tr>
            <td colSpan={6} style={{ textAlign: "right", fontWeight: "bold" }}>TOTAL :</td>
            <td style={{ textAlign: "right", fontWeight: "bold" }}>{totals.total.toLocaleString()}</td>
          </tr>
        </tbody>
      </table>
      </div>
      </div>
      {/* Bank Details */}
      <Row style={{ marginTop: 12 }}>
        <Col span={14}>
         <div style={{ marginTop: 8 }}>
            <Text strong>BANK DETAILS</Text>
            <div>Bank name : {bank.name}</div>
            <div>Account Name : {bank.accName}</div>
            <div>Account No : {bank.accNo}</div>
            <div>IFSC Code : {bank.ifsc}</div>
            <div>Branch : {bank.branch}</div>
          </div>
        </Col>
        <Col span={10} style={{ textAlign: "right" }}>
          <div style={{ marginTop: 40 }}>
            <div>FOR {company.name}</div>
            <div style={{ height: 40 }} />
            <div>Authorised signature</div>
          </div>
        </Col>
      </Row>
      <div className="no-print" style={{ textAlign: "right", marginTop: 24 }}>
        {/* <Button type="primary" onClick={() => exportDeliveryChallanPDF({ company, billTo, invoice, items, totals, bank })}>
          Export DC
        </Button> */}
        <Button type="primary" onClick={() => window.print()} style={{ marginLeft: 8 }}>
          print
        </Button>
        <Link to="/">
          <Button type="primary" style={{ marginLeft: 8 }}>
            Back to List
          </Button>
        </Link>
      </div>
    </div>
    // </div>
  );
}