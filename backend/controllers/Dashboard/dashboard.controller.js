import Invoice from "../../models/Invoice.model.js";
import asyncHandler from "../../utils/AsyncHandler.js";
import ApiResponse from "../../utils/ApiResponse.js";
import ApiError from "../../utils/ApiError.js";

// Dashboard Summary Controller
const getDashboardData = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;
    const invoices = await Invoice.find({ createdBy: userId });
    const totalInvoices = invoices.length;

    const totalSales = invoices.reduce((acc, invoice) => acc + (invoice.amounts.totalAmount || 0), 0);

    const totalProfit = invoices.reduce((acc, invoice) => {
      const net = invoice.amounts.netAmount || 0;
      const total = invoice.amounts.totalAmount || 0;
      return acc + (total - net);
    }, 0);

    // Optional: Monthly sales chart data
    const monthlySalesMap = {};

    invoices.forEach(invoice => {
      const date = new Date(invoice.invoiceDate);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      if (!monthlySalesMap[monthKey]) {
        monthlySalesMap[monthKey] = 0;
      }
      monthlySalesMap[monthKey] += invoice.amounts.totalAmount || 0;
    });

    const monthlySales = Object.entries(monthlySalesMap).map(([month, total]) => ({
      month,
      total: Number(total.toFixed(2)),
    }));

    // Buyer-wise sales aggregation
    const buyerSalesAgg = await Invoice.aggregate([
      { $match: { createdBy: userId } },
      { $group: { _id: "$buyer.name", total: { $sum: "$amounts.totalAmount" } } },
      { $sort: { total: -1 } }
    ]);
    const buyerSales = buyerSalesAgg.map(item => ({ buyer: item._id || 'Unknown', total: Number(item.total.toFixed(2)) }));

    // Respond
    res.status(200).json(
      new ApiResponse(200, {
        totalInvoices,
        totalSales: Number(totalSales.toFixed(2)),
        totalProfit: Number(totalProfit.toFixed(2)),
        monthlySales,
        buyerSales
      }, "Dashboard data fetched successfully")
    );
  } catch (error) {
    console.error("Dashboard error:", error);
    throw new ApiError(500, "Failed to get dashboard data");
  }
});

export { getDashboardData };
