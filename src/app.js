const express = require("express");
const app = express();
const router = require("../src/routes/userRoutes");  ;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/users", router);

app.use((err, req, res, next) => {
res.status(500).json({ message: err.message });
});
    
module.exports = app;
