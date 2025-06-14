import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import userRoutes from "./routes/userRoutes.js";
import testRoutes from "./routes/testRoutes.js";
import itemRoutes from "./routes/MasterRoutes/itemRoutes.js";
import companyRoutes from "./routes/MasterRoutes/companyRoutes.js";
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
app.use("/api/v1/item",itemRoutes);
app.use("/api/v1/company", companyRoutes);
app.get('/', (req, res) => {
  res.send('Under development...');
});

export { app };
