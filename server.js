const express = require("express");
const app = express();
//const fs = require('fs');
/*const options = {
  key: fs.readFileSync('/etc/letsencrypt/live/binateglads.com/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/binateglads.com/fullchain.pem'),
};*/
const server = require("http").createServer(/*options,*/ app);
const cors = require("cors");
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes");
const propertyRoutes = require("./routes/propertyRoutes");
const propertyTenantRoutes = require("./routes/propertyTenantRoutes");
const rentaltracking = require("./routes/RentalTrackingRoutes");
const maintenanceRoutes = require("./routes/maintenanceRoutes");
const restaurantRoutes = require("./routes/RestaurantRoutes");
const chatRoutes = require('./routes/chatRoutes');
const Auth = require("./middlewares/Authentication");
const dotenv = require("dotenv").config("./");
const path = require("path");
const { iniateSockets } = require("./controllers/ChatController");

app.use(express.static(path.join(__dirname + "/public")));
app.use(express.json());
app.use(cors());
app.use("/restaurant/api/", restaurantRoutes);
app.use("/chat/api/", chatRoutes);
app.use("/user/api/", userRoutes);
app.use("/property/api/", Auth, propertyRoutes);
app.use("/property/tenant/api/", Auth, propertyTenantRoutes);
app.use("/rentaltracking/api/", rentaltracking);
app.use("/maintenance/api/", Auth, maintenanceRoutes);
app.use("/requests/api/", Auth, propertyRoutes);


iniateSockets(server);
// let uri = "mongodb://ammar:367900aA@cluster0-shard-00-00.1zari.mongodb.net:27017,cluster0-shard-00-01.1zari.mongodb.net:27017,cluster0-shard-00-02.1zari.mongodb.net:27017/tenantTrack?ssl=true&replicaSet=atlas-12t03u-shard-0&authSource=admin&retryWrites=true&w=majority";

mongoose.set("strictQuery", false);
mongoose
  .connect("mongodb://ammar:367900aA@cluster0-shard-00-00.1zari.mongodb.net:27017,cluster0-shard-00-01.1zari.mongodb.net:27017,cluster0-shard-00-02.1zari.mongodb.net:27017/tenantTrack?ssl=true&replicaSet=atlas-12t03u-shard-0&authSource=admin&retryWrites=true&w=majority")
  .then((response) => {
    console.log(`Database Connected Successfully`);
  })
  .catch((error) => {
    console.log(`Database Disconnected ${error}`);
  });

server.listen(4000, () => {
  console.log(`Server is running on port 4000`);
});
