import express from "express";
import swaggerUi from "swagger-ui-express";
import StoreRoute from "./routes/StoreRoute";

const app = express();
app.use(express.json());

// Serve Swagger UI with your OpenAPI spec
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(undefined, {
    swaggerOptions: {
      url: "/openapi.yaml",
    },
  })
);

// Serve the OpenAPI spec file
app.use("/openapi.yaml", express.static("./openapi.yaml"));

// API routes
app.use("/v3", StoreRoute);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
  console.log("Swagger UI available at: http://localhost:3000/api-docs");
});
