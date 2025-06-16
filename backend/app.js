import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import userRoutes from "./routes/userRoutes.js";
import testRoutes from "./routes/testRoutes.js";
// Import Master Routes
import itemRoutes from "./routes/MasterRoutes/itemRoutes.js";
import companyRoutes from "./routes/MasterRoutes/companyRoutes.js";
import businessRoutes from "./routes/MasterRoutes/businessRoutes.js";
import lorryRoutes from "./routes/MasterRoutes/lorryRoutes.js";
import siteRoutes from "./routes/MasterRoutes/siteRoutes.js";
import supplierRoutes from "./routes/MasterRoutes/supplierRoutes.js";
// Import Transaction and Invoice Routes
import transactionRoutes from "./routes/transactionRoutes.js";
import invoiceRoutes from "./routes/invoiceRoutes.js";

const app = express();

app.use(cors({
  origin: "http://localhost:5173",  // hardcoded for dev
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(express.static('public'));
app.use(cookieParser());

//using routes
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/test", testRoutes);
app.use("/api/v1/items", itemRoutes);
app.use("/api/v1/company", companyRoutes);
app.use("/api/v1/business", businessRoutes);
app.use("/api/v1/lorry", lorryRoutes);
app.use("/api/v1/site", siteRoutes);
app.use("/api/v1/supplier", supplierRoutes);
app.use("/api/v1/transactions", transactionRoutes);
app.use("/api/v1/invoices", invoiceRoutes);
app.get('/', (req, res) => {
  res.send('Under development...');
});

export { app };
