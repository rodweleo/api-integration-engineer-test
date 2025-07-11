import express from "express";
import StoreRoute from "./routes/StoreRoute";

const app = express();
app.use(express.json());

app.use("/v1", StoreRoute);

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});