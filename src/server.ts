import App from "./app";
import databaseConfiguration from "../config/database";

const port = 3000;
const app = new App(port);
databaseConfiguration
  .initialize()
  .then(() => {
    console.log("Connected to database");
    app.listen();
  })
  .catch((error) => {
    console.error("Error connecting to the database", error);
  });
