const express = require("express");
const cors = require("cors");
const RoleRoute = require("./route/role-route")
const DataRoute = require("./route/data-route")
const app = express();

app.use(cors());
app.use(express.json());

app.use("/roles", RoleRoute);
app.use("/data", DataRoute)

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log("Server on Port:", PORT));
