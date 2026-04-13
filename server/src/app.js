import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import routes from "./routes/index.js";
import { notFoundHandler } from "./middlewares/not-found.js";
import { errorHandler } from "./middlewares/error-handler.js";

const app = express();

app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

app.use("/", routes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;