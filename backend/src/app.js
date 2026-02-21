import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";

import router from "./routes/movies.routes.js";
import { notFound, errorHandler } from "./middlewares/error.js";

const app = express();

// Middlewares globales
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Rutas
app.use("/api/movies", router);

// Middlewares de error
app.use(notFound);
app.use(errorHandler);

export default app;
