// src/pages/Dashboard.jsx

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2"; // or use recharts
import 'chart.js/auto'; // Needed for Chart.js

const Dashboard = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    axios.get("/api/v1/dashboard", { withCredentials: true }) // include cookies
      .then(res => setData(res.data.data))
      .catch(err => console.error("Dashboard Error:", err));
  }, []);

  if (!data) return <div>Loading...</div>;

  const chartData = {
    labels: data.monthlySales.map(item => item.month),
    datasets: [
      {
        label: "Monthly Sales",
        data: data.monthlySales.map(item => item.total),
        backgroundColor: "#4caf50"
      }
    ]
  };

  const buyerChartData = {
    labels: data.buyerSales.map(item => item.buyer),
    datasets: [
      {
        label: "Sales by Buyer",
        data: data.buyerSales.map(item => item.total),
        backgroundColor: "#2196f3"
      }
    ]
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <StatCard title="Total Invoices" value={data.totalInvoices} />
        <StatCard title="Total Sales" value={`₹${data.totalSales.toFixed(2)}`} />
        <StatCard title="Total Profit" value={`₹${data.totalProfit.toFixed(2)}`} />
      </div>

      <div className="bg-white p-4 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4">Monthly Sales</h2>
        <div className="w-1/2 mx-auto" style={{maxWidth: 600}}>
          <Bar data={chartData} />
        </div>
      </div>

      {/* Buyer-wise Sales Chart */}
      <div className="bg-white p-4 rounded-xl shadow mt-8">
        <h2 className="text-xl font-semibold mb-4">Sales by Buyer</h2>
        <div className="w-1/2 mx-auto" style={{maxWidth: 600}}>
          <Bar data={buyerChartData} />
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value }) => (
  <div className="bg-white p-4 rounded-xl shadow text-center">
    <p className="text-gray-500">{title}</p>
    <h3 className="text-2xl font-bold">{value}</h3>
  </div>
);

export default Dashboard;
