import { configDotenv } from "dotenv";
import App from "./app";

const port = 3000;
const app = new App(port)

app.listen();
