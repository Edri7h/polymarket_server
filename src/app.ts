import express from "express";
import cors from "cors";

import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes";
import votesRoutes from "./routes/votes.routes";
import transactionRoutes from "./routes/transaction.routes";
import eventsRoutes from "./routes/events.routes";
import discussionsRoutes from "./routes/discussions.routes";
const app = express();

const allowedOrigins = [
  process.env.CLIENT_URL 
];


app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true
}));

app.use(cookieParser());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "server is working!!!"
  });
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/votes", votesRoutes);
app.use("/api/v1/events", eventsRoutes);
app.use("/api/v1/discussions", discussionsRoutes);
app.use(
  "/api/v1/transactions",
  transactionRoutes
);

export default app;
