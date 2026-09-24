import app from "./src/app.js";
import { connectToDb } from "./src/database/database.js";
import server from "./src/services/socket.service.js";

connectToDb();
server.listen(3000, () => {
  console.log("server is running on port 3000");
});
