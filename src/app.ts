import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import StoreRoute from "./routes/StoreRoute";
import dotenv from "dotenv";

const envFile = `.env.${process.env.NODE_ENV || "development"}`;
dotenv.config({ path: envFile });

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(undefined, {
    swaggerOptions: {
      url: "/openapi.yaml",
    },
  })
);

app.use("/openapi.yaml", express.static("./openapi.yaml"));

app.get("/", (req, res) => {
  res.status(200).json("The test store endpoint is live");
});

// API routes
app.use("/v1", StoreRoute);

app.listen(3000, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
  console.log(`Swagger UI available at endpoint /api-docs`);
});
